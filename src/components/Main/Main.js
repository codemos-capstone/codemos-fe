import React, { useState, useEffect } from "react";
import './Main.css';
import File from './File/File';
import Code from './Code/Code';
import ColabHeader from "./Header/ColabHeader";

export default function Main({ isLogin, setIsLogin }) {
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [run, setRun] = useState(false);
  const [isDocsVisible, setIsDocsVisible] = useState(false);

  useEffect(() => {
    const problem = JSON.parse(sessionStorage.getItem('selectedProblem'));
    if (problem) {
      setSelectedProblem(problem);
    }
  }, []);

  const toggleDocsVisibility = () => {
    console.log("Toggling visibility");
    setIsDocsVisible(!isDocsVisible);
  };

  return (
    <div className='contents'>
      <ColabHeader toggleDocsVisibility={toggleDocsVisibility} setRun={setRun} />
      <div className="space">
        <div className="file-container">
          <File setSelectedCode={setSelectedCode} setSelectedProblem={setSelectedProblem}></File>
        </div>
        <div className="resizer"></div> 
        <div className="code-container">
          <Code
            selectedCode={selectedCode}
            selectedProblem={selectedProblem}
            isDocsVisible={isDocsVisible}
            codeRun={run}
            endGame={() => setRun(false)}
          />
        </div>
        <div className="right-border">
          <div className="document"></div>
        </div>
      </div>
    </div>
  );
}