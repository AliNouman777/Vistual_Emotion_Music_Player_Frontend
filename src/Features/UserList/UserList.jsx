import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserList.css";
import AdminFeaturesaside from "../AdminFeatures/AdminFeaturesaside";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "../../Loader/Loader";

const getToken = () => {
  const tokenData = JSON.parse(localStorage.getItem("token"));
  return tokenData ? tokenData.value : null;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserIds, setDeletingUserIds] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getToken();

      if (!token) {
        setError("No token found");
        setLoadingUsers(false);
        return;
      }

      try {
        setLoadingUsers(true);
        const response = await axios.get("http://127.0.0.1:5000/user/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (err) {
        setError("Error fetching users");
        toast.error("Error fetching users");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const token = getToken();

    if (!token) {
      setError("No token found");
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      setDeletingUserIds(prev => [...prev, userId]);
      await axios.delete(`http://127.0.0.1:5000/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      setError("Error deleting user");
      if (err.response) {
        // Server-side error
        toast.error(`Error deleting user: ${err.response.data.message}`);
      } else {
        // Network or other errors
        toast.error("Error deleting user. Please try again.");
      }
    } finally {
      setDeletingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  if (loadingUsers) {
    return (
      <>
        <AdminFeaturesaside />
        <div className="loading-container">
          {/* <div className="spinner"></div>
          <p>Loading users...</p> */}
          <Loader/>
        </div>
        <ToastContainer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminFeaturesaside />
        <div className="error-container">
          <p>{error}</p>
        </div>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <AdminFeaturesaside />
      <div className="user-table-container">
        <h2>User List</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isDeleting = deletingUserIds.includes(user.id);
                return (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
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
    </>
  );
};

export default UserList;
