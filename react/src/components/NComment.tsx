import React, { useState } from "react";
import { Axios } from "../lib/axios";
import A from "../../public/images/enter2.png";
import { NestedComment } from "./Comment";

interface NestedProps {
  data: NestedComment;
  render: boolean;
  sRender: (render: boolean) => void;
  user: string | undefined;
  conid: number;
  sConid: (id: number) => void;
}
const NComment: React.FC<NestedProps> = ({
  data,
  render,
  sRender,
  user,
  conid,
  sConid,
}) => {
  const nestComment: NestedComment = data; //nestedComment 저장
  const [appear, nAppear] = useState<boolean>(false); //대댓글 수정창을 띄우기위한 state
  const [content, sContent] = useState<string>(""); //대댓글 수정내용을 저장하는 state

  const deleter = async () => {
    await Axios.delete(
      `http://localhost:3012/nested-comments/${nestComment?.id}`
    ).catch((e) => console.log(e));
    sRender(!render);
  };
  const remake = async () => {
    await Axios.put(
      `http://localhost:3012/nested-comments/${nestComment?.id}`,
      {
        content: content,
      }
    ).catch((e) => console.log(e));

    sContent("");
    nAppear(!appear);
    sRender(!render);
    sConid(0);
  };

  return (
    <>
      <div className="ncomment">
        <div className="incomment">
          <div>
            <img src={A} alt={""} />
            {nestComment?.content}
          </div>
          {nestComment?.author === user ? (
            <div className="nbutton">
              {appear && conid === -1 * nestComment.id ? (
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
                      nAppear(!appear);
                      sConid(nestComment?.id);
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
