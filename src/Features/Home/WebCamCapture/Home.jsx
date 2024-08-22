import React from "react";
import { motion } from "framer-motion";
import "./WebCamCapture.css";
import img from "../home.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const WebCamCapture = () => {
  const Navigate = useNavigate();
 
  const imageAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  };

  const navbtn=()=>{
    Navigate("/capture")
  }

  return (
    <>
      <div className="pcon">
        <div className="container">
          <div className="container">
            <div className="textcon typing">
              <h1>Visual Emotion Base Music Player</h1>
              <p className="homePara">
              Discover music tailored to your emotions. Visual Emotion Base Music Player uses advanced AI to analyze your facial expressions and curate a personalized soundtrack. Let your feelings guide the rhythm, as we transform your mood into melodies. Experience music like never before.
              </p>
            </div>
          </div>
          <div className="imgcon">
            <motion.img src={img} alt="music" animate={imageAnimation} />
          </div>
        </div>
        <div className="start">
        <button onClick={navbtn} className="startbtn"><Link className="btnlink">Let's Start</Link></button>
        </div>
      </div>
    </>
  );
};

export default WebCamCapture;
