import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from './useLogin'; // Import the custom hook
import googleLoginImage from 'assets/images/continueGoogle.png';
const btnTexts = require('lang/eng.json').login;

export default function Login() {
    const { email, setEmail, password, setPassword, handleLogin } = useLogin();
    const navigate = useNavigate();
    const googleOAuth = process.env.REACT_APP_GOOGLE_OAUTH_ADDRESS;

    const containerStyle = {
        marginTop: '10%',
        maxWidth: '300px',
        margin: 'auto',
        backgroundColor: 'rgba(255,255,255,0.8)',
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
                    <div className='forgot-password'
                        style={{ float: 'left', fontSize: '60%', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => navigate("/sign/forgotpassword")}
                    >
                        Forgot Password?
                    </div>
                </div>
              
                <div className="form-group google">
                    <a href={googleOAuth}>
                        <img src={googleLoginImage} alt="Continue with Google" style={{ width: '50%', cursor: 'pointer', marginTop:'10px'}} />
                    </a>
                </div>
                <div className='btn-container'>
                    <button className='submit' type="submit">{btnTexts[1]}</button>
                    <div className='to-register'><Link to={"/sign/register"}>{btnTexts[4]}</Link></div>
                </div>
            </form>
        </div>
    );
}
