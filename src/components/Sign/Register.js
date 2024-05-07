import React, { useState } from "react";
import useRegister from './useRegister'; // 사용자 정의 훅 import
import googleLoginImage from 'assets/images/continueGoogle.png';
const btnTexts = require('lang/kor.json').login;

export default function Register({ setForm }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const register = useRegister(); // 사용자 정의 훅 사용

    function handleRegister(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        register(email, username, password);
    }

    const containerStyle = {
        marginTop: '10%',
        maxWidth: '300px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)'
    };

    const labelStyle = {
        float: 'left',
        fontSize: '60%'
    };

    return (
        <div className="register-container" style={containerStyle}>
            <h2>{btnTexts[2]}</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="username" style={labelStyle}>Username</label>
                    <input type="text" id="username" name="username" placeholder="Enter your username" onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email" style={labelStyle}>Email</label>
                    <input type="text" id="reg-id" name="email" placeholder="Enter your email" onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password" style={labelStyle}>Password</label>
                    <input type="password" id="reg-password" name="password" placeholder="Enter your password" onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                    <input type="password" id="re-password" name="re-password" placeholder="Re-enter your password" onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <img src={googleLoginImage} style={{ width: '50%', height: '20%', cursor: 'pointer' }} alt="Continue with Google" />
                </div>
                <button type="submit" style={{ margin: '5px' }}>{btnTexts[2]}</button>
                <button type="button" onClick={() => setForm('login')}>{btnTexts[3]}</button>
            </form>
        </div>
    );
}
