import React, { useState } from "react";
import "../css/MainComp.css";
import { useNavigate } from "react-router-dom";

// 각 게시글의 데이터를 나타내는 인터페이스 정의
interface Post {
  id: number; // 게시글 ID
  createdAt: string; // 작성 날짜 (ISO 형식)
  author: string; // 작성자 이름
  category: string; // 게시글 카테고리
  title: string; // 게시글 제목
}

// PostList 컴포넌트가 받을 props의 타입 정의
interface PostListProps {
  list: Post[]; // 게시글 목록 배열
}

// PostList 컴포넌트 정의
const PostList: React.FC<PostListProps> = ({ list }) => {
  // 작성자 이름을 저장하는 상태 (초기값: null)
  const [user, setUser] = useState<string | null>(null);

  // 마우스 우클릭 위치를 저장하는 상태 (초기값: {x: 0, y: 0})
  const [display, setDisplay] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 페이지 이동을 위한 네비게이터 함수
  const navig = useNavigate();

  // 마우스 우클릭 이벤트 처리 함수
  const rightClick = (e: React.MouseEvent<HTMLDivElement>, user: string) => {
    e.preventDefault(); // 기본 우클릭 메뉴 표시 방지
    setDisplay({ x: e.clientX, y: e.clientY }); // 클릭한 위치 저장
    setUser(user); // 클릭한 작성자의 이름 저장
  };

  // 정보보기 창을 닫는 함수
  const closeMenu = () => {
    setUser(null); // 작성자 이름 초기화
  };

  return (
    <>
      {list.map((item) => {
        const date = item.createdAt.substring(0, 10); // 작성 날짜의 연월일만 추출
        const user = item.author; // 작성자 이름 가져오기

        return (
          <div className="line-change" key={item.id} onClick={closeMenu}>
            <div
              className="title-value"
              onClick={() => navig(`/list-in/${item.id}`)} // 제목 클릭 시 상세 페이지로 이동
            >
              [{item.category}] {item.title}
            </div>

            <div
              className="user-value"
              onContextMenu={(e) => rightClick(e, item.author)} // 우클릭 이벤트 처리
              style={{ display: "inline-block" }}
            >
              {user}
            </div>

            <div className="post-date">{date}</div>
          </div>
        );
      })}

      {user && (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: `${display.y}px`, // 우클릭한 Y 좌표
            left: `${display.x}px`, // 우클릭한 X 좌표
          }}
        >
          <button onClick={closeMenu}>x</button>

          <div className="menu-item" onClick={closeMenu}>
            정보보기
          </div>
        </div>
      )}
    </>
  );
};

export default PostList;
