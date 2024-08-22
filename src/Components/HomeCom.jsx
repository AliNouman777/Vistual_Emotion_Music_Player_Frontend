import React, { useEffect } from "react";  
import Navbar from "../Features/Navbar/Navbar";
import Home from "../Features/Home/WebCamCapture/Home";
import "./Home.css";
import { useDispatch } from "react-redux";
import { UserProfile } from "../App/AsyncSlice/UserAsyncSlice";  

const HomeCom = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserProfile());
  }, []);  

  return (
    <div className="home">
      <Navbar />
      <Home />
    </div>
  );
};

export default HomeCom;
