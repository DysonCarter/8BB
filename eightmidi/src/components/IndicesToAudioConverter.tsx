interface IndicesToAudioConverterProps {
    indexArray: Array<number>;
}

const ROWS = 16
const NOTES = ["A", "B", "C", "D", "E", "F", "G"]

let noteI = 0;
let voicing = 4;

let indexDictionary: Record<number,string> = {
    [ROWS-1]:'rest',
    [ROWS-2]:'slur'
}
//Add note voicings to dictionary A4  B4 so on
for(let i=ROWS-3; i >= 0; i--){
    indexDictionary[i] = `${NOTES[noteI%7]}${voicing}`;
    noteI++;
    if(noteI%7 === 0){
        voicing++;
    }
}

function IndicesToAudioConverter({indexArray} : IndicesToAudioConverterProps) {

    return <>
        {indexArray.map((index, i) => (
          <span key={i}>{indexDictionary[index]} </span>
        ))}
    </>
}

export default IndicesToAudioConverter;
