import React, { useEffect, useRef, useState } from "react";
import "./Game.css"
import Docs from "./Docs";
import GameCanvas from "components/GameCanvas";
import MainBtn from "components/Buttons/MainBtn";

import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-ambiance';

import LoginBtn from "components/Buttons/LoginBtn";

export default function Game({ isLogin }){
    const [code, setCode] = useState('// TODO: ');
    const onChange = (value) => {setCode(value);};

    let canvasWidth = 500;
    let canvasHeight = 500; 
    const [showCanvas, setShowCanvas] = useState(false);
    const initRocket = {
        position: { x: canvasWidth / 2, y: canvasHeight / 2 },
        displayPosition: { x: canvasWidth / 2, y: canvasHeight / 2 },
        velocity: { x: 0, y: 0 },
        rotationVelocity: 0,
        angle: 0,
        engineOn: false,
        rotatingLeft: false,
        rotatingRight: false,
    
        timeSinceStart: 0,
        lastRotation: 1,
        lastRotationAngle: Math.PI * 2,
        rotationCount: 0,
        maxVelocity: { x: 0, y: 0 },
        velocityMilestone: { x: 0, y: 0 },
        heightMilestone: 0,
        usedfuel: 0,
    };
    const constants = {
        STARTTIME: Date.now(),
        THRUST: 0.01,
        RTHRUST: 0.01,
        GRAVITY: 0.004,
        ROCKET_WIDTH: 20,
        ROCKET_HEIGHT: 40,
        FUELLIMIT : 100,
        TIMELIMIT : 2000,
    }
    const allowed = {
        getVelocityX : true,
        getVelocityY : true,
        getAngle : true,
        getHeight : true,
        getRotationVelocity : true,
        engineOn : true,
        engineOff : true,
        rotateLeft : true,
        stopLeftRotation : true,
        rotateRight : true,
        stopRightRotation : true
    }
    const initState = [initRocket, constants, allowed]
    
    const loadCode = () => {
        const code = localStorage.getItem("myCodemosCode");
        if (code) {
            setCode(code);
        } else {
            setCode("// TODO: ");
        }
    }

    return(
        <div className="container">
            <LoginBtn isLogin={isLogin}/>
            {showCanvas &&
                <GameCanvas size={[canvasHeight, canvasWidth]} code={code} initState={initState} animationEnded = {() => setShowCanvas(false)} />
            }
            <div id="endGameStats" className="fullSizeContainer">
                <h1 id="description"></h1>
                <div className="scoreContainer"><span id="score"></span> point <span id="type"></span></div>
                <div className="meterAndLabel">
                    <div className="label">Speed</div>
                    <div className="meter" data-stat-name="speed">
                        <div className="cursor" data-percent-position=""><span data-value=""></span><span className="unit">&nbsp;MPH</span></div>
                    </div>
                </div>
                <div className="meterAndLabel">
                    <div className="label">Angle</div>
                    <div className="meter" data-stat-name="angle">
                        <div className="cursor" data-percent-position=""><span data-value=""></span> <span className="unit">&#176;</span></div>
                    </div>
                </div>
                <div className="statsTable">
                    <div className="tableRow">
                        <span className="tableLabel">Time</span>
                        <span className="tableValue"><span id="duration"></span> seconds</span>
                    </div>
                    <div className="tableRow">
                        <span className="tableLabel">Flips</span>
                        <span className="tableValue" id="rotations"></span>
                    </div>
                    <div className="tableRow">
                        <span className="tableLabel">Max Speed</span>
                        <span className="tableValue"><span id="maxSpeed"></span> MPH</span>
                    </div>
                    <div className="tableRow">
                        <span className="tableLabel">Max Height</span>
                        <span className="tableValue"><span id="maxHeight"></span> FT</span>
                    </div>
                </div>
                <div className="buttonContainer">
                    <div className="button loading" id="tryAgain">
                        <span id="tryAgainText">Play Again</span>
                        <svg className="buttonAnimatedBorder">
                            <rect width="100%" height="100%"></rect>
                        </svg>
                    </div>
                    <div className="button" id="share">
                        <span>Leaderboard</span>
                        <svg className="buttonBorder">
                            <rect width="100%" height="100%"></rect>
                        </svg>
                    </div>
                    <div className="button" id="copyText">
                        <span>Leaderboard</span>
                        <svg className="buttonBorder">
                            <rect width="100%" height="100%"></rect>
                        </svg>
                    </div>
                </div>
            </div>

            <div id="drag-handle"></div>

            <div id="editorWrap" style={{visibility: "hidden"}}>
                <AceEditor
                    id="editor"
                    mode="javascript"
                    theme="ambiance"
                    onChange={onChange}
                    value={code}
                    name="code-editor"
                    editorProps={{ $blockScrolling: true }}
                />
            </div>

            <div id="docs" style={{visibility: 'hidden', overflowY: "auto"}}>
                <Docs />
            </div>

            <button className="docs-btn" onClick={apiDocsToggle}>Docs</button>
            <button className="code-btn" onClick={toggleVisibility}>Code</button>
            <button className="apply-btn" onClick={() => {setShowCanvas(true)}}>Apply</button>
            <button className="logout-btn" style={{ display: 'none' }}>Logout</button> {/**onClick={logout} */}
            <MainBtn btnType = 'main' />

            {/*} <div id="tally" className="topRightCorner">L<span id="landingTotal"></span> C<span id="crashTotal"></span></div> */}
        </div>
    )
}

