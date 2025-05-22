import { useRef, useState } from "react";

type NoteContainerProps = {
    children?: React.ReactNode;
}

function NoteContainer({children} : NoteContainerProps) {

    const [noteActive, setNoteActive] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    function handleNoteClick() {
        //toggle color:
        if(divRef.current){
            divRef.current.style.backgroundColor = noteActive ? "rgb(198, 188, 137)" : "green"
        }
        setNoteActive(!noteActive);
    }

    return <>
      <div className="noteContainer" ref={divRef} onClick={handleNoteClick}>{children}</div>
    </>
}

export default NoteContainer;