import React, { useState } from "react";
import './Main.css';
import File from './File/File'
import Code from './Code/Code'
import ColabHeader from "./Header/ColabHeader";

export default function Main({isLogin, setIsLogin}){
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null); 
  const [run, setRun] = useState(false);

  return(
    <div className='contents'>
      <ColabHeader setRun={setRun}></ColabHeader>
      <div className="space">
        <div className="file-container">
          <File setSelectedCode={setSelectedCode} setSelectedProblem={setSelectedProblem}></File>
        </div>
        <div className="code-container">
          <Code selectedCode={selectedCode} selectedProblem={selectedProblem} codeRun={run} endGame={()=>{setRun(false)}}></Code>
        </div>
      </div>
    </div>
  );
}
