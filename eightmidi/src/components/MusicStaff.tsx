import NoteContainer from "./NoteContainer"

const COLS = 32;
const ROWS = 9

function MusicStaff() {

    let notecontainers = []
    for(let i = 0; i< COLS*ROWS; i++){
        if ((i+1) % (ROWS) !== 0){
            notecontainers.push( <NoteContainer key={i}>{i}</NoteContainer>)
        } else {
            notecontainers.push( <NoteContainer key={i} active={true}>{i}</NoteContainer>)
        }
    }

    return <>
    <div className="musicGrid">
        {notecontainers}
    </div>
    </>
}

export default MusicStaff