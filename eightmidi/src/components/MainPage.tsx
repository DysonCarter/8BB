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
        <p>
          <strong>8BB</strong> is a tool for creating 8-bit music. Inspired by the tune builder from the 
          <em> Animal Crossing </em> series, 8BB offers an intuitive and playful way to compose your own melodies.
        </p>
        <p>
          This little musical toy sparked a love for music and composition in many kids—including myself—and 8BB aims to keep that spark alive in a more flexible, digital format.
        </p>
      </div>
      <img
        src={animalCrossingImage}
        alt="Animal Crossing Tune Builder"
        style={{ width: '300px', height: 'auto' }}
      />
    </div>

    <div className="AboutTitle">How to Use</div>
    <div className="AboutContent">
      <p>
        The main interface is the grid-based staff. Each column represents a beat, and each row corresponds to a pitch. 
        You can click or drag up and down to change the pitch of each note. The bottom row is a rest (no sound), 
        and the second-to-last row is a slur, which extends the previous note.
      </p>
      <p>
        You can customize your composition by adding more columns (notes) or rows (pitches) using the + and – buttons. 
        Press <strong>Clear</strong> to reset the composition, or <strong>Play</strong> to hear your song. 
        Use the tempo slider to adjust playback speed, and hit <strong>Share</strong> to generate a link to your tune.
      </p>
    </div>
  </div>

  </div>
  </>;
}

export default MainPage;
