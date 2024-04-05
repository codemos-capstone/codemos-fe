import React from "react";
import './MainPage.css'
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
                <div className="menus">
                    <div className="buttons">
                        <MainBtn btnType='game' handlePage={handlePage} />
                        <MainBtn btnType='docs' handlePage={handlePage} />
                        <MainBtn btnType='leader' handlePage={handlePage} />
                    </div>
                    {/*<Leader />*/}
                </div>
                {/*<script src="login.js"></script>*/}
            </div>
        </div>
    )
}
/*
loadBoard(0, 0);
window.onload = function () {};
document.addEventListener("DOMContentLoaded", () => {
    console.log(sessionStorage.getItem("jwtToken"));
    if (sessionStorage.getItem("jwtToken") == null) {
        console.log("no token");
        document.querySelector(".home-login-btn").style.display = "block";
        document.querySelector(".home-logout-btn").style.display = "none";
        document.querySelector(".home-mypage-btn").style.display = "none";
    } else {
        document.querySelector(".home-login-btn").style.display = "none";
        document.querySelector(".home-logout-btn").style.display = "block";
        document.querySelector(".home-mypage-btn").style.display = "block";
        var token = sessionStorage.getItem("jwtToken");
        fetch(serverAddress + "/api/verify-token", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                if (response.text() == "Invalid token.") {
                    sessionStorage.removeItem("jwtToken");
                    document.quereySelector(".home-login-btn").style.display = "block";
                    document.querySelector(".home-logout-btn").style.display = "none";
                    document.querySelector(".home-mypage-btn").style.display = "none";
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Error Code:", error);
            });
    }
    //로그인 확인
    setTimeout(() => {
        console.log(sessionStorage.getItem("jwtToken"));
        if (sessionStorage.getItem("jwtToken") == null) {
            console.log("no token");
            document.querySelector(".home-login-btn").style.display = "block";
            document.querySelector(".home-logout-btn").style.display = "none";
            document.querySelector(".home-mypage-btn").style.display = "none";

            return;
        } else {
            document.querySelector(".home-login-btn").style.display = "none";
            document.querySelector(".home-logout-btn").style.display = "block";
            document.querySelector(".home-mypage-btn").style.display = "block";
            var token = sessionStorage.getItem("jwtToken");
            fetch(serverAddress + "/api/verify-token", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(response.status);
                    }
                    if (response.text() == "Invalid token.") {
                        sessionStorage.removeItem("jwtToken");
                        document.quereySelector(".home-login-btn").style.display = "block";
                        document.querySelector(".home-logout-btn").style.display = "none";
                        document.querySelector(".home-mypage-btn").style.display = "none";
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error("Error Code:", error);
                });
        }
    }, 2000);
});
function logout() {
    sessionStorage.removeItem("jwtToken");
    document.querySelector(".home-login-btn").style.display = "block";
    document.querySelector(".home-logout-btn").style.display = "none";
    document.querySelector(".home-mypage-btn").style.display = "none";
}*/