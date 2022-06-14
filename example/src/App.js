import React from "react";
import "./App.css";
import Stories, { WithSeeMore } from "../../dist";

function App() {
  return (
    <div className="App">
      <div className="stories">
        <Stories loop keyboardNavigation stories={stories2} />
      </div>
    </div>
  );
}

const Story2 = ({ action, isPaused }) => {
  return (
    <div style={{ ...contentStyle, background: "Aquamarine", color: "#333" }}>
      <h1>You get the control of the story.</h1>
      <p>
        Render your custom JSX by passing just a{" "}
        <code style={{ fontStyle: "italic" }}>content</code> property inside
        your story object.
      </p>
      <p>
        You get a <code style={{ fontStyle: "italic" }}>action</code> prop as an
        input to your content function, that can be used to play or pause the
        story.
      </p>
      <h1>{isPaused ? "Paused" : "Playing"}</h1>
      <h4>v2 is out 🎉</h4>
      <p>React Native version coming soon.</p>
    </div>
  );
};

const Story3 = ({ action, isPaused }) => {
  return (
    <div style={{ ...contentStyle, background: "Aquamarine", color: "#333" }}>
      <video
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        width="100%"
        height="100%"
        autoPlay
      ></video>
    </div>
  );
};

const stories2 = [
  {
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    type: "video",
  },
  { content: Story2 },
  { content: Story3 },
];

const image = {
  display: "block",
  maxWidth: "100%",
  borderRadius: 4,
};

const code = {
  background: "#eee",
  padding: "5px 10px",
  borderRadius: "4px",
  color: "#333",
};

const contentStyle = {
  background: "#333",
  width: "100%",
  padding: 20,
  color: "white",
  height: "100%",
};

const customSeeMore = {
  textAlign: "center",
  fontSize: 14,
  bottom: 20,
  position: "relative",
};

export default App;
