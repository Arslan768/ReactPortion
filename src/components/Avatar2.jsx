import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useEffect, useMemo, useRef, useState } from "react";
import './Chatbot.css'; // Import CSS for styling
import * as THREE from "three";

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export function Avatar(props) {
  // State and controls
  var {
    playAudio,
    script,
    headFollow,
    smoothMorphTarget,
    morphTargetSmoothing,
  } = useControls({
    playAudio: false,
    headFollow: true,
    smoothMorphTarget: true,
    morphTargetSmoothing: 0.5,
    script: {
      value: "response",
      options: ["welcome", "pizzas", "HassanKamran", "response"],
    },
  });

  // Chat and conversation states
  const [messages, setMessages] = useState([]); // Stores conversation
  const [input, setInput] = useState('');       // Stores user input
  const [loading, setLoading] = useState(false); // Indicates when the bot is processing

  let audio;
  let lipsync;

  useFrame(() => {
    if (!playAudio || !audio) return;

    const currentAudioTime = audio.currentTime;
    if (audio.paused || audio.ended) {
      setAnimation("Idle");
      return;
    }

    Object.values(corresponding).forEach((value) => {
      if (!smoothMorphTarget) {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = 0;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = 0;
      } else {
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );

        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[value]
          ],
          0,
          morphTargetSmoothing
        );
      }
    });

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCue = lipsync.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ) {
        if (!smoothMorphTarget) {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
          ] = 1;
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
          ] = 1;
        } else {
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Head.morphTargetInfluences[
              nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
            ],
            1,
            morphTargetSmoothing
          );
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
          ] = THREE.MathUtils.lerp(
            nodes.Wolf3D_Teeth.morphTargetInfluences[
              nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
            ],
            1,
            morphTargetSmoothing
          );
        }
        break;
      }
    }
  });

  const checkResponse = async (question) => {
    try {
      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST', // Use POST as required by your backend
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }), // Send the input as question
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Add bot response to conversation
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.response },
      ]);
      playAudio = true; // Set playAudio to true when the response is received
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }]);
      setLoading(true);
      await checkResponse(input);
      setLoading(false);
      setInput(''); // Clear input after sending message
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value); // Update input as user types
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(); // Send message on pressing Enter
    }
  };

  useEffect(() => {
    if (!playAudio) return;

    // Fetch the updated JSON file
    fetch(`./audios/response.json?cacheBust=${new Date().getTime()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        lipsync = data;
        console.log("JSON File parsed");
        audio = new Audio(`./audios/response.mp3?cacheBust=${new Date().getTime()}`);
        audio.play();

        if (script === "welcome") {
          setAnimation("Greeting");
        } else {
          setAnimation("Idle");
        }
      })
      .catch((error) => console.error("Failed to fetch JSON file:", error));

    return () => {
      audio.pause(); // Clean up to prevent multiple audios playing
    };
  }, [playAudio, script]);

  const { nodes, materials } = useGLTF("/models/646d9dcdc8a5f5bddbfac913.glb");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: angryAnimation } = useFBX("/animations/Angry Gesture.fbx");
  const { animations: greetingAnimation } = useFBX("/animations/Standing Greeting.fbx");

  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetingAnimation[0].name = "Greeting";

  const [animation, setAnimation] = useState("Idle");

  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], angryAnimation[0], greetingAnimation[0]],
    group
  );

  useEffect(() => {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }, [animation]);

  // Head movement logic
  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("Head").lookAt(state.camera.position);
    }
  });

  return (
    <div>
      {/* Avatar 3D Model */}
      <group {...props} dispose={null} ref={group}>
        <primitive object={nodes.Hips} />
        {/* Avatar SkinnedMeshes */}
        {/* (your model and skinned meshes here) */}
      </group>

      {/* Chat Interface */}
      <div style={styles.container}>
        <div style={styles.chatWindow}>
          {messages.map((message, index) => (
            <div key={index} style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
              {message.text}
            </div>
          ))}
        </div>
        {loading && <div style={styles.loading}>Bot is processing...</div>}
        <input
          type="text"
          style={styles.input}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
                <button style={styles.sendButton} onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

// CSS styles for the chat interface
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  chatWindow: {
    width: '300px',
    height: '400px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '10px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    marginBottom: '10px',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '5px',
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '5px',
    maxWidth: '80%',
  },
  input: {
    width: '250px',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    borderRadius: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  loading: {
    fontStyle: 'italic',
    marginBottom: '10px',
  },
};

useGLTF.preload("/models/646d9dcdc8a5f5bddbfac913.glb");
useFBX.preload("/animations/Idle.fbx");
useFBX.preload("/animations/Angry Gesture.fbx");
useFBX.preload("/animations/Standing Greeting.fbx");


