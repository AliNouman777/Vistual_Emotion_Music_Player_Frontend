import React, { useState } from "react";
import { motion } from "framer-motion";
import "./LoginPage.css";
import { useDispatch } from "react-redux";
import { UserLogin } from "../../App/AsyncSlice/UserAsyncSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginFeature = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State to hold errors

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors
    if (!validateEmail(data.email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }
    setLoading(true);
    dispatch(UserLogin(data)).then((e) => {
      if (e.meta.requestStatus === "fulfilled") {
        toast.success("Login successful!");
        navigate("/");
        setLoading(false);
      } else {
        toast.error(`Please try again. ${e.payload.message}`);
        setLoading(false);
      }
    });
  };

  return (
    <div className="con">
      <ToastContainer />
      <div className="leftcon">
        <div className="left-text">
          <img
            className="image"
            src="https://play-lh.googleusercontent.com/YImtNmRtt854TWLJWGvUWn27oYeH_7DcI6VnAUsztof3xQ9v43bxft9rQFESuwMnY1sy=w240-h480-rw"
            alt="image"
          />
          <h1 className="titleheading">
            Welcome to Visual Emotion Music Player
          </h1>
        </div>
      </div>
      <motion.div
        className="rightcon"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, duration: 1 }}
      >
        <div className="loginform">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              id="email"
              className="email"
              placeholder="Email"
              onChange={(e) => handleChange(e)}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <input
              type="password"
              name="password"
              id="password"
              required
              placeholder="Password"
              minLength="8"
              maxLength="16"
              className="password"
              onChange={(e) => handleChange(e)}
            />
            <button
              type="submit"
              className="loginbutton"
              disabled={loading}
              style={{
                cursor: loading ? "not-allowed" : "pointer",
                backgroundColor: loading ? "#ccc" : "#007bff",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="login-link">
              Don't have an account? <Link to={"/signup"}>Signup</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginFeature;
