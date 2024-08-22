import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./App/Slice/UserSlice";
import MusicSlice from "./App/Slice/MusicSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    music: MusicSlice,
  },
});
