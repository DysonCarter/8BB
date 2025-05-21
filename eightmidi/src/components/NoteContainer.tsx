type NoteContainerProps = {
    children?: React.ReactNode;
}

function NoteContainer({children} : NoteContainerProps) {
    return <>
      <div className="noteContainer">{children}</div>
    </>
}

export default NoteContainer;