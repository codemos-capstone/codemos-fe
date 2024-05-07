import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Login from "components/Sign/Login";
import Register from "components/Sign/Register";
import Header from 'components/Header/Header';

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
            <Header></Header>
            <div className="success-message" id="successMessage">{btnTexts[0]}</div>
            {form}
            <div className="home">
                <button btntype='main' className="home-btn" onClick={()=>{navigate("/");}}>{btnTexts[4]}</button>
            </div>
        </div>
    )
}