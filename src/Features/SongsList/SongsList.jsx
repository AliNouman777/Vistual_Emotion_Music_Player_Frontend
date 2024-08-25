import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SongList.css";
import AdminFeaturesaside from "../AdminFeatures/AdminFeaturesaside";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Loader/Loader"
const getToken = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  return tokenData ? tokenData.value : null;
};

const SongsList = () => {
  const [Songs, setSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [error, setError] = useState(null);
  const [deletingSongIds, setDeletingSongIds] = useState([]);
  const [editingSong, setEditingSong] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const token = getToken();

      if (!token) {
        setError("No token found");
        setLoadingSongs(false);
        return;
      }

      try {
        setLoadingSongs(true);
        const response = await axios.get("http://127.0.0.1:5000/music/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSongs(response.data);
      } catch (err) {
        setError("Error fetching Songs");
        toast.error("Error fetching Songs");
      } finally {
        setLoadingSongs(false);
      }
    };

    fetchSongs();
  }, []);

  const handleDelete = async (SongId) => {
    const token = getToken();

    if (!token) {
      setError("No token found");
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      setDeletingSongIds((prev) => [...prev, SongId]);
      await axios.delete(`https://face-detection-music-player-backend.onrender.com/music/delete/${SongId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSongs(Songs.filter((Song) => Song._id !== SongId));
      toast.success("Song deleted successfully");
    } catch (err) {
      setError("Error deleting Song");
      if (err.response) {
        toast.error(`Error deleting Song: ${err.response.data.message}`);
      } else {
        toast.error("Error deleting Song. Please try again.");
      }
    } finally {
      setDeletingSongIds((prev) => prev.filter((id) => id !== SongId));
    }
  };

  const handleEditClick = (Song) => {
    setEditingSong(Song);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingSong((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();

    if (!token) {
      setError("No token found");
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      await axios.put(`https://face-detection-music-player-backend.onrender.com/music/update/${editingSong._id}`, editingSong, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSongs(Songs.map((Song) => (Song._id === editingSong._id ? editingSong : Song)));
      setEditingSong(null);
      toast.success("Song updated successfully");
    } catch (err) {
      setError("Error updating Song");
      if (err.response) {
        toast.error(`Error updating Song: ${err.response.data.message}`);
      } else {
        toast.error("Error updating Song. Please try again.");
      }
    }
  };

  return (
    <div className="maincon">
      <AdminFeaturesaside />
      {editingSong && (
        <div className="edit-form-container">
          <h3>Edit Song</h3>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={editingSong.title}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Singer</label>
              <input
                type="text"
                name="singer"
                value={editingSong.singer}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <input
                type="text"
                name="type"
                value={editingSong.type}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={editingSong.description}
                onChange={handleEditChange}
              />
            </div>
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditingSong(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      <div className="Song-table-container">
        <h2>Song List</h2>
        {Songs.length === 0 ? (
          // <p>No Songs found.</p>
          <Loader/>
        ) : (
          <table className="Song-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Singer</th>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Songs.map((Song) => {
                const isDeleting = deletingSongIds.includes(Song._id);
                return (
                  <tr key={Song._id}>
                    <td>{Song.title}</td>
                    <td>{Song.singer}</td>
                    <td>{Song.type}</td>
                    <td>{Song.description}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(Song._id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                      <button
                        className="edit-button edit"
                        onClick={() => handleEditClick(Song)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SongsList;
