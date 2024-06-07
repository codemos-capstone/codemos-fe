import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import symbol from 'assets/images/main-symbol.png'
import logo from 'assets/images/main-logo.png'
import LoginBtn from 'components/Buttons/LoginBtn'
import './Header.css';
import LBBtn from "../Buttons/LBBtn";
const btnTexts = require('lang/kor.json').btns.problems;


export default function Header(){
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if(token) setIsLogin(true);
        else setIsLogin(false);
    }, []);

    return(
        <div className="header">
            <a href ="/">
            <div className="left">
                <img src ={symbol} style={{width: '20px', height: '20px', marginRight: '10px'}}></img>
                <img src ={logo} style={{width: '120px'}}></img>
                <a href ="/landing">
                <div className="pro">Problems</div></a>
                <div className="pro">Report</div>
            </div>
            </a>
            <div className="right">
                <LBBtn></LBBtn>
                <LoginBtn isLogin={isLogin} setIsLogin={setIsLogin}/>
            </div>
        </div>
    )
}