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
        content: 'Welcome to our Codemos Codespace!',
        position: 'center'
    },
    {
        selector: '.file-container .file',
        content: 'This is your file list which contains all of your created code files. You can choose one of your file or create new one.',
    },
    {
        selector: '.colab-header .menu',
        content: 'This is menu. You can create new file here.'
    },
    {
        selector: '.container .space',
        content: 'This space shows chosen problem and the codespace that contains your code.'
    },
    {
        selector: '.code .editor-container',
        content: 'This is the codespace. You can freely write your code here.'
    },
    {
        selector: '.colab-header .actions',
        content: `You can simulate your codes by clicking this run button\n(But you have to press convert button before your block code simulating!).\n DOCS button will show the docs that contains all the information you will need.`
    },
    {
        content: 'This is all for basic uses. Enjoy your coding!',
        position: 'center'
    },
]