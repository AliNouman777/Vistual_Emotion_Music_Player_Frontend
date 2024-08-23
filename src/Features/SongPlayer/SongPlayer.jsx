import React, { useEffect } from "react";
import "./SongPlayer.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SongPlayer = () => {
  const music = useSelector((state) => state.music.music);
  const navigate = useNavigate();

  return (
    <>
      {music ? (
        <div>
          <div className="parentcon">
            <div className="videoplayer">
              <div className="videocon">
                <video
                  autoPlay
                  className="musicvideo"
                  src={music.music_link}
                  controls
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="textcon">
                <div className="circle-container">
                  <div className="rotating-circle">
                    <img
                      className="logoimg"
                      src="https://play-lh.googleusercontent.com/YImtNmRtt854TWLJWGvUWn27oYeH_7DcI6VnAUsztof3xQ9v43bxft9rQFESuwMnY1sy=w240-h480-rw"
                      alt="Rotating"
                    />
                  </div>
                </div>

                <h2>Song Name : {music.title} </h2>
                <h3>Artist Name :{music.singer} </h3>
                <h3>Mood : {music.type}</h3>
                <p>{music.description}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>Not Music found</div>
          <Link to={"/"}>Home</Link>
        </>
      )}
    </>
  );
};

export default SongPlayer;
