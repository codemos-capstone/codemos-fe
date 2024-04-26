import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Login from "components/Login";
import Register from "components/Register";

import "./LoginPage.css"

const btnTexts = require('lang/kor.json').login;

export default function LoginPage({setPage, setIsLogin}){
    const navigate = useNavigate();
    const setToLogin = () => {
        setIsLogin(true)
        setPage('main')
    }
    const [formStat, setFormStat] = useState('login')
    let form;
    if (formStat === 'login'){
        form = <Login setForm={setFormStat} setToLogin={setToLogin} />
    } else if (formStat === 'register') {
        form = <Register setForm={setFormStat} />
    }
    
    return(
        <div className="container" style={{padding: '10px'}}>
            <div className="success-message" id="successMessage">{btnTexts[0]}</div>
            {form}
            <Link to={process.env.REACT_APP_GOOGLE_AUTH}><button>구글</button></Link>
            <div className="home">
                <button btntype='main' className="home-btn" onClick={()=>{navigate("/");}}>{btnTexts[4]}</button>
            </div>
        </div>
    )
}