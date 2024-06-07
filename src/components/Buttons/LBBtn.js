import React from 'react';
import { useNavigate } from 'react-router-dom';
import './btns.css';
const btnTexts = require('lang/kor.json').btns;

export default function LBBtn({btnType}){
    const navigate = useNavigate();
    return <button btntype="login" className="home-login-btn" style = {{backgroundColor: "#0a0f1c", color:"white"}} onClick={()=>{navigate("/leader");}}>리더보드</button>
}