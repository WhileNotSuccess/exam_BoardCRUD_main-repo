import React, { useEffect, useState } from "react";
import "../styles/maincomp.css";
import { useNavigate } from "react-router-dom";
import HTMLReactParser from "html-react-parser/lib/index";
import { useTypedSelector } from "../useTypedSelector";
import { Axios } from "../lib/axios";

interface List {  // 띄울 글의 인터페이스
  author: string;
  category: string;
  content: string;
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
}

interface PostListProps {   // 부모 컴포넌트에서 받은 띄울 글의 배열
  list: List[];
}

const PostList: React.FC<PostListProps> = ({ list }) => {
  const [user, setUser] = useState(""); // 작성자 이름 담을 변수
  const [display, setDisplay] = useState({ x: 0, y: 0 }); // 마우스 우클릭 한 위치를 담을 변수
  const [posts, setPosts] = useState<List[]>(list); // 게시글 목록 상태로 관리
  const navig = useNavigate();
  const category = useTypedSelector((state) => state.category); // 리듀스를 이용해서 카테고리를 변경경

  const rightClick = (e: React.MouseEvent<HTMLDivElement>, user: string) => {
    // 마우스 우클릭 함수
    e.preventDefault(); // 브라우저 기본 우클릭 막는 코드
    setDisplay({ x: e.clientX, y: e.clientY });
    setUser(user);
  };

  const goToPage = (user: string) => {
    // 정보보기 창 닫기 함수
    navig(`/user-page`, { state: user });
    setUser("");
  };

  const closeMenu = () => {
    // 정보보기 창 닫기 함수
    setUser("");
  };

  const memberUpdate = (id: number) => {
    navig(`/post-update/${id}`);
  };

  const memberDelete = async (id: number) => {
    try {
      // 서버에서 게시글 삭제 요청
      await Axios.delete(`http://localhost:3012/posts/${id}`);
      // 삭제된 후 게시글 목록에서 해당 항목 제거
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("게시글 삭제 실패", error);
    }
  };

  useEffect(() => { setPosts(list);
   }, [list]); // 카테고리가 변경되면 내용도 변경되서 Effect로 실시간 변경
  
  return (
    <>
      {posts.map((item: List) => {
        const date = item.createdAt.substring(0, 10);
        const user = item.author;
        return (category === "조원소개" ? (        // 조원소개 페이지일땐 다른 디자인으로 div 띄우기
          <div className="memberBox" key={item.id}>
            <div className="member">
              <div className="memberTitle">{item.title}</div>
              <div className="memberContent">{HTMLReactParser(item.content)}</div>
              <button className="updateBtn" onClick={() => memberUpdate(item.id)}>
                수정
              </button>
              <button className="deleteBtn" onClick={() => memberDelete(item.id)}>
                삭제
              </button>
            </div>
          </div>
        ) : (   // 조원소개 이외에는 게시글 형태로 클릭 시 listin 이동
          <div className="line-change" key={item.id} onClick={closeMenu}>   
              <div className="title-value" onClick={() => navig(`/post/${item.id}`)}>
                [{item.category}] {item.title}
              </div>
            
            <div
              className="user-value"
              onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => rightClick(e, item.author)} // onContextMenu : 우클릭하게 해주는 함수
              style={{ display: "inline-block" }}
            >
              {user}
              </div>
            <div className="post-date">{date}</div>
          </div>
        )
        );
      })}
      {user && (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: `${display.y}px`,
            left: `${display.x}px`,
          }}
        >
          <button onClick={closeMenu}>x</button>
          <div className="menu-item" onClick={() => goToPage(user)}>
            정보보기
          </div>
        </div>
      )}
    </>
  );
};

export default PostList;
