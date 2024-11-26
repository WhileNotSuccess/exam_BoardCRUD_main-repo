import { useAuth } from '../hooks/auth'

const User = () => {
    const {user, isLoading, logout} = useAuth()
    console.log(user)
    console.log(isLoading)
  return (
    <div>
      <div>id:{user?.id}</div>
      <div>name:{user?.name}</div>
      <div>profile: <img src={`${user?.profilePicture}`} alt="profile" /></div>
      <div>googleId:{user?.googleId}</div>
      <div><button onClick={()=>{logout()}}>로그아웃</button></div>
    </div>
  )
}

export default User
