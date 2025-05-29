import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";

interface IndicesToAudioConverterProps {
  indexArray: Array<number>;
  rows: number;
  onPlayingNoteChange?: (column: number | null) => void;
  tempo: number;
}

const NOTES = ["C", "D", "E", "F", "G", "A", "B"];

function parseIndexArray(
  indexArray: number[],
  indexDictionary: Record<number, string>
): Array<{ time: number; note: string; duration: string }> {
  const events: Array<{ time: number; note: string; duration: string }> = [];

  const noteDuration = ["8n", "4n", "4n + 8n"];

  let currentNote: string | null = null;
  let slurCount = 0;
  let noteStartTime = 0;

  for (let i = 0; i < indexArray.length; i++) {
    const val = indexDictionary[indexArray[i]];

    if (val === "rest") {
      if (currentNote !== null) {
        events.push({
          time: noteStartTime,
          note: currentNote,
          duration: noteDuration[Math.min(slurCount, noteDuration.length - 1)],
        });
        currentNote = null;
      }
      slurCount = 0;
    } else if (val === "slur") {
      if (currentNote !== null) {
        slurCount++;
      }
    } else {
      // It's a note
      if (currentNote !== null) {
        // Push the previous note
        events.push({
          time: noteStartTime,
          note: currentNote,
          duration: noteDuration[Math.min(slurCount, noteDuration.length - 1)],
        });
      }
      currentNote = val;
      slurCount = 0;
      noteStartTime = i;
    }
  }

  // Push the final note if it exists
  if (currentNote !== null) {
    events.push({
      time: noteStartTime,
      note: currentNote,
      duration: noteDuration[Math.min(slurCount, noteDuration.length - 1)],
    });
  }

  return events;
}


function IndicesToAudioConverter({ indexArray, rows, onPlayingNoteChange, tempo }: IndicesToAudioConverterProps) {
  const partRef = useRef<Tone.Part | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const [currentPlayingColumn, setCurrentPlayingColumn] = useState<number | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const handlePlay = async () => {
    if (!synthRef.current) return;

    await Tone.start();
    Tone.Transport.bpm.value = tempo * 120;

    // Build indexDictionary with notes using rows
    let noteI = 0;
    let voicing = 4;
    const indexDictionary: Record<number, string> = {
      [rows - 1]: "rest",
      [rows - 2]: "slur",
    };
    for (let i = rows - 3; i >= 0; i--) {
      indexDictionary[i] = `${NOTES[noteI % 7]}${voicing}`;
      noteI++;
      if (noteI % 7 === 0) voicing++;
    }

    const events = parseIndexArray(indexArray, indexDictionary);

    const part = new Tone.Part<[number, { note: string; duration: string }]>(
      (time, value) => {
        synthRef.current!.triggerAttackRelease(
          value.note,
          value.duration,
          time
        );
      },
      events.map((e) => [
        e.time * Tone.Time("8n").toSeconds(),
        { note: e.note, duration: e.duration },
      ])
    );

    part.loop = false;

    // Clear any existing scheduled events
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel();

    // Schedule the part to start
    part.start(0);
    Tone.Transport.start("+0.1");

    // Update current playing column based on time
    Tone.Transport.scheduleRepeat((time) => {
      const currentTime = Tone.Transport.seconds;
      const column = Math.floor(currentTime / Tone.Time("8n").toSeconds());
      if (column !== currentPlayingColumn && column < indexArray.length) {
        setCurrentPlayingColumn(column);
        onPlayingNoteChange?.(column);
      }
    }, "8n");

    // Schedule cleanup at the end of playback
    const totalDuration = indexArray.length * Tone.Time("8n").toSeconds();
    Tone.Transport.scheduleOnce(() => {
      setCurrentPlayingColumn(null);
      onPlayingNoteChange?.(null);
    }, totalDuration);

    // Dispose previous part
    partRef.current?.dispose();
    partRef.current = part;
  };

  return (
    <div className="playButtonContainer">
      <button 
        className="playButton"
        onClick={handlePlay}
      >
        Play
      </button>
    </div>
  );
}

export default IndicesToAudioConverter;
