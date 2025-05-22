import NoteContainer from "./NoteContainer"
import { useState } from "react";

const COLS = 32;
const ROWS = 16

function MusicStaff() {
    const [activeIndices, setActiveIndices] = useState<number[]>(Array(COLS).fill(ROWS-1))

    const handleNoteClick = (row: number, column: number) => {
        setActiveIndices((prev) => {
            const newActive = [...prev];
            newActive[column] = row;
            return newActive;
        });
    }

    let noteContainers = [];
    for(let column = 0; column < COLS; column++){
        for(let row = 0; row < ROWS; row++){
            const index = column * ROWS + row;
            const isActive = activeIndices[column] === row;
            
            noteContainers.push(
                <NoteContainer
                  key={index}
                  active={isActive}
                  onClick={()=>{handleNoteClick(row, column)}}
                >
                   {index} 
                </NoteContainer>
            )
        }
    }

    let active_string = ""
    for(let i in activeIndices)
        active_string += `${activeIndices[i]}, `

    return <>
    <div className="musicGrid">
        {noteContainers}
    </div>
    <p>{active_string}</p>
    </>
}

export default MusicStaff