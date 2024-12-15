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
import { useDispatch } from 'react-redux';


interface Posts {   // 불러온 게시글의 인터페이스스
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<Posts[]>([]);  // 게시글 배열
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지
  const [nextPage, setNextPage] = useState<string>(""); // 다음 페이지
  const [prevPage, setPrevPage] = useState<string>(""); // 이전 페이지
  const [postPerPage, setPostPerPage] = useState<number>(() => {  // 게시글 갯수 (로컬 스토리지에 저장)
    const saved = localStorage.getItem("postPerPage");
    return saved ? JSON.parse(saved) : 10;      //
  });
  const [totalPage, setTotalPage] = useState<number>(0);
  const [h_announce, setHAnnounce] = useState<boolean>(() => {    // 공지 숨기기 (onoff 여부 로컬 스토리지 저장장)
    const saved = localStorage.getItem("h_announce");
    return saved ? JSON.parse(saved) : true;
  });
  const [notion, setNotion] = useState<Posts[]>([]);    // 공지사항 리스트 (가장 최신 글 2개만 가져옴)
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

  const fetchNotions = async () => {    // 공지사항 글 가져오기기
    const { data } = await axios.get(
      `http://localhost:3012/posts?category=공지사항&limit=2`
    );
    setNotion(data.data);
  };

  useEffect(() => {       // 게시판이 바뀌거나 조정하려는 글 갯수 변경 시 다시 렌더링링
    fetchPosts(1);
  }, [category, postPerPage]);

  useEffect(() => {       // 렌더링 시 공지 사항 불러오는 함수 호출출
    fetchNotions();
  }, []);

  useEffect(() => {
    
    localStorage.setItem("postPerPage", JSON.stringify(postPerPage)) // 로컬 스토리지 값 변경
    
  }, [postPerPage]);  

  const pageChange = async (url: string) => { // 좌우 페이지 이동 버튼 클릭 시 게시글 이동동
    if (url) {
      const { data } = await axios.get(url);
      setPosts(data.data);
      setCurrentPage(data.currentPage);
      setNextPage(data.nextPage);
      setPrevPage(data.prevPage);
      setTotalPage(data.totalPage);
    }
  };

  const paginate = (pageNumber: number) => {    // 페이지 번호를 인자값으로 받아 페이지 렌더링
    fetchPosts(pageNumber);   
  };

  return (
    <div className='out-container'>
    <div className="container">
      <CategoryCompo />
      <div className="post-list">
        <div className="options-container">
          <div className="category-name">{category}</div>

          {category !== "조원소개" && ( // 조원 소개 페이지에선 공지 숨기기, 게시글 설정 옵션을 띄우지 않음
            <div className="options-right">
              {category === "공지사항" || category === "현지학기제" ? <></> :
              <form onSubmit={(e) => e.preventDefault()}> 
                <input
                  type="checkbox"
                  checked={h_announce}
                  onChange={() => setHAnnounce(!h_announce)}
                />
                공지숨기기
              </form>
                }   
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


        {category==="조원소개" ? <></> : // 조원소개 페이지에선 제목, 작성자, 일자 문구를 띄우지 않음
        <div className="post-header">
          <span className="post-title">글 제목</span>
          <span className="post-user">작성자</span>
          <span className="post-date">작성일자</span>
        </div>
        }
        {notion.length > 0 && !h_announce && category==='자유게시판' && <PostList list={notion} />}
        {posts.length > 0 && <PostList list={posts} />}

        <div className="post-btn-container">
          <button className="post-btn" onClick={() => navigate("/post")}>
            {category === "조원소개" ? "조원 추가" : "글 작성" }
          </button>
        </div>
      </div>

      <UserInfoCompo />
      <DownSearch />
    </div>
    <div className="down-banner"> 
        <Pagination 
          
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

