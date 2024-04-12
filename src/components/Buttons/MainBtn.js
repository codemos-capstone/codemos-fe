import React from 'react';
import { Link } from 'react-router-dom';
const btnTexts = require('lang/kor.json').btns;

export default function MainBtn({btnType}){
    if(btnType === 'main'){
        return <Link to="/"><button btntype={btnType} className='home-btn'>Home</button></Link>
    }
    let btnText = btnTexts[btnType]
    return <Link to={"/" + btnType}><button btntype={btnType} className='button'>{btnText}</button></Link>
}