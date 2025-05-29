import StaffHolder from "./StaffHolder";
import animalCrossingImage from "./images/Animal Crossing New Leaf Town Names.jpeg";

function MainPage() {
  return <>
  <div className="mainPage">
    <div className="mainPageHeader">
        8BB
        <div className="mainPageHeaderSubtitle">8-Bit Builder</div>
    </div>
    <StaffHolder />
    <div className="About">
        <div className="AboutTitle">About</div>
        <div className="AboutContent" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p>8BB is a tool for creating 8-bit music. Inspired by the Animal Crossing series's tune builder, 8BB is an intuitive way to compose your own music. To the right is an image of the original tune builder from Animal Crossing.</p>
                <p>This little toy is responsible for many kids like myself becoming insterested in music and composition.</p>
              </div>
              <img src={animalCrossingImage} alt="Animal Crossing Tune Builder" style={{ width: '300px', height: 'auto' }} />
        </div>
        <div className="AboutTitle">How to use</div>
        <div className="AboutContent">
            <p>The main part you will be working with is the staff. It is a basic grid where each column represents a note, and each row reprsents a pitch. You can adjust the pitch of each note by clicking or dragging up and down. The bottom row is a rest (so nothing is played). The next row is a slur which will make the previous note ring out.</p>
            <p>If you find you ran out of space, you can add more columns by clicking the "+" button. You can also add more rows by clicking the "+" if you desire to use higher notes. Finally, you can click clear to reset the notes, or click play to hear your song.</p>
        </div>
    </div>
  </div>
  </>;
}

export default MainPage;
