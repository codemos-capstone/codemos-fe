import React, { useState, useEffect, useRef, useContext } from "react";
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
  const [currentLang, setCurrentLang] = useState(null);

  return(
    <CodeSpaceContext.Provider value={{
      selectedProblem, setSelectedProblem,
      selectedCode, setSelectedCode,
      selectedCodeId, setSelectedCodeId,
      selectedFileName, setSelectedFileName,
      run, setRun,
      showNewFile, setShowNewFile,
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
  const { selectedProblem, setSelectedProblem, selectedCode, selectedCodeId, selectedFileName } = useContext(CodeSpaceContext);
  const [isDocsVisible, setIsDocsVisible] = useState(false);
  const [reloadFiles, setReloadFiles] = useState(false); // 파일 리로드 트리거
  const [docsWidth, setDocsWidth] = useState(600);
  const docsRef = useRef(null);
  const resizerRef = useRef(null);
  const [fileWidth, setFileWidth] = useState(200); // Initial file width

  useEffect(() => {
    const problem = JSON.parse(sessionStorage.getItem('selectedProblem'));
    if (problem) {
      setSelectedProblem(problem);
    }
  }, []);

  const toggleDocsVisibility = () => {
    setIsDocsVisible(!isDocsVisible);
  };

  const handleSaveCode = async () => {
    console.log(selectedCode);
    console.log(selectedCodeId);
    console.log(selectedFileName);
    console.log(selectedProblem);
    if (selectedCodeId) {
      try {
        const token = sessionStorage.getItem("accessToken");
        const now = new Date().toISOString();
        await axios.put(
          `http://localhost:8080/api/v1/code-file/${selectedCodeId}`,
          {
            content: selectedCode,
            updatedAt: now
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log("Code saved successfully");
      } catch (error) {
        console.error("Error saving code:", error);
      }
    } else {
      console.log('No selectedFileID');
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
