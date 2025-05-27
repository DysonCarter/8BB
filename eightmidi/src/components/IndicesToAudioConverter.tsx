import * as Tone from "tone";
import { useEffect, useRef } from "react";

interface IndicesToAudioConverterProps {
  indexArray: Array<number>;
}

const ROWS = 16;
const NOTES = ["C", "D", "E", "F", "G", "A", "B"];

let noteI = 0;
let voicing = 4;

const indexDictionary: Record<number, string> = {
  [ROWS - 1]: "rest",
  [ROWS - 2]: "slur",
};

// Build indexDictionary with notes
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
      currentDuration++;
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
  const partRef = useRef<Tone.Part<
    [number, { note: string; duration: string }]
  > | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    const synth = new Tone.Synth().toDestination();
    const events = parseIndexArray(indexArray);

    const part = new Tone.Part<[number, { note: string; duration: string }]>(
      (time, value) => {
        synth.triggerAttackRelease(value.note, value.duration, time);
      },
      events.map((e) => [
        e.time * Tone.Time("8n").toSeconds(),
        { note: e.note, duration: e.duration },
      ])
    );

    part.loop = false;
    Tone.Transport.bpm.value = 120;

    partRef.current = part;
    synthRef.current = synth;

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      part.dispose();
      synth.dispose();
    };
  }, [indexArray]);

  const handlePlay = async () => {
    if (partRef.current && synthRef.current) {
      await Tone.start(); // Required by browsers to unlock audio
      partRef.current.start(0);
      Tone.Transport.start("+0.1"); // slight delay for smoother playback
    }
  };

  return (
    <div>
      <button style={{width:500,height:100,fontSize:50}}
      onClick={handlePlay}>Play</button>
    </div>
  );
}

export default IndicesToAudioConverter;
