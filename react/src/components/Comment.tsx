import React, { FormEvent, useEffect, useState } from "react";
import { CommentData } from "../pages/Listin";
import { Axios } from "../lib/axios";
import B from "../../public/images/arrow_down.png";
import C from "../../public/images/arrow_up.png";
import NComment from "./NComment";

interface CommentProps {
  data: CommentData;
  render: boolean;
  setRender: (render: boolean) => void;
  user: string | undefined;
  commentId: number;
  setCommentId: (id: number) => void;
}
export interface NestedComment {
  id: number;
  content: string;
  author: string;
  comment_id: number;
}

const Comment: React.FC<CommentProps> = ({
  data,
  render,
  setRender,
  user,
  commentId,
  setCommentId,
}) => {
  const [NestedComments, setNestedComments] = useState<NestedComment[]>(); // 대댓글 저장을 위한 state
  const [content, sContent] = useState<string>(""); // 댓글 수정을 위한 state
  const [nestedAppear, setNestedAppear] = useState<boolean>(false); // 대댓글 작성 창을 띄우기위한 state
  const [commentRemakeAppear, setCommentRemakeAppear] = useState<boolean>(false); // 댓글 수정 창을 띄우기위한 state
  const [NestedHide, setNestedHide] = useState<boolean>(false); // 대댓글을 안보이게 하는 state
  
  async function getNestedComment() {
    try {
      const receiveData = await Axios.get(
        `http://localhost:3012/nested-comments?comment-id=${data.id}`
      );
      setNestedComments(receiveData.data.data);  
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    getNestedComment();
  }, [data, render]);
  //form 태그의 작
  const configer = (e: FormEvent) => {
    e.preventDefault();
    if (nestedAppear) {
      nComment();
    } else if (commentRemakeAppear) {
      remake();
    }
    sContent("");
  };
  const deleter = async () => {
    await Axios.delete(`http://localhost:3012/comments/${data.id}`).catch(
      (e) => console.log(e)
    );
    setRender(!render);
  };
  const remake = async () => {
    await Axios.put(`http://localhost:3012/comments/${data.id}`, {
      content: content,
    }).catch((e) => console.log(e));
    setCommentRemakeAppear(false);
    setRender(!render)
  };
  const nComment = async () => {
    await Axios.post(`http://localhost:3012/nested-comments`, {
      commentId: `${data.id}`,
      content: content,
    }).catch((e) => console.log(e));
    setNestedAppear(false);
    setRender(!render)
  };
  
  return (
    <div className="comment">
      <div className="incomment">
        <div className="contentSpaceBetween">
        <div>{data.content}</div><div className="cAuthor">작성자:{data.author}</div>
        </div>
        <div>
          
          {/*대댓글 작성,댓글 수정,삭제 버튼, form */}
          <div className="button">
            {/*nestedAppear(대댓글작성),commentRemakeAppear(댓글 수정) 어느쪽이 하나라도 true이고 commentId와 댓글의 id가 일치할경우 form으로 전환*/}
            {nestedAppear || (commentRemakeAppear && commentId === data.id) ? (
              <form onSubmit={configer}>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => sContent(e.target.value)}
                />
                <button>작성</button>
              </form>
            ) : (
              <>
                {/*click시 commentId에 댓글 아이디 저장, nestedAppear false=>true*/}
                {user?(
                <button
                  onClick={() => {
                    setCommentId(data.id);
                    setNestedAppear(!nestedAppear);
                  }}
                >
                  대댓글 작성
                </button>
                {/*사용자와 댓글의 작성자가 같을 경우 구현, 클릭시 commentId에 댓글 id 저장, commentRemakeAppear false=>true */}
                {user === data.author ? (
                  <>
                    <button
                      onClick={() => {
                        setCommentId(data.id);
                        setCommentRemakeAppear(!commentRemakeAppear);
                      }}
                    >
                      수정
                    </button>
                    {/*deleter 호출 */}
                    <button onClick={deleter}>삭제</button>
                  </>
                ) : null}
                ):null}
              </>
            )}
          </div>
        </div>
      </div>
      {/*대댓글의 갯수를 보여주는 객체, , 클릭시 NestedHide false=>true*/}
      {NestedComments?.length? (
        <label htmlFor="NestedHide" onClick={() => setNestedHide(!NestedHide)}>
          {NestedHide ? <img src={C} alt="NestedHide" /> : <img src={B} alt="show" />}
          {NestedComments.length}개의 대댓글
        </label>
      ) : null}
      {/*hide는 기본 false=> 아무것도 안함
    true로 변화시 대댓글을 mapping해서 NComment 컴포넌트호출
  */}
      {NestedHide
        ? NestedComments?.map((data) => {
            return (
              <NComment
                // props 전달 목록 key,대댓글, '대댓글 변화시 렌더링을 위한 state,setState',사용자 이름, '댓글,대댓글 수정시 다른 수정창을 닫기위한 state,setState'
                key={data.id} //key
                data={data} //대댓글
                render={render} //대댓글 변화시 렌더링을 위한 state,setState
                setRender={setRender}
                user={user} //사용자 이름
                commentId={commentId} //댓글 대댓글 수정시 다른 수정창을 닫기위한 state,setState
                setCommentId={setCommentId}
              />
            );
          })
        : null}
    </div>
  );
};

export default Comment;
