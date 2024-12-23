import React, { useState, useContext, useRef } from 'react';
import { CodeSpaceContext } from 'contexts/CodeSpaceContext';
import './ColabHeader.css';
import runImg from 'assets/images/run.png';
import { useTour } from '@reactour/tour';

const ColabHeader = ({ toggleDocsVisibility, saveStatus }) => {
  const { setRun, setShowNewFile, judgeMessage} = useContext(CodeSpaceContext);
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const [editDropdownVisible, setEditDropdownVisible] = useState(false);
  const [runDropdownVisible, setRunDropdownVisible] = useState(false);
  const fileInputRef = useRef(null); // 파일 input 참조

  const { setIsOpen } = useTour();

  const runGame = () => { setRun(true); };

  const handleNewJs = () => {
    setShowNewFile('js');
    setDropdownVisible(false);
  }
  const handleNewCPP = () => {
    setShowNewFile('c');
    setDropdownVisible(false);
  }
  const handleNewPython = () => {
    setShowNewFile('py');
    setDropdownVisible(false);
  }
  const handleNewBlock = () => {
    setShowNewFile('block');
    setDropdownVisible(false);
  }

  // 파일 선택 시 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        // console.log('파일 내용:', fileContent); // 파일 내용을 콘솔에 출력
        // 필요한 처리 로직 추가
      };
      reader.readAsText(file); // 텍스트 파일 읽기
    }
  };

  // 파일 선택창 열기
  const handleOpenFile = () => {
    fileInputRef.current.click(); // 파일 input 클릭 이벤트 트리거
  };

  return (
    <header className="colab-header">
      <div className="menu">
        <div
          className="menu-button" 
          onMouseOver={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          New File
          {dropdownVisible && (
            <div className="dropdown-content">
              <button className="dropdown-item" onClick={handleNewJs}>New JavaScript File</button>
              <button className="dropdown-item" onClick={handleNewCPP}>New C File</button>
              <button className="dropdown-item" onClick={handleNewPython}>New Python File</button>
              <button className="dropdown-item" onClick={handleNewBlock}>New block coding File</button>
              {/*<button className="dropdown-item" onClick={handleOpenFile}>Open</button>
              <button className="dropdown-item">Save</button>*/}
            </div>
          )}
        </div>
        {/*<div
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
        </div>
        <div className="menu-button" 
          onMouseEnter={() => setRunDropdownVisible(true)}
          onMouseLeave={() => setRunDropdownVisible(false)}
        >
          Run
          {runDropdownVisible && (
            <div className="dropdown-content">
              <button className="dropdown-item" onClick={runGame}>Run</button>
              <button className="dropdown-item">Debug</button>
            </div>
          )}
        </div>
        <div className="menu-button">Tools</div>*/}
        <div className="menu-button help" onClick={() => {setIsOpen(true)}}>Help</div>
      </div>

      <div className="actions">
      {saveStatus &&  <div className="action-button" style={{ color: 'green' ,fontSize:'80%' }}> {saveStatus}</div>}
      {judgeMessage && <div className="action-button" style={{ color: 'green' ,fontSize:'80%'}}>{judgeMessage}</div>}
        <button className="action-button run" onClick={runGame}><img src={runImg} alt="Run" /></button>
        <button className="action-button" onClick={toggleDocsVisibility}>DOCS</button>
        <button className="action-button"><span className="action-icon">&#9881;</span></button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept=".js"  // .js 파일만 선택 가능
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </header>
  );
};

export default ColabHeader;
