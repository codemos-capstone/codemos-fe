import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Game.css"
import Docs from "./Docs";

import AceEditor from "react-ace-builds";
import "react-ace-builds/webpack-resolver-min";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-ambiance';

import { animate, clampedProgress, generateCanvas, randomBetween, seededRandomBetween, seededRandomBool, transition } from "utils/helpers/helpers.js";
import { makeLander } from "utils/lander/lander.js";
//import { makeToyLander } from "utils/lander/toylander.js";
import { makeStarfield } from "utils/starfield.js";
import { makeControls } from "utils/lander/controls.js";
import { makeTerrain } from "utils/terrain.js";
import { showStatsAndResetControl } from "utils/stats.js";
//import { manageInstructions } from "utils/instructions.js";
//import { makeAudioManager } from "utils/helpers/audio.js";
import { makeConfetti } from "utils/lander/confetti.js";
import { makeTallyManger } from "utils/tally.js";
import { makeAsteroid } from "utils/asteroids.js";
import { makeSpaceAsteroid } from "utils/spaceAsteroids.js";
import { makeChallengeManager } from "utils/challenge.js";
import { makeSeededRandom } from "utils/helpers/seededrandom.js";
import { makeBonusPointsManager } from "utils/bonuspoints.js";
import { makeTheme } from "utils/theme.js";
import { TRANSITION_TO_SPACE, VELOCITY_MULTIPLIER } from "utils/helpers/constants.js";
import { landingScoreDescription, crashScoreDescription, destroyedDescription } from "utils/helpers/scoring.js";

import LoginBtn from "components/Buttons/LoginBtn";

let _lander;
let appState;
let canvasWidth;
let canvasHeight;

function MainBtn({  }){
    const navigate = useNavigate();
    return <button btntype={"main"} className='home-btn' onClick={
        ()=>{
            navigate("/");
            //window.cancelAnimationFrame(animationID);
        }
    }>Home</button>
};


