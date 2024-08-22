import React, { useEffect } from 'react';
import AdminFeatures from '../Features/AdminFeatures/AdminFeaturesaside';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserStatsChart from './UserStatsChart/UserStatsChart';
import MusicStatsChart from './UserStatsChart/MusicStatsChart';  

const AdminCom = () => {
  const Navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!localStorage.getItem("token") && !user) {
      return Navigate('/');
    }
    if (user && user.isAdmin === false) {
      return Navigate("/");
    }
  }, [user]);

  return (
    <div>
      <AdminFeatures />
      <UserStatsChart />  {/* User registrations chart */}
      <MusicStatsChart />  {/* Music type distribution chart */}
    </div>
  );
}

export default AdminCom;
