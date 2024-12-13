import  { useEffect, useState } from "react";
import { CategoryCompo } from "../components/CategoryComp.tsx";
import UserInfoCompo from "../components/UserInfoComp.tsx";
import "../styles/userpage.css";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/auth.ts";
import { Axios } from "../lib/axios.ts";
interface item {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const UserPage = () => {
  const location = useLocation();
  const author = location.state;
  const [userData, setUserData] = useState([]); // 작성글 또는 댓글 데이터를 저장
  const [selectedTab, setSelectedTab] = useState("post"); // 탭 상태 ('post' 또는 'comment')
  const postPerPage = 10; // 페이지 당 글 수
  const [prevPage, setPrevPage] = useState(""); // 이전 페이지 URL
  const [nextPage, setNextPage] = useState(""); // 다음 페이지 URL
  const [totalPage, setTotalPage] = useState(0); // 총 페이지 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  const navig = useNavigate();

  // 작성글 데이터를 가져오는 함수
  const postData = async (page:number) => {
    const { data } = await Axios.get(
      `http://localhost:3012/posts/search?content=${author}&target=author&limit=${postPerPage}&page=${page}`
    );
    setUserData(data.data);
    setPrevPage(data.prevPage);
    setNextPage(data.nextPage);
    setTotalPage(data.totalPage);
    setCurrentPage(data.currentPage || 1); // currentPage 업데이트
  };

  // 댓글단 글 데이터를 가져오는 함수
  const commentData = async (page:number) => {
    try {
      const response = await Axios.get(
        `http://localhost:3012/comments/search?content=${author}&limit=10&page=${page}`,
        
      );
      // 댓글의 값이 들어온다면 정상적으로 띄우고
      // 값이 없다면 빈배열 처리(사용자가 댓글을 달지 않으면 헤더값이 없어서 오류가 나기에 오류를  빈배열 처리)
      const data = response.data || {};
      
      setUserData(data.data || []);
      setPrevPage(data.prevPage || "");
      setNextPage(data.nextPage || "");
      setTotalPage(data.totalPage || 0);
      setCurrentPage(data.currentPage || 1); // currentPage 업데이트
      
    } catch (error) {
      // 에러 처리 (예: 네트워크 오류 등)
      setUserData([]);
      setPrevPage("");
      setNextPage("");
      setTotalPage(0);
      setCurrentPage(1);
    }
  };

  // 페이지네이션 버튼 클릭 시 호출되는 함수
  const paginate = async (pageNumber:number) => {
    if (selectedTab === "post") {
      await postData(pageNumber);
    } else if (selectedTab === "comment") {
      await commentData(pageNumber);
    }
  };

  // 페이지 이동을 위한 함수
  const pageChange = async (url:string) => {
    if (url) {
      const { data } = await Axios.get(url, {
        headers: {
          nickName: `${author}`,
        },
      });
      setUserData(data.data);
      setPrevPage(data.prevPage);
      setNextPage(data.nextPage);
      setTotalPage(data.totalPage);
      setCurrentPage(data.currentPage || 1); // currentPage 업데이트
    }
  };

  // 페이지 처음 로딩 시, '작성글' 탭을 기본으로 설정
  useEffect(() => {
    postData(1); // 1페이지 로딩
  }, []);
  return (
    <div className="info-container">
      <CategoryCompo />
      <div className="info-list">
        <h1 className="info-name">{author}</h1>
        <div className="info-select">
          <button
            className={`select-post ${selectedTab === "post" ? "active" : ""}`}
            onClick={() => {
              setSelectedTab("post");
              postData(1); // '작성글' 탭 클릭 시, 1페이지 데이터 로딩
            }}
          >
            작성글
          </button>
          <button
            className={`select-comment ${
              selectedTab === "comment" ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTab("comment");
              commentData(1); // '댓글단 글' 탭 클릭 시, 1페이지 데이터 로딩
            }}
          >
            댓글단 글
          </button>
        </div>

        <div className="info-header">
          <span className="info-title">글 제목</span>
          <span className="info-date">작성일자</span>
        </div>

        {userData.map((item:item) => {
          const date = item.createdAt.substring(0, 10); // 날짜 포맷
          return (
            <div className="line-change" key={item.id}>
              <span onClick={() => navig(`/post/${item.id}`)}>
                [{item.category}] {item.title}
              </span>
              <span className="post-date">{date}</span>
            </div>
          );
        })}
      </div>
      <UserInfoCompo />
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

export default UserPage;
