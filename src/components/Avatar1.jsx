import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, {useEffect, useMemo, useRef, useState } from "react";
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

let { position, scale, playAudio, jawab } = props;
let [updateCount, setUpdateCount] = useState(0);

const greetingAudioRef = useRef(null);  // Use ref for the audio object
const greetingControlRef = useRef(false); // Use ref for the control
const greetingLipsyncRef = useRef(null); // Store lipsync data in ref


  // if(playAudio){
  //   alert("play audio postive!");
  // }else{
  //   alert("play audio negative!");
  // }

// State to handle user input and bot response
// const [userInput, setUserInput] = useState(""); // User input text
// const [botResponse, setBotResponse] = useState(""); // Bot response text
const [greetingControl, setGreetingControl] = useState(false);
// Controls for playAudio, headFollow, etc.
var {
  //playAudio ,
  script,
  headFollow,
  smoothMorphTarget,
  morphTargetSmoothing,
} = useControls({
  //playAudio: PlayAudio ,
  headFollow: true,
  smoothMorphTarget: true,
  morphTargetSmoothing: 0.5,
  script: {
    value: "response",
    options: ["welcome", "pizzas", "HassanKamran", "response"],
  },
});

  let audio;
  let lipsync;

  let greeting_lipsync;
  let greeting_audio;
  
  useFrame(() => {
   if (!playAudio) return;

    const currentAudioTime = audio.currentTime;
    // alert("Inside useFrame")
    //if (audio.paused || audio.ended) {
    if (audio.ended) {
      setAnimation("Idle");
      playAudio = false;

      //alert('Audio has ended, play Audio is false')
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


// The below is for when the website is initially loaded
    useFrame(() => {
      if (!greetingControlRef.current) return;
      
      const currentAudio = greetingAudioRef.current;  // Get audio from ref
      if (!currentAudio) return;  // Ensure audio exists


      const currentAudioTime = currentAudio.currentTime;
      if (currentAudio.ended || currentAudio.paused) {
        setAnimation("Idle");
        greetingControlRef.current = false;
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
      const greeting_lipsync = greetingLipsyncRef.current;
      if (!greeting_lipsync) return;

      for (let i = 0; i < greeting_lipsync.mouthCues.length; i++) {
        const mouthCue = greeting_lipsync.mouthCues[i];
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
    },[greetingControl , greeting_audio]);

   
  useEffect(() => {
    //alert("useEffect");
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
        lipsync = data; // Use the fetched data directly
        //alert("JSON File parsed");
 

        audio = new Audio(`./audios/response.mp3?cacheBust=${new Date().getTime()}`);
        audio.play();
        
        // if (script === "welcome") {
        //   setAnimation("Idle");
        // } else {
        //   setAnimation("Idle");
        // }
      })
      .catch((error) => console.error("Failed to fetch JSON file:", error));

    return () => {
      audio.pause(); // Clean up to prevent multiple audios playing
    };
  }, [playAudio, script, jawab]);



  // This one controls greetings
  useEffect(() => {
    fetch(`./audios/welcome.json?cacheBust=${new Date().getTime()}`)
      .then((welcome) => {
        if (!welcome.ok) {
          throw new Error("Network response was not ok");
        }
        return welcome.json();
      })
      .then((data) => {
        greetingLipsyncRef.current = data;
 
        console.log(greeting_lipsync)
        greeting_audio = new Audio(`./audios/welcome.mp3?cacheBust=${new Date().getTime()}`);
        greetingAudioRef.current = greeting_audio;
        greeting_audio.play();
        
        setAnimation("Greeting");
        greetingControlRef.current = true;

        
        
      })    
      .catch((error) => console.error("Failed to fetch JSON file:", error));

      return () => {
        if (greetingAudioRef.current) {
          greetingAudioRef.current.pause();  // Clean up audio
        }
      };
    }, []);
  // const triggerUpdate = () => {
  //   setUpdateCount((prevCount) => prevCount + 1); // Increment to trigger effect
  // };


  const { nodes, materials } = useGLTF("/models/646d9dcdc8a5f5bddbfac913.glb");
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: angryAnimation } = useFBX("/animations/Angry Gesture.fbx");
  const { animations: greetingAnimation } = useFBX("/animations/Standing Greeting.fbx");
  //const { animations: yellingAnimation } = useFBX("/animations/Yelling.fbx");

  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetingAnimation[0].name = "Greeting";
  //yellingAnimation[0].name = "Yelling";
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

  // CODE ADDED AFTER THE TUTORIAL (but learnt in the portfolio tutorial ♥️)
  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("Head").lookAt(state.camera.position);
    }
  });

  return (
    
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}





useGLTF.preload("/models/646d9dcdc8a5f5bddbfac913.glb");
