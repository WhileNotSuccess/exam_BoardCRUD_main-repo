import React, { FormEvent, useEffect, useState } from "react";
import { CommentData } from "../pages/Listin";
import { Axios } from "../lib/axios";
import B from "../../public/images/arrow_down.png";
import C from "../../public/images/arrow_up.png";
import NComment from "./NComment";

interface CommentProps {
  data: CommentData;
  urender: boolean;
  urRender: (render: boolean) => void;
  user: string | undefined;
  conid: number;
  sConid: (id: number) => void;
}
export interface NestedComment {
  id: number;
  content: string;
  author: string;
  comment_id: number;
}

const Comment: React.FC<CommentProps> = ({
  data,
  urender,
  urRender,
  user,
  conid,
  sConid,
}) => {
  const [datad, sDatad] = useState<NestedComment[]>(); // 대댓글 저장을 위한 state
  const [content, sContent] = useState<string>(""); // 댓글 수정을 위한 state
  const [render, sRender] = useState<boolean>(false); // 대댓글 변화시 렌더링을 위한 state
  const [cAppear, sCAppear] = useState<boolean>(false); // 대댓글 작성 창을 띄우기위한 state
  const [appear, nAppear] = useState<boolean>(false); // 댓글 수정 창을 띄우기위한 state
  const [hide, sHide] = useState<boolean>(false); // 대댓글을 안보이게 하는 state

  useEffect(() => {
    async function binary() {
      try {
        const raw_data = await Axios.get(
          `http://localhost:3012/nested-comments?comment-id=${data.id}`
        );
        sDatad(raw_data.data.data);
      } catch (error) {
        console.error(error);
      }
    }
    binary();
  }, [data, render]);
  const configer = (e: FormEvent) => {
    e.preventDefault();
    if (cAppear && appear === false) {
      if (cAppear) {
        nComment();
      } else if (appear) {
        remake();
      }
      sContent("");
      urRender(!urender);
    }
  };
  const deleter = async () => {
    await Axios.delete(`http://localhost:3012/comments/${data.id}`).catch(
      (e) => console.log(e)
    );
    urRender(!urender);
  };
  const remake = async () => {
    await Axios.put(`http://localhost:3012/comments/${data.id}`, {
      content: content,
    }).catch((e) => console.log(e));
    nAppear(false);
  };
  const nComment = async () => {
    await Axios.post(`http://localhost:3012/api/nested-comments`, {
      commentId: `${data.id}`,
      content: content,
    }).catch((e) => console.log(e));
    sCAppear(false);
  };

  return (
    <div className="comment">
      <div className="incomment">
        <div>{data.content}</div>
        <div>
          <div className="cAuthor">작성자:{data.author}</div>
          {/*대댓글 작성,댓글 수정,삭제 버튼, form */}
          <div className="button">
            {/*cAppear(대댓글작성),appear(댓글 수정) 어느쪽이 하나라도 true이고 conid와 댓글의 id가 일치할경우 form으로 전환*/}
            {cAppear || (appear && conid === data.id) ? (
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
                {/*click시 conid에 댓글 아이디 저장, cAppear false=>true*/}
                <button
                  onClick={() => {
                    sConid(data.id);
                    sCAppear(!cAppear);
                  }}
                >
                  대댓글 작성
                </button>
                {/*사용자와 댓글의 작성자가 같을 경우 구현, 클릭시 conid에 댓글 id 저장, appear false=>true */}
                {user === data.author ? (
                  <>
                    <button
                      onClick={() => {
                        sConid(data.id);
                        nAppear(!appear);
                      }}
                    >
                      수정
                    </button>
                    {/*deleter 호출 */}
                    <button onClick={deleter}>삭제</button>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      {/*대댓글의 갯수를 보여주는 객체, , 클릭시 hide false=>true*/}
      {datad?.length === undefined ? null : (
        <label htmlFor="hide" onClick={() => sHide(!hide)}>
          {hide ? <img src={C} alt="hide" /> : <img src={B} alt="show" />}
          {datad.length}개의 대댓글
        </label>
      )}
      {/*hide는 기본 false=> 아무것도 안함
    true로 변화시 대댓글을 mapping해서 NComment 컴포넌트호출
  */}
      {hide
        ? datad?.map((att) => {
            return (
              <NComment
                // props 전달 목록 key,대댓글, '대댓글 변화시 렌더링을 위한 state,setState',사용자 이름, '댓글,대댓글 수정시 다른 수정창을 닫기위한 state,setState'
                key={att.id} //key
                data={att} //대댓글
                render={render} //대댓글 변화시 렌더링을 위한 state,setState
                sRender={sRender}
                user={user} //사용자 이름
                conid={conid} //댓글 대댓글 수정시 다른 수정창을 닫기위한 state,setState
                sConid={sConid}
              />
            );
          })
        : null}
    </div>
  );
};

export default Comment;
