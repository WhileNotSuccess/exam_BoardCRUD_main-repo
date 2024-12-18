import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { CreateCategory } from "./CreateCategory.tsx";
import { useNavigate } from "react-router-dom";
import { useTypedSelector } from "../useTypedSelector.tsx";

interface CategoryData {
  id:number,
  name:string,
}


export const CategoryCompo = () => {
  const dispatch = useDispatch();
  const categoryList = useTypedSelector((state) => state.categoryList);
  const navigate = useNavigate();
  
  const categoryChange = (category:string) => {
    dispatch({ type: "CATEGORY_CHANGE", payload: category });
    navigate("/", { state: { category: category } });
  };


  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("http://localhost:3012/category");
      
      dispatch({ type: "CATEGORYLIST_UPLOAD", payload: data.data});
    };
    fetchCategories()
  }, [dispatch]);


  return (
    <div className="board-tag">
      <div className="board-list">
        {categoryList.map((data:CategoryData) => (
          <CreateCategory
            key={data.id}
            boardName={data.name}
            categoryChange={categoryChange}
          />
        ))}
      </div>
    </div>
  );
};
