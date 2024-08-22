import React, { useEffect, useState } from "react";
import SongPlayer from '../Features/SongPlayer/SongPlayer.jsx';
import DistortedText from "../Features/SongPlayer/distortedtext.jsx";

const SongplayerCom = () => {
  const [isHidden, setIsHidden] = useState(true); // More descriptive naming
  const timeoutDuration = 3000; // Define magic number as a named constant

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHidden(false);
    }, timeoutDuration);

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, [timeoutDuration]); 

  return (
    <div>
      {isHidden ? <DistortedText /> : <SongPlayer />}
    </div>
  );
}

export default SongplayerCom;
