import IndicesToAudioConverter from "./IndicesToAudioConverter";
import NoteContainer from "./NoteContainer";
import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

const COLS = 32;
const ROWS = 16;

// Build indexDictionary with notes
const indexDictionary: Record<number, string> = {
  [ROWS - 1]: "rest",
  [ROWS - 2]: "slur",
};
const NOTES = ["C", "D", "E", "F", "G", "A", "B"];
let noteI = 0;
let voicing = 4;
for (let i = ROWS - 3; i >= 0; i--) {
  indexDictionary[i] = `${NOTES[noteI % 7]}${voicing}`;
  noteI++;
  if (noteI % 7 === 0) voicing++;
}

function MusicStaff() {
  const [activeIndices, setActiveIndices] = useState<number[]>(
    Array(COLS).fill(ROWS - 1)
  );

  const synthRef = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const handleNoteClick = (row: number, column: number) => {
    setActiveIndices((prev) => {
      const newActive = [...prev];
      newActive[column] = row;
      return newActive;
    });

    const note = indexDictionary[row];
    if (note && note !== "rest" && note !== "slur") {
      Tone.start(); // required on first user interaction
      synthRef.current?.triggerAttackRelease(note, "8n");
    }
  };

  let noteContainers = [];
  for (let column = 0; column < COLS; column++) {
    for (let row = 0; row < ROWS; row++) {
      const index = column * ROWS + row;
      const isActive = activeIndices[column] === row;

      noteContainers.push(
        <NoteContainer
          key={index}
          active={isActive}
          onClick={() => {
            handleNoteClick(row, column);
          }}
        >
          {/*index*/}
        </NoteContainer>
      );
    }
  }

  let active_string = "";
  let indexArray = [];
  for (let i in activeIndices) {
    active_string += `${activeIndices[i]}, `;
    indexArray.push(activeIndices[i]);
  }

  return (
    <>
      <div className="musicGrid">{noteContainers}</div>
      <IndicesToAudioConverter indexArray={indexArray} />
    </>
  );
}

export default MusicStaff;
