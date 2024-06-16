import React from "react";
import './CodeSpaces.css'
import Header from 'components/Header/Header';
import Main from 'components/Main/Main';

export default function CodeSpaces() {

    return (
        <div className='container'>
            {/* Header 컴포넌트 */}
            <Header />
            {/* Main 컴포넌트 */}
            <Main></Main>
        </div>
    );
}
