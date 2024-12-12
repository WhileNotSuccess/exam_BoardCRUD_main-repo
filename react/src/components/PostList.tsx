import React, { useState } from "react";
import "../styles/maincomp.css";
import { useNavigate } from "react-router-dom";
import HTMLReactParser from "html-react-parser/lib/index";
import { useTypedSelector } from "../useTypedSelector";
import { Axios } from "../lib/axios";

interface List {
  author: string;
  category: string;
  content: string;
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
}

interface PostListProps {
  list: List[];
}

const PostList: React.FC<PostListProps> = ({ list }) => {
  const [user, setUser] = useState(""); // 작성자 이름 담을 변수
  const [display, setDisplay] = useState({ x: 0, y: 0 }); // 마우스 우클릭 한 위치를 담을 변수
  const [posts, setPosts] = useState<List[]>(list); // 게시글 목록 상태로 관리
  const navig = useNavigate();
  const category = useTypedSelector((state) => state.category);

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

  return (
    <>
      {posts.map((item: List) => {
        const date = item.createdAt.substring(0, 10);
        const user = item.author;
        return category === "조원소개" ? (
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
        ) : (
          <div className="line-change" key={item.id} onClick={closeMenu}>
            {category === "자유게시판" ? (
              <span onClick={() => navig(`/post/${item.id}`)}>
                [{item.category}] {item.title}
              </span>
            ) : (
              HTMLReactParser(item.content)
            )}
            <span
              className="user-value"
              onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => rightClick(e, item.author)}
              style={{ display: "inline-block" }}
            >
              {user}
            </span>
            <span className="post-date">{date}</span>
          </div>
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
