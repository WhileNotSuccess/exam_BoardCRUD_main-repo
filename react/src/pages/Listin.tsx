import { useEffect, useState, FormEvent } from "react";
import { Axios } from "../lib/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ListInComp.css";
import '../styles/maincomp.css'
import HTMLReactParser from "html-react-parser/lib/index";
import Comment from "../components/Comment.tsx";
import { CategoryCompo } from "../components/CategoryComp.tsx";
import { useAuth } from "../hooks/auth.ts";

//게시글, 댓글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  updatedAt: string;
}

export interface CommentData {
  id: number;
  content: string;
  author: string;
  post_id: number;
}

const ListIn = () => {
  const [post, setPost] = useState<Post>(); // 게시글 data
  const [content, setContent] = useState<string>(""); // 댓글 작성시 input창의 state
  const [render, setRender] = useState<boolean>(false); // 렌더링 state
  const [comment, setComment] = useState<CommentData[]>([]); // 게시글에 달린 댓글
  // const [listcon, sListcon] = useState<string>(""); // html 파서를 위한 게시글 내용(html parser에서 post.content를 쓰면 오류-first argument must be string)
  const [commentId, setCommentId] = useState<number>(0); // 댓글 아이디
  const [loading, setLoading] = useState<boolean>(true); // 로딩중임을 나타내는 state --시작시 true로 loading 중, useEffect안에서 false로 변경하면 state 변경으로 렌더링
  const [error, setError] = useState<string>(""); // 에러임을 나타내는 state --시작시 공백(false)로 useEffect안에서 axios로 받아오는 중 error시 에러안에 글자열 저장(true)로 error표시
  const { id } = useParams<{ id: string }>(); // 게시글 id
  const navi = useNavigate();
  const {user}=useAuth()

  useEffect(() => {
    async function getPostAndComment() {
      try {
        const post = await Axios.get(`http://localhost:3012/posts/${id}`);
        const comment = await Axios.get(
          `http://localhost:3012/comments?post-id=${id}`
        );
        setPost(post.data.data);
        setComment(comment.data.data);
        setLoading(false);
      } catch (err) {
        setError("error");
        setLoading(false);
        console.error(err);
      }
    }
    getPostAndComment();
  }, [render, id]);

  const confirm = (e: FormEvent) => {
    e.preventDefault();
    if (content !== "") {
      //댓글 내용이 공백이 아닐경우 post실행, content 초기화
      commentOn();
      setContent("");
    }
  };
  //댓글 작성 함수
  const commentOn = async () => {
    await Axios.post(`http://localhost:3012/comments`, {
      postId: `${id}`,
      content: content,
    },
    {
      headers:{'Content-type':'application/json'}
    }).catch((e: any) =>{
       if(e.response.status==401){
        alert('로그인 후 이용해 주세요')
      }})
    setRender(!render);
  };
  //post-update페이지로 navigate
  const updater = () => {
    navi(`/post-update/${id}`);
  };
  // 게시글 삭제후 메인 페이지 navigate
  const deleter = async () => {
    await Axios.delete(`http://localhost:3012/posts/${id}`)
    .catch((e: unknown) =>console.log(e)
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
            {post?.content? <div>{HTMLReactParser(post?.content)}</div>:<></>}
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
                onChange={(e) => setContent(e.target.value)}
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
              render={render} //렌더링을 위한 state
              setRender={setRender} //렌더링을 위한 setState
              user={user?.name} //사용자의 닉네임
              commentId={commentId} //댓글 수정시 다른 수정창을 닫기 위한 state,setState
              setCommentId={setCommentId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ListIn;
