import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Login from "components/Login";
import Register from "components/Register";

import "./LoginPage.css"

const btnTexts = require('lang/kor.json').login;

function HomeBtn(){
    return(
        <Link to="/"><button btntype='main' className="home-btn">{btnTexts[4]}</button></Link>
    )   
}

export default function LoginPage({setPage, setIsLogin}){
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
            <a href="https://accounts.google.com/o/oauth2/auth?client_id=97551998574-irm4ietu011qts1lkacbpvoqvbkt7j85.apps.googleusercontent.com&redirect_uri=https://codemos.site/auth/callback&response_type=code&scope=email">구글</a>
            <div className="home">
                <HomeBtn />
            </div>
        </div>
    )
}

function googleLogin(){
    fetch("https://accounts.google.com/o/oauth2/auth?client_id=97551998574-irm4ietu011qts1lkacbpvoqvbkt7j85.apps.googleusercontent.com&redirect_uri=https://codemos.site&response_type=code&scope=email",{
        method: 'GET',
    }).then((res)=>{})
}