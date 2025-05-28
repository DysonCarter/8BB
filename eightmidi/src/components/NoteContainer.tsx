
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
  return (
    <div
      className="noteContainer"
      style={{ backgroundColor: active ? "green" : "rgb(198, 188, 137)",  }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

export default NoteContainer;
