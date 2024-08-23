import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const UserLogin = createAsyncThunk(
  "user/login",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "https://face-detection-music-player-backend.onrender.com/user/login",
        {
          email: user.email,
          password: user.password,
        },
        {
          withCredentials: true,
        }
      );

      const storeToken = (token) => {
        const now = new Date();
        // Set expiry to one week (7 days) from now
        const expiry = now.getTime() + 7 * 24 * 60 * 60 * 1000;
        const item = {
          value: token,
          expiry: expiry,
        };
        localStorage.setItem("token", JSON.stringify(item));
      };

      if (data.access_token) {
        storeToken(data.access_token);
      }

      return data;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      let status = 0;

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        status = error.response.status;
      }

      return rejectWithValue({
        message: errorMessage,
        status: status,
      });
    }
  }
);

export const UserSignup = createAsyncThunk(
  "user/register",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        "https://face-detection-music-player-backend.onrender.com/user/register",
        user,
        {
          headers: {
            "Content-Type": "application/json", 
          },
          withCredentials: true, 
        }
      );

      return data;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      let status = 0;

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
        status = error.response.status;
      }

      return rejectWithValue({
        message: errorMessage,
        status: status,
      });
    }
  }
);

function gettoken() {
  const tokenString = localStorage.getItem("token");
  const tokenobj = tokenString ? JSON.parse(tokenString) : null;

  // Check if the token object exists
  if (tokenobj) {
    // Check if the token has expired
    if (new Date().getTime() > tokenobj.expiry) {
      localStorage.removeItem("token");
      return null;
    } else {
      // Token is not expired, return its value
      return tokenobj.value;
    }
  } else {
    // Token object does not exist, return null
    return null;
  }
}

export const UserProfile = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue }) => {
    const token = gettoken();

    if (!token) {
      return rejectWithValue({
        message: "Invalide Token",
        status: 401,
      });
    }

    try {
      const { data } = await axios.get("https://face-detection-music-player-backend.onrender.com/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return data;
      
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      let status = 0;

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        status = error.response.status;
      }

      return rejectWithValue({
        message: errorMessage,
        status: status,
      });
    }
  }
);

export const UserLogout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = gettoken();
      if (!token) {
        throw new Error("No token found");
      }

      const { data } = await axios.post(
        "https://face-detection-music-player-backend.onrender.com/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      localStorage.removeItem("token");

      return data;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      let status = 0;

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        status = error.response.status;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return rejectWithValue({
        message: errorMessage,
        status: status,
      });
    }
  }
);
