import React, { useState, useEffect, ChangeEvent } from "react";
import "../css/PostComp.css";
import { UserInfoCompo } from "../components/MainComp";
import { CategoryCompo } from "../components/CategoryCompo";
import {Axios} from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAuth } from "../hooks/auth";

// CKEditor에서 사용할 이미지 업로드 어댑터 클래스
class MyUploadAdapter {
  loader: any; // 파일 업로드를 처리하는 객체, ck에디터의 loader객체가 어떤타입인지 몰라서 any로 정의

  constructor(loader: any) {
    this.loader = loader; // 클래스의 다른 메서드에서 사용가능하도록 정의
  }

  async upload(): Promise<{ default: string }> {
    // default는 url이고 url은 문자열로 사용되기 때문에 string으로 지정
    try {
      const file = await this.loader.file; // 사용자가 선택한 파일에 접근
      const data = new FormData();
      data.append("image", file);

      const res = await Axios.post(
        "http://localhost:8000/api/image-upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return { default: res.data }; // ck에디터에 반환된 url을 전달, default는 ck에디터에서 기본적으로 사용하는 키 이름
    } catch (error) {
      throw error;
    }
  }
}

// 게시글 작성 컴포넌트
const Post: React.FC = () => {
  // react.fc는 post가 함수형 컴포넌트임을 타입스크립트가 인지할수 있도록
  const [boardName, setBoardName] = useState<string>("자유게시판"); // 카테고리 이름
  const [title, setTitle] = useState<string>(""); // 사용자가 작성한 제목
  const [content, setContent] = useState<string>(""); // 사용자가 작성한 내용

  const navigate = useNavigate(); // 페이지 이동이 필요할 때 사용
  const { user, isLoading } = useAuth(); // 로그인한 유저의 정보 및 기다림을 위함

  useEffect(() => {
    // post페이지에 처음 왔을때 사용자가 로그인 하지 않으면 메인페이지로 이동시키는 함수
    if (!isLoading && !user) {
      alert("로그인 후 이용해주세요");
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const adapter = (editorInstance: any) => {
    // 타입스크립트가 ck에디터의 editorInstance 타입을 정확하게 알지 못하기 때문, 타입이 정확하지 않으면 any를 사용
    editorInstance.plugins.get("FileRepository").createUploadAdapter = (
      // ck에디터에 파일을 업로드 하고 url을 ck에디터에 삽입하는 역할
      loader: any
    ) => {
      return new MyUploadAdapter(loader); // 따로 정의한 MyUploadAdapter를 사용하도록 설정
    };
  };

  const GoToMain = () => {
    // 글을 작성하다 취소버튼을 누르면 바로 메인 페이지로 이동하는 함수
    navigate("/");
  };

  const titlechange = (e: ChangeEvent<HTMLInputElement>) => {
    // 값이 바뀌는 이벤트, <>안에는 변경 이벤트가 실행된 위치 div면 HTMLDivElement
    setTitle(e.target.value);
  };

  const onclick = async (boardName: string) => {
    // 게시판이름을 기준으로 글을 업로드 하는 함수
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", boardName);

      const res = await Axios.post(
        `http://localhost:8000/api/posts?category=${boardName}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("성공했습니다", res.data);
      navigate("/");
    } catch (error) {
      // 사용자가 제목이나 내용을 입력하지 않았을시 실행되는 에러 구문
      if (title === "") alert("제목을 입력해주세요");
      if (content === "") alert("내용을 입력해주세요");
      console.error("실패했습니다", error);
    }
  };

  return (
    <div className="post-board">
      <CategoryCompo />
      <div className="test">
        <div className="title-board">
          <select
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="board-select"
          >
            <option value="자유게시판">자유게시판</option>
            <option value="공지사항">공지사항</option>
            <option value="축제게시판">축제게시판</option>
            <option value="조원소개">조원소개</option>
          </select>
          <input placeholder="제목" onChange={titlechange} />
        </div>
        <div className="user-name">
          <>작성자 : {user ? user.nick_name : "로딩 중..."}</>
        </div>
        <div className="content-write">
          <div className="ckeditor">
            <CKEditor
              editor={ClassicEditor} // 간단한 텍스트 편집기를 사용할때 사용하는 에디터
              data="" // 초기 데이터는 빈 문자열로 설정
              onReady={(editorInstance) => {
                // ck에디터가 준비 되었을 때 이미지 업로드 기능을 사용할수 있게
                adapter(editorInstance);
              }}
              onChange={(_, editorInstance) => {  // onchange를 쓰려면 두번째 인자에 줘야 하는데 기본적인 첫번째 인자를 event로 줘버리면 ts에서 에러
                // onchange만 쓸거면 두번째 인자를 써야함 ( 데이터 가져오기, 수정하기 )
                setContent(editorInstance.getData()); // 사용자가 입력한 html형식의 내용을 content변수에 저장
              }}
            />
          </div>
        </div>
        <div className="btns-box">
          <div className="upload-btn" onClick={() => onclick(boardName)}>
            <>업로드</>
          </div>
          <div className="upload-btn" onClick={GoToMain}>
            취소
          </div>
        </div>
      </div>
      <div>
        <UserInfoCompo user={user} />
      </div>
    </div>
  );
};

export default Post;
