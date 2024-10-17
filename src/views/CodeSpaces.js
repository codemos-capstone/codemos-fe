import React from "react";
import CodeSpace from 'components/CodeSpace/CodeSpace';
import { TourProvider } from "@reactour/tour";
import './CodeSpaces.css'

export default function CodeSpaces() {

    return (
        <TourProvider steps={steps}>
            <div className='container'>
                {/* CodeSpace 컴포넌트 */}
                <CodeSpace></CodeSpace>
            </div>
        </TourProvider>
    );
}

const steps = [
    {
        content: 'Welcome to Codemos code space!',
        position: 'center'
    },
    {
        selector: '.colab-header .menu',
        content: 'This is a menu for creating or loading files.',
    },
    {
        selector: '.file-container',
        content: 'This is your file list. All files you created will appear here.',
    },
    {
        selector: '.code-container',
        content: 'This is your code space. You can write your answer code for the problem you chose',
    },
]