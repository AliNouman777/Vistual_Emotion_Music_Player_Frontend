import React from 'react'
import About from '../Features/About/About'
import Navbar from '../Features/Navbar/Navbar'
import "./Home.css"

const AboutCom = () => {
  return (
    <div className='aboutcon' style={{display:"flex"}}>
        <Navbar/>
        <About/>
    </div>
  )
}

export default AboutCom
