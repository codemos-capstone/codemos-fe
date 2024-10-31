import { randomBetween, seededRandomBetween, randomBool, getVectorVelocity, velocityInMPS, velocityInMPS_s, getAngleDeltaUpright, getAngleDeltaUprightWithSign, heightInMeter, percentProgr, heightInMeteress } from "../helpers/helpers.js";
import { scoreLanding, scoreCrash } from "../helpers/scoring.js";
import { CRASH_VELOCITY, CRASH_ANGLE, LAND_MAX_FRAME, TRANSITION_TO_SPACE } from "../helpers/constants.js";
import { drawTrajectory } from "./trajectory.js";
import { transition, clampedProgress, easeInOutSine } from "../helpers/helpers.js";
import { makeImageExplosion, makeLanderExplosion } from "./explosion.js";
import { makeConfetti } from "./confetti.js";

export const makeLander = (state, setting, endAnimation) => {
    const CTX = state.get("CTX");
    const canvasWidth = state.get("canvasWidth");
    const canvasHeight = state.get("canvasHeight");
    //const audioManager = null;

    const constants = setting[0];
    const allowed = setting[1]

    // Use grounded height to approximate distance from ground
    const _landingData = state.get("terrain").getLandingData();
    const _groundedHeight = _landingData.terrainAvgHeight - constants.ROCKET_HEIGHT / 2;

    const drawHUD = (rocket) => {
        const textWidth = CTX.measureText("100.0 m/s").width + 2;
        const xPosBasis = Math.abs(rocket.velocity.x) > 6 ? canvasWidth / 2 - textWidth / 2 : Math.min(rocket.position.x + constants.ROCKET_WIDTH * 2, canvasWidth - textWidth);
        const yPosBasis = Math.max(rocket.position.y, TRANSITION_TO_SPACE);
        const lineHeight = 14;
        const rotatingLeft = rocket.rotationVelocity < 0;
        const speedColor = getVectorVelocity(rocket.velocity) > CRASH_VELOCITY ? "rgb(255, 0, 0)" : "rgb(0, 255, 0)";
        const angleColor = getAngleDeltaUpright(rocket.angle) > CRASH_ANGLE ? "rgb(255, 0, 0)" : "rgb(0, 255, 0)";

        // Draw HUD text
        CTX.save();
        CTX.font = "400 10px -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillStyle = speedColor;
        CTX.fillText(`${velocityInMPS(rocket.velocity)} m/s`, xPosBasis, yPosBasis - lineHeight);
        CTX.fillStyle = angleColor;
        CTX.fillText(`${getAngleDeltaUprightWithSign(rocket.angle).toFixed(1)}°`, xPosBasis, yPosBasis);
        CTX.fillStyle = state.get("theme").infoFontColor;
        CTX.fillText(`${heightInMeter(rocket.position.y, _groundedHeight)} Meter`, xPosBasis, yPosBasis + lineHeight);
        CTX.restore();

        // Draw hud rotation direction arrow
        const arrowHeight = 7;
        const arrowWidth = 6;
        const arrowTextMargin = 3;
        const arrowVerticalOffset = -3;
        if (rotatingLeft) {
            CTX.save();
            CTX.strokeStyle = angleColor;
            CTX.beginPath();
            CTX.moveTo(xPosBasis - arrowWidth - arrowTextMargin, yPosBasis + arrowVerticalOffset);
            CTX.lineTo(xPosBasis - arrowTextMargin, yPosBasis + arrowVerticalOffset - arrowHeight / 2);
            CTX.lineTo(xPosBasis - arrowTextMargin, yPosBasis + arrowVerticalOffset + arrowHeight / 2);
            CTX.closePath();
            CTX.stroke();
            CTX.restore();
        } else {
            CTX.save();
            CTX.strokeStyle = angleColor;
            CTX.beginPath();
            CTX.moveTo(xPosBasis - arrowWidth - arrowTextMargin, yPosBasis + arrowVerticalOffset - arrowHeight / 2);
            CTX.lineTo(xPosBasis - arrowTextMargin, yPosBasis + arrowVerticalOffset);
            CTX.lineTo(xPosBasis - arrowWidth - arrowTextMargin, yPosBasis + arrowVerticalOffset + arrowHeight / 2);
            CTX.closePath();
            CTX.stroke();
            CTX.restore();
        }
    };

    const drawBottomHUD = (rocket) => {
        const yPadding = constants.ROCKET_HEIGHT;
        const xPadding = constants.ROCKET_HEIGHT;

        const secondsUntilTerrain = rocket.velocity.y > 0 ? Math.abs(Math.round((rocket.position.y - canvasHeight + (canvasHeight - _landingData.terrainAvgHeight)) / rocket.velocity.y / 100)) : 99;

        CTX.save();

        CTX.fillStyle = state.get("theme").infoFontColor;
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.textAlign = "left";
        CTX.fillText(`${velocityInMPS(rocket.velocity)}`, xPadding, canvasHeight - yPadding - 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("m/s", xPadding, canvasHeight - yPadding);

        CTX.textAlign = "right";
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText(`${heightInMeter(rocket.position.y, _groundedHeight)}`, canvasWidth - xPadding, canvasHeight - yPadding - 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("Meter", canvasWidth - xPadding, canvasHeight - yPadding);

        if (secondsUntilTerrain < 15) {
            // CTX.fillStyle = "rgb(255, 0, 0)";
            // CTX.textAlign = "center";
            // CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
            // CTX.fillText(Intl.NumberFormat().format(secondsUntilTerrain), canvasWidth / 2, canvasHeight - yPadding);
            // CTX.letterSpacing = "1px";
            // CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
            // CTX.fillText("SECONDS UNTIL TERRAIN", canvasWidth / 2, canvasHeight - yPadding + 24);
        }

        CTX.restore();
    };


    const drawTopHUD = (rocket) => {
        const yPadding = constants.ROCKET_HEIGHT;
        const xPadding = constants.ROCKET_HEIGHT;

        const secondsUntilTerrain = rocket.velocity.y > 0 ? Math.abs(Math.round((rocket.position.y - canvasHeight + (canvasHeight - _landingData.terrainAvgHeight)) / rocket.velocity.y / 100)) : 99;

        CTX.save();

        CTX.fillStyle = state.get("theme").infoFontColor;
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.textAlign = "left";
        CTX.fillText(`${rocket.timeSinceStart}`, xPadding, yPadding + 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("Time(ms)", xPadding, yPadding);

        CTX.textAlign = "right";
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText(`${rocket.usedfuel.toFixed(1)}`, canvasWidth - xPadding, yPadding + 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("Fuel(L)", canvasWidth - xPadding, yPadding);

        if (secondsUntilTerrain < 15) {
            // CTX.fillStyle = "rgb(255, 0, 0)";
            // CTX.textAlign = "center";
            // CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
            // CTX.fillText(Intl.NumberFormat().format(secondsUntilTerrain), canvasWidth / 2, canvasHeight - yPadding);
            // CTX.letterSpacing = "1px";
            // CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
            // CTX.fillText("SECONDS UNTIL TERRAIN", canvasWidth / 2, canvasHeight - yPadding + 24);
        }

        CTX.restore();
    };

    const jsUpdateIterator = (code, logs) => {
        const rocket = deepCopy(logs[0]);

        const getFuel = () => {
            if (allowed.getFuel) {
                return constants.FUELLIMIT - rocket.usedfuel;
            }
            else {
                throw new TypeError("getFuel is not a function")
            }
        };
        const getTimeLeft = () => {
            if (allowed.getTimeLeft) {
                return constants.TIMELIMIT - rocket.timeSinceStart;
            }
            else {
                throw new TypeError("getTimeLeft is not a function")
            }
        };
        const getX = () => {
            if (allowed.getX) {
                return rocket.position.x / canvasWidth;
            }
            else {
                throw new TypeError("getX is not a function")
            }
        };
        const getY = () => {
            if (allowed.getY) {
                return 1 - rocket.position.y / canvasHeight;
            }
            else {
                throw new TypeError("getY is not a function")
            }
        };
        const getVelocityX = () => {
            if (allowed.getVelocityX) {
                return velocityInMPS_s(rocket.velocity.x);
            }
            else {
                throw new TypeError("getVelocityX is not a function")
            }
        };
        const getVelocityY = () => {
            if (allowed.getVelocityY)
                return velocityInMPS_s(rocket.velocity.y);
            else {
                throw new TypeError("getVelocityY is not a function")
            }
        };
        const getAngle = () => {
            if (allowed.getAngle)
                return rocket.angle;
            else {
                throw new TypeError("getAngle is not a function")
            }
        };
        const getHeight = () => {
            if (allowed.getHeight)
                return heightInMeter(rocket.position.y, _groundedHeight);
            else {
                throw new TypeError("getHeight is not a function")
            }
        };
        const getRotationVelocity = () => {
            if (allowed.getRotationVelocity)
                return velocityInMPS_s(rocket.rotationVelocity);
            else {
                throw new TypeError("getRotationVelocity is not a function")
            }
        };
        // Rocket functions
        const engineOn = () => {
            if (allowed.engineOn)
                rocket.engineOn = true;
            else {
                throw new TypeError("engineOn is not a function")
            }
        };
        const engineOff = () => {
            if (allowed.engineOff)
                rocket.engineOn = false;
            else {
                throw new TypeError("engineOff is not a function")
            }
        };
        const rotateLeft = () => {
            if (allowed.rotateLeft)
                rocket.rotatingLeft = true;
            else {
                throw new TypeError("rotateLeft is not a function")
            }
        };
        const rotateRight = () => {
            if (allowed.rotateRight)
                rocket.rotatingRight = true;
            else {
                throw new TypeError("rotateRight is not a function")
            }
        };
        const stopLeftRotation = () => {
            if (allowed.stopLeftRotation)
                rocket.rotatingLeft = false;
            else {
                throw new TypeError("stopLeftRotation is not a function")
            }
        };
        const stopRightRotation = () => {
            if (allowed.stopRightRotation)
                rocket.rotatingRight = false;
            else {
                throw new TypeError("stopRightRotation is not a function")
            }
        };
    
        const logging = () => {
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
    
        // prohibited functions
        const setInterval = () => { throw new TypeError("setInterval is not a function") };
        const setTimeout = () => { throw new TypeError("setTimeout is not a function") };
        const requestAnimationFrame = () => { throw new TypeError("requestAnimationFrame is not a function") };
        const setImmediate = () => { throw new TypeError("setImmediate is not a function") };
    
        let isEnd = { end: false };
    
        let _mainloop = () => { };
        try {
            eval(code);
            while (!isEnd.end) {
                _mainloop();
                isEnd = checkEnd(rocket);
                if (!isEnd.end) {
                    updateRocket(rocket)
                    logs.push(deepCopy(rocket));
                } else {
                    rocket.engineOn = false;
                    rocket.rotatingLeft = false;
                    rocket.rotatingRight = false;
                    logs.push(deepCopy(rocket));
                    // console.log("alsdkfjlkasdjlfjalsdflasdjkfjlsdjlfjksdlf" + logs.length)
                }
            }
        } catch (e) {
            console.log(e);
            return;
        };
    
        let landingState = {
            land: isEnd.land,
            ground: isEnd.ground
        }
    
        return landingState;
    };
    
    const loadPyodideInstance = async () => {
        if (!window.pyodide) {
            await new Promise((resolve, reject) => {
                const pyodideScript = document.createElement("script");
                pyodideScript.src = "https://cdn.jsdelivr.net/pyodide/v0.23.0/full/pyodide.js";
                pyodideScript.onload = resolve;
                pyodideScript.onerror = reject;
                document.head.appendChild(pyodideScript);
            });
            window.pyodide = await loadPyodide();  // Pyodide 로드
            console.log("Pyodide loaded");
        }
    };
    const pyUpdateIterator = async (code, logs) => {
        const pythonHeader = `from js import (
            getVelocityX,
            getAngle,
            getRotationVelocity,
            stopRightRotation,
            rotateLeft,
            stopLeftRotation,
            rotateRight,
            getVelocityY,
            getHeight,
            engineOn,
            engineOff,
        )
    `;
        console.log(logs[0]);
        const rocket = deepCopy(logs[0]);
        console.log("rocket:", rocket);
    
        // Pyodide 로드
        await loadPyodideInstance();
    
        // JavaScript 함수들을 Pyodide로 등록
        window.engineOn = () => {
            if (allowed.engineOn)
                rocket.engineOn = true;
            else {
                throw new TypeError("engineOn is not a function");
            }
        };
    
        window.engineOff = () => {
            if (allowed.engineOff)
                rocket.engineOn = false;
            else {
                throw new TypeError("engineOff is not a function");
            }
        };
    
        window.getVelocityX = () => {
            if (allowed.getVelocityX) {
                return velocityInMPS_s(rocket.velocity.x);
            } else {
                throw new TypeError("getVelocityX is not a function");
            }
        };
    
        window.getVelocityY = () => {
            if (allowed.getVelocityY)
                return velocityInMPS_s(rocket.velocity.y);
            else {
                throw new TypeError("getVelocityY is not a function");
            }
        };
    
        window.getAngle = () => {
            if (allowed.getAngle)
                return rocket.angle;
            else {
                throw new TypeError("getAngle is not a function");
            }
        };
    
        window.getHeight = () => {
            if (allowed.getHeight)
                return heightInMeter(rocket.position.y, _groundedHeight);
            else {
                throw new TypeError("getHeight is not a function");
            }
        };
    
        window.getRotationVelocity = () => {
            if (allowed.getRotationVelocity)
                return velocityInMPS_s(rocket.rotationVelocity);
            else {
                throw new TypeError("getRotationVelocity is not a function");
            }
        };
    
        window.rotateLeft = () => {
            if (allowed.rotateLeft)
                rocket.rotatingLeft = true;
            else {
                throw new TypeError("rotateLeft is not a function");
            }
        };
    
        window.rotateRight = () => {
            if (allowed.rotateRight)
                rocket.rotatingRight = true;
            else {
                throw new TypeError("rotateRight is not a function");
            }
        };
    
        window.stopLeftRotation = () => {
            if (allowed.stopLeftRotation)
                rocket.rotatingLeft = false;
            else {
                throw new TypeError("stopLeftRotation is not a function");
            }
        };
    
        window.stopRightRotation = () => {
            if (allowed.stopRightRotation)
                rocket.rotatingRight = false;
            else {
                throw new TypeError("stopRightRotation is not a function");
            }
        };
    
        window.logging = () => {
            console.log(
                `getVelocityX()        : ${window.getVelocityX()}\n` +
                `getVelocityY()        : ${window.getVelocityY()}\n` +
                `getAngle()            : ${window.getAngle()}\n` +
                `getHeight()           : ${window.getHeight()}\n` +
                `getRotationVelocity() : ${window.getRotationVelocity()}`
            );
        };
    
        // JavaScript에서 Python 코드 실행
        let isEnd = { end: false };
        let _mainloop = () => {};
    
        try {
            const pyodideResult = await pyodide.runPythonAsync(pythonHeader + code); // Python 코드를 Pyodide로 실행
            console.log("Python Code Execution Result:", pyodideResult);
    
            // Python 코드 내에서 mainloop 함수를 가져와서 JavaScript로 할당
            if (pyodide.globals.get("_mainloop")) {
                _mainloop = pyodide.globals.get("_mainloop");
            }
    
            while (!isEnd.end) {
                _mainloop();  // Python의 mainloop 호출
                isEnd = checkEnd(rocket);  // 착륙 성공 여부 확인
                if (!isEnd.end) {
                    updateRocket(rocket);  // 로켓 상태 업데이트
                    logs.push(deepCopy(rocket));  // 로그 기록
                } else {
                    rocket.engineOn = false;
                    rocket.rotatingLeft = false;
                    rocket.rotatingRight = false;
                    logs.push(deepCopy(rocket));
                }
            }
        } catch (e) {
            console.error('Error running Python code with Pyodide:', e);
            return;
        }
    
        let landingState = {
            land: isEnd.land,
            ground: isEnd.ground
        };
    
        return landingState;
    };
    
    
    const compileCodeAndGetWasm = async (code) => {
        const formData = new FormData();
        formData.append('code', code);
    
        try {
            const response = await fetch(process.env.REACT_APP_WASM_SERVER_ADDRESS, {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) throw new Error('Failed to compile C code');
            
            const wasmArrayBuffer = await response.arrayBuffer();  
            console.log("WASM ArrayBuffer length:", wasmArrayBuffer.byteLength)
            console.log(wasmArrayBuffer);
            return wasmArrayBuffer;
        } catch (error) {
            console.error('Error compiling C code to WASM:', error);
            throw error;
        }
    };
    const cUpdateIterator = async (code, logs) => {
        const wasmArrayBuffer = await compileCodeAndGetWasm(code);
        const rocket = deepCopy(logs[0]);
        console.log("rocket:", rocket);
        const env = {
            engineOn: () => {
                if (allowed.engineOn) rocket.engineOn = true;
                else throw new TypeError("engineOn is not a function");
            },
            engineOff: () => {
                if (allowed.engineOff) rocket.engineOn = false;
                else throw new TypeError("engineOff is not a function");
            },
            getVelocityX: () => {
                if (allowed.getVelocityX) return velocityInMPS_s(rocket.velocity.x);
                else throw new TypeError("getVelocityX is not a function");
            },
            getVelocityY: () => {
                if (allowed.getVelocityY) return velocityInMPS_s(rocket.velocity.y);
                else throw new TypeError("getVelocityY is not a function");
            },
            getAngle: () => {
                if (allowed.getAngle) return rocket.angle;
                else throw new TypeError("getAngle is not a function");
            },
            getHeight: () => {
                if (allowed.getHeight) return heightInMeter(rocket.position.y, _groundedHeight);
                else throw new TypeError("getHeight is not a function");
            },
            getRotationVelocity: () => {
                if (allowed.getRotationVelocity) return velocityInMPS_s(rocket.rotationVelocity);
                else throw new TypeError("getRotationVelocity is not a function");
            },
            rotateLeft: () => {
                if (allowed.rotateLeft) rocket.rotatingLeft = true;
                else throw new TypeError("rotateLeft is not a function");
            },
            rotateRight: () => {
                if (allowed.rotateRight) rocket.rotatingRight = true;
                else throw new TypeError("rotateRight is not a function");
            },
            stopLeftRotation: () => {
                if (allowed.stopLeftRotation) rocket.rotatingLeft = false;
                else throw new TypeError("stopLeftRotation is not a function");
            },
            stopRightRotation: () => {
                if (allowed.stopRightRotation) rocket.rotatingRight = false;
                else throw new TypeError("stopRightRotation is not a function");
            },
        };
    
        let wasmReady = false;
        let wasmModule;
        let isEnd = { end: false };
        let landingState = { land: false, ground: false };
        try {
            console.log("wasmArrayBuffer:", wasmArrayBuffer);
            console.log(wasmArrayBuffer instanceof ArrayBuffer);  
            wasmModule = await WebAssembly.instantiate(wasmArrayBuffer, { env });
            wasmReady = true; // WASM 준비 완료
            const _mainloop = wasmModule.instance.exports.main;
            //console.log("mainloop function:", _mainloop.toString());
            while(!isEnd.end){
                _mainloop();  // wasm mainloop 실행
                isEnd = checkEnd(rocket);
                if (!isEnd.end) {
                    updateRocket(rocket);
                    logs.push(deepCopy(rocket));
                } else {
                    rocket.engineOn = false;
                    rocket.rotatingLeft = false;
                    rocket.rotatingRight = false;
                    logs.push(deepCopy(rocket));
                    landingState = {
                        land: isEnd.land,
                        ground: isEnd.ground
                    };
                }
            }
        } catch (e) {
            console.error("Error running WebAssembly code:", e);
        }
    
        return landingState;
    };

    const runSimulation = (language, code, logs) => {
        try {
            if (language == 'js') {
                return jsUpdateIterator(code, logs);
            } else if (language == 'py') {
                return pyUpdateIterator(code, logs);
            } else if (language == 'c') {
                return cUpdateIterator(code, logs);
            }
        } catch (err) {
            console.error('Error running simulation:', err);
        }
    }

    function deepCopy(obj) {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return [...obj.map(deepCopy)];
        }

        const copy = {};
        for (const key in obj) {
            copy[key] = deepCopy(obj[key]);
        }
        return copy;
    };

    const checkEnd = (rocket) => {
        const landingArea = _landingData.landingSurfaces.find(({ x, width }) => rocket.position.x - constants.ROCKET_WIDTH / 2 >= x && rocket.position.x + constants.ROCKET_WIDTH / 2 <= x + width);
        const didLand = getVectorVelocity(rocket.velocity) < CRASH_VELOCITY && getAngleDeltaUpright(rocket.angle) < CRASH_ANGLE && landingArea;
        if (rocket.timeSinceStart > constants.TIMELIMIT && constants.TIMELIMIT != -1) {
            return { end: true, land: false, ground: false }
        } else if (rocket.position.y + constants.ROCKET_HEIGHT / 2 < _landingData.terrainHeight ||
            (rocket.position.y + constants.ROCKET_HEIGHT / 2 >= _landingData.terrainHeight && !CTX.isPointInPath(_landingData.terrainPath2D, rocket.position.x * state.get("scaleFactor"), (rocket.position.y + constants.ROCKET_HEIGHT / 2) * state.get("scaleFactor")))) {
            return { end: false, land: false, ground: true };
        } else if (didLand) {
            return { end: true, land: true, ground: true };
        } else {
            return { end: true, land: false, ground: true };
        }
    };

    const updateRocket = (rocket) => {
        const deltaTimeMultiplier = 1;// deltaTime / INTERVAL;
        rocket.position.y = rocket.position.y + deltaTimeMultiplier * rocket.velocity.y;
        // Update ballistic properties
        // xxx : #3
        if (rocket.rotatingRight && rocket.usedfuel < constants.FUELLIMIT && constants.FUELLIMIT != -1) { // xxx : #4
            rocket.rotationVelocity += deltaTimeMultiplier * constants.RTHRUST;
            rocket.usedfuel += deltaTimeMultiplier * constants.RTHRUST * 2; // xxx : #4
        }
        if (rocket.rotatingLeft && rocket.usedfuel < constants.FUELLIMIT && constants.FUELLIMIT != -1) { // xxx : #4
            rocket.rotationVelocity -= deltaTimeMultiplier * constants.RTHRUST;
            rocket.usedfuel += deltaTimeMultiplier * constants.RTHRUST * 2; // xxx : #4
        }
        if (rocket.position.x < 0) rocket.position.x = canvasWidth;

        if (rocket.position.x > canvasWidth) rocket.position.x = 0;

        rocket.position.x += deltaTimeMultiplier * rocket.velocity.x;
        rocket.angle += deltaTimeMultiplier * ((Math.PI / 180) * rocket.rotationVelocity);
        rocket.velocity.y += deltaTimeMultiplier * constants.GRAVITY;

        rocket.displayPosition.x = rocket.position.x;

        if (rocket.engineOn && rocket.usedfuel < constants.FUELLIMIT && constants.FUELLIMIT != -1) { // xxx : #4
            rocket.velocity.x += deltaTimeMultiplier * (constants.THRUST * Math.sin(rocket.angle));
            rocket.velocity.y -= deltaTimeMultiplier * (constants.THRUST * Math.cos(rocket.angle));
            rocket.usedfuel += deltaTimeMultiplier * constants.THRUST * 20; // xxx : #4
        }

        // console.log("fuel : " + fuel.toFixed(2) + "L & time : " + time + "ms");

        // Log new rotations
        const rotations = Math.floor(rocket.angle / (Math.PI * 2));
        if (Math.abs(rocket.angle - rocket.lastRotationAngle) > Math.PI * 2 && (rotations > rocket.lastRotation || rotations < rocket.lastRotation)) {
            rocket.rotationCount++;
            rocket.lastRotation = rotations;
            rocket.lastRotationAngle = rocket.angle;
        }

        // Log new max speed and height
        if (rocket.position.y < rocket.maxHeight) rocket.maxHeight = rocket.position.y;

        if (getVectorVelocity(rocket.velocity) > getVectorVelocity(rocket.maxVelocity)) {
            rocket.maxVelocity = { ...rocket.velocity };
        }

        if (rocket.position.y < rocket.heightMilestone + Math.min(-3500, rocket.heightMilestone * 3)) {
            rocket.heightMilestone = rocket.position.y;
        }

        if (getVectorVelocity(rocket.velocity) > getVectorVelocity(rocket.velocityMilestone) + 10) {
            rocket.velocityMilestone = { ...rocket.velocity };
        }

        rocket.displayPosition.y = rocket.position.y < TRANSITION_TO_SPACE ? TRANSITION_TO_SPACE : rocket.position.y;
        rocket.timeSinceStart += 8;
    };

    const drawLanding = (position, confetti) => {
        //draw and update effects
        confetti.draw();
    };

    const drawExploding = (isGround, explosion, clouds) => {
        //draw and update clouds
        /*if(isGround) clouds.foreach(cloud => {
            cloud.position.y = cloud.position.y + cloud.velocity.y;
            if (cloud.position.x < 0) cloud.position.x = canvasWidth;
    
            if (cloud.position.x > canvasWidth) cloud.position.x = 0;
    
            cloud.position.x += cloud.velocity.x;
            cloud.angle += ((Math.PI / 180) * cloud.rotationVelocity);
            cloud.velocity.y += constants.GRAVITY;
    
            cloud.displayPosition.x = cloud.position.x;
        });*/
        explosion.draw();
    };

    const drawCloud = (cloud) => { };

    const makeClouds = (rocket) => {
        let clouds = [];
        //pass
        //use position and velocity and create several clouds that have own position and velocity
        return clouds;
    };

    const draw = (logs, landingState, img = null) => {
        const lastLog = logs.at(-1);
        let animationID;
        let landAnimationEnd = false;
        let landAnimationCount = 0;
        let currentState;
        let explosion = makeLanderExplosion(
            state,
            lastLog.position.y < 0 ? lastLog.displayPosition : lastLog.position,
            lastLog.velocity,
            lastLog.angle,
            lastLog.position.y >= 0
        );
        let imgExplosion = makeImageExplosion(
            state,
            lastLog.position.y < 0 ? lastLog.displayPosition : lastLog.position,
            lastLog.velocity,
            lastLog.angle,
            img,
            lastLog.position.y >= 0
        );
        let clouds = makeClouds(lastLog);
        const score = landingState.land ? scoreLanding(getAngleDeltaUpright(lastLog.angle), getVectorVelocity(lastLog.velocity)).toFixed(1) : scoreCrash(getAngleDeltaUpright(lastLog.angle), getVectorVelocity(lastLog.velocity)).toFixed(1);
        // console.log(lastLog)

        let confetti = makeConfetti(state, Math.round(100)); //amount depends on score
        const drawFromLogs = () => {
            if (logs.length > 0) currentState = logs.shift();

            CTX.fillStyle = state.get("theme").backgroundGradient;
            CTX.fillRect(0, 0, canvasWidth, canvasHeight);

            // Move stars in parallax as lander flies high
            state.get("stars").draw(logs.length > 0 ? currentState.velocity : { x: 0, y: 0 });

            // Move terrain as lander flies high
            CTX.save();
            CTX.translate(0, transition(0, state.get("terrain").getLandingData().terrainHeight, clampedProgress(TRANSITION_TO_SPACE, 0, currentState.position.y)));
            state.get("terrain").draw();
            CTX.restore();

            //Draw rocket when the game is not ended or the rocket succesfully landed
            if (logs.length <= 0) {
                if (landingState.land) {
                    if (img) drawRocketImg(currentState, img);
                    else drawRocket(currentState)
                    drawLanding(currentState.position, confetti);
                } else {
                    drawExploding(landingState.ground, img ? imgExplosion : explosion, clouds);
                }
                landAnimationCount++;
            } else {
                if (img) drawRocketImg(currentState, img);
                else drawRocket(currentState)
            }

            if (landAnimationCount >= LAND_MAX_FRAME) landAnimationEnd = true;

            if (currentState.position.y > TRANSITION_TO_SPACE) {
                drawTrajectory(state, currentState.position, currentState.angle, currentState.velocity, currentState.rotationVelocity);
            }

            // Draw speed and angle text beside lander, even after crashing
            // if (currentState.position.y > TRANSITION_TO_SPACE) {
            drawHUD(currentState);
            // } else {
            // CTX.save();
            // const animateHUDProgress = clampedProgress(constants.ROCKET_HEIGHT, -constants.ROCKET_HEIGHT, currentState.position.y);
            // CTX.globalAlpha = transition(0, 1, animateHUDProgress, easeInOutSine);
            // CTX.translate(0, transition(16, 0, animateHUDProgress, easeInOutSine));
            drawBottomHUD(currentState);
            drawTopHUD(currentState);
            CTX.restore();
            // }
            animationID = window.requestAnimationFrame(drawFromLogs)
            if (logs.length <= 0 && landAnimationEnd) {
                window.cancelAnimationFrame(animationID);
                setTimeout(endAnimation, 2000);
            }
        }
        drawFromLogs();
        return score;
    };

    const drawRocket = (rocket) => {
        CTX.save();

        // The lander positions is handled differently in two "altitude zones"
        // Zone 1:
        //   The lander is close to the ground - the viewport is static, and the
        //   terrain is visible. The _position is the same as the display position
        // Zone 2:
        //   The lander has transitioned to space, and over the course of two
        //   viewport heights, it's moved linearly to the center of the screen

        // Zone 1 positioning
        CTX.translate(rocket.position.x, rocket.position.y < TRANSITION_TO_SPACE ? TRANSITION_TO_SPACE : rocket.position.y);

        // Zone 2 positioning
        if (rocket.position.y > 0) {
            const yPosTransition = transition(0, canvasHeight / 2 - TRANSITION_TO_SPACE, clampedProgress(0, -canvasHeight * 2, rocket.position.y), easeInOutSine);

            CTX.translate(0, yPosTransition);
            rocket.displayPosition.y += yPosTransition;
        }

        CTX.rotate(rocket.angle);

        //rocket body
        CTX.beginPath();
        CTX.moveTo(-constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(0, -constants.ROCKET_HEIGHT);
        CTX.lineTo(constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(-constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").landerGradient;
        CTX.fill();

        //rocket cap
        CTX.beginPath();
        CTX.moveTo(-constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(0, -constants.ROCKET_HEIGHT);
        CTX.lineTo(constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.arc(0, 0, Math.sqrt(constants.ROCKET_WIDTH * constants.ROCKET_WIDTH + constants.ROCKET_HEIGHT * constants.ROCKET_HEIGHT) / 2, 2 * Math.PI - Math.atan2(constants.ROCKET_HEIGHT, constants.ROCKET_WIDTH), Math.PI + Math.atan2(constants.ROCKET_HEIGHT, constants.ROCKET_WIDTH), true);
        CTX.fillStyle = state.get("theme").threeGradient("#EB8C0C", '#6a3b0c', "#401f1a", constants.ROCKET_WIDTH, 0, 0.5);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(-constants.ROCKET_WIDTH / 2, 0);
        CTX.lineTo(-constants.ROCKET_WIDTH, 5 * constants.ROCKET_HEIGHT / 8);
        CTX.lineTo(-constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#DFE5E5", "#4A4E6F", "#3D4264", constants.ROCKET_WIDTH / 2, -3 * constants.ROCKET_WIDTH / 4, 0.8);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(constants.ROCKET_WIDTH / 2, 0);
        CTX.lineTo(constants.ROCKET_WIDTH, 5 * constants.ROCKET_HEIGHT / 8);
        CTX.lineTo(constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#3D4264", "#4A4E6F", "#DFE5E5", constants.ROCKET_WIDTH / 2, 3 * constants.ROCKET_WIDTH / 4, 0.2);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(0, 0.2 * constants.ROCKET_HEIGHT);
        CTX.lineTo(- constants.ROCKET_WIDTH / 4, constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(0, 0.8 * constants.ROCKET_HEIGHT);
        CTX.lineTo(constants.ROCKET_WIDTH / 4, constants.ROCKET_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#DFE5E5", '#262b4f', "#4A4E6F", constants.ROCKET_WIDTH / 2, 0, 0.5);
        CTX.fill();

        // Translate to the top-left corner of the lander so engine and booster
        // flames can be drawn from 0, 0
        CTX.translate(-constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        if (rocket.usedfuel < constants.FUELLIMIT && constants.FUELLIMIT != -1) {
            if (rocket.engineOn || rocket.rotatingLeft || rocket.rotatingRight) {
                CTX.fillStyle = randomBool() ? "#415B8C" : "#F3AFA3";
            }

            // Main engine flame
            if (rocket.engineOn) {
                const _flameHeight = randomBetween(10, 50);
                const _flameMargin = 3;
                CTX.beginPath();
                CTX.moveTo(_flameMargin, constants.ROCKET_HEIGHT);
                CTX.lineTo(constants.ROCKET_WIDTH - _flameMargin, constants.ROCKET_HEIGHT);
                CTX.lineTo(constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT + _flameHeight);
                CTX.closePath();
                CTX.fill();
            }

            const _boosterLength = randomBetween(5, 25);
            // Right booster flame
            if (rocket.rotatingLeft) {
                CTX.beginPath();
                CTX.moveTo(constants.ROCKET_WIDTH, 0);
                CTX.lineTo(constants.ROCKET_WIDTH + _boosterLength, constants.ROCKET_HEIGHT * 0.05);
                CTX.lineTo(constants.ROCKET_WIDTH, constants.ROCKET_HEIGHT * 0.1);
                CTX.closePath();
                CTX.fill();
            }

            // Left booster flame
            if (rocket.rotatingRight) {
                CTX.beginPath();
                CTX.moveTo(0, 0);
                CTX.lineTo(-_boosterLength, constants.ROCKET_HEIGHT * 0.05);
                CTX.lineTo(0, constants.ROCKET_HEIGHT * 0.1);
                CTX.closePath();
                CTX.fill();
            }
        }
        CTX.restore();
    };

    const drawRocketImg = (rocket, img) => {
        CTX.save();
        // Near ground positioning
        CTX.translate(rocket.position.x, rocket.position.y < TRANSITION_TO_SPACE ? TRANSITION_TO_SPACE : rocket.position.y);

        // Higher positioning
        if (rocket.position.y > 0) {
            const yPosTransition = transition(0, canvasHeight / 2 - TRANSITION_TO_SPACE, clampedProgress(0, -canvasHeight * 2, rocket.position.y), easeInOutSine);

            CTX.translate(0, yPosTransition);
            rocket.displayPosition.y += yPosTransition;
        }

        CTX.rotate(rocket.angle);

        CTX.drawImage(img, - constants.ROCKET_WIDTH, - 3 * constants.ROCKET_HEIGHT / 2, 2 * constants.ROCKET_WIDTH, 2 * constants.ROCKET_HEIGHT);

        // Translate to the top-left corner of the lander so engine and booster
        // flames can be drawn from 0, 0
        CTX.translate(- constants.ROCKET_WIDTH / 2, - constants.ROCKET_HEIGHT / 2);
        if (rocket.usedfuel < constants.FUELLIMIT && constants.FUELLIMIT != -1) {
            if (rocket.engineOn || rocket.rotatingLeft || rocket.rotatingRight) {
                CTX.fillStyle = randomBool() ? "#415B8C" : "#F3AFA3";
            }

            // Main engine flame
            if (rocket.engineOn) {
                const _flameHeight = randomBetween(10, 50);
                const _flameMargin = 3;
                CTX.beginPath();
                CTX.moveTo(_flameMargin, constants.ROCKET_HEIGHT);
                CTX.lineTo(constants.ROCKET_WIDTH - _flameMargin, constants.ROCKET_HEIGHT);
                CTX.lineTo(constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT + _flameHeight);
                CTX.closePath();
                CTX.fill();
            }

            const _boosterLength = randomBetween(5, 25);
            // Right booster flame
            if (rocket.rotatingLeft) {
                CTX.beginPath();
                CTX.moveTo(constants.ROCKET_WIDTH, 0);
                CTX.lineTo(constants.ROCKET_WIDTH + _boosterLength, constants.ROCKET_HEIGHT * 0.05);
                CTX.lineTo(constants.ROCKET_WIDTH, constants.ROCKET_HEIGHT * 0.1);
                CTX.closePath();
                CTX.fill();
            }

            // Left booster flame
            if (rocket.rotatingRight) {
                CTX.beginPath();
                CTX.moveTo(0, 0);
                CTX.lineTo(-_boosterLength, constants.ROCKET_HEIGHT * 0.05);
                CTX.lineTo(0, constants.ROCKET_HEIGHT * 0.1);
                CTX.closePath();
                CTX.fill();
            }
        }
        CTX.restore();
    };

    const drawExplodingImg = (isGround, explosion, clouds, img) => { };

    return {
        draw,
        runSimulation
    };
};
