import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const UPLOAD_ENDPOINT = 'https://face-detection-music-player-backend.onrender.com/music'; 

function gettoken() {
  const tokenString = localStorage.getItem("token");
  const tokenobj = tokenString ? JSON.parse(tokenString) : null;
  if (!tokenobj && new Date().getTime() > tokenobj.expiry) {
    return null;
  }
  return tokenobj.value;
}

export const uploadMusic = createAsyncThunk(
  'music/uploadMusic',
  async (musicData, { rejectWithValue }) => {
    try {
      const token = gettoken();
      const formData = new FormData();
      formData.append('title', musicData.title);
      formData.append('singer', musicData.singer);
      formData.append('description', musicData.description);
      formData.append('musictype', musicData.musictype);
      formData.append('file', musicData.file);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`  // Set Authorization header
        }
      };

      const response = await axios.post(`${UPLOAD_ENDPOINT}/upload`, formData, config);
      return response.data;
      
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Could not upload music');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const DetectEmotion = createAsyncThunk(
  "Music/DetectEmotion",
  async (musicData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${UPLOAD_ENDPOINT}/getimg`, musicData);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.log(error.response)
        return rejectWithValue(error.response.data.message || 'Could not detect emotion');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
) 



export const SingerListAsync = createAsyncThunk(
  "Music/SingerListAsync",async (_, {rejectWithValue})=>{
    try{
      const response = await axios.get(`${UPLOAD_ENDPOINT}/singers`);
      return response.data;
    }catch(error){
     
        return rejectWithValue(error.message);
      
    }
  }
)