import React from 'react'
import "./Admin.css"
import AdminSongsUploader from '../Features/AdminFeatures/AdminSongsUploader'
import AdminFeaturesaside from '../Features/AdminFeatures/AdminFeaturesaside'
const AdminSongCom = () => {
  return (
    <div className='Songcon'>
        <AdminFeaturesaside/>
        <AdminSongsUploader/>
    </div>
  )
}

export default AdminSongCom
