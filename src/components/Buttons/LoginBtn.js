import React from 'react';
import { Link } from 'react-router-dom';
import profile from 'assets/images/profile.jpeg'
const btnTexts = require('lang/kor.json').btns.login;

function ProfileBtn(){
    return(
        <Link to="userpage">
            <button btntype="user-page" className="home-mypage-btn">
                <div className="profile-image" style={{background: '#bdbdbd'}}><img className="profile" src={profile} /></div>
            </button>
        </Link>
    )
}

export default function LoginBtn({isLogin, setIsLogin}){
    function logout(){
        setIsLogin(false);
        sessionStorage.removeItem("jwtToken");
    }
    if (isLogin) {
        return(
            <div>
                <ProfileBtn />
                <button className="home-logout-btn" onClick={logout}>{btnTexts[1]}</button>
            </div>
        )
    } else {
        return(
            <Link to="/login"><button btntype="login" className="home-login-btn">{btnTexts[0]}</button></Link>
        )
    }
}