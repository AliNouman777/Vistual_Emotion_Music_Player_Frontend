import React from "react";
import "./AdminFeaturesaside.css";
import { FaHome, FaUpload, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { GiLoveSong } from "react-icons/gi";
import { IoMdArrowRoundBack } from "react-icons/io";

const AdminFeaturesaside = () => {
  return (
    <div className="maincon">
    <div className="asidecon">
      <Link to={"/"}  className="link">
          <IoMdArrowRoundBack/> Home
        </Link>
      <aside className="aside">
        <Link to={"/dashboard"}  className="link">
          <FaHome /> Dashboard
        </Link>
        <Link to={"/dashboard/upload"} className="link">
          <FaUpload /> Upload
        </Link>
        <Link to= {"/dashboard/user"} className="link">
          <FaUsers/> User
        </Link>
        <Link to= {"/dashboard/songs"} className="link">
          <GiLoveSong/> Songs List
        </Link>
        <Link to = {"/logout"} className="link">
          <MdLogout/>Logout
        </Link>
      </aside>
    </div>
    </div>
  );
};

export default AdminFeaturesaside;
