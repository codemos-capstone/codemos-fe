import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthMiddle = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('accessToken');
        if (accessToken) {
            sessionStorage.setItem('accessToken', accessToken);
            navigate('/');
        } else {
            // 토큰이 없으면 바로 루트로 리디렉션
            navigate('/');
        }
    }, [navigate]);

    return (
        <div>
            Redirecting...
        </div>
    );
};

export default OAuthMiddle;
