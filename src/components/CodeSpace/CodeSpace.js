import React, { useState, useEffect, useRef } from "react";
import './CodeSpace.css';
import File from './File/File';
import Code from './Code/Code';
import ColabHeader from "./Header/ColabHeader";
import Docs from "views/Docs";

export default function CodeSpace() {
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [run, setRun] = useState(false);
  const [isDocsVisible, setIsDocsVisible] = useState(false);
  const [reloadFiles, setReloadFiles] = useState(false); // 파일 리로드 트리거
  const [showInput, setShowInput] = useState(false); // 입력 필드 표시 여부
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
    setReloadFiles(prev => !prev); // 파일이 생성되었을 때 리로드 트리거
    setShowInput(false); // 파일 생성 후 입력 필드 숨기기
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
        setShowInput={setShowInput} // showInput 상태 전달
      />
      <div className="space">
        <div className="file-container">
          <File 
            setSelectedCode={setSelectedCode} 
            setSelectedProblem={setSelectedProblem} 
            reloadFiles={reloadFiles} 
            showInput={showInput} // showInput 상태 전달
            setShowInput={setShowInput} // 필요하면 setShowInput 전달
            selectedProblem={selectedProblem} // 선택된 문제 전달
          />
          <File setSelectedCode={setSelectedCode} setSelectedProblem={setSelectedProblem} />
        </div>
        <div className="resizer"></div>
        <div className="code-container">
          <Code
            selectedCode={selectedCode}
            selectedProblem={selectedProblem}
            isDocsVisible={isDocsVisible}
            codeRun={run}
            endGame={() => setRun(false)}
            setSelectedCode={setSelectedCode}
          />
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
