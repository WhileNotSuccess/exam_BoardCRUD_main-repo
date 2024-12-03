import React from "react";
import "../styles/maincomp.css";

interface category {
  id:number;
  title:string;
  category:string;
}

interface categoryProps {
  props:category;
}

export const PostTitle : React.FC<categoryProps> = ({props}) => {
  return (
    <div className="line-change">
      <span>
        [{props.category}] {props.title}
        <br />
      </span>
    </div>
  );
};




