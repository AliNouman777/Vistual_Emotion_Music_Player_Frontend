import React from 'react'
import Navbar from '../Features/Navbar/Navbar'
import "./Home.css"
import CaptureFeature from '../Features/Capture/CaptureFeature'
const CaptureCom = () => {
  return (
    <div className='home'>
        <Navbar/>
        <CaptureFeature/>
    </div>
  )
}

export default CaptureCom
