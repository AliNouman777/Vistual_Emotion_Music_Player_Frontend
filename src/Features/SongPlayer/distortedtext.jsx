import React, { useEffect, useState } from "react";
import "./ditortedtext.css";
import { useSelector } from "react-redux";

const DistortedText = () => {
  const mood = useSelector((state) => state.music.mood);
  const [emoji, setEmoji] = useState("");

  // Update the emoji based on the mood
  useEffect(() => {
    const moodEmojis = {
      angry: "😠",
      disgust: "🤢",
      fear: "😨",
      happy: "😀",
      neutral: "😐",
      sad: "😢",
      surprise: "😲"
    };
    setEmoji(moodEmojis[mood] || "");  // Use the mood to fetch the corresponding emoji or default to an empty string
  }, [mood]);

  // Build the animated text with individual characters
  const animatedMoodText = mood.split("").map((char, index) => (
    <span
      key={index}
      className="spanSmoke"
      style={{ animationDelay: `${0.5 + index / 10}s` }}
    >
      {char}
    </span>
  ));

  return (
    <div className="wrapperEight">
      <h3 className="smoke">
        <span className="spanSmoke">You look</span> &nbsp;{animatedMoodText}<span className="emoji">{emoji}</span>
      </h3>
    </div>
  );
};

export default DistortedText;
