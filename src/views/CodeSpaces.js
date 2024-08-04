import React from "react";
import './CodeSpaces.css'
import CodeSpace from 'components/CodeSpace/CodeSpace';

export default function CodeSpaces() {

    return (
        <div className='container'>
            {/* CodeSpace 컴포넌트 */}
            <CodeSpace></CodeSpace>
        </div>
    );
}
