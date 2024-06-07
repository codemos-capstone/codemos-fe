import React from 'react';
import useLogin from './useLogin'; // Import the custom hook
import googleLoginImage from 'assets/images/continueGoogle.png';
const btnTexts = require('lang/kor.json').login;

export default function Login({ setForm }) {
    const { email, setEmail, password, setPassword, handleLogin } = useLogin();
    const googleOAuth = process.env.GOOGLE_OAUTH_ADDRESS;

    function pageToggle() {
        setForm('register');
    }

    function handleForgotPassword() {
        setForm('forgot-password');
    }

    const containerStyle = {
        marginTop: '10%',
        maxWidth: '300px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
    };
    const labelStyle = {
        float: 'left',
        fontSize: '60%'
    };

    return (
        <div className="login-container" style={containerStyle}>
            <h2>{btnTexts[1]}</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="id" style={labelStyle}>Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password" style={labelStyle}>Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <div
                        style={{ float: 'left', fontSize: '60%', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={handleForgotPassword}
                    >
                        비밀번호를 잊으셨나요?
                    </div>
                </div>
              
                <div className="form-group">
                    <a href={googleOAuth}>
                        <img src={googleLoginImage} alt="Continue with Google" style={{ width: '50%', cursor: 'pointer', marginTop:'10px'}} />
                    </a>
                </div>
                <button type="submit" style={{ margin: '5px' }}>{btnTexts[1]}</button>
                <button type="button" onClick={pageToggle}>{btnTexts[2]}</button>
            </form>
        </div>
    );
}
