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
  const {user, logout} = useAuth()
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  return (
    <div className="user-info">
      {user ? (
        <>
          <div className="user-login">{user.name}</div>
        <button onClick={logout} className="logout-btn">
          로그아웃
        </button>
        </>
      ) : (
        <>
      <a href={`${baseUrl}/auth/google/login`}>
        <img src="./images/web_neutral_rd_ctn.svg" className='google-logo'/>
      </a>
          <Link to="/sign-in" className="logout-btn">
            회원가입
          </Link>
        </>
      )}
    </div>
  );
};

export default UserInfoCompo;