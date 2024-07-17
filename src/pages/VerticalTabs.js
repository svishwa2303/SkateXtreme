import React from 'react';
import '../css/AdminHome.css';

const VerticalTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="vertical-tabs">
      <button className={activeTab === 'vtab1' ? 'active' : ''} onClick={() => setActiveTab('vtab1')}>VTab 1</button>
      <button className={activeTab === 'vtab2' ? 'active' : ''} onClick={() => setActiveTab('vtab2')}>VTab 2</button>
      <button className={activeTab === 'vtab3' ? 'active' : ''} onClick={() => setActiveTab('vtab3')}>VTab 3</button>
      <button className={activeTab === 'vtab4' ? 'active' : ''} onClick={() => setActiveTab('vtab4')}>VTab 4</button>
    </div>
  );
};

export default VerticalTabs;
