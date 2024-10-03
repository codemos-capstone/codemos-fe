import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Login from "components/Sign/Login";
import Register from "components/Sign/Register";
import ForgotPassword from "components/Sign/ForgotPassword";

import "./SignPage.css"

const btnTexts = require('lang/kor.json').login;

export default function SignPage(){
    const navigate = useNavigate();
    const location = useLocation();
    const { formType } = useParams();
    const queryParams = new URLSearchParams(location.search);
    const oauth = queryParams.get('oauth');
    const emailFromQuery = queryParams.get('email');

    // 상태에 따라 초기 폼 설정
    const [form, setForm] = useState(oauth === 'true' ? <Register initialEmail={emailFromQuery} /> : <Login />);

    useEffect(() => {
        if (formType === 'login'){
            setForm(<Login />)
        } else if (formType === 'register') {
            setForm(<Register initialEmail={emailFromQuery} />)
        } else if (formType === 'forgotpassword') {
            setForm(<ForgotPassword />)
        }
    }, [formType])

    
    return(
        <div className="sign-container">
            {form}
            <div className="home">
                <button btntype='main' className="home-btn" onClick={()=>{navigate("/");}}>{btnTexts[5]}</button>
            </div>
        </div>
    )
}
