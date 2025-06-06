type NoteContainerProps = {
  children?: React.ReactNode;
  active?: boolean;
  playing?: boolean;
  onClick?: () => void;
  onMouseDown?: () => void;
};

function NoteContainer({
  children,
  active = false,
  playing = false,
  onClick,
  onMouseDown,
}: NoteContainerProps) {

  // colors for notes
  let bgcolor = "rgb(0,0,0,0)";
  if(children === "rest"){
    bgcolor = "grey";
  } else if(children === "slur"){
    bgcolor = "#8E4585";
  } else if (children){
    bgcolor = "#395C6B";
  }
  return (
    <div
      className={`noteContainer ${playing ? 'playing' : ''}`}
      style={{ backgroundColor: bgcolor}}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

export default NoteContainer;
