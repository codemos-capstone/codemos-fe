import React, { useEffect } from "react";
import './CodeSpace.css'
import Leaderboard from "components/LeaderBoard/Leaderboard";
import MainBtn from 'components/Buttons/MainBtn'
import Header from 'components/Header/Header';
import Main from 'components/Main/Main';

export default function CodeSpace({ isLogin, setIsLogin }) {
    useEffect(() => {
        // sessionStorage에서 accessToken을 가져옵니다.
        const accessToken = sessionStorage.getItem('accessToken');

        // accessToken이 존재하면 로그인 상태로 업데이트합니다.
        if (accessToken) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [setIsLogin]); // setIsLogin이 변경되면 useEffect가 다시 실행됩니다.

    return (
        <div className='container'>
            {/* Header 컴포넌트 */}
            <Header isLogin={isLogin} setIsLogin={setIsLogin} />
            {/* Main 컴포넌트 */}
            <Main></Main>
        </div>
    );
}
