import React, { useState, useEffect, useRef } from "react";
import './CodeSpace.css';
import File from './File/File';
import Code from './Code/Code';
import ColabHeader from "./Header/ColabHeader";
import axios from 'axios';

export default function CodeSpace() {
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState(null); 
  const [selectedCodeId, setSelectedCodeId] = useState('');  // 관리할 상태 추가
  const [run, setRun] = useState(false);
  const [isDocsVisible, setIsDocsVisible] = useState(false);
  const [reloadFiles, setReloadFiles] = useState(false); 
  const [showInput, setShowInput] = useState(false); 
  const [docsWidth, setDocsWidth] = useState(400);
  const docsRef = useRef(null);
  const resizerRef = useRef(null);

  useEffect(() => {
    const problem = JSON.parse(sessionStorage.getItem('selectedProblem'));
    if (problem) {
      setSelectedProblem(problem);
    }
  }, []);

  const toggleDocsVisibility = () => {
    setIsDocsVisible(!isDocsVisible);
  };

  const handleFileCreationSuccess = () => {
    setReloadFiles(prev => !prev);
    setShowInput(false); 
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

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSaveCode();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
        setRun={setRun} 
        onFileCreationSuccess={handleFileCreationSuccess} 
        setShowInput={setShowInput} 
      />
      <div className="space">
        <div className="file-container">
          <File 
            setSelectedCode={setSelectedCode} 
            setSelectedProblem={setSelectedProblem} 
            setSelectedFileName={setSelectedFileName} 
            setSelectedCodeId={setSelectedCodeId}
            reloadFiles={reloadFiles} 
            showInput={showInput} 
            setShowInput={setShowInput} 
            selectedProblem={selectedProblem} 
          />
        </div>
        <div className="resizer" ref={resizerRef} onMouseDown={handleMouseDown}></div>
        <div className="code-container">
          <Code
            selectedCode={selectedCode}
            selectedProblem={selectedProblem}
            selectedFileName={selectedFileName} 
            isDocsVisible={isDocsVisible}
            codeRun={run}
            endGame={() => setRun(false)}
            setSelectedCode={setSelectedCode}
            handleSaveCode={handleSaveCode}  
          />
        </div>
      </div>
    </div>
  );
}
