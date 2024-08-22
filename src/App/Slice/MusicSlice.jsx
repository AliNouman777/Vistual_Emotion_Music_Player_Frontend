import { createSlice } from "@reduxjs/toolkit";
import { uploadMusic,DetectEmotion ,SingerListAsync} from '../AsyncSlice/MusicAsyncSlice';


const initialState = {
  music: null,
  loading: false,
  error: null,
  musiclanguage: [],
  musicsingers:[],
  mood:"******"
};

const Musicupload = createSlice({
  name: "Music/upload",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadMusic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadMusic.fulfilled, (state, action) => {
        state.loading = false;
        state.music = action.payload;
      })
      .addCase(uploadMusic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(DetectEmotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DetectEmotion.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data && action.payload.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * action.payload.data.length);
          state.music = action.payload.data[randomIndex];
          state.mood = action.payload.data[randomIndex].type;
        } else {
          state.error = "No music found for the detected mood.";
        }
      })
      .addCase(DetectEmotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(SingerListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SingerListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.musicsingers = action.payload;
      })
      .addCase(SingerListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      ;
  }  
});



export const { setToken, clearToken } = Musicupload.actions;

export default Musicupload.reducer;
