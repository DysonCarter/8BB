import { useState } from "react";

type NoteContainerProps = {
    children?: React.ReactNode;
}

function NoteContainer({children} : NoteContainerProps) {

    const [noteActive, setNoteActive] = useState<boolean>(false);

    function handleNoteClick() {
        alert(`Clicked ${children}, note active = ${!noteActive}`);
        setNoteActive(!noteActive);
    }

    return <>
      <div className="noteContainer" onClick={handleNoteClick}>{children}</div>
    </>
}

export default NoteContainer;