import React from "react";
import "./Game.css"

//import "utils/tempindex"
//import "utils/func"
import MainBtn from "components/Buttons/MainBtn";
import LoginBtn from "components/Buttons/LoginBtn";

export default function Game({setPage, isLogin}){
    return(
        <div className="container">
            <LoginBtn isLogin={isLogin}/>
        
            {/*<div className="game-window"></div>*/}
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
            <div id="instructions" className="fullSizeContainer instructions">
                <div>
                    <h1>CodeMos</h1>
                    <p>착륙 알고리즘을 작성해 착륙 지점에 우주선을 안전하게 착륙시켜야 합니다</p>
                </div>
                <div className="instructionsControls">
                    <h2>키보드 방향키로 API 함수 테스트</h2>
                    <div id="forKeyboard">
                        <ul>
                            <li id="engineCheck"><input type="checkbox" /> 위쪽 방향키(주 엔진), engineOn()</li>
                            <li id="rightRotationCheck"><input type="checkbox" />왼쪽 방향키(오른쪽 추진체), rotateLeft()</li>
                            <li id="leftRotationCheck"><input type="checkbox" />오른쪽 방향키(왼쪽 추진체), rotateRight()</li>
                            <li id="engineAndRotationCheck"><input type="checkbox" /> 방향키 동시에 누르기, 모든 함수는 동시에 호출될 수 있습니다.</li>
                        </ul>
                    </div>
                    <div id="forTouch">
                        <ul>
                            <li id="engineCheck"><input type="checkbox" /> Tap the center of the screen</li>
                            <li id="rightRotationCheck"><input type="checkbox" /> Tap the left side</li>
                            <li id="leftRotationCheck"><input type="checkbox" /> Tap the right side</li>
                            <li id="engineAndRotationCheck"><input type="checkbox" /> Hold down on the center while you tap the sides</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/*} <div id="cornerChallenge" className="topLeftCorner show">Daily Challenge <span id="cornerChallengeNumber"></span></div> */}

            <div id="drag-handle"></div>

            {/* 코드 에디터 */}
            <div id="editorWrap" style={{visibility: 'hidden'}}>
                <div id="editor"></div>
            </div>

            <div id="docs" style={{visibility: 'hidden'}}>
                <iframe src="docs.html" width="100%" height="100%"></iframe>
            </div>

            {/*<script src="/ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
            <script src="index.js" type="module"></script>
            <script src="func.js" type="module"></script>
            <script>
                원래 코드들 있던 자리
            </script>*/}

            <button className="docs-btn">Docs</button> {/** onClick="apiDocsToggle()" */}
            <button className="code-btn">Code</button> {/** onClick="toggleVisibility()" */}
            <button className="apply-btn">Apply</button> {/** onClick="applyCodeHandler()" */}
            <button className="logout-btn" style={{display: 'none'}}>Logout</button> {/** onClick="logout()" */}
            <MainBtn btnType='main' />

            {/*} <div id="tally" className="topRightCorner">L<span id="landingTotal"></span> C<span id="crashTotal"></span></div> */}
        </div>
    )
}
/*
var editor = ace.edit("editor");
editor.setTheme("ace/theme/ambiance");
editor.session.setMode("ace/mode/javascript");

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
});

function applyCodeHandler() {
    var code = editor.getValue();
    applyCode(code);
    setSaveCode(code);
    saveCode(code);
}

function saveCode(code) {
    localStorage.setItem("myCodemosCode", code);
    console.log("코드가 저장되었습니다.");
}

function loadCode() {
    var code = localStorage.getItem("myCodemosCode");
    var editorElement = document.getElementById("editor");
    if (code) {
        editor.setValue(code);
    } else {
        editor.setValue("// TODO: \nnewInterval = setInterval(() => {\n    // TODO: \n}, 1);\n// TODO:");
    }
}*/