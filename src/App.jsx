import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginCom from "./Components/LoginCom";
import SignupCom from "./Components/SignupCom";
import { useDispatch } from "react-redux";
import { UserProfile } from "./App/AsyncSlice/UserAsyncSlice";
import HomeCom from "./Components/HomeCom";
import CaptureCom from "./Components/CaptureCom";
import AdminCom from "./Components/AdminCom";
import AdminSongCom from "./Components/AdminSongCom";
import SongplayerCom from "./Components/SongplayerCom";
import Logout from "./Features/Logout";
import AboutCom from "./Components/AboutCom";
import UserList from "./Features/UserList/UserList";
import SongsList from "./Features/SongsList/SongsList";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const t = dispatch(UserProfile());
  })


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/capture" element={<CaptureCom />} />
        <Route path="/login" element={<LoginCom />} />
        <Route path="/signup" element={<SignupCom />} />
        <Route path="/" element={<HomeCom />} />
        <Route path="/dashboard" element={<AdminCom />} />
        <Route path="/dashboard/upload" element={<AdminSongCom />} />
        <Route path = "/dashboard/user" element={<UserList/>} />
        <Route path="/dashboard/songs" element={<SongsList/>} />
        <Route path="/player" element={<SongplayerCom />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<AboutCom />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
