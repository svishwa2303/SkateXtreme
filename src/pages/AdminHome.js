import React, { useState, useEffect } from 'react';
import HorizontalTabs from './HorizontalTabs';
import TeachersList from './TeachersList';
import StudentAttendance from './StudentAttendance';
import DataTableToggle from './StudentDetailList';
import '../css/AdminHome.css';
import { useSelector } from 'react-redux';
import { selectUsername } from '../redux/selectors';
import MyAccount from './MyAccount';

const AdminHome = () => {
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('tab1');
  const [userDetails, setUserDetails] = useState(null); // State to hold user details


  const handleTabChange = (tab) => {
    setActiveHorizontalTab(tab);
  };

  
  return (
    <div className="app-container">
      <HorizontalTabs
        activeTab={activeHorizontalTab}
        setActiveTab={handleTabChange}
        tabNames={['Manage Instructors', 'Student Attendance', 'Student Details', 'My Account']}
      />
      <div className="content-container">
        {activeHorizontalTab === 'tab1' && <TeachersList />}
        {activeHorizontalTab === 'tab2' && <StudentAttendance />}
        {activeHorizontalTab === 'tab3' && (
          <>
            <p>Student Details</p>
            <DataTableToggle />
          </>
        )}
        {activeHorizontalTab === 'tab4' && (
          <>
            <MyAccount />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
