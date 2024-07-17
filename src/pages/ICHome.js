import React, { useState } from 'react';
import HorizontalTabs from './HorizontalTabs';
import StudentDetailList from './StudentDetailList';
import '../css/ICHome.css';
import StudentAttendance from './StudentAttendance';
import PaymentControl from './PaymentControl';

const ICHome = () => {
  const [activeHorizontalTab, setActiveHorizontalTab] = useState('tab1');
  
  const resetPassword = () => {
    // Reset password logic
  };

  return (
    <div className="app-container">
      <HorizontalTabs activeTab={activeHorizontalTab} setActiveTab={setActiveHorizontalTab} tabNames={['Student Attendance', 'Student Details', 'Payment Control', 'My Account']} />
      <div className="content-container">
        {activeHorizontalTab === 'tab1' && (
            <StudentAttendance />
        )}
        {activeHorizontalTab === 'tab2' && (
          <>
            <p>Student Details</p>
            <StudentDetailList />
          </>
        )}
        {activeHorizontalTab === 'tab3' && (
          <>
            <p>Payment Control:</p>
            <PaymentControl />
          </>
        )}
        {activeHorizontalTab === 'tab4' && (
          <>
            <p>Reset Password:</p>
            <button onClick={resetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ICHome;
