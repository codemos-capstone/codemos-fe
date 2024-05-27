import React, { useState } from 'react';
import './ColabHeader.css';
import runImg from 'assets/images/run.png';
const ColabHeader = ({ toggleDocsVisibility }) => {
  console.log(typeof toggleDocsVisibility); // "function"이어야 합니다.
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const [editDropdownVisible, setEditDropdownVisible] = useState(false);
  const [runDropdownVisible, setRunDropdownVisible] = useState(false);

  return (
    <header className="colab-header">
      <div className="menu">
        <button 
            className="menu-button" 
            onMouseOver={() => setDropdownVisible(true)}
            onMouseLeave={() => setDropdownVisible(false)}
          >
            File
            {dropdownVisible && (
              <div className="dropdown-content">
                <button className="dropdown-item">New JavaScript Space</button>
                <button className="dropdown-item">New Block Space</button>
                <button className="dropdown-item">Open</button>
                <button className="dropdown-item">Save</button>
              </div>
            )}
        </button>
        <button 
          className="menu-button" 
          onMouseEnter={() => setEditDropdownVisible(true)}
          onMouseLeave={() => setEditDropdownVisible(false)}
        >
          Edit
          {editDropdownVisible && (
            <div className="dropdown-content">
              <button className="dropdown-item">Undo</button>
              <button className="dropdown-item">Redo</button>
              <button className="dropdown-item">Cut</button>
              <button className="dropdown-item">Copy</button>
              <button className="dropdown-item">Paste</button>
            </div>
          )}
        </button>
        <button className="menu-button" 
          onMouseEnter={() => setRunDropdownVisible(true)}
          onMouseLeave={() => setRunDropdownVisible(false)}
        >
          Run
          {runDropdownVisible && (
            <div className="dropdown-content">
              <button className="dropdown-item">Run</button>
              <button className="dropdown-item">Debug</button>
            </div>
          )}</button>
        <button className="menu-button">Tools</button>
        <button className="menu-button">Help</button>
      </div>
      <div className="actions">
        <img src = {runImg} />
        <button className="action-button">remove</button>
        <button className="action-button" onClick={toggleDocsVisibility}>DOCS</button>
      {/* 기타 버튼 및 UI 요소 */}
        <button className="action-button"><span className="action-icon">&#9881;</span></button>
      </div>
    </header>
  );
};

export default ColabHeader;
