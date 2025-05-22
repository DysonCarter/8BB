import { useRef, useState } from "react";

type NoteContainerProps = {
    children?: React.ReactNode;
    active?: boolean;
}

function NoteContainer({children, active=false} : NoteContainerProps) {

    const [noteActive, setNoteActive] = useState<boolean>(active)
    const divRef = useRef<HTMLDivElement>(null);

    function handleNoteClick() {
        //toggle color:
        if(divRef.current){
            divRef.current.style.backgroundColor = noteActive ? "rgb(198, 188, 137)" : "green"
        }
        setNoteActive(!noteActive);
    }

    return <>
      <div className="noteContainer" ref={divRef} style={{backgroundColor: noteActive ? "green" : "rgb(198, 188, 137)"}}onClick={handleNoteClick}>{children}</div>
    </>
}

export default NoteContainer;