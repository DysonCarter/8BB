import IndicesToAudioConverter from "./IndicesToAudioConverter";
import NoteContainer from "./NoteContainer";
import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

const COLS = 50;
const ROWS = 16;

const MARIO = [11, 14, 9, 14, 8, 6, 14, 14, 15, 15, 8, 9, 11, 13, 12, 11, 12, 11, 12, 14, 13, 15, 12, 12, 12, 8, 12, 5, 15, 15, 12, 11, 12, 11, 12, 11, 15, 15, 8, 9, 8, 9, 8, 12, 14, 11, 14, 14, 15, 15]

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
  const [activeIndices, setActiveIndices] = useState<number[]>([...MARIO]);
  const [dragColumn, setDragColumn] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const lastPlayTimeRef = useRef<number>(0);

  useEffect(() => {
    synthRef.current = new Tone.Synth().toDestination();
    return () => {
      synthRef.current?.dispose();
    };
  }, []);

  const playNote = (row: number) => {
    const note = indexDictionary[row];
    if (!note || note === "rest" || note === "slur") return;

    const now = Tone.now();

    // Prevent too-fast triggering
    if (now - lastPlayTimeRef.current < 0.05) return;

    lastPlayTimeRef.current = now;

    Tone.start();
    synthRef.current?.triggerAttackRelease(note, "8n", now + 0.01);
  };

  const handleMouseDown = (column: number) => {
    setDragColumn(column);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragColumn === null || !gridRef.current) return;

    const gridTop = gridRef.current.getBoundingClientRect().top;
    const y = e.clientY - gridTop;
    const gridHeight = gridRef.current.clientHeight;
    const rowHeight = gridHeight / ROWS;

    const row = Math.max(0, Math.min(ROWS - 1, Math.floor(y / rowHeight)));

    setActiveIndices((prev) => {
      const newActive = [...prev];
      if (newActive[dragColumn] !== row) {
        newActive[dragColumn] = row;
        playNote(row);
      }
      return newActive;
    });
  };

  const handleMouseUp = () => {
    setDragColumn(null);
  };

  const handleNoteClick = (row: number, column: number) => {
    setActiveIndices((prev) => {
      const newActive = [...prev];
      newActive[column] = row;
      return newActive;
    });
  
    playNote(row);
  };

  const noteContainers = [];
  for (let column = 0; column < COLS; column++) {
    for (let row = 0; row < ROWS; row++) {
      const index = column * ROWS + row;
      const isActive = activeIndices[column] === row;

      noteContainers.push(
        <NoteContainer
          key={index}
          active={isActive}
          onClick={() => handleNoteClick(row, column)}
          onMouseDown={() => handleMouseDown(column)}
        >
          {isActive ? indexDictionary[row] : null}
        </NoteContainer>
      );
    }
  }

  const indexArray = [...activeIndices];

  return (
    <>
      <div
        className="musicGrid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`
        }}
        ref={gridRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {noteContainers}
      </div>
      <IndicesToAudioConverter indexArray={indexArray} />
      {console.log(indexArray.join(', '))}
    </>
  );
}

export default MusicStaff;
