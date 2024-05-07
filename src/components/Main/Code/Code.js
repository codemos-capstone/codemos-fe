import React from "react";
import './Code.css';
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-ambiance';
import '../../Buttons/FileBtn'
import FileBtn from "../../Buttons/FileBtn";

export default function Code(){
    const CodeEditorStyle = {width: '100%',height:'100%',border: '5px solid #3D3D3D', borderTop: '20px solid #3D3D3D'}
    return(
        <div className='code'>
            <div style={{width: '100%',height:'25px', backgroundColor: 'black'}}>
            <FileBtn></FileBtn>
            </div>
            <AceEditor
                style ={CodeEditorStyle}
                id="editor"
                mode="javascript"
                theme="ambiance"
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
            />
        </div>
    );
}