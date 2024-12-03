import { Link } from "react-router-dom";
import "../styles/maincomp.css"
import { useAuth } from "../hooks/auth";

// interface user {
//   id:number;
//   nick_name:string;
//   email:string;
//   email_verified_at:any;
//   created_at:string;
//   updated_at:string;
// }

// interface userProps {
//   user:user;
// }



const UserInfoCompo : React.FC = () => {
  const {user} = useAuth()
  
  return (
    <div className="user-info">
      {user ? (
        <>
          <div className="user-login">{user.name}</div>
          <Link to="/login" className="logout-btn">
            로그아웃
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="user-login">
            로그인
          </Link>
          <Link to="/sign-in" className="logout-btn">
            회원가입
          </Link>
        </>
      )}
    </div>
  );
};

export default UserInfoCompo;