import React from 'react';
import { useNavigate } from 'react-router-dom';
import profile from 'assets/images/profile.jpeg'
import './btns.css';
const btnTexts = require('lang/kor.json').btns.login;

function ProfileBtn(){
    const navigate = useNavigate();
    return(
        <button btntype="user-page" className="home-mypage-btn" onClick={()=>{navigate("/userpage");}}>
            <div className="profile-image" style={{background: '#bdbdbd', }}><img className="profile" src={profile} /></div>
        </button>
    )
}

export default function LoginBtn({ isLogin, setIsLogin }){
    const navigate = useNavigate();
    function logout(){
        alert('로그아웃 하시겠습니까?');
        setIsLogin(false);
        sessionStorage.removeItem("accessToken");
    
    }
    if (isLogin) {
        return(
            <div>
                <button className="home-logout-btn"  style = {{backgroundColor: "#0a0f1c", color:"white"}} onClick={logout}>{btnTexts[1]}</button>
            </div>
        )
    } else {
        return(
            <button btntype="login" className="home-login-btn" onClick={()=>{navigate("/login");}} style = {{backgroundColor: "#0a0f1c", color:"white"}}>{btnTexts[0]}</button>
        )
    }
}