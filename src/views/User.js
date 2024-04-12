import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./User.css"

const btnTexts = require('lang/kor.json').user;
const serverAddress = "";

import symbol from 'assets/images/main-symbol.png'

export default function User({ isLogin}){
    const navigate = useNavigate();
    const [badAccess, setBadAccess] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        let token = sessionStorage.getItem('jwtToken')
        if (token == null){
            setBadAccess(true);
            /*setTimeout(() => {
                history.back()
            }, 2000);*/
        } else {
            fetch(serverAddress + '/user/mypage', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setBadAccess(false);
                return response.json()
            })
            .then(data => {
                setUserData(data);
            })
            .catch(error => console.error('Error:', error));
        }
    }, [])

    if (isLogin && !badAccess && userData) {
        return(
        <div className="container">
            <button btntype='main' className="home-btn" onClick={()=>{navigate("/");}}>{btnTexts[4]}</button>
            <div className="box">
                <div className="logo">
                    {/*로고 이미지 경로를 'logo.png'로 가정합니다. 실제 경로로 변경하세요.*/}
                    <img src={symbol} alt="Logo" />
                </div>
                <div className="profile">
                    <div className="user-info-block">
                        <div className="profile-icon"></div>
                        <UserInfo userDetail={[userData.loginId, userData.role]}  />
                        {/*<button id="deleteAccount">회원탈퇴</button>*/}
                    </div>
                </div>
                <CodeEntities codes={userData.leaderBoards} />
            </div>
        </div> 
        );
    } else {
        return(<div className="container"><div className="box" style={{paddingTop: "100px"}}><div>Bad Access</div></div></div>);
    }
}
function UserInfo({userDetail}){
    return(
        <div className="user-details">
            <h2 className="nickname">{btnTexts[1]}</h2>
            <h2 className="small-text">ID: {userDetail[0]}</h2>
            <h2 className="small-text">ROLE: {userDetail[1]}</h2>
        </div>
    )
}
function CodeEntities({codes}){
    const [showCode, setShowCode] = useState(codes.map(() => false));
    const toggleCode = (idx) => {
        setShowCode((prevState) => {
            const newState = [...prevState];
            newState[idx] = !newState[idx];
            return newState;
        });
    };

    return(
        <div id="code-buttons">
            {codes.map((item, idx)=>(
                <div style={{display: "flex"}}>
                    <div className="code" style={{width: "90%", margin: "5px"}} onClick={() => {toggleCode(idx);}}>
                        [Code {item.leaderBoardId}]
                        {showCode[idx] && <pre>
                            <code style={{whiteSpace:"pre-wrap", overflowWrap:"break-word"}}>{item.code}</code>
                        </pre>}
                    </div>
                    <button className="reg-btn" onClick={() => {registerCode(item.leaderBoardId)}}>{btnTexts[2]}</button>
                    <button className="close" onClick={deleteCode} style={{
                        color: "#fff",
                        fontSize: "20px",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: "transparent"}}>&#215;</button>
                </div>
            ))}
        </div>
    )
}

function registerCode(codeNum){
    var conf = confirm(btnTexts[3]);
    var token = sessionStorage.getItem('jwtToken')
    if(conf){
        fetch(serverAddress+"/user/updateRanking/"+codeNum,{
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then((response)=>{
            if(!response.ok){
                throw new Error(response.status)
            }
            console.log("등록 완료!")
        })
        .catch((error) => {
            console.log('Error', error)
        })      
    }
}
function deleteCode(){
    var conf = confirm("이 코드를 삭제할까요?")
    if(conf){
        //fetch(_delete from server_)
        //reload page
    }
}
function deleteAccount(){}