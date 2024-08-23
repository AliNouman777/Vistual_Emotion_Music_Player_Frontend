import React, { useState } from "react";
import { motion } from "framer-motion";
import "./SingupPage.css";
import { UserSignup } from "../../App/AsyncSlice/UserAsyncSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SignupFeature = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value) ? "" : "Please enter a valid email address.";
        break;
      case "password":
        error = validatePassword(value) ? "" : "Password must be 8-16 characters long, and include at least one uppercase letter, one lowercase letter, one digit, and one special character.";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Trigger validation for all fields when the user clicks the submit button
    validateField("email", data.email);
    validateField("password", data.password);

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      setLoading(true);
      dispatch(UserSignup(data)).then((e) => {
        if (e.meta.requestStatus === "fulfilled") {
          toast.success("Signup successful!");
          setLoading(false);
          navigate("/login"); // Redirect to login page after successful signup
        } else {
          toast.error(`Signup failed. ${e.payload.message}`);
          setLoading(false);
        }
      });
    } else {
      toast.error("Please correct the errors in the form before submitting.");
    }
  };

  return (
    <div className="con">
      <ToastContainer />
      <div className="leftcon">
        <div className="left-text">
          <img
            src="https://play-lh.googleusercontent.com/YImtNmRtt854TWLJWGvUWn27oYeH_7DcI6VnAUsztof3xQ9v43bxft9rQFESuwMnY1sy=w240-h480-rw"
            className="image"
            alt="Visual Emotion Music Player"
          />
          <h1 className="titleheading">
            Welcome to Visual Emotion Music Player
          </h1>
        </div>
      </div>
      <motion.div
        className="rightcon"
        initial={{ x: 100, opacity: 0 }} // Start 100 pixels to the right and with opacity 0
        animate={{ x: 0, opacity: 1 }} // Animate to original position and full opacity
        transition={{ type: "spring", stiffness: 100, duration: 1 }} // Spring animation
      >
        <div className="signupform">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={data.username}
              onChange={handleChange}
              required
              pattern="[a-zA-Z0-9]+" // Only allow letters and numbers
              title="Username must contain only letters and numbers."
              minLength="3"
              maxLength="20"
              className="username"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              required
              className="email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              required
              minLength="8"
              maxLength="16"
              className="password"
            />
            {errors.password && <span className="error">{errors.password}</span>}
            <button
              type="submit"
              className="signupbutton"
              disabled={loading} // Disable button when loading
              style={{
                 background: loading ? "grey" : "" ,
                 cursor: loading? "not-allowed" : "pointer"                 
              }}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
            <p className="login-link">
              Already have an account? <Link to={"/login"}>Login</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupFeature;
