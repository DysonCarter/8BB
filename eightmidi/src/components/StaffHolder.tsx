import { useState } from "react";
import MusicStaff from "./MusicStaff";

function StaffHolder() {
    const [cols, setCols] = useState(50);
    const [rows, setRows] = useState(16);

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

    return <>
    <div className="staffHolder">
    <MusicStaff COLS={cols} ROWS={rows}/>
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
    </div>
    </>
}

export default StaffHolder;