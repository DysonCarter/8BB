import { FaShare } from 'react-icons/fa';

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
        
        // Create a modal dialog
        const dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = '#395C6B';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        dialog.style.zIndex = '1000';
        dialog.style.color = 'white';
        dialog.style.fontFamily = "'Fredoka', sans-serif";

        const title = document.createElement('h3');
        title.textContent = 'Share Your Song';
        title.style.margin = '0 0 15px 0';
        dialog.appendChild(title);

        const options = document.createElement('div');
        options.style.display = 'flex';
        options.style.flexDirection = 'column';
        options.style.gap = '10px';

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Link';
        copyButton.className = 'shareButton';
        copyButton.style.width = '100%';
        copyButton.onclick = async () => {
            try {
                await navigator.clipboard.writeText(shareUrl);
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy Link';
                }, 2000);
            } catch (err) {
                prompt('Copy this link:', shareUrl);
            }
        };

        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download WAV (Coming Soon)';
        downloadButton.className = 'shareButton';
        downloadButton.style.width = '100%';
        downloadButton.style.backgroundColor = '#6B395C';
        downloadButton.style.boxShadow = '0 2px 0 #4B2B3C';
        downloadButton.disabled = true;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'shareButton';
        closeButton.style.width = '100%';
        closeButton.style.backgroundColor = '#6B6B6B';
        closeButton.style.boxShadow = '0 2px 0 #4B4B4B';
        closeButton.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };

        options.appendChild(copyButton);
        options.appendChild(downloadButton);
        options.appendChild(closeButton);
        dialog.appendChild(options);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';
        overlay.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };

        document.body.appendChild(overlay);
        document.body.appendChild(dialog);
    }

    return <button className="shareButton" onClick={handleShare}><FaShare /></button>
}

export default ShareButton;