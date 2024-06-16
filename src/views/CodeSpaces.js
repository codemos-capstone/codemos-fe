import React from "react";
import './CodeSpaces.css'
import Header from 'components/Header/Header';
import CodeSpace from 'components/CodeSpace/CodeSpace';

export default function CodeSpaces() {

    return (
        <div className='container'>
            {/* Header 컴포넌트 */}
            <Header />
            {/* CodeSpace 컴포넌트 */}
            <CodeSpace></CodeSpace>
        </div>
    );
}
