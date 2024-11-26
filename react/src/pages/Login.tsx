import React, { useEffect } from 'react'
import { useAuth } from '../hooks/auth'

const Login = () => {
  const {user, isLoading} = useAuth()

  useEffect(()=>{
    if(!isLoading && user){
      window.location.href = '/user'
    }
  },[user,isLoading])
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  return (
    <div>
      <a href={`${baseUrl}/auth/google/login`}>
        <img src="./images/web_neutral_rd_ctn.svg" className='google-logo'/>
      </a>
    </div>
  )
}

export default Login
