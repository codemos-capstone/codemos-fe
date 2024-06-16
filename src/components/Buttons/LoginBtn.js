import React from 'react';
import { useNavigate } from 'react-router-dom';
import profile from 'assets/images/profile.jpeg'
import './btns.css';
const btnTexts = require('lang/kor.json').btns.login;

function ProfileBtn(){
    const navigate = useNavigate();
    return(
        <button btntype="user-page" className="mypage-btn" onClick={()=>{navigate("/userpage");}}>
            <div className="profile-image" style={{background: '#bdbdbd', }}><img className="profile" src={profile} /></div>
        </button>
    )
}

export default function LoginBtn({ isLogin, setIsLogin }){
    const btnStyle = {
        padding: "8px 16px",
        fontSize: "12px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#0a0f1c",
        color:"white",
        transition: "background-color 0.3s, box-shadow 0.3s"
    }
    const navigate = useNavigate();
    function logout(){
        alert('로그아웃 하시겠습니까?');
        setIsLogin(false);
        sessionStorage.removeItem("accessToken");
    
    }
    if (isLogin) {
        return(
            <div>
                <button className="logout-btn"  style = {btnStyle} onClick={logout}>{btnTexts[1]}</button>
            </div>
        )
    } else {
        return(
            <button btntype="login" className="login-btn" onClick={()=>{navigate("/login");}} style = {btnStyle}>{btnTexts[0]}</button>
        )
    }
}