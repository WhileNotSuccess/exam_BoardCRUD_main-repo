import React, { useState } from "react";
import "../styles/nav.css";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

const Nav = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const inputExist = (e:React.FormEvent) => {
    e.preventDefault()
    
    if (searchInput === "") {
      alert("내용을 입력해주세요.");
    } else {
      dispatch({ type: "TARGET_CHANGE", payload: "title" });
      navigate("/search-result", {
        state: { searchInput: searchInput },
      });
    }
  };



  return (
    <div className="parent">
      <div className="header">
        <Link to="/" className="logo"></Link>
        <div className="rectangle">
          <form onSubmit={(e)=>{inputExist(e)}} className="search-form">
            <input
              className="search-box"
              placeholder="내용을 입력하세요."
              value={searchInput}
              onChange={onChange}
              
            />
            <button type="submit" className="search-icon">
              <img src="/images/search.jpg" alt="Search" />
            </button>
          </form>
        </div>
      </div>
      <div className="banner"></div>
    </div>
  );
};

export default Nav;
