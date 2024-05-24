import React, { useState } from "react";
import './Main.css';
import File from './File/File'
import Code from './Code/Code'
import ColabHeader from "./Header/ColabHeader";

export default function Main({isLogin, setIsLogin}){
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null); 

  return(
    <div className='contents'>
      <ColabHeader></ColabHeader>
      <div className="space">
        <div className="file-container">
          <File setSelectedCode={setSelectedCode} setSelectedProblem={setSelectedProblem}></File>
        </div>
        <div className="code-container">
          <Code selectedCode={selectedCode} selectedProblem={selectedProblem}></Code>
        </div>
      </div>
    </div>
  );
}
