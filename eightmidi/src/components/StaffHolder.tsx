import { useState } from "react";
import MusicStaff from "./MusicStaff";

function StaffHolder() {

    const [cols, setCols] = useState(50);
    const [rows, setRows] = useState(16);

    const changeColumns = (newCols: number) => {
        setCols(newCols);
    }

    const changeRows = (newRows: number) => {
        setRows(newRows);
    }

    return <>
    <div className="staffHolder">
    <MusicStaff COLS={cols} ROWS={rows}/>
    </div>
    <input type="number" min="1" max="1000" value={cols} onChange={(e) => changeColumns(parseInt(e.target.value))} />
    <input type="number" min="1" max="32" value={rows} onChange={(e) => changeRows(parseInt(e.target.value))} />
    </>
}

export default StaffHolder;