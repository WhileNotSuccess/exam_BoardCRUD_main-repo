import { useEffect, useState, FormEvent } from "react";
import { Axios } from "../lib/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ListInComp.css";
import HTMLReactParser from "html-react-parser/lib/index";
import Comment from "../components/Comment.tsx";
import { CategoryCompo } from "../components/CategoryComp.tsx";

//게시글, 댓글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  updated_at: string;
}
interface User {
  id: number;
  name: string;
  profilePicture: string;
  googleId: number;
}
export interface CommentData {
  id: number;
  content: string;
  author: string;
  post_id: number;
}

const ListIn = () => {
  const [post, sPost] = useState<Post>(); // 게시글 data
  const [content, sContent] = useState<string>(""); // 댓글 작성시 input창의 state
  const [urender, urRender] = useState<boolean>(false); // 렌더링 state
  const [comment, sComment] = useState<CommentData[]>([]); // 게시글에 달린 댓글
  const [listcon, sListcon] = useState<string>(""); // html 파서를 위한 게시글 내용(html parser에서 post.content를 쓰면 오류-first argument must be string)
  const [conid, sConid] = useState<number>(0); // 댓글 아이디
  const [loading, setLoading] = useState<boolean>(true); // 로딩중임을 나타내는 state --시작시 true로 loading 중, useEffect안에서 false로 변경하면 state 변경으로 렌더링
  const [error, setError] = useState<string>(""); // 에러임을 나타내는 state --시작시 공백(false)로 useEffect안에서 axios로 받아오는 중 error시 에러안에 글자열 저장(true)로 error표시
  const [user, setUser] = useState<User>(); //유저 장보 저장
  const { id } = useParams<{ id: string }>(); // 게시글 id
  const navi = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const post = await Axios.get(`http://localhost:3012/posts/${id}`);
        const comment = await Axios.get(
          `http://localhost:3012/comments?post-id=${id}`
        );
        sPost(post.data.data);
        sListcon(post.data.data.content);
        sComment(comment.data.data);

        setLoading(false);
      } catch (err) {
        setError("error");
        setLoading(false);
        console.error(err);
      }
    }
    async function getUser() {
      // const user = await Axios.get("/user/info");
      const user={data:{id:1,name:'string',profilePicture:"",googleId:3}}
      setUser(user.data);
    }
    fetchData();
    getUser();
    console.log(post)
  }, [urender, id]);

  const confirm = (e: FormEvent) => {
    e.preventDefault();
    if (content !== "") {
      //댓글 내용이 공백이 아닐경우 post실행, content 초기화
      commentOn();
      sContent("");
    }
    urRender(!urender); //렌더링 state
  };
  //댓글 작성 함수
  const commentOn = async () => {
    await Axios.post(`http://localhost:3012/comments`, {
      postId: `${id}`,
      content: content,
    }).catch((e: unknown) => console.log(e));
  };
  //post-update페이지로 navigate
  const updater = () => {
    navi(`/post-update/${id}`);
  };
  // 게시글 삭제후 메인 페이지 navigate
  const deleter = async () => {
    await Axios.delete(`http://localhost:3012/post/${id}`).catch((e: unknown) =>
      console.log(e)
    );
    navi("/");
  };
  // 로딩중일때 로딩중 표시, error가 났을때 error표시
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="maindiv">
        <CategoryCompo />
        <div className="listmain">
          <div className="title-board">
            <h3>
              [{post?.category}]{post?.title}
            </h3>
          </div>
          <div className="author">작성자:{post?.author}</div>
          {user?.name === post?.author ? (
            <div className="listButton">
              <button onClick={updater}>글 수정</button>
              <button onClick={deleter}>글 삭제</button>
            </div>
          ) : null}
          <div id="line">
            <h3>내용</h3>
            <div>{HTMLReactParser(listcon)}</div>
          </div>
          {/*댓글 달기 위한 form element*/}
          <div id="form">
            <div className="input-group-prepend">
              <span className="input-gruop-text">댓글 작성 창</span>
            </div>
            <form onSubmit={confirm}>
              <input
                type="text"
                value={content}
                onChange={(e) => sContent(e.target.value)}
              />
              <button>작성</button>
            </form>
          </div>

          <div className="announceComment">댓글</div>
          {comment.map((data) => (
            //props 전달 목록 : key, 댓글, '렌더링을 위한 state,setState', 사용자의 닉네임, '댓글,대댓글 수정시 다른 수정창을 닫기위한 state,setState'
            <Comment
              key={data.id} //key
              data={data} //댓글
              urender={urender} //렌더링을 위한 state
              urRender={urRender} //렌더링을 위한 setState
              user={user?.name} //사용자의 닉네임
              conid={conid} //댓글 수정시 다른 수정창을 닫기 위한 state,setState
              sConid={sConid}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ListIn;
