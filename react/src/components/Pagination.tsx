import React from "react";
import "../styles/maincomp.css";

interface props {
  postPerPage:number;
  prevPage:string;
  nextPage:string;
  totalPage:number;
  paginate:(pageNumber:number)=> void;
  currentPage:number;
  pageChange:(url:string)=>void;
}


export const Pagination : React.FC<props> = ({
  postPerPage,
  prevPage,
  nextPage,
  totalPage,
  paginate,
  currentPage,
  pageChange

}) => {
  const pageNumbers = [];

  // 페이지네이션이 없을 경우, 페이지네이션을 렌더링하지 않음
  if (totalPage === 0) return null;

  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPage);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <button
        className="arrow-button"
        onClick={(e) => {
          e.preventDefault();
          pageChange(prevPage ? `${prevPage}&limit=${postPerPage}` : "");
        }}
        disabled={!prevPage}
      >
        <img src="/images/arrow_back.jpg" />
      </button>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className={currentPage === number ? "active" : ""}>
            <a
              onClick={(e) => {
                e.preventDefault();
                paginate(number);
              }}
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
      <button
        className="arrow-button"
        onClick={(e) => {
          e.preventDefault();
          pageChange(nextPage ? `${nextPage}&limit=${postPerPage}` : "");
        }}
        disabled={!nextPage}
      >
        <img src="arrow_forward.jpg " />
      </button>
    </>
  );
};

export default Pagination;
