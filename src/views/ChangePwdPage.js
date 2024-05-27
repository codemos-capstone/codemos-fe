import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from 'components/Header/Header';
import "./ChangePwdPage.css";

import ResetPassword from "components/Sign/ResetPassword";

const btnTexts = require('lang/kor.json').login;

export default function ChangePwdPage(){
    const navigate = useNavigate();
    
    return(
        <div className='container'>
        <Header />
            <div className="success-message" id="successMessage">{btnTexts[0]}</div>
            <ResetPassword />
            <div className="home">
                <button btntype='main' className="home-btn" onClick={()=>{navigate("/");}}>{btnTexts[4]}</button>
            </div>
        </div>
    )
}
