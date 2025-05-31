import { useState } from "react";
import MusicStaff from "./MusicStaff";
import ShareButton from "./ShareButton";

let MARIO = [11, 14, 9, 14, 8, 6, 14, 14, 15, 15, 8, 9, 11, 13, 12, 11, 12, 11, 12, 14, 13, 15, 12, 12, 12, 8, 12, 5, 15, 15, 12, 11, 12, 11, 12, 11, 15, 15, 8, 9, 8, 9, 8, 12, 14, 11, 14, 14, 15, 15];

function StaffHolder() {
    // Check for shared song data in URL parameters
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    let initialCols = 50;
    let initialRows = 16;
    let initialTempo = 1;
    let initialSong = MARIO;
    if (dataParam) {
        try {
            const jsonString = atob(decodeURIComponent(dataParam));
            const json = JSON.parse(jsonString);
            initialCols = json.cols;
            initialRows = json.rows;
            initialTempo = json.tempo;
            initialSong = json.song;
        } catch (e) {
            console.error('Error parsing shared song data:', e);
        }
    }
    const [cols, setCols] = useState(initialCols);
    const [rows, setRows] = useState(initialRows);
    const [song, setSong] = useState(initialSong);
    const [tempo, setTempo] = useState(initialTempo);

    const changeColumns = (delta: number) => {
        const newCols = cols + delta;
        const clampedValue = Math.min(Math.max(1, newCols), 1000);
        setCols(clampedValue);
    }

    const changeRows = (delta: number) => {
        const newRows = rows + delta;
        const clampedValue = Math.min(Math.max(1, newRows), 32);
        setRows(clampedValue);
        
        // Update song state to reflect row changes
        if (delta > 0) {
            setSong(prevSong => prevSong.map(index => index + 1));
        } else if (delta < 0) {
            setSong(prevSong => prevSong.map(index => Math.max(index - 1, 0)));
        }
    }

    const clearSong = () => {
        setSong(Array(cols).fill(rows-1));
    }

    const setNewSong = (newSong: Array<number>) => {
        setSong(newSong);
    }

    return <>
    <div className="staffHolder">
    <MusicStaff COLS={cols} ROWS={rows} song={song} tempo={tempo} onSongChange={setNewSong} />
    </div>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontFamily: 'Fredoka, sans-serif' }}>Tempo: {tempo.toFixed(1)}</span>
            <input className="inputSlider" type="range" min=".1" max="3" step="0.1" value={tempo} onChange={(e) => setTempo(parseFloat(e.target.value))} />
        </div>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShareButton song={song} tempo={tempo} rows={rows} cols={cols}/>
        </div>
    </div>
    </>
}

export default StaffHolder;