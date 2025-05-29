
interface ShareButtonProps {
    song: Array<number>;
    tempo: number;
    rows: number;
    cols: number;
}

function ShareButton({song, tempo, rows, cols}: ShareButtonProps) {
    function makeSongJson() {
        const songJson = {
            "tempo": tempo,
            "rows": rows,
            "cols": cols,
            "song": song
        }
        console.log(songJson);
        return songJson;
    }

    return <button className="shareButton" onClick={makeSongJson}>Share</button>
}

export default ShareButton;