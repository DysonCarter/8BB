
type NoteContainerProps = {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  onMouseDown?: () => void;
};

function NoteContainer({
  children,
  active = false,
  onClick,
  onMouseDown,
}: NoteContainerProps) {

  // colors for notes
  let bgcolor = "rgb(198, 188, 137)";
  if(children === "rest"){
    bgcolor = "grey";
  } else if(children === "slur"){
    bgcolor = "plum";
  } else if (children){
    bgcolor = "green";
  }
  return (
    <div
      className="noteContainer"
      style={{ backgroundColor: bgcolor}}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

export default NoteContainer;
