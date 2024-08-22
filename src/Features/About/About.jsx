import React from 'react'
import "./About.css"
import { motion } from "framer-motion";
import ali_img from "/ali.png"
import molvi_img from "/molvi.jpg"

const About = () => {
  return (
    <div className="about-container">
      <motion.div
        className="about-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <section className="about-section">
          <h1>About Visual Emotion Base Music Player</h1>
          <p>
            Visual Emotion Base Music Player is an innovative music platform
            designed to tailor music to your emotions. By leveraging cutting-edge AI technology, our player analyzes your facial expressions to curate a personalized soundtrack that aligns with your current mood. Whether you're feeling joyful, reflective, or anything in between, Visual Emotion Base Music Player transforms your emotions into a seamless musical journey.
          </p>
        </section>

        <section className="team-section">
          <h1>Meet the Team</h1>
          <div className="team-members">
            <div className="team-member">
              <img src={ali_img} alt="Ali Nouman" />
              <h2>ALI NOUMAN</h2>
              <p>Developer</p>
            </div>
            <div className="team-member">
              <img src={molvi_img} alt="Team Member 2" />
              <h2>Molvi</h2>
              <p>Designer </p>
            </div>
           
          </div>
        </section>
      </motion.div>
    </div>
  );

}

export default About
