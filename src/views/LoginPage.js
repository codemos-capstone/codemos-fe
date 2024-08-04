import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Login from "components/Sign/Login";
import Register from "components/Sign/Register";

import "./LoginPage.css"
import ForgotPassword from "components/Sign/ForgotPassword";

const btnTexts = require('lang/kor.json').login;

export default function LoginPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const oauth = queryParams.get('oauth');
    const emailFromQuery = queryParams.get('email');

    // 상태에 따라 초기 폼 설정
    const [formStat, setFormStat] = useState(oauth === 'true' ? 'register' : 'login');

    let form;
    if (formStat === 'login'){
        form = <Login setForm={setFormStat} />
    } else if (formStat === 'register') {
        form = <Register setForm={setFormStat} initialEmail={emailFromQuery} />
    } else if (formStat === 'forgot-password') {
        form = <ForgotPassword />
    }
    
    return(
        <div className="container">
            {form}
            <div className="home">
                <button btntype='main' className="home-btn" onClick={()=>{navigate("/");}}>{btnTexts[4]}</button>
            </div>
        </div>
    )
}
