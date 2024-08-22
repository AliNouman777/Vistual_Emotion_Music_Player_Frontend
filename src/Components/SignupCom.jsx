import React,{useEffect} from 'react'
import SignupFeature from '../Features/Signup/SignupFeature'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SignupCom = () => {
  const Navigate = useNavigate()

  const user = useSelector(state=>state.user.user)
  useEffect(()=>{
    if (user){
      Navigate('/')
    }
  },[user]);

  return (
    <>
      <SignupFeature /> 
    </>
  )
}

export default SignupCom
