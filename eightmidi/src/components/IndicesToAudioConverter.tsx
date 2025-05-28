import * as Tone from "tone";
import { useEffect, useRef } from "react";

interface IndicesToAudioConverterProps {
  indexArray: Array<number>;
}

const ROWS = 16;
const NOTES = ["C", "D", "E", "F", "G", "A", "B"];

// Build indexDictionary with notes
let noteI = 0;
let voicing = 4;

const indexDictionary: Record<number, string> = {
  [ROWS - 1]: "rest",
  [ROWS - 2]: "slur",
};

for (let i = ROWS - 3; i >= 0; i--) {
  indexDictionary[i] = `${NOTES[noteI % 7]}${voicing}`;
  noteI++;
  if (noteI % 7 === 0) voicing++;
}

function parseIndexArray(
  indexArray: number[]
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

function IndicesToAudioConverter({ indexArray }: IndicesToAudioConverterProps) {
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

    const events = parseIndexArray(indexArray);

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
