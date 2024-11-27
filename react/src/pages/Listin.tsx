import axios from "axios";
import { Axios } from "../lib/axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface poster{
    id:string;
    content:string;
    author:string;
    created_at:string;
}
type nameline={
    id:number;
    name:string;
}
let name:nameline={
    id:1,name:'hello'
}

const Listin = () => {
    const [post, sPost] = useState({}); // 게시글 정보
    const [content, sContent] = useState(""); //댓글 작성시 input 창에 적용시킬 state
    const [urender, urRender] = useState(false); //렌더링 state
    const [comment, sComment] = useState([]); // 게시글에 달린 댓글
    const [listcon, sListcon] = useState(""); // html 파서를 위한 게시글 내용(html parser에서 post.content를 쓰면 오류-first argument must be string)
    const [conid, sConid] = useState(0); // 댓글, 대댓글 수정시 다른 창을 닫기 위한 변수
    const id = useParams().id; // 게시글 id
    const navi = useNavigate();
    useEffect(()=>{
        async function postSetting(){
            // 게시글 id로 게시글 정보 받아오기
            await Axios.get(`api/posts/${id}`).then(data=>sPost(data.data))
            // 게시글 id로 댓글 정보 받아오기
            await Axios.get(`api/comments/${id}`).then(data=>sComment(data.data))
        }
        postSetting();
    },[])


  return (
    <></>
  )
}

export default Listin