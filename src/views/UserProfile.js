import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';
import defaultProfilePic from 'assets/images/profile.jpeg' 

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [newProfilePicURL, setNewProfilePicURL] = useState('');
    const { nickname } = useParams();
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const navigate = useNavigate();

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
            setNewNickname(response.data.nickname);
            setNewProfilePicURL(response.data.profilePicUrl || '');
            
            const currentUserResponse = await axios.get(`${process.env.REACT_APP_SERVER_ADDRESS}/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsOwnProfile(currentUserResponse.data.nickname === nickname);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    if (!profile) return <div>Loading...</div>;

    const getProfileImage = (nickname) => {
        return `https://robohash.org/${nickname}?size=200x200&set=set4`;
    };


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const token = sessionStorage.getItem("accessToken");
            
            await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/user/nickname`, {
                email: profile.email,
                nickname: newNickname
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await axios.put(`${process.env.REACT_APP_SERVER_ADDRESS}/user/profile-picture`, {
                email: profile.email,
                profilePicURL: newProfilePicURL
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsEditing(false);
            await fetchProfile();
            navigate(`/profile/${newNickname}`);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setNewNickname(profile.nickname);
        setNewProfilePicURL(profile.profilePicUrl || '');
    };

    return (
        <div className="user-profile">
            <div className="user-profile-header">
                {isEditing ? (
                    <div>
                        <input style={{padding:"3px", width:"60%"}}
                            type="text" 
                            value={newProfilePicURL} 
                            onChange={(e) => setNewProfilePicURL(e.target.value)}
                            placeholder="Enter new profile picture URL"
                        />
                    </div>
                ) : (
                    <img 
                        src={profile.profilePicUrl || getProfileImage(profile.nickname)} 
                        alt="Profile" 
                        className="user-profile-image" 
                    />
                )}
                <div className="user-profile-info">
                    {isEditing ? (
                        <div>
                            <input 
                                type="text" 
                                value={newNickname} 
                                onChange={(e) => setNewNickname(e.target.value)}
                            />
                            <button onClick={handleSaveClick}>Save</button>
                            <button onClick={handleCancelClick}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <h2>{profile.nickname}</h2>
                            {isOwnProfile && (
                                <button onClick={handleEditClick}>Edit Profile</button>
                            )}
                        </div>
                    )}
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
