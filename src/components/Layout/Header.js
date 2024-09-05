import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import symbol from 'assets/images/main-symbol.png'
import logo from 'assets/images/main-logo.png'
import LoginBtn from 'components/Buttons/LoginBtn'
import defaultProfilePic from 'assets/images/dol.jpg' 
import './Header.css';
import LBBtn from "../Buttons/LBBtn";
import axios from 'axios';

export default function Header(){
    const [isLogin, setIsLogin] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        if(token) {
            setIsLogin(true);
            fetchUserProfile();
        }
        else setIsLogin(false);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
        }
    };

    const getProfileImage = (nickname) => {
        return `https://robohash.org/${nickname}?size=200x200&set=set4`;
    };

    return(
        <div className="header">
            <div className="left">
                <div className="nav-logo">
                    <Link to ="/">
                        <img src ={symbol} style={{width: '20px', height: '20px', marginRight: '10px'}}></img>
                        <img src ={logo} style={{width: '120px'}}></img>
                    </Link>
                </div>
                <div className="nav-menu">
                    <Link to ="/landing">
                        <div className="pro">Problems</div>
                    </Link>
                    <Link>
                        <div className="pro">Report</div>
                    </Link>
                </div>
            </div>
            <div className="right">
                <LBBtn></LBBtn>
                <LoginBtn isLogin={isLogin} setIsLogin={setIsLogin}/>
                {isLogin && userProfile && (
                    <button 
                    className="profile-image-button"
                    onClick={() => navigate(`/profile/${userProfile.nickname}`)}
                >
                    <img 
                        src={userProfile.profilePicUrl || getProfileImage(userProfile.nickname)} 
                        alt="Profile" 
                    />
                </button>
                )}
            </div>
        </div>
    )
}
