import React, { useState } from "react";
import './Main.css';
import File from './File/File'
import Code from './Code/Code'
import ColabHeader from "./Header/ColabHeader";

export default function Main({isLogin, setIsLogin}){
  const [selectedCode, setSelectedCode] = useState('');

  return(
    <div className='contents'>
      <ColabHeader></ColabHeader>
      <div className="space">
        <File setSelectedCode={setSelectedCode}></File>
        <Code selectedCode={selectedCode}></Code>
      </div>
    </div>
  );
}