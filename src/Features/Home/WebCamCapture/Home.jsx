import React from "react";
import { motion } from "framer-motion";
import "./WebCamCapture.css";
import img from "../home.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const imageAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
    },
  };

  const handleNavigation = () => {
    navigate("/capture");
  };

  return (
    <>
      <div className="page-container">
        <div className="content-container">
          <div className="text-container typing">
            <h1>Visual Emotion Based Music Player</h1>
            <p className="home-paragraph">
              Discover music tailored to your emotions. Visual Emotion Based
              Music Player uses advanced AI to analyze your facial expressions
              and curate a personalized soundtrack. Let your feelings guide the
              rhythm, as we transform your mood into melodies. Experience music
              like never before.
            </p>
          </div>
          <div className="image-container">
            <motion.img src={img} alt="music" animate={imageAnimation} />
          </div>
        </div>
        <div className="start-button-container">
          <button onClick={handleNavigation} className="start-button">
            <Link className="button-link">Let's Start</Link>
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
