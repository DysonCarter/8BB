import IndicesToAudioConverter from "./IndicesToAudioConverter";
import NoteContainer from "./NoteContainer";
import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

interface MusicStaffProps {
  COLS: number;
  ROWS: number;
  song: Array<number>;
  tempo: number;
  onSongChange: (newSong: Array<number>) => void;
}

function MusicStaff({COLS, ROWS, song, tempo, onSongChange}: MusicStaffProps) {
  const [activeIndices, setActiveIndices] = useState<number[]>([...song]);
  const [dragColumn, setDragColumn] = useState<number | null>(null);
  const [playingColumn, setPlayingColumn] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const lastPlayTimeRef = useRef<number>(0);
  const prevRowsRef = useRef<number>(ROWS);
  const prevColsRef = useRef<number>(COLS);

  // Effect to shift notes down when rows are added
  useEffect(() => {
    if (ROWS > prevRowsRef.current) {
      setActiveIndices(prev => prev.map(index => index + 1));
    } else if (ROWS < prevRowsRef.current) {
      setActiveIndices(prev => prev.map(index => Math.max(index - 1, 0)));
    }
    prevRowsRef.current = ROWS;
  }, [ROWS]);

  // Effect to handle column changes
  useEffect(() => {
    if (COLS < prevColsRef.current) {
      // Remove columns from the end when decreasing
      setActiveIndices(prev => prev.slice(0, COLS));
    } else if (COLS > prevColsRef.current) {
      // Add new columns with default value (rest) when increasing
      setActiveIndices(prev => [...prev, ...Array(COLS - prevColsRef.current).fill(ROWS - 1)]);
    }
    prevColsRef.current = COLS;
  }, [COLS, ROWS]);

  useEffect(() => {
    setActiveIndices([...song]);
  }, [song]);

  // Build indexDictionary with notes
  const indexDictionary: Record<number, string> = {
    [ROWS - 1]: "rest",
    [ROWS - 2]: "slur",
  };
  const NOTES = ["C", "D", "E", "F", "G", "A", "B"];
  let noteI = 0;
  let voicing = 4;  // Start with C4
  for (let i = ROWS - 3; i >= 0; i--) {
    indexDictionary[i] = `${NOTES[noteI % 7]}${voicing}`;
    noteI++;
    if (noteI % 7 === 0) voicing++;  // Increment octave as we go down
  }

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
        onSongChange(newActive);
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
      onSongChange(newActive);
      return newActive;
    });
  
    playNote(row);
  };

  const noteContainers = [];
  for (let column = 0; column < COLS; column++) {
    for (let row = 0; row < ROWS; row++) {
      const index = column * ROWS + row;
      const isActive = activeIndices[column] === row;
      const isPlaying = playingColumn === column && isActive;

      noteContainers.push(
        <NoteContainer
          key={index}
          active={isActive}
          playing={isPlaying}
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
      <IndicesToAudioConverter 
        indexArray={indexArray} 
        rows={ROWS} 
        onPlayingNoteChange={setPlayingColumn}
        tempo={tempo}
      />
      {/*console.log(indexArray.join(', '))*/ /*For debugging*/}
    </>
  );
}

export default MusicStaff;
