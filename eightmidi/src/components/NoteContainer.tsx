
type NoteContainerProps = {
    children?: React.ReactNode;
    active?: boolean;
    onClick?: ()=> void;
}

function NoteContainer({children, active=false, onClick} : NoteContainerProps) {
    return <>
      <div 
      className="noteContainer"
      style={{backgroundColor: active ? "green" : "rgb(198, 188, 137)"}}
      onClick={onClick}>
        {children}
      </div>
    </>
}

export default NoteContainer;