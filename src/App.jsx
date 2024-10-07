// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./components/Experience";
// import { Chatbot } from "./components/chatbot"; // Import your Chatbot component
// import React, { useState } from 'react';

// // import './App.css'; // Optional, for custom styling

// function App() {
//   const [playAudio, setPlayAudio] = useState(false); // State to control avatar audio
//   const [script, setScript] = useState('welcome');

//   const handleChatbotResponse = (response) => {
//     if (response) {
//       setScript(response); // Set the script based on the chatbot response
//       setPlayAudio(true);  // Trigger play audio
//     }
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100vh" }}>
//       {/* 3D Scene */}
//       <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
//         <color attach="background" args={["#ececec"]} />
//         <Experience playAudio={playAudio} script={script} />
//       </Canvas>

//       {/* Chatbot component */}
//       <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1 }}>
//         <Chatbot onResponse={handleChatbotResponse} />
//       </div>
//     </div>
//   );
// }

// export default App;





import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Chatbot } from "./components/chatbot"; // Import your Chatbot component
import React, { useState } from 'react';

function App() {
  let [playAudio, setPlayAudio] = useState(false); // State to control avatar audio
  let [script, setScript] = useState('welcome');


  const handleChatbotResponse = (response) => {
    if (response) {
      setScript(response); // Set the script based on the chatbot response
      setPlayAudio(true);  // Trigger play audio
      //alert(response)
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience playAudio={playAudio } script={script} />
      </Canvas>

      {/* Chatbot component */}
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1 }}>
        <Chatbot onResponse={handleChatbotResponse} /> {/* Pass onResponse instead */}
      </div>
    </div>
  );
}

export default App;






// import { Canvas } from "@react-three/fiber";
// import { Experience } from "./components/Experience";
// import { Avatar } from "./components/Avatar"; // Import the Avatar component
// import React, { useState } from 'react';

// function App() {
//   const [playAudio, setPlayAudio] = useState(false); // State to control avatar audio
//   const [script, setScript] = useState('welcome');

//   const handleAvatarResponse = (response) => {
//     if (response) {
//       setScript(response); // Set the script based on the avatar response
//       setPlayAudio(true);   // Trigger play audio
//     }
//   };

//   return (
//     <div style={{ position: "relative", width: "100%", height: "100vh" }}>
//       {/* 3D Scene */}
//       <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
//         <color attach="background" args={["#ececec"]} />
//         <Experience playAudio={playAudio} script={script} />
//       </Canvas>

//       {/* Avatar component */}
//       <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1 }}>
//         <Avatar onResponse={handleAvatarResponse} /> {/* Pass onResponse to Avatar */}
//       </div>
//     </div>
//   );
// }

// export default App;
