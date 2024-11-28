import React,{useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'; 
import "../styles/maincomp.css";
import { CategoryCompo } from "../components/CategoryComp.tsx";
import UserInfoCompo from '../components/UserInfoComp.tsx';
/* import Pagination from "../components/Pagination"; */
import PostList from "../components/PostList.tsx";
import DownSearch from "../components/DownSearch.tsx";
import { useAuth } from "../hooks/auth";
import { useTypedSelector } from "../useTypedSelector.tsx";
    interface Posts {
      // 게시글을 띄우기 위해 필요한 posts의 속성값 타입 지정
      id: number;
      title: string;
      content: string;
      author: string;
      category: string;
      createdAt: string;
      updatedAt: string;
    }
    
    const MainPage: React.FC = () => {
      // 리액트의 함수 컴포넌트 (React.FC)
      const [posts, setPosts] = useState<Posts[]>([]); // axios의 데이터만 저장(Posts 인터페이스의 항목들만)
      const [currentPage, setCurrentPage] = useState<string>(""); // 현재 페이지
      const [nextPage, setNextPage] = useState<string>(""); // 다음 페이지
      const [prevPage, setPrevPage] = useState<string>(""); // 이전 페이지
      const [postPerPage, setPostPerPage] = useState<number>(10); // 페이지에 띄울 글 갯수
      const [totalPage, setTotalPage] = useState<number>(0); // 총 페이지
      const [h_announce, setHAnnounce] = useState<boolean>(true); // 공지 숨기기
      const [notion, setNotion] = useState<Posts[]>([]); // 공지내용 가져오기
      const nav = useNavigate()
      
      const category = useTypedSelector((state) => state.category); // 카테고리 (리듀서 사용해서 값 가져오기)
      const { user } = useAuth();
      const navigate = useNavigate();
      const fetchPosts = async (page: number) => {
        // 메인 페이지 글 가져오기
        const { data } = await axios.get(
          // axios로 페이지의 원하는 값을 쿼리로 구분해서 가져와서 구조분해할당으로 안에서 data의 값만 가져오기
          `http://localhost:8000/api/posts?category=${category}&limit=${postPerPage}&page=${page}
        `
        );
        // 가져온 값을 state에 설정

        setPosts(data.data);
        setCurrentPage(data.currentPage);
        setNextPage(data.nextPage);
        setPrevPage(data.prevPage);
        setTotalPage(data.totalPage);
      };
    
      const fetchNotions = async () => {
        // 공지사항 글 가져오기
        const { data } = await axios.get(
          `http://localhost:8000/api/posts?category=공지사항&limit=2
        `
        );
        setNotion(data.data);
      };
    
      useEffect(() => {

        fetchPosts(1);
        // 어떤 페이지를 가든 시작페이지는 1페이지가 되어야하기 때문에 1로 지정
      }, [category, postPerPage]);
    
      useEffect(() => {
        // 공지 글 로딩
        fetchNotions();
      }, []);
    
      // 페이지 변경 시 nextPage, prevPage값을 인자로 받는데, 해당 url에서 값을 가져와서
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
        // 페이지값 변경
        fetchPosts(pageNumber);
      };
      const moveLogin = () => {
        nav('/login')
    }

  return (
    <>
    <div className="container">
      <CategoryCompo />
      <div className="post-list">
        <div className="options-container">
          <div className="category-name">{category}</div>
          <div className="options-right">
            <form onClick={() => setHAnnounce(!h_announce)}>
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
        </div>
        <div className="post-header">
          <span className="post-title">글 제목</span>
          <span className="post-user">작성자</span>
          <span className="post-date">작성일자</span>
        </div>
        {notion.length > 0 && !h_announce && <PostList list={notion} />}
        {posts.length > 0 && <PostList list={posts} />}
        <div className="post-btn-container">
          <button className="post-btn" onClick={() => navigate("/post")}>
            글 작성
          </button>
        </div>
      </div>
      <UserInfoCompo user={user} />

      <DownSearch />

      <div className="down-banner">
        
        {/* <Pagination // 백엔드 페이지네이션 추가 시 사용 예정
          postPerPage={postPerPage}
          totalPage={totalPage}
          paginate={paginate}
          currentPage={currentPage}
          prevPage={prevPage}
          nextPage={nextPage}
          pageChange={pageChange}
        /> */}
        
      </div>
    </div>
  </>
  )
}


export default MainPage;
