import React,{useEffect} from 'react'
import LoginFeature from '../Features/Login/LoginFeature'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const LoginCom = () => {
  const Navigate = useNavigate()

  const user = useSelector(state=>state.user.user)
  useEffect(()=>{
    if (user){
      Navigate('/')
    }
  },[user])

  return (
    <>
      <LoginFeature/>
    </>
  )
}

export default LoginCom
