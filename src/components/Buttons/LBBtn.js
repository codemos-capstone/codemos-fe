import React from 'react';
import { useNavigate } from 'react-router-dom';
import './btns.css';
const btnTexts = require('lang/kor.json').btns;

export default function LBBtn({}){
    const btnStyle = {
        padding: "8px 16px",
        fontSize: "12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#0a0f1c",
        color:"white",
        transition: "background-color 0.3s, box-shadow 0.3s"
    }
    const navigate = useNavigate();
    return <button btntype="leader" className="login-btn" style = {btnStyle} onClick={()=>{navigate("/leader");}}>리더보드</button>
}