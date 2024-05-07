import React from 'react';
import { useNavigate } from 'react-router-dom';
const btnTexts = require('lang/kor.json').btns;

export default function LBBtn({btnType}){

    return <button btntype="login" className="home-login-btn" onClick={()=>{navigate("/login");}}>리더보드</button>
}