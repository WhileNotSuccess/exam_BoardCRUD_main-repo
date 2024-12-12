import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import "../styles/maincomp.css";
import { CategoryCompo } from "../components/CategoryComp.tsx";
import UserInfoCompo from '../components/UserInfoComp.tsx';
import Pagination from "../components/Pagination"; 
import PostList from "../components/PostList.tsx";
import DownSearch from "../components/DownSearch.tsx";
import { useTypedSelector } from "../useTypedSelector.tsx";

interface Posts {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Posts[]>([]); 
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [nextPage, setNextPage] = useState<string>("");
  const [prevPage, setPrevPage] = useState<string>("");
  const [postPerPage, setPostPerPage] = useState<number>(() => {
    const saved = localStorage.getItem("postPerPage");
    return saved ? JSON.parse(saved) : 10;
  });
  const [totalPage, setTotalPage] = useState<number>(0);
  const [h_announce, setHAnnounce] = useState<boolean>(() => {
    const saved = localStorage.getItem("h_announce");
    return saved ? JSON.parse(saved) : true;
  });
  const [notion, setNotion] = useState<Posts[]>([]);

  const category = useTypedSelector((state) => state.category);
  const navigate = useNavigate();

  const fetchPosts = async (page: number) => {
    const { data } = await axios.get(
      `http://localhost:3012/posts?category=${category}&limit=${postPerPage}&page=${page}`
    );

    setPosts(data.data);
    setCurrentPage(data.currentPage);
    setNextPage(data.nextPage);
    setPrevPage(data.prevPage);
    setTotalPage(data.totalPage);
  };

  const fetchNotions = async () => {
    const { data } = await axios.get(
      `http://localhost:3012/posts?category=공지사항&limit=2`
    );
    setNotion(data.data);
  };

  useEffect(() => {
    fetchPosts(1);
  }, [category, postPerPage]);

  useEffect(() => {
    fetchNotions();
  }, []);

  useEffect(() => {
    localStorage.setItem("postPerPage", JSON.stringify(postPerPage));
  }, [postPerPage]);

  useEffect(() => {
    localStorage.setItem("h_announce", JSON.stringify(h_announce));
  }, [h_announce]);

  const pageChange = async (url: string) => {
    if (url) {
      const { data } = await axios.get(url);
      setPosts(data.data);
      setCurrentPage(data.currentPage);
      setNextPage(data.nextPage);
      setPrevPage(data.prevPage);
      setTotalPage(data.totalPage);
    }
  };

  const paginate = (pageNumber: number) => {
    fetchPosts(pageNumber);
  };

  return (
    <div className="container">
      <CategoryCompo />
      <div className="post-list">
        <div className="options-container">
          <div className="category-name">{category}</div>

          {category !== "조원소개" && (
            <div className="options-right">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="checkbox"
                  checked={h_announce}
                  onChange={() => setHAnnounce(!h_announce)}
                />
                공지숨기기
              </form>
              <select
                value={postPerPage}
                onChange={(e) => setPostPerPage(Number(e.target.value))}
                className="page-select"
              >
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
                <option value={30}>30개씩</option>
              </select>
            </div>
          )}
        </div>


        {category==="조원소개" ? <></> : 
        <div className="post-header">
          <span className="post-title">글 제목</span>
          <span className="post-user">작성자</span>
          <span className="post-date">작성일자</span>
        </div>
        }
        {notion.length > 0 && !h_announce && <PostList list={notion} />}
        {posts.length > 0 && <PostList list={posts} />}

        <div className="post-btn-container">
          <button className="post-btn" onClick={() => navigate("/post")}>
            {category === "조원소개" ? "조원 추가" : "글 작성" }
          </button>
        </div>
      </div>

      <UserInfoCompo />
      <DownSearch />
      <div className="down-banner">
        <Pagination
          postPerPage={postPerPage}
          totalPage={totalPage}
          paginate={paginate}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          pageChange={pageChange}
        />
      </div>
    </div>
  );
};

export default MainPage;
