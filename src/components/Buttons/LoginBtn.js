import React from 'react';
import { useNavigate } from 'react-router-dom';
import profile from 'assets/images/profile.jpeg'
import './btns.css';
const btnTexts = require('lang/eng.json').btns.login;

function ProfileBtn(){
    const navigate = useNavigate();
    return(
        <button btntype="user-page" className="mypage-btn" onClick={()=>{navigate("/userpage");}}>
            <div className="profile-image" style={{background: '#bdbdbd', }}><img className="profile" src={profile} /></div>
        </button>
    )
}

export default function LoginBtn({ isLogin, setIsLogin }){
    const navigate = useNavigate();
    function logout(){
        var state = confirm('로그아웃 하시겠습니까?');
        
        if (state){
            setIsLogin(false);
            sessionStorage.removeItem("accessToken");
        } 
    
    }
    if (isLogin) {
        return(
            <div>
                <button className="logout-btn" onClick={logout}>{btnTexts[1]}</button>
            </div>
        )
    } else {
        return(
            <button btntype="login" className="login-btn" onClick={()=>{navigate("/login");}}>{btnTexts[0]}</button>
        )
    }
}