import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import symbol from 'assets/images/main-symbol.png'
import logo from 'assets/images/main-logo.png'
import LoginBtn from 'components/Buttons/LoginBtn'
import './Header.css';
import LBBtn from "../Buttons/LBBtn";


export default function Header({isLogin, setIsLogin}){

    return(
        <div className="header">
            <a href ="/">
            <div className="left">
                <img src ={symbol} style={{width: '20px', height: '20px', marginRight: '10px'}}></img>
                <img src ={logo} style={{width: '120px'}}></img>
            </div>
            </a>
            <div className="right">
                <LBBtn></LBBtn>
                <LoginBtn isLogin={isLogin} setIsLogin={setIsLogin}/>
            </div>
        </div>
    )
}