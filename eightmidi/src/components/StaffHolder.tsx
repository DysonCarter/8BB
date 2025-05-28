import { useState } from "react";
import MusicStaff from "./MusicStaff";

let MARIO = [11, 14, 9, 14, 8, 6, 14, 14, 15, 15, 8, 9, 11, 13, 12, 11, 12, 11, 12, 14, 13, 15, 12, 12, 12, 8, 12, 5, 15, 15, 12, 11, 12, 11, 12, 11, 15, 15, 8, 9, 8, 9, 8, 12, 14, 11, 14, 14, 15, 15];

function StaffHolder() {
    const [cols, setCols] = useState(50);
    const [rows, setRows] = useState(16);
    const [song, setSong] = useState(MARIO);

    const changeColumns = (delta: number) => {
        const newCols = cols + delta;
        const clampedValue = Math.min(Math.max(1, newCols), 1000);
        setCols(clampedValue);
    }

    const changeRows = (delta: number) => {
        const newRows = rows + delta;
        const clampedValue = Math.min(Math.max(1, newRows), 32);
        setRows(clampedValue);
    }

    const clearSong = () => {
        setSong(Array(cols).fill(rows-1));
    }

    return <>
    <div className="staffHolder">
    <MusicStaff COLS={cols} ROWS={rows} song={song}/>
    </div>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button className="inputRC" onClick={() => changeColumns(-1)}>-</button>
            <span style={{ fontFamily: 'Fredoka, sans-serif' }}>Cols: {cols}</span>
            <button className="inputRC" onClick={() => changeColumns(1)}>+</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button className="inputRC" onClick={() => changeRows(-1)}>-</button>
            <span style={{ fontFamily: 'Fredoka, sans-serif' }}>Rows: {rows}</span>
            <button className="inputRC" onClick={() => changeRows(1)}>+</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <button className="clearButton" onClick={clearSong}>Clear Song</button>
        </div>
    </div>
    </>
}

export default StaffHolder;