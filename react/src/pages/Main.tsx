import React from 'react'
import { useNavigate } from 'react-router-dom'

const Main = () => {
    const nav = useNavigate()
    const onClick = () => {
        nav('/login')
    }
  return (
    <div>
      <button onClick={onClick}>로그인으로</button>
    </div>
  )
}

export default Main
