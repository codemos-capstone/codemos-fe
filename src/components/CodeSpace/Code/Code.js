import React, { useState, useEffect, useRef, useContext } from "react";
import { CodeSpaceContext } from 'contexts/CodeSpaceContext';
import AceEditor from "aceEditor/AceEditor";
import BlockEditor from "blockCoding/BlockEditor";
import GameCanvas from "./GameCanvas";
import axios from "axios";
import { getEncodedCode } from "blockCoding/Blockly/BlocklyComponent";

import "./Code.css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-ambiance";

const modeName = {
    js: 'javascript',
    py: 'python',
    c: 'c_cpp',
    block: 'block'
}

const defaultCodes = {
    js: '_mainloop = function(){\n\n}',
    block: '',
    c: `void main() { }`,
    py: 'def _mainloop(): pass'
}

export default function Code() {
    const { selectedProblem, selectedCode, setSelectedCode, selectedCodeId, selectedFileName, run, setRun, judgeMessage,setJudgeMessage, currentLang } = useContext(CodeSpaceContext);

    const CodeEditorStyle = {
        width: "90%",
        height: "70vh",
        border: "5px solid #3D3D3D",
        borderTop: "20px solid #3D3D3D",
        marginBottom: '2rem'
    };

    const resize = (e) => {
        const newWidth = (window.innerWidth - e.clientX) / window.innerWidth * 100;
        setDocsWidth(Math.max(20, Math.min(80, newWidth))); // Limit width between 20% and 80%
    };
    const stopResize = () => {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
    };

    const [score, setScore] = useState(null);
    const [isJudging, setIsJudging] = useState(false);
    const [judgeResult, setJudgeResult] = useState(null);
    const [judgeProgress, setJudgeProgress] = useState(0);

    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [animationRunning, setAnimationRunning] = useState(false); // 애니메이션 상태 관리

    const endGame = () => {
        setRun(false) 
    };

    
    useEffect(() => {
        if (run) {
            setAnimationRunning(false);  // 먼저 애니메이션을 false로 설정하고
    
            setTimeout(() => {
                setAnimationRunning(true);  // 약간의 지연 후에 true로 다시 설정
            }, 0);  // 지연을 0ms로 주어 순서 보장
    
            setJudgeProgress(0);
    
            const judgeCode = async () => {
                setIsJudging(true);
                setJudgeMessage("Connecting to Judging server...");
                await new Promise((resolve) => setTimeout(resolve, 300));
    
                const judgeAnimation = async () => {
                    let progress = 0;
                    while (progress < 100) {
                        const increment = Math.floor(Math.random() * 15) + 1;
                        progress = Math.min(progress + increment, 100);
                        setJudgeMessage(`Judging...(${progress}%)`);
                        setJudgeProgress(progress);
                        await new Promise((resolve) => setTimeout(resolve, 50));
                    }
                };
    
                await judgeAnimation();
                await new Promise((resolve) => setTimeout(resolve, 100));
    
                try {
                    const token = sessionStorage.getItem("accessToken");
                    const response = await axios.post(`${serverAddress}/api/v1/judge/problem/${selectedProblem.problemNumber}/score`, { code: selectedCode }, { headers: { Authorization: `Bearer ${token}` } });
                    setJudgeResult(response.data);
                    setJudgeMessage("Judging completed!");
                } catch (error) {
                    console.error("Error judging:", error);
                    setJudgeMessage("Error during judging.");
                }
                setIsJudging(false);
                setTimeout(() => {
                    setJudgeMessage('');
                }, 5000);
            };
            judgeCode();
        }
    }, [run, selectedProblem, selectedCode, setJudgeMessage]);

    useEffect(() => {
        setRun(false);
    }, [selectedCode])

    return (
        <div className="code">
            <div className="editor-container">
                {selectedProblem ? (
                    <>
                        <div className="problems">
                            <h3>
                                {selectedProblem.problemNumber} : {selectedProblem.title}
                            </h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Time Limit<br /><span>getTimeLeft()</span></th>
                                        <th>Fuel Limit<br /><span>getFuel()</span></th>
                                        <th>Initial Position(x, y)<br /><span>getX(), getY()</span></th>
                                        <th>Initial Velocity(x, y)<br /><span>getVelocityX(), getVelocityY()</span></th>
                                        <th>Initial Rotation Velocity<br /><span>getRotationVelocity()</span></th>
                                        <th>Initial Angle(deg)<br /><span>getAngle()</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td> {selectedProblem.timeLimit} ms</td>
                                        <td> {selectedProblem.fuelLimit}</td>
                                        <td>
                                            {" "}
                                            ({selectedProblem.initialX}, {selectedProblem.initialY})
                                        </td>
                                        <td>
                                            {" "}
                                            ({selectedProblem.initialVelocityX}, {selectedProblem.initialVelocityY})
                                        </td>
                                        <td> {selectedProblem.rotationVelocity}</td>
                                        <td> {selectedProblem.initialAngle}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <br></br>
                            <div>{selectedProblem.description}</div>
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
                            <div><details>
                                <summary>Hint</summary>
                                <ul>
                                    <li>{/*Todo: 서버에서 받아오거나 문제 조건 보고 알아서 추가*/}</li>
                                </ul>
                            </details></div>
                        </div>
                    </>
                ) : (
                    <div></div>
                    //선택 안하면 아무것도 없음
                )}
                {selectedFileName ? <div className="fileSubject">{selectedFileName + '.' + currentLang}</div> :
                    <div className="no-file">Please create your file.<br /> (Or your codes will be missing)</div>}
                {currentLang == 'block' ? <BlockEditor />
                : <AceEditor
                selectedCodeId={selectedCodeId}
                style={CodeEditorStyle}
                id="editor"
                mode={currentLang && modeName[currentLang]}
                theme="ambiance"
                name="code-editor"
                fontSize="14px"
                value={selectedCode || defaultCodes[currentLang]}
                onChange={(value) => setSelectedCode(value)}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: false }}
                marginBottom="4%"
            />}
                <div style={{ color: "white" }}>
                    {isJudging ? (
                        <div>
                            <div>{judgeMessage}</div>
                            <progress value={judgeProgress} max="100" />
                        </div>
                    ) : (
                        <>
                            
                            {judgeResult && (
                                <div>
                                    <table style={{width:"20%", float:"right", marginRight:"4%"}}>
                                    <tbody>
                                        <tr>
                                            <td colSpan="2">Judge Result</td>
                                        </tr>
                                        <tr>
                                            <td>Score(local)</td>
                                            <td> {score}</td>
                                        </tr>
                                        <tr>
                                        <td>Score</td>
                                        <td>{judgeResult.score}</td>
                                        </tr>
                                        <tr>
                                        <td>Time</td>
                                        <td>{judgeResult.time}ms</td>
                                        </tr>
                                        <tr>
                                        <td>Fuel</td>
                                        <td>{judgeResult.fuel}L</td>
                                        </tr>
                                        <tr>
                                        <td>Bytes</td>
                                        <td>{judgeResult.bytes}Bytes</td>
                                        </tr>
                                        <tr>
                                        <td>Angle</td>
                                        <td>{judgeResult.angle}°</td>
                                        </tr>
                                        <tr>
                                        <td>Velocity X</td>
                                        <td>{judgeResult.velX}</td>
                                        </tr>
                                        <tr>
                                        <td>Velocity Y</td>
                                        <td>{judgeResult.velY}</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                                )}
                        </>
                    )}
                </div>
                {animationRunning && <GameCanvas 
                                        className="GameCanvas" 
                                        size={[600, 800]} 
                                        language={currentLang} 
                                        code={currentLang == 'block' ? getEncodedCode(selectedCode) : selectedCode} 
                                        problem={selectedProblem} 
                                        endAnimation={endGame} 
                                        setScore={setScore}
                                          />}

            </div>
        </div>
    );
}