export default function Game({ isLogin }){
    const [code, setCode] = useState('// TODO: ');
    const onChange = (value) => {setCode(value);};

    const canvasRef = useRef(null);
    let scale = window.devicePixelRatio;
    let height = 500; //window.innerHeight;
    let width = 500; //window.innerWidth;

    const applyCodeHandler = () => {
        applyCode(code);
        setSaveCode(code);
        saveCode(code);
    }
    
    
    const loadCode = () => {
        const code = localStorage.getItem("myCodemosCode");
        if (code) {
            setCode(code);
        } else {
            setCode("// TODO: ");
        }
    }

    const apply = () => {
        console.log("apply")
        console.log(code)
        const lander = _lander;
        const initState = {
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
        
            startTime: Date.now(),
            usedfuel: 0,
            GRAVITY: 0.004,
            ROCKET_WIDTH: 20,
            ROCKET_HEIGHT: 40
        };
        const logs = [initState]
        const didLand = lander.updateIterator(code, logs);
        lander.newDraw(logs, didLand);
    }

    useEffect(()=>{
        const canvasElement = canvasRef.current;
        if ( canvasElement ){
            const CTX = canvasElement.getContext('2d');
    
            canvasElement.width = Math.floor(width * scale);
            canvasElement.height = Math.floor(height * scale);
            
            height = 500; // window.innerHeight;
            width = 500; //window.innerWidth;
            scale = window.devicePixelRatio;
            const scaleFactor = scale;
            canvasHeight = height;
            canvasWidth = width;
            CTX.scale(scale, scale);


            //---------------------------------

            //const audioManager = makeAudioManager();

            const challengeManager = makeChallengeManager();
            const seededRandom = makeSeededRandom();

            appState = new Map()
                .set("CTX", CTX)
                .set("canvasWidth", canvasWidth)
                .set("canvasHeight", canvasHeight)
                .set("canvasElement", canvasElement)
                .set("scaleFactor", scaleFactor)
                //.set("audioManager", audioManager)
                .set("challengeManager", challengeManager)
                .set("seededRandom", seededRandom);

            const theme = makeTheme(appState);
            appState.set("theme", theme);

            const terrain = makeTerrain(appState);
            appState.set("terrain", terrain);

            const bonusPointsManager = makeBonusPointsManager(appState);
            appState.set("bonusPointsManager", bonusPointsManager);

            const stars = makeStarfield(appState);
            appState.set("stars", stars);
            const lander = makeLander(appState);
            _lander = lander
            const landerControls = makeControls(appState, lander);
            const tally = makeTallyManger();

            let sendAsteroid = seededRandomBool(seededRandom);
            let asteroidCountdown = seededRandomBetween(2000, 15000, seededRandom);
            let asteroids = [makeAsteroid(appState, lander.getPosition, onAsteroidImpact)];
            let spaceAsteroids = [];
            let randomConfetti = [];

            let gameEnded = false;

            landerControls.attachEventListeners();
            challengeManager.populateCornerInfo();
            terrain.setShowLandingSurfaces();

            // MAIN ANIMATION LOOP

            /*const animationObject = animate((timeSinceStart, deltaTime) => {
                CTX.fillStyle = theme.backgroundGradient;
                CTX.fillRect(0, 0, canvasWidth, canvasHeight);

                // Move stars in parallax as lander flies high
                stars.draw(lander.getVelocity());

                // Move terrain as lander flies high
                CTX.save();
                CTX.translate(0, transition(0, terrain.getLandingData().terrainHeight, clampedProgress(TRANSITION_TO_SPACE, 0, lander.getPosition().y)));
                terrain.draw();
                CTX.restore();

                // if (instructions.hasClosedInstructions()) {
                    //landerControls.drawTouchOverlay();

                    bonusPointsManager.draw(lander.getPosition().y < TRANSITION_TO_SPACE);

                    // Generate and draw space asteroids
                    // if (lander.getPosition().y < -canvasHeight * 2) {
                    //     // The chance that an asteroid will be sent is determined by the screen
                    //     // width. This means that the density of asteroids will be similar across
                    //     // phones and wider desktop screens. On a 14" MacBook the chance of an
                    //     // asteroid being sent in any given frame is ~1 in 50; on an iPhone 14
                    //     // it's ~1 in 200, or 1/4 the chance for a screen ~1/4 the width.
                    //     if (!gameEnded && Math.round(randomBetween(0, 100 / (canvasWidth / 800))) === 0) {
                    //         spaceAsteroids.push(makeSpaceAsteroid(appState, lander.getVelocity, lander.getDisplayPosition, onAsteroidImpact));
                    //     }

                    //     //spaceAsteroids.forEach((a) => a.draw(deltaTime));
                    // }

                    // // Move asteroids as lander flies high
                    // CTX.save();
                    // CTX.translate(0, transition(0, terrain.getLandingData().terrainHeight, clampedProgress(TRANSITION_TO_SPACE, 0, lander.getPosition().y)));
                    // if (sendAsteroid && timeSinceStart > asteroidCountdown) {
                    //     //asteroids.forEach((a) => a.draw(deltaTime));
                    // }
                    // CTX.restore();

                    if (randomConfetti.length > 0) {
                        randomConfetti.forEach((c) => c.draw(deltaTime));
                    }

                    lander.draw(timeSinceStart, deltaTime);
                // } else {
                //     toyLander.draw(deltaTime);

                //     toyLanderControls.drawTouchOverlay();
                // }
            });
            animationID = animationObject.animationID;

            // PASSED FUNCTIONS

            function onCloseInstructions() {
                toyLanderControls.detachEventListeners();
                landerControls.attachEventListeners();
                challengeManager.populateCornerInfo();
                terrain.setShowLandingSurfaces();
            }*/

            function onGameEnd(data) {
                gameEnded = true;
                landerControls.detachEventListeners();
                bonusPointsManager.hide();

                const finalScore = data.landerScore + bonusPointsManager.getTotalPoints();
                const scoreDescription = data.landed ? landingScoreDescription(finalScore) : data.struckByAsteroid ? destroyedDescription() : crashScoreDescription(finalScore);
                const scoreForDisplay = Intl.NumberFormat().format(finalScore.toFixed(1));

                showStatsAndResetControl(appState, lander, animationObject, { ...data, scoreDescription, scoreForDisplay }, landerControls.getHasKeyboard(), onResetGame);

                if (data.landed) {
                    //audioManager.playLanding();
                    tally.storeLanding();
                } else {
                    //audioManager.playCrash();
                    tally.storeCrash();
                }

                tally.updateDisplay();
            }

            function onResetGame() {
                gameEnded = false;
                lander.resetProps(); // added, replay시 리셋
                landerControls.attachEventListeners();
                seededRandom.setDailyChallengeSeed();
                randomConfetti = [];
                terrain.reGenerate();
                stars.reGenerate();
                sendAsteroid = seededRandomBool(seededRandom);
                asteroidCountdown = seededRandomBetween(2000, 15000, seededRandom);
                asteroids = [makeAsteroid(appState, lander.getPosition, onAsteroidImpact)];
                spaceAsteroids = [];
                bonusPointsManager.reset();
            }
            
            function onAsteroidImpact(asteroidVelocity) {
                console.log("destroyed!")
                lander.destroy(asteroidVelocity);
            }
        }
    }, [])

    return(
        <div className="container">
            <LoginBtn isLogin={isLogin}/>
        
            <canvas ref={ canvasRef } style={{width: `${width}px`, height: `${height}px`}}></canvas>
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
            {/*<div id="instructions" className="fullSizeContainer instructions">
                <div>
                    <h1>CodeMos</h1>
                    <p>착륙 알고리즘을 작성해 착륙 지점에 우주선을 안전하게 착륙시켜야 합니다</p>
                </div>
                <div className="instructionsControls" style={{color: "#fff"}}>
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
            /div>*/}
            {/*} <div id="cornerChallenge" className="topLeftCorner show">Daily Challenge <span id="cornerChallengeNumber"></span></div> */}

            <div id="drag-handle"></div>

            {/* 코드 에디터 */}
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
            <button className="apply-btn" onClick={apply}>Apply</button>
            <button className="logout-btn" style={{ display: 'none' }}>Logout</button> {/**onClick={logout} */}
            <MainBtn />

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

let _code;

function setSaveCode(code) {
    _code = code;
}

window.setSaveCode = setSaveCode;

//****************** 서버가 던진거 받아서 초기화 ㄱㄱ ******************* */

// #2

let _allowGetVelocityX = true;
let _allowGetVelocityY = true;
let _allowGetAngle = true;
let _allowGetHeight = true;
let _allowGetRotationVelocity = true;
let _allowEngineOn = true;
let _allowEngineOff = true;
let _allowRotateLeft = true;
let _allowStopLeftRotation = true;
let _allowRotateRight = true;
let _allowStopRightRotation = true;

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