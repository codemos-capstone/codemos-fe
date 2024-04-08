import React from "react";
import './MainPage.css'
import Leaderboard from "components/Leaderboard";
import LoginBtn from 'components/Buttons/LoginBtn'
import MainBtn from 'components/Buttons/MainBtn'
import symbol from 'assets/images/main-symbol.png'
import logo from 'assets/images/main-logo.png'

import susuk from 'assets/images/dol.jpg'

export default function MainPage({setPage, isLogin, setIsLogin}){
    const handlePage = (e) => {
        setPage(e.currentTarget.getAttribute('btnType'))
    }
    return(
        <div className='container'>
            <LoginBtn handlePage={handlePage} isLogin={isLogin} setIsLogin={setIsLogin}/>
            <div>
                <div className="mainpage">
                    <img src={symbol} width="100px" /><br />
                    <img src={logo} width="250px" />
                </div>
                <div className="iframe-container">
                    <iframe id="rightIframe" src="https://lottie.host/embed/67e1faa4-2645-461f-a6f0-4952bc6e94c8/9K3VEbwQTX.json"></iframe>
                    <img src={susuk} style={{height: '400px'}} />{/*<iframe id="leftIframe" src="minigame.html"></iframe>*/}
                </div>
                <div className="menus" style={{padding: "50px", margin: "auto"}}>
                    <div className="buttons" style={{minWidth: "300px"}}>
                        <MainBtn btnType='game' handlePage={handlePage} />
                        <MainBtn btnType='docs' handlePage={handlePage} />
                        <MainBtn btnType='leader' handlePage={handlePage} />
                    </div>
                    <div style={{width: "40%",minWidth: "400px"}}><Leaderboard page="0" /></div>
                </div>
            </div>
        </div>
    )
}
/*function logout() {
    sessionStorage.removeItem("jwtToken");
    document.querySelector(".home-login-btn").style.display = "block";
    document.querySelector(".home-logout-btn").style.display = "none";
    document.querySelector(".home-mypage-btn").style.display = "none";
}*/