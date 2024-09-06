import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthMiddle = () => {
    const navigate = useNavigate();
    const { checkLoginStatus } = useAuth();

    useEffect(() => {
        const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('accessToken');
        if (accessToken) {
            sessionStorage.setItem('accessToken', accessToken);
            checkLoginStatus().then(() => navigate('/'));
        } else {
            navigate('/');
        }
    }, [navigate, checkLoginStatus]);

    return (
        <div>
            Redirecting...
        </div>
    );
};

export default OAuthMiddle;