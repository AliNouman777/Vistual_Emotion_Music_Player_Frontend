import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSongUploader.css";
import { useDispatch } from "react-redux";
import { uploadMusic } from "../../App/AsyncSlice/MusicAsyncSlice";
import waiting from "/duck.gif"

const AdminSongsUploader = () => {
  const dispatch = useDispatch();
  const [song, setSong] = useState({
    singer: "",
    title: "",
    description: "",
    musictype: "",
  });

  const [video, setVideo] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSong({ ...song, [name]: value });
  };

  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    toast.info("Uploading music...");

    // Prepare the music data object as expected by the uploadMusic thunk
    const musicData = {
      title: song.title,
      singer: song.singer,
      description: song.description,
      musictype: song.musictype,
      file: video, 
    };

    try {
      // Dispatch the uploadMusic action with the prepared music data
      const response = await dispatch(uploadMusic(musicData)).unwrap();
      toast.success('Music uploaded successfully!');
      setSong({
        singer: "",
        title: "",
        description: "",
        musictype: "",
    });
    setVideo(null);

    } catch (error) {
      // Error handling: Display error message from the thunk or a generic message
      toast.error(error || 'Upload failed, please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="song-uploader"
      initial="hidden"
      animate="visible"
      variants={formVariants}
      transition={{ duration: 0.5 }}
    >
      <h1>Upload Songs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="singer"
          placeholder="Singer"
          value={song.singer}
          onChange={handleInputChange}
        />
        <select
          name="musictype"
          value={song.musictype}
          onChange={handleInputChange}
        >
          <option value="">Select Music Type</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="surprise">Surprise</option>
          <option value="neutral">Neutral</option>
          <option value="disgust">Disgust</option>
        </select>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={song.title}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={song.description}
          onChange={handleInputChange}
        />

        <motion.input
          type="file"
          name="video"
          accept="audio/mp3,video/mp4" 
          onChange={handleVideoChange}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        />
      <div className="waiting-con">
      {isUploading && <img className="waiting" src={waiting} alt="WAITING" />}
      </div>
        <motion.button
          type="submit"
          disabled={isUploading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </motion.button>
      </form>

      <ToastContainer />
    </motion.div>
  );
};

export default AdminSongsUploader;
