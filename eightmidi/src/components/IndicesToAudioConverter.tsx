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
  
    // Reset Transport
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel(); // Clear all scheduled events
  
    // Dispose old part if any
    partRef.current?.dispose();
    partRef.current = null;
  
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
  
    const indexEvents = indexArray.map((val, i) => ({
      time: i * Tone.Time("8n").toSeconds(),
      type: indexDictionary[val],
    }));
  
    const synth = synthRef.current;
    let currentlyPlaying: string | null = null;
  
    const scheduleId = Tone.Transport.scheduleRepeat((time) => {
      const step = Math.floor(Tone.Transport.seconds / Tone.Time("8n").toSeconds());
      const entry = indexEvents[step];
      if (!entry) return;
  
      if (entry.type === "rest") {
        if (currentlyPlaying) {
          synth.triggerRelease(time);
          currentlyPlaying = null;
        }
      } else if (entry.type === "slur") {
        // Do nothing, sustain
      } else {
        if (entry.type !== currentlyPlaying) {
          if (currentlyPlaying) {
            synth.triggerRelease(time);
          }
          synth.triggerAttack(entry.type, time);
          currentlyPlaying = entry.type;
        }
      }
  
      setCurrentPlayingColumn(step);
      onPlayingNoteChange?.(step);
    }, "8n");
  
    const totalDuration = indexArray.length * Tone.Time("8n").toSeconds();
    Tone.Transport.scheduleOnce(() => {
      synth.triggerRelease();
      setCurrentPlayingColumn(null);
      onPlayingNoteChange?.(null);
      Tone.Transport.clear(scheduleId); // Stop the repeat
    }, totalDuration);
  
    Tone.Transport.start("+0.1");
  };
  
  const handleStop = () => {
    synthRef.current?.triggerRelease();
    setCurrentPlayingColumn(null);
    onPlayingNoteChange?.(null);

    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel();

    // Dispose old part if any
    partRef.current?.dispose();
    partRef.current = null;
  }

  return (
    <div className="playButtonContainer" style={{ display: 'flex'}}>
      <button 
        className="playButton"
        onClick={handlePlay}
      >
        Play
      </button>
      <button 
        className="playButton"
        onClick={handleStop}
      >
        Stop
      </button>
    </div>
  );
}

export default IndicesToAudioConverter;
