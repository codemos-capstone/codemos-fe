import React, { useState, useEffect, useRef, useContext } from "react";
import { useTour } from "@reactour/tour";
import { CodeSpaceContext } from "common/CodeSpaceContext";
import File from './File/File';
import Code from './Code/Code';
import ColabHeader from "./Header/ColabHeader";
import axios from 'axios';
import Docs from "views/Docs";

import './CodeSpace.css';

function ContextProvider ({ children }){

  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedCodeId, setSelectedCodeId] = useState('');  // 관리할 상태 추가
  const [selectedFileName, setSelectedFileName] = useState(null); 
  const [run, setRun] = useState(false);
  const [showNewFile, setShowNewFile] = useState(false); // 입력 필드 표시 여부
  const [judgeMessage, setJudgeMessage] = useState(""); // 판정 메시지 상태
  const [currentLang, setCurrentLang] = useState(null);

  return(
    <CodeSpaceContext.Provider value={{
      selectedProblem, setSelectedProblem,
      selectedCode, setSelectedCode,
      selectedCodeId, setSelectedCodeId,
      selectedFileName, setSelectedFileName,
      run, setRun,
      showNewFile, setShowNewFile,
      judgeMessage, setJudgeMessage,
      currentLang, setCurrentLang
    }}>
      {children}
    </CodeSpaceContext.Provider>
  )
}

export default function CodeSpace () {
  return(
    <ContextProvider>
      <CodeSpaceInner />
    </ContextProvider>
  )
}

function CodeSpaceInner() {
  const { setSelectedProblem, selectedCode, selectedCodeId } = useContext(CodeSpaceContext);
  const [isDocsVisible, setIsDocsVisible] = useState(false);
  const [reloadFiles, setReloadFiles] = useState(false); // 파일 리로드 트리거
  const [docsWidth, setDocsWidth] = useState(600);
  const docsRef = useRef(null);
  const resizerRef = useRef(null);
  const [fileWidth, setFileWidth] = useState(200); // Initial file width
  const [saveStatus, setSaveStatus] = useState(""); //저장 상태 메시지  

  useEffect(() => {
    if (sessionStorage.getItem("selectedProblem")){
      const problem = JSON.parse(sessionStorage.getItem("selectedProblem"));
      sessionStorage.removeItem("selectedProblem")
      if (problem) {
        setSelectedProblem(problem);
      }
    }
  }, []);

  const toggleDocsVisibility = () => {
    setIsDocsVisible(!isDocsVisible);
  };

  const handleSaveCode = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      alert('코드를 저장하려면 로그인이 필요합니다.');
      return;
    }
    if (selectedCodeId) {
      setSaveStatus("저장 중..."); // 저장 중 메시지 설정
      try {
        const now = new Date().toISOString();
        const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
        await axios.put(
          `${serverAddress}/api/v1/code-file/${selectedCodeId}`,
          {
            content: selectedCode,
            updatedAt: now
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        // console.log("Code saved successfully");
        setSaveStatus("저장 완료");
        setTimeout(() => setSaveStatus(""), 2000);

        // 파일 리로드 트리거 설정
        setReloadFiles(prev => !prev);
      } catch (error) {
        console.error("Error saving code:", error);
        setSaveStatus("저장 실패");
      }
    } else {
      alert('파일 생성이 필요합니다.')
    }
  };

  const handleSaveKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveCode();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSaveKeyDown);
    return () => {
      window.removeEventListener("keydown", handleSaveKeyDown);
    };
  }, [selectedCode, selectedCodeId]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (docsRef.current) {
      const newWidth = docsRef.current.getBoundingClientRect().right - e.clientX;
      setDocsWidth(Math.max(200, Math.min(newWidth, window.innerWidth * 0.8)));
    }
  };

  const handleMouseUp = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className='contents'>
      <ColabHeader 
        toggleDocsVisibility={toggleDocsVisibility} 
        saveStatus={saveStatus}
      />
      <div className="space">
          <File reloadFiles={reloadFiles} />
        <div className="resizer"></div>
        <div className="code-container">
          <Code />
        </div>
        <div 
          className={`docs-panel ${isDocsVisible ? 'visible' : ''}`} 
          ref={docsRef} 
          style={{ width: isDocsVisible ? `${docsWidth}px` : '0' }}
        >
          <div className="resizer" ref={resizerRef} onMouseDown={handleMouseDown}></div>
          <Docs />
        </div>
        <div className="toggle-docs" onClick={toggleDocsVisibility}>
          {isDocsVisible ? '▶' : '◀'}
        </div>
      </div>
    </div>
  );
}
