import NoteContainer from "./NoteContainer"

function MusicStaff() {
    let notecontainers = []
    for(let i = 0; i< 32*8; i++){
        notecontainers.push( <NoteContainer key={i}>{i}</NoteContainer>)
    }

    return <>
    <div className="musicGrid">
        {notecontainers}
    </div>
    </>
}

export default MusicStaff