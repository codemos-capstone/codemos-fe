import { useEffect, useRef } from "react";
import ace from "ace-builds/src-noconflict/ace";
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-javascript'

export default function AceEditor({mode, theme,  ...props}){
    const aceEditorRef = useRef(null);
    const editorDivRef = useRef(null);

    useEffect(() => {
        const basePath = '/ace-builds/src-noconflict';
        ace.default.config.set('basePath', basePath);
        ace.default.config.set('modePath', basePath);
        ace.default.config.set('themePath', basePath);
        ace.default.config.set('workerPath', basePath);

        if (editorDivRef.current && !aceEditorRef.current) {
            aceEditorRef.current = ace.default.edit(editorDivRef.current);
            aceEditorRef.current.setTheme(`ace/theme/${theme ? theme : 'monokai'}`);
            aceEditorRef.current.session.setMode(`ace/mode/${mode ? mode : 'javascript'}`);

            aceEditorRef.current.setOptions({
                fontSize: props.fontSize,
                showPrintMargin: false
            })
        }

        aceEditorRef.current.on('change', () => {
            props.onChange(aceEditorRef.current.getValue());
        })

    }, []);

    useEffect(() => {
        aceEditorRef.current.setValue(props.value);
        aceEditorRef.current.session.setMode(`ace/mode/${mode ? mode : 'javascript'}`);
    }, [props.selectedFileName])
  
    return (
      <div
        id = "editor"
        ref={editorDivRef} 
        style={props.style}
        value={props.value}
      >
      </div>
    );
}
/**
 *                 style={CodeEditorStyle}
                id="editor"
                name="code-editor"
                value={selectedCode || "_mainloop = function(){\n\n}"}
                onChange={(value) => setSelectedCode(value)}
                editorProps={{ $blockScrolling: false }}
                marginBottom="4%"
 */