import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchKeyword } from "../../redux/slices/searchSlice";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchKeyword(keyword)); // ⬅️ Send to redux
    navigate("/product"); // ⬅️ Redirect to product page
  };

  return (
    <div className="search-wrapper">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search products"
          className="search-input"
          autoComplete="off"
        />
        <button type="submit" className="search-button">
          <IoSearchOutline />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
