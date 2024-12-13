import { Link } from "react-router-dom";
import "../styles/maincomp.css"
import { useAuth } from "../hooks/auth";

const UserInfoCompo : React.FC = () => {
  const {user, logout, error, isLoading} = useAuth()
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  if(isLoading){
    return(
      <div className="user-info">
        로딩중...
      
    </div>
    )
  }
  if(!isLoading && error){
    return(
      <div className="user-info">
        <>
      <a href={`${baseUrl}/auth/google/login`}>
        <img src="./images/web_neutral_rd_ctn.svg" className='google-logo'/>
      </a>
          <Link to="/sign-in" className="logout-btn">
            회원가입
          </Link>
        </>
    </div>
    )
    
  }
  if(!isLoading && user){
    return (
      <div className="user-info">
          <>
            <div className="user-login">{user.name}</div>
          <button onClick={logout} className="logout-btn">
            로그아웃
          </button>
          </>
      
      </div>
    );
  }
  
};

export default UserInfoCompo;