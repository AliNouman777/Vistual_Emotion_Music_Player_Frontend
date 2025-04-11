import React, { useEffect, useState } from "react";
import "./SongPlayer.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MP from "/mp.png"

const SongPlayer = () => {
  const music = useSelector((state) => state.music.music);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoDetails, setVideoDetails] = useState({
    title: "",
    description: "",
    channelTitle: "",
  });

  const fetchYouTubeVideos = async (query) => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&key=AIzaSyAToXp1On3Vn6nccbt-Nm9L7dD7Ft1yySA&maxResults=5`
    );
    const data = await response.json();
    setVideos(data.items);
  };

  useEffect(() => {
    if (music) {
      fetchYouTubeVideos(`${music.type} mood songs from bollywood and holywood`);
    }
  }, [music]);

  const handleVideoSelect = (videoId, videoSnippet) => {
    setSelectedVideo(videoId);
    setVideoDetails({
      title: videoSnippet.title,
      description: videoSnippet.description,
      channelTitle: videoSnippet.channelTitle,
    });
  };

  return (
    <>
      {music ? (
        <div>
          <div className="parentcon">
            <div className="videoplayer">
              <div className="videocon">
                {selectedVideo ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                  ></iframe>
                ) : (
                  <video
                    autoPlay
                    className="musicvideo"
                    src={music.music_link}
                    controls
                    loop
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
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

                <h2 className="m-font">
                  Song Name : {selectedVideo ? videoDetails.title : music.title}
                </h2>
                <h3 className="s-font">
                  Artist Name :{" "}
                  {selectedVideo ? videoDetails.channelTitle : music.singer}
                </h3>
                <p className="x-font">
                  {selectedVideo ? videoDetails.description.length > 100? `${videoDetails.description.slice(0, 100)} ...`:videoDetails.description : music.description.length > 100 ? `${music.description.slice(0,100)}...` : music.description}
                </p>
              </div>
            </div>

            {videos && (
              <div className="recommendations">
                <h2>Recommended Songs</h2>
                <div className="video-list">
                  {videos.map((video) => (
                    <div
                      key={video.id.videoId}
                      className="video-thumbnail"
                      onClick={() =>
                        handleVideoSelect(video.id.videoId, video.snippet)
                      }
                    >
                      <img
                        src={video.snippet.thumbnails.medium.url}
                        alt={video.snippet.title}
                        className="thumbnail"
                      />
                      <p>{video.snippet.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="notfoundcon">
            <div className="notfoundtext">Not Music found</div>
            <Link to={"/"}>Home</Link>
          </div>
        </>
      )}
    </>
  );
};

export default SongPlayer;
