import * as Tone from "tone";
import { useEffect, useRef } from "react";

interface IndicesToAudioConverterProps {
  indexArray: Array<number>;
  rows: number;
}

const NOTES = ["C", "D", "E", "F", "G", "A", "B"];

function parseIndexArray(
  indexArray: number[],
  indexDictionary: Record<number, string>
): Array<{ time: number; note: string; duration: string }> {
  const events: Array<{ time: number; note: string; duration: string }> = [];
  let time = 0;
  let currentNote: string | null = null;
  let currentDuration = 0;

  for (let i = 0; i < indexArray.length; i++) {
    const val = indexDictionary[indexArray[i]];

    if (val === "rest") {
      if (currentNote) {
        events.push({
          time: time - currentDuration,
          note: currentNote,
          duration: `${currentDuration * 0.5}n`,
        });
        currentNote = null;
      }
      time++;
    } else if (val === "slur") {
      if (currentNote) {
        currentDuration++;
      }
      time++;
    } else {
      if (currentNote) {
        events.push({
          time: time - currentDuration,
          note: currentNote,
          duration: `${currentDuration * 0.5}n`,
        });
      }
      currentNote = val;
      currentDuration = 1;
      time++;
    }
  }

  if (currentNote) {
    events.push({
      time: time - currentDuration,
      note: currentNote,
      duration: `${currentDuration * 0.5}n`,
    });
  }

  return events;
}

function IndicesToAudioConverter({ indexArray, rows }: IndicesToAudioConverterProps) {
  const partRef = useRef<Tone.Part | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const handlePlay = async () => {
    if (!synthRef.current) return;

    await Tone.start();

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

    Tone.Transport.stop();
    Tone.Transport.position = 0;
    Tone.Transport.cancel();

    part.start(0);
    Tone.Transport.start("+0.1");

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
