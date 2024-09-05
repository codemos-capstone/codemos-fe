import React, { useState, useEffect } from "react";
import AceEditor from "react-ace-builds";
//import BlockEditor from "blockCoding/BlockEditor";
import FileBtn from "../../Buttons/FileBtn";
import Docs from "views/Docs";
import ReactMarkdown from "react-markdown";
import GameCanvas from "components/GameCanvas";
import axios from "axios";

import "./Code.css";
import "react-ace-builds/webpack-resolver-min";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-ambiance";

export default function Code({ selectedCode, selectedProblem, isDocsVisible, codeRun, endGame, setSelectedCode }) {
    console.log(selectedCode);
    const CodeEditorStyle = {
        width: "95%",
        height: "10%", // 초기 높이를 20%로 설정
        maxHeight: "fit-content", // 최대 높이를 내용에 맞추어 조정
        border: "5px solid #3D3D3D",
        borderTop: "20px solid #3D3D3D",
    };
    const toggleDocs = () => {
        setIsDocsVisible(!isDocsVisible);
    };
    const [score, setScore] = useState(null);
    const [isJudging, setIsJudging] = useState(false);
    const [judgeResult, setJudgeResult] = useState(null);
    const [judgeProgress, setJudgeProgress] = useState(0);
    const [judgeMessage, setJudgeMessage] = useState("");
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    useEffect(() => {
        if (codeRun && selectedProblem) {
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
                    setScore(response.data.score);
                } catch (error) {
                    console.error("Error judging:", error);
                }
                setIsJudging(false);
            };
            judgeCode();
        }
    }, [codeRun, selectedProblem, selectedCode]);

    console.log(isDocsVisible);
    return (
        <div className="code">
            <div style={{ width: "100%", height: "25px", backgroundColor: "black", display: "flex", justifyContent: "flex-start" }}>
                <FileBtn />
                <FileBtn />
                <FileBtn />
                <FileBtn />
            </div>
            <div className="code-container">
                <div className={`docs ${isDocsVisible ? "docs-visible" : ""}`}>
                    <Docs />
                </div>
                {selectedProblem ? (
                    <>
                        <div className="problems">
                            <h2>
                                {selectedProblem.problemNumber} : {selectedProblem.title}
                            </h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Time Limit</th>
                                        <th>Fuel Limit</th>
                                        <th>Initial Position(x, y)</th>
                                        <th>Initial Velocity(x, y)</th>
                                        <th>Initial Rotation Velocity</th>
                                        <th>Initial Angle(deg)</th>
                                    </tr>
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
                        </div>
                    </>
                ) : (
                    <div></div>
                    //선택 안하면 아무것도 없음
                )}
                <AceEditor
                    style={CodeEditorStyle}
                    id="editor"
                    mode="javascript"
                    theme="ambiance"
                    name="code-editor"
                    fontSize="14px"
                    value={selectedCode}
                    onChange={(value) => setSelectedCode(value)}
                    showPrintMargin={false}
                    height="fit-content"
                    editorProps={{ $blockScrolling: false }}
                />
                <div style={{ color: "white" }}>
                    {isJudging ? (
                        <div>
                            <div>{judgeMessage}</div>
                            <progress value={judgeProgress} max="100" />
                        </div>
                    ) : (
                        <>
                            <span>Score(local): {score}</span>
                            {judgeResult && (
                                <div>
                                    <div>[Judge Result]</div>
                                    <div>Score: {judgeResult.score}</div>
                                    <div>Time: {judgeResult.time}ms</div>
                                    <div>Fuel: {judgeResult.fuel}L</div>
                                    <div>Bytes: {judgeResult.bytes}Bytes</div>
                                    <div>Angle: {judgeResult.angle}°</div>
                                    <div>Velocity X: {judgeResult.velX}</div>
                                    <div>Velocity Y: {judgeResult.velY}</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {codeRun && <GameCanvas className="GameCanvas" size={[600, 800]} code={selectedCode} problem={selectedProblem} endAnimation={endGame} setScore={setScore}></GameCanvas>}
            </div>
        </div>
    );
}
