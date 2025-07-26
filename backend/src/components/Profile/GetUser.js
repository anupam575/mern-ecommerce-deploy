// GetUser.js
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setFetchedUser } from "../../redux/slices/authSlice";

import "./user.css";

function GetUser() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/me", {
        withCredentials: true,
      });

      dispatch(setFetchedUser(data.user));
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="user-container">
      <h2>User Details</h2>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {user.avatar && <img src={user.avatar.url} alt="avatar" />}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GetUser;
