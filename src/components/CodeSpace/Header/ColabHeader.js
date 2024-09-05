import React, { useState } from 'react';
import './ColabHeader.css';
import runImg from 'assets/images/run.png';

const ColabHeader = ({ toggleDocsVisibility, setRun, onFileCreationSuccess, setShowInput }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const [editDropdownVisible, setEditDropdownVisible] = useState(false);
  const [runDropdownVisible, setRunDropdownVisible] = useState(false);

  const runGame = () => { setRun(true) };

  return (
    <header className="colab-header">
      <div className="menu">
        <button 
          className="menu-button" 
          onMouseOver={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          생성
          {dropdownVisible && (
            <div className="dropdown-content">
              <button 
                className="dropdown-item" 
                onClick={() => setShowInput(true)} // showInput 상태를 true로 설정
              >
                새로운 JavaScript 블럭
              </button>
              <button className="dropdown-item">새로운 블럭 스페이스</button>
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
          )}
        </button>
        <button className="menu-button">Tools</button>
        <button className="menu-button">Help</button>
      </div>

      <div className="actions">
        <img src={runImg} onClick={runGame} alt="Run" />
        <button className="action-button">remove</button>
        <button className="action-button" onClick={toggleDocsVisibility}>DOCS</button>
        <button className="action-button"><span className="action-icon">&#9881;</span></button>
      </div>
    </header>
  );
};

export default ColabHeader;
