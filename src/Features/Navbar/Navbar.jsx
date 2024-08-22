import React, { useEffect } from "react";
import "./Navbar.css";
import {
  FaInfoCircle,
  FaCamera,
  FaHome,
  FaSignInAlt,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import login from "/login.png";
import { useSelector } from "react-redux";

const Navbar = () => {
  const Navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  
  function movetocapture() {
    Navigate("/capture");
  }
  function movetologin() {
    Navigate("/login");
  }

  return (
    <>
      <div className="con">
        <div className="hnavbar">
          <div className="iconcon">
            <Link to={"/"} className="Link">
              <FaHome />
            </Link>
            <span onClick={movetocapture} className="Link">
              <FaCamera />
            </span>
            <Link to={"/about"} className="Link">
              <FaInfoCircle />
            </Link>
            {user && user.isAdmin && (
              <Link to={"/dashboard"} className="Link">
                <MdDashboard />
              </Link>
            )}
  {console.log(localStorage.getItem("token"))}
            {localStorage.getItem("token") ? (
              
              <Link to={"/logout"} className="Link">
                <FaSignInAlt />
              </Link>
            ) : (
              <img
                className="login Link"
                src={login}
                onClick={movetologin}
                alt="login"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