function toggleVisibility() {
    var editor = document.getElementById("editorWrap");
    var handle = document.getElementById("drag-handle");
    if (editor.style.visibility === "hidden") {
        editor.style.visibility = "visible";
        checkHandleVisibility();
    } else {
        editor.style.visibility = "hidden";
        checkHandleVisibility();
    }
}

function apiDocsToggle() {
    var docs = document.getElementById("docs");
    var handle = document.getElementById("drag-handle");
    if (docs.style.visibility === "hidden") {
        docs.style.visibility = "visible";
        checkHandleVisibility();
    } else {
        docs.style.visibility = "hidden";
        checkHandleVisibility();
    }
}

function checkHandleVisibility() {
    var editorC = document.getElementById("editorWrap");
    var docs = document.getElementById("docs");
    var handle = document.getElementById("drag-handle");

    if (editorC.style.visibility === "visible" || docs.style.visibility === "visible") {
        handle.style.visibility = "visible";
    } else {
        handle.style.visibility = "hidden";
    }
}

// #2

//************************************************************** */
function logging() {
    console.log(
        "getVelocityX()        : " +
            getVelocityX() +
            "\ngetVelocityY()        : " +
            getVelocityY() +
            "\ngetAngle()            : " +
            getAngle() +
            "\ngetHeight()           : " +
            getHeight() +
            "\ngetRotationVelocity() : " +
            getRotationVelocity()
    );
}

function removeComment(code) {
    return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
}

function detectMaliciousCode(code) {
    const maliciousPatterns = [
      /setInterval\s*\(/,
      /setTimeout\s*\(/,
      /requestAnimationFrame\s*\(/,
      /process\.nextTick\s*\(/,
      /setImmediate\s*\(/,
      /eval\s*\(/,
      /new\s+Function\s*\(/,
      /process\.(exit|env)/,
      /require\s*\(/,
      /global\./,
      /window\./,
      /fetch\s*\(/,
      /new\s+XMLHttpRequest\s*\(/,
    ];
  
    for (const pattern of maliciousPatterns) {
      if (pattern.test(code)) {
        return true;
      }
    }
  
    return false;
  }
var isFirst = true;

// 금지 함수

const setInterval = {};
const setTimeout = {};
const requestAnimationFrame = {};
const setImmediate = {};

var afterApply = false;
export function applyCode(userCode) {
    afterApply = true;
    // console.log(userCode);
    var code = removeComment(userCode); 

    // if (!isFirst) clearInterval(newInterval);
    (function() {
        if (!detectMaliciousCode(code)) {
            try {
                eval(code);
            } catch (error) {
                //process.send({ type: 'error', error: error.message });process.exit()
            }
            // newInterval = setInterval(() => {
            //     _mainLoop();
            // }, 1);
        } else {
            //process.send({ type: 'error', error: "사용 금지 메서드 사용" });process.exit()
            // console.log("사용자 정의 비동기 루프 사용 금지, _mainLoop만 사용.");
        }
    })();
    isFirst = false;
}
window.applyCode = applyCode;

function saveCode(code) {
    localStorage.setItem("myCodemosCode", code);
    console.log("코드가 저장되었습니다.");
}

/*
document.addEventListener("DOMContentLoaded", function () {
    var handle = document.getElementById("drag-handle");
    var docs = document.getElementById("docs");
    var editorC = document.getElementById("editorWrap");
    var isResizing = false;
    loadCode();
    handle.addEventListener("mousedown", function (e) {
        isResizing = true;
        e.preventDefault();
    });

    var currentPath = window.location.pathname;
    history.replaceState(null, null, currentPath.replace(".html", ""));
    document.addEventListener("mousemove", function (e) {
        if (!isResizing) return;
        var offsetRight = document.body.offsetWidth - e.pageX;
        var offsetLeft = e.pageX;

        handle.style.left = offsetLeft - 50 + "px";
        docs.style.right = offsetRight + "px";
        editorC.style.left = offsetLeft + "px";
    });

    document.addEventListener("mouseup", function (e) {
        isResizing = false;
    });
    var printMargin = document.querySelector(".ace_print-margin");
    if (printMargin) {
        printMargin.style.visibility = "hidden";
    }
});*/