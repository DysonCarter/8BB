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

    const handleShare = async () => {
        const songJson = makeSongJson();
        const jsonString = JSON.stringify(songJson);
        const encoded = encodeURIComponent(btoa(jsonString));
        const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard: ' + shareUrl);
        } catch (err) {
            // Fallback for unsupported clipboard API
            prompt('Copy this link:', shareUrl);
        }
    }

    return <button className="shareButton" onClick={handleShare}>Share</button>
}

export default ShareButton;