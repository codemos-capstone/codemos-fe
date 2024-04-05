import { React, useState } from "react";
import Login from "components/Login";
import Register from "components/Register";

import "./LoginPage.css"

const btnTexts = require('lang/kor.json').login;

function HomeBtn({handlePage}){
    return(
        <button btntype='main' className="home-btn" onClick={handlePage}>{btnTexts[4]}</button>
    )   
}

export default function LoginPage({setPage, setIsLogin}){
    const handlePage = (e) => {
        setPage(e.currentTarget.getAttribute('btnType'))
    }
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
            <div className="home">
                <HomeBtn handlePage={handlePage} />
            </div>
        </div>
    )
}