import React from "react";
import './Code.css';
import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-ambiance';
import FileBtn from "../../Buttons/FileBtn";

export default function Code({ selectedCode, selectedProblem }) {
  const CodeEditorStyle = {width: '100%', height:'100%', border: '5px solid #3D3D3D', borderTop: '20px solid #3D3D3D'}

  return(
    <div className='code'>
      <div style={{width: '100%', height:'25px', backgroundColor: 'black', display: 'flex', justifyContent: 'flex-start'}}>
        <FileBtn />
        <FileBtn />
        <FileBtn />
        <FileBtn />
      </div>
      <div className="problems">
        {selectedProblem ? (
          <>
            <h3>{selectedProblem.title}</h3>
            <p>{selectedProblem.description}</p>
            <ul>
              <li>Time Limit: {selectedProblem.timeLimit} ms</li>
              <li>Fuel Limit: {selectedProblem.fuelLimit}</li>
              <li>Initial Position: ({selectedProblem.initialX}, {selectedProblem.initialY})</li>
              <li>Initial Velocity: ({selectedProblem.initialVelocityX}, {selectedProblem.initialVelocityY})</li>
              <li>Initial Angle: {selectedProblem.initialAngle} degrees</li>
            </ul>
            {selectedProblem.userDefined && <p>This is a user-defined problem.</p>}
            {selectedProblem.restrictedMethods && selectedProblem.restrictedMethods.length > 0 && (
              <div>
                <h4>Restricted Methods:</h4>
                <ul>
                  {selectedProblem.restrictedMethods.map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p>No problem selected. Please select a problem to view details.</p>
        )}
      </div>
      <AceEditor
        style={CodeEditorStyle}
        id="editor"
        mode="javascript"
        theme="ambiance"
        name="code-editor"
        value={selectedCode}
        showPrintMargin={false}
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  );
}
