import React from 'react';
import '../css/AdminHome.css'; // Import your CSS file

const HorizontalTabs = ({ activeTab, setActiveTab, tabNames }) => {
  return (
    <div className="horizontal-tabs"> {/* Ensure 'horizontal-tabs' class is defined in AdminHome.css */}
      {tabNames.map((tabName, index) => (
        <button
          key={index}
          className={activeTab === `tab${index + 1}` ? 'active horizontal-tab' : 'horizontal-tab'}
          onClick={() => setActiveTab(`tab${index + 1}`)}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
};

export default HorizontalTabs;
