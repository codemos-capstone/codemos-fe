import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import symbol from 'assets/images/main-symbol.png'
import logo from 'assets/images/main-logo.png'
import LoginBtn from 'components/Buttons/LoginBtn'
import defaultProfilePic from 'assets/images/profile.jpeg'
import './Header.css';
import LBBtn from "../Buttons/LBBtn";
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function Header(){
    const [isLogin, setIsLogin] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
                        <div className="btn">Problems</div>
                    </Link>
                    <Link to={"/leader/1000"}>
                        <div className="btn">Leader Board</div>
                    </Link>
                    <Link>
                        <div className="btn">Report</div>
                    </Link>
                </div>
            </div>
            <div className="right">
                {user ? (
                    <>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        <button 
                            className="profile-image-button"
                            onClick={() => navigate(`/profile/${user.nickname}`)}
                        >
                            <img 
                                src={user.profilePicUrl || getProfileImage(user.nickname)} 
                                alt="Profile" 
                            />
                        </button>
                    </>
                ) : (
                    <>
                        <button className="reg-btn" onClick={() => navigate("/sign/register")}>Register</button>
                        <button className="login-btn" onClick={() => navigate("/sign/login")}>Login</button>
                    </>
                )}
            </div>
        </div>
    )
}
