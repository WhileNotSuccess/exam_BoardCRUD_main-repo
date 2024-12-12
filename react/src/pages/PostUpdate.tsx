import React, {
  ChangeEvent,

  useEffect,
  useState,
} from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../styles/PostComp.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/auth";
import {Axios} from "../lib/axios";
import UserInfoCompo from '../components/UserInfoComp'
import { useNavigate } from "react-router-dom";
import {CategoryCompo} from "../components/CategoryComp";

// CKEditor에서 이미지 업로드를 처리하는 커스텀 업로드 어댑터
class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }

  // 이미지 업로드 함수
  async upload(): Promise<{ default: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const file = await this.loader.file;
        const data = new FormData(); // FormData 객체 생성
        data.append("image", file); // FormData에 이미지 파일 추가

        // 서버에 이미지 파일 전송
        const res = await Axios.post(
          "http://localhost:3012/s3/image-upload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const imgUrl = res.data.url; // 서버에서 반환된 이미지 URL 저장
        resolve({
          default: imgUrl, // 에디터에서 사용할 기본 이미지 URL 반환
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

const PostUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // URL에서 게시글 ID를 가져옴
  const [upTitle, setUpTitle] = useState<string>(""); // 제목 상태 변수
  const [upContent, setUpContent] = useState<string>(""); // 내용 상태 변수
  const [boardName, setBoardName] = useState<string>("자유게시판"); // 게시판 이름 상태 변수

  const { user } = useAuth(); // 사용자 인증 정보 및 로딩 상태 변수
  const navigate = useNavigate();

  const adapter = (editorInstance: any) => {
    editorInstance.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return new MyUploadAdapter(loader);
    };
  };

  useEffect(() => {
    // 작성자가 글을 수정할때 해당글의 정보를 받아오는 함수
    const fetchPost = async () => {
      try {
        const res = await Axios.get(`http://localhost:3012/posts/${id}`);
        setUpTitle(res.data.data.title);
        setUpContent(res.data.data.content);
      } catch (error) {
        console.error("게시글을 불러오지 못했습니다.", error);
      }
    };

    fetchPost();
  }, [id]);

  const titlechange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpTitle(e.target.value);
  };

  const GoToMain = () => {
    navigate("/");
  };

  const onclick = async (id: string | undefined) => {
    // 유저가 로그인하면 string 비로그인이면 undefined이기 때문
    // 게시글 수정 요청 함수
    try {
      const res = await Axios.put(`http://localhost:3012/posts/${id}`, {
        title: upTitle,
        content: upContent,
        category: boardName,
      });

      console.log("수정 성공", res.data);
      navigate("/");
    } catch (error) {
      if (upTitle === "") {
        alert("제목을 입력해주세요");
      }
      if (upContent === "") {
        alert("내용을 입력해주세요");
      }
      console.error("수정 실패", error);
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
            <option value={"자유게시판"}>자유게시판</option>
            <option value={"공지사항"}>공지사항</option>
            <option value={"축제게시판"}>축제게시판</option>
            <option value={"조원소개"}>조원소개</option>
          </select>
          <input placeholder="제목" onChange={titlechange} value={upTitle} />
        </div>
        <div className="user-name">
          <>작성자 : {user ? user.nick_name : "로딩 중..."}</>
        </div>
        <div className="content-write">
          <div className="ckeditor">
            <CKEditor
              editor={ClassicEditor}
              data={upContent} // 초기 데이터로 수정된 내용 설정
              onReady={(editorInstance) => {
                adapter(editorInstance);
              }}
              onChange={(_, editorInstance) => {   
                setUpContent(editorInstance.getData());
              }}
            />
          </div>
        </div>
        <div className="btns-box">
          <div className="upload-btn" onClick={() => onclick(id)}>
            <>수정</>
          </div>
          <div className="upload-btn" onClick={GoToMain}>
            취소
          </div>
        </div>
      </div>

      <div>
        {/* <UserInfoCompo user={user} /> */}
      </div>
    </div>
  );
};

export default PostUpdate;
