import React, { FormEvent, useState } from "react";
import { Axios } from "../lib/axios";
import A from "../../public/images/enter2.png";
import { NestedComment } from "./Comment";

interface NestedProps {
  data: NestedComment;
  render: boolean;
  setRender: (render: boolean) => void;
  user: string | undefined;
  commentId: number;
  setCommentId: (id: number) => void;
}
const NComment: React.FC<NestedProps> = ({
  data,
  render,
  setRender,
  user,
  commentId,
  setCommentId,
}) => {
  const nestComment: NestedComment = data; //nestedComment 저장
  const [nestedAppear, setNestedAppear] = useState<boolean>(false); //대댓글 수정창을 띄우기위한 state
  const [content, sContent] = useState<string>(""); //대댓글 수정내용을 저장하는 state

  const deleter = async () => {
    await Axios.delete(
      `http://localhost:3012/nested-comments/${nestComment?.id}`
    ).catch((e) => console.log(e));
    setRender(!render);
  };
  const remake = async (e:FormEvent) => {
    e.preventDefault();
    await Axios.patch(
      `http://localhost:3012/nested-comments/${nestComment?.id}`,
      {
        content: content,
      }
    ).catch((e) => console.log(e));
    sContent("");
    setNestedAppear(false);
    setRender(!render);
    setCommentId(0);
  };

  return (
    <>
      <div className="ncomment">
        <div className="incomment">
          <div className="nestedComment">
            <div className="nestedCommentContent">
              <img src={A} alt={""} />
              {nestComment?.content}
            </div>
            <div className="nestedCommentAuthor">작성자:{nestComment?.author}</div>
          </div>
          {nestComment?.author === user ? (
            <div className="nbutton">
              {nestedAppear && commentId === -1 * nestComment.id ? (
                <>
                  <form onSubmit={remake}>
                    <input
                      type="textbox"
                      value={content}
                      onChange={(e) => sContent(e.target.value)}
                    />
                    <button>완료</button>
                  </form>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setNestedAppear(true);
                      setCommentId(-1*(nestComment.id));
                    }}
                  >
                    수정
                  </button>
                  <button onClick={deleter}>삭제</button>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default NComment;
