import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';
import defaultProfilePic from 'assets/images/dol.jpg' 

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const { nickname } = useParams();

    useEffect(() => {
        fetchProfile();
    }, [nickname]);

    const fetchProfile = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/profile/${nickname}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(response.data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    const getProfileImage = (nickname) => {
        return `https://robohash.org/${nickname}?size=200x200`;
    };

    return (
        <div className="user-profile">
            <div className="user-profile-header">
                <img 
                    src={profile.profilePicUrl || getProfileImage(profile.nickname)} 
                    alt="Profile" 
                    className="user-profile-image" 
                />
                <div className="user-profile-info">
                    <h2>{profile.nickname}</h2>
                </div>
            </div>
            <div className="user-profile-stats">
                <div className="user-profile-stat">
                    <div className="user-profile-stat-value">{profile.level}</div>
                    <div className="user-profile-stat-label">Level</div>
                </div>
                <div className="user-profile-stat">
                    <div className="user-profile-stat-value">{profile.experience}</div>
                    <div className="user-profile-stat-label">Experience</div>
                </div>
                <div className="user-profile-stat">
                    <div className="user-profile-stat-value">{profile.solvedProblems.length}</div>
                    <div className="user-profile-stat-label">Solved Problems</div>
                </div>
            </div>
            <div className="user-profile-solved-problems">
                <h3>Solved Problems:</h3>
                <div className="user-profile-problem-list">
                    {profile.solvedProblems.map((problem, index) => (
                        <span key={index} className="user-profile-problem">{problem}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;