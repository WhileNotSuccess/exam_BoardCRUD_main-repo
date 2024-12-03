import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/maincomp.css";
import axios from "axios";
import UserInfoCompo from "../components/UserInfoComp.tsx";
import { CategoryCompo } from "../components/CategoryComp.tsx"; // 왼쪽의
import PostList from "../components/PostList"; // 주소가 들어가면 게시글 형태로 만들어주는 컴포넌트
import Pagination from "../components/Pagination"; // 페이지네이션
import DownSearch from "../components/DownSearch"; // 하단 검색창
import { useSelector } from "react-redux";
import { useAuth } from "../hooks/auth.ts";

interface targetState {
  searchInput : string;
  target : string;
}

const SearchResult = () => {
  const [postPerPage, setPostPerPage] = useState(10); // 한 페이지에 띄울 게시글 갯수
  const location = useLocation();
  const { searchInput } = location.state || {searchInput: ""}; // 검색 내용을 location으로 값을 받아옴
  const target = useSelector((state:targetState) => state.target); // 리듀서를 이용해 이전 페이지의 타겟(제목,내용,작성자)을 받아옴
  const [resultData, setResultData] = useState([]); // 주소를 통해 받아온 response 데이터
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPage, setTotalPage] = useState(1); // 전체 페이지
  const [prevPage, setPrevPage] = useState(""); // 다음 페이지
  const [nextPage, setNextPage] = useState(""); // 이전 페이지

  const {user} = useAuth();

  const fetchResult = async (page:number) => {
    const { data } = await axios.get(
      `http://localhost:3012/api/search?content=${searchInput}&target=${target}&limit=${postPerPage}&page=${page}`
    );
    setResultData(data.data);
    setTotalPage(data.totalPage);
    setNextPage(data.nextPage);
    setPrevPage(data.prevPage);
    setCurrentPage(data.currentPage);
  };

  useEffect(() => {
    fetchResult(1);
  }, [postPerPage, searchInput]); // searchInput과 target이 변경될 때도 fetchResult 호출

  const pageChange = async (url:string) => {
    // 페이지의 < > 버튼을 눌렀을 때 바뀌는 실제값
    const { data } = await axios.get(url);
    setResultData(data.data);
    setCurrentPage(data.currentPage);
    setNextPage(data.nextPage);
    setPrevPage(data.prevPage);
    setTotalPage(data.totalPage);
  };

  const paginate = (pageNumber:number) => {
    // 페이지네이션의 번호 부분을 누르면 호출되는 부분
    fetchResult(pageNumber);
  };

  return (
    <div className="container">
      <CategoryCompo />
      <div className="post-list">
        <div className="options-container">
          <div className="category-name">검색 결과</div>
          <div className="options-right">
            <select
              className="page-select"
              value={postPerPage}
              onChange={(e) => setPostPerPage(Number(e.target.value))}
            >
              <option value={10}>10개씩</option>
              <option value={20}>20개씩</option>
              <option value={30}>30개씩</option>
            </select>
          </div>
        </div>
        <div className="post-header">
          <span className="post-title">글 제목</span>
          <span className="search-post-user">작성자</span>
          <span className="post-date">작성일자</span>
        </div>
        <hr />
        {resultData.length > 0 ? <PostList list={resultData} /> : null}
      </div>
      <UserInfoCompo user={user}/>
      <DownSearch />
      <div className="down-banner">
        <Pagination
          postPerPage={postPerPage}
          prevPage={prevPage}
          nextPage={nextPage}
          totalPage={totalPage}
          paginate={paginate}
          currentPage={currentPage}
          pageChange={pageChange}
        />
      </div>
    </div>
  );
};

export default SearchResult;
