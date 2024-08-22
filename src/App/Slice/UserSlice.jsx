import { createSlice } from "@reduxjs/toolkit";
import { UserLogin,UserSignup,UserProfile ,UserLogout} from "../AsyncSlice/UserAsyncSlice";

const initialState = {
  user: null,
  loading: false,
  error: null,
  token: null,
  message: "",
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {},
  extraReducers: (builders)=>{
    builders
     .addCase(UserLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.user = action.payload;
      })
      .addCase(UserLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UserSignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserSignup.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(UserSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(UserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UserLogout.pending, (state)=>{
        state.loading=true;
      })
      .addCase(UserLogout.fulfilled,(state)=>{
        state.loading=false;
        state.user=null;
        state.token=null;
      })
      .addCase(UserLogout.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      })

  }
});

export default userSlice.reducer;