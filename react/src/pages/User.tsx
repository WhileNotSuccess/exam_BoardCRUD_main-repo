import React, { useEffect, useState } from 'react'
import { Axios } from '../lib/axios'
import { UserDetail } from '../common/types'

const User = () => {
    const [user, setUser] = useState<UserDetail>()
    useEffect(()=>{
        async function effect(){
            const response = await Axios.get('/user/test')
            if(response.status === 200){
                setUser(response.data)
            }
        }
        effect()
    },[]
    )
  return (
    <div>
      <div>id:{user?.id}</div>
      <div>name:{user?.name}</div>
      <div>profile: <img src={`${user?.profilePicture}`} alt="profile" /></div>
      <div>googleId:{user?.googleId}</div>
    </div>
  )
}

export default User
