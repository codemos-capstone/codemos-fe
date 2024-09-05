import React from 'react';
import { useNavigate } from 'react-router-dom';
import './btns.css';
const btnTexts = require('lang/kor.json').btns;

export default function LBBtn({}){
    const navigate = useNavigate();
    return <button btntype="leader" className="leader-btn" onClick={()=>{navigate("/leader/1000");}}>{btnTexts.leader}</button>
}