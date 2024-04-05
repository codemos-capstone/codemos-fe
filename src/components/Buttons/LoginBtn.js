import React from 'react';
import profile from 'assets/images/profile.jpeg'
const btnTexts = require('lang/kor.json').btns.login;

function ProfileBtn({handlePage}){
    return(
        <button btntype="user-page" className="home-mypage-btn" onClick={handlePage}>
        <div className="profile-image" style={{background: '#bdbdbd'}}><img className="profile" src={profile} /></div>
        </button>
    )
}

export default function LoginBtn({handlePage, isLogin, setIsLogin}){
    function logout(){
        setIsLogin(false);
        sessionStorage.removeItem("jwtToken");
    }
    if (isLogin) {
        return(
            <div>
                <ProfileBtn handlePage={handlePage} />
                <button className="home-logout-btn" onClick={logout}>{btnTexts[1]}</button>
            </div>
        )
    } else {
        return(
            <button btntype="login" className="home-login-btn" onClick={handlePage}>{btnTexts[0]}</button>
        )
    }
}