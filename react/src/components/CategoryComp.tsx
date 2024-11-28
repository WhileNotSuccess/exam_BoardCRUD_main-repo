import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { CreateCategory } from "./CreateCategory.tsx";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../useTypedSelector.tsx";

interface data {
  id:number,
  boardName:string,

}


export const CategoryCompo = () => {
  const dispatch = useDispatch();
  const categoryList = useTypedSelector((state) => state.categoryList);
  const navigate = useNavigate();
  const fetchCategories = async () => {
    const { data } = await axios.get("http://localhost:8000/api/category");
    dispatch({ type: "CATEGORYLIST_UPLOAD", payload: data.data });
  };

  useEffect(() => {
    fetchCategories();
  }, [dispatch]);

  const categoryChange = (category:string) => {
    dispatch({ type: "CATEGORY_CHANGE", payload: category });
    navigate("/", { state: { category: category } });
  };

  return (
    <div className="board-tag">
      <div className="board-list">
        {categoryList.map((data:data) => (
          <CreateCategory
            key={data.id}
            boardName={data.boardName}
            categoryChange={categoryChange}
          />
        ))}
      </div>
    </div>
  );
};
