import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { UserLogout } from "../App/AsyncSlice/UserAsyncSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(UserLogout())
        .then((e) => {
          toast.success(e.payload.message);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        })
        .catch(() => {
          toast.error("Something Went Wrong");
        });
    }else{
        toast.error("Please Login First");
        setTimeout(() => {
            navigate("/login");
          }, 1000);
    }
  }, []);

  return <ToastContainer />;
};

export default Logout;
