import React from 'react';
import { useNavigate } from 'react-router-dom';
import './btns.css';
const btnTexts = require('lang/kor.json').btns;

export default function LBBtn({}){
    const btnStyle = {
        padding: "8px 16px",
        fontSize: "12px",
        border: "none",
        borderRadius: "5px"
    }
    const navigate = useNavigate();
    return <button btntype="leader" className="login-btn" style = {{...btnStyle, backgroundColor: "#0a0f1c", color:"white"}} onClick={()=>{navigate("/leader");}}>리더보드</button>
}