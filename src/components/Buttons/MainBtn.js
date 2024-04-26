import React from 'react';
import { useNavigate } from 'react-router-dom';
const btnTexts = require('lang/kor.json').btns;

export default function MainBtn({btnType}){
    const navigate = useNavigate();
    if(btnType === 'main'){
        return <button btntype={btnType} className='home-btn' onClick={()=>{navigate("/");}}>Home</button>
    }
    let btnText = btnTexts[btnType]
    return <button btntype={btnType} className='button' onClick={()=>{navigate("/" + btnType);}}>{btnText}</button>
}