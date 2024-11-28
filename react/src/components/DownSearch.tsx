import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch  } from "react-redux";
import "../styles/nav.css";
import { useTypedSelector } from "../useTypedSelector.tsx";
const DownSearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const target = useTypedSelector((state) => state.target);
  const [downSearchInput, setDownSearchInput] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDownSearchInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputExist();
    }
  };

  const inputExist = () => {
    if (downSearchInput === "") {
      alert("내용을 입력해주세요.");
    } else {
      navigate("/search-result", {
        state: { searchInput: downSearchInput, target },
      });
    }
  };

  return (
    <div className="down-rectangle">
      <select
        className="select-target"
        value={target}
        onChange={(e) => {
          dispatch({ type: "TARGET_CHANGE", payload: e.target.value });
        }}
      >
        <option value={"title"}>제목</option>
        <option value={"content"}>내용</option>
        <option value={"author"}>작성자</option>
      </select>
      <input
        className="down-search-box"
        placeholder="내용을 입력하세요."
        value={downSearchInput}
        onChange={onChange}
        onKeyUp={handleKeyPress}
      />
      <button className="search-icon" onClick={inputExist}>
        <img src="/images/search.jpg" alt="Search" />
      </button>
    </div>
  );
};

export default DownSearch;
