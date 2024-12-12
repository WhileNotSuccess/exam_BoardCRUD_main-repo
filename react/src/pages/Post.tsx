import React, { useState, useEffect, ChangeEvent } from "react";
import "../styles/PostComp.css";
import UserInfoCompo from "../components/UserInfoComp";
import { CategoryCompo } from "../components/CategoryComp";
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
      const data = new FormData(); // 왜 formdata로 보냈는지? : 파일은 바이너리 데이터라서 일반 json형식은 코드가 길어져 가독성이 떨어짐, 서버가 폼데이터로 보내라고 지정해놓음
      data.append("image", file);

      const res = await Axios.post(
        "http://localhost:3012/s3/image-upload",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return { default: res.data.url }; // ck에디터에 반환된 url을 전달, default는 ck에디터에서 기본적으로 사용하는 키 이름
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
      // FileRepository는 파일 업로드와 관련된 플러그인 
      // createUploadAdapter가 하는 역할?
      // 파일 업로드를 처리할 어댑터를 생성해주는 역할이지만 기본적으로는 loader를 받아서 사용
      loader: any
    ) => {
      return new MyUploadAdapter(loader); // 따로 정의한 MyUploadAdapter에 loader를 넘겨주고 사용할수 있도록 설정
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
      const res = await Axios.post(
        `http://localhost:3012/posts?category=${boardName}`,
        {
          title: title,
          content: content,
          category: boardName,
        },
        {
          headers: { "Content-Type": "application/json" },
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
          <>작성자 : {user ? user.name : "로딩 중..."}</>
        </div>
        <div className="content-write">
          <div className="ckeditor">
            <CKEditor
              editor={ClassicEditor} // 간단한 텍스트 편집기를 사용할때 사용하는 에디터
              data="" // 초기 데이터는 빈 문자열로 설정
              onReady={(editorInstance) => {
                // 에디터를 조작하거나 상호작용하기 위한 인스턴스, 이 코드에서는 이미지 업로드 플러그인을 가져오기 위해 사용
                // ck에디터가 준비 되었을 때 이미지 업로드 기능을 사용할수 있게
                adapter(editorInstance);
              }}
              onChange={(_, editorInstance) => {  // onchange를 쓰려면 두번째 인자에 줘야 하는데 기본적인 첫번째 인자를 event로 줘버리면 ts에서 에러
                // onChange의 첫번째 인자의 하는 역할?
                // 첫번째 인자가 하는 역할은 사용자가 클릭한 위치를 가져오거나, 클릭한 위치에 따라 정교한작업을 할때 사용한다. 이 코드에서는 단순히 글 내용만 변경하기에 사용하지 않음
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
        <UserInfoCompo />
      </div>
    </div>
  );
};

export default Post;
