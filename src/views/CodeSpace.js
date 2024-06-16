import React, { useState, useEffect } from "react";
import './CodeSpace.css'
import Leaderboard from "components/LeaderBoard/Leaderboard";
import Header from 'components/Header/Header';
import Main from 'components/Main/Main';

export default function CodeSpace() {

    return (
        <div className='container'>
            {/* Header 컴포넌트 */}
            <Header />
            {/* Main 컴포넌트 */}
            <Main></Main>
        </div>
    );
}
