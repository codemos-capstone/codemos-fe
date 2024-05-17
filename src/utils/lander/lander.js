import { randomBetween, seededRandomBetween, randomBool, getVectorVelocity, velocityInMPH, getAngleDeltaUpright, getAngleDeltaUprightWithSign, heightInFeet, percentProgress } from "../helpers/helpers.js";
import { scoreLanding, scoreCrash } from "../helpers/scoring.js";
import { CRASH_VELOCITY, CRASH_ANGLE, INTERVAL, TRANSITION_TO_SPACE } from "../helpers/constants.js";
import { drawTrajectory } from "./trajectory.js";
import { transition, clampedProgress, easeInOutSine } from "../helpers/helpers.js";

export const makeLander = (state, setting, animationEnded) => {
    const CTX = state.get("CTX");
    const canvasWidth = state.get("canvasWidth");
    const canvasHeight = state.get("canvasHeight");
    //const audioManager = null;
    const bonusPointsManager = state.get("bonusPointsManager");

    const constants = setting[0];
    const allowed = setting[1]

    // Use grounded height to approximate distance from ground
    const _landingData = state.get("terrain").getLandingData();
    const _groundedHeight = _landingData.terrainAvgHeight - constants.ROCKET_HEIGHT + constants.ROCKET_HEIGHT / 2;    

    const drawHUD = (rocket) => {
        const textWidth = CTX.measureText("100.0 MPH").width + 2;
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
        CTX.fillText(`${velocityInMPH(rocket.velocity)} MPH`, xPosBasis, yPosBasis - lineHeight);
        CTX.fillStyle = angleColor;
        CTX.fillText(`${getAngleDeltaUprightWithSign(rocket.angle).toFixed(1)}°`, xPosBasis, yPosBasis);
        CTX.fillStyle = state.get("theme").infoFontColor;
        CTX.fillText(`${heightInFeet(rocket.position.y, _groundedHeight)} FT`, xPosBasis, yPosBasis + lineHeight);
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
        CTX.fillText(`${velocityInMPH(rocket.velocity)}`, xPadding, canvasHeight - yPadding - 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("MPH", xPadding, canvasHeight - yPadding);

        CTX.textAlign = "right";
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText(`${heightInFeet(rocket.position.y, _groundedHeight)}`, canvasWidth - xPadding, canvasHeight - yPadding - 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("FT", canvasWidth - xPadding, canvasHeight - yPadding);

        if (secondsUntilTerrain < 15) {
            CTX.fillStyle = "rgb(255, 0, 0)";
            CTX.textAlign = "center";
            CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
            CTX.fillText(Intl.NumberFormat().format(secondsUntilTerrain), canvasWidth / 2, canvasHeight - yPadding - 24);
            CTX.letterSpacing = "1px";
            CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
            CTX.fillText("SECONDS UNTIL TERRAIN", canvasWidth / 2, canvasHeight - yPadding);
        }

        CTX.restore();
    };

    const updateIterator = (code, logs) => {
        const rocket = deepCopy(logs[0]);
        let end = false;
        let didLand = false;
        
        // Rocket functions
        const engineOn = () => {
            if(allowed.engineOn)
                rocket.engineOn = true;
            else {
                throw new TypeError("engineOn is not a function")
            }
        };
        const engineOff = () => {
            if(allowed.engineOff)
                rocket.engineOn = false;
            else {
                throw new TypeError("engineOff is not a function")
            }
        };
        const getVelocityX = () => {
            if(allowed.getVelocityX)
                return rocket.velocity.x;
            else {
                throw new TypeError("getVelocityX is not a function")
            }
        };
        const getVelocityY = () => {
            if(allowed.getVelocityY)
                return rocket.velocity.y;
            else {
                throw new TypeError("getVelocityY is not a function")
            }
        };
        const getAngle = () => {
            if(allowed.getAngle)
                return rocket.angle;
            else {
                throw new TypeError("getAngle is not a function")
            }
        };
        const getHeight = () => {
            if(allowed.getHeight)
                return heightInFeet(rocket.position.y, _groundedHeight);
            else {
                throw new TypeError("getHeight is not a function")
            }
        };
        const getRotationVelocity = () => {
            if(allowed.getRotationVelocity)
                return rocket.rotationVelocity;
            else {
                throw new TypeError("getRotationVelocity is not a function")
            }
        };
        const rotateLeft = () => {
            if(allowed.rotateLeft)
                rocket.rotatingLeft = true;
            else {
                throw new TypeError("rotateLeft is not a function")
            }
        };
        const rotateRight = () => {
            if(allowed.rotateRight)
                rocket.rotatingRight = true;
            else {
                throw new TypeError("rotateRight is not a function")
            }
        };
        const stopLeftRotation = () => {
            if(allowed.stopLeftRotation)
                rocket.rotatingLeft = false;
            else {
                throw new TypeError("stopLeftRotation is not a function")
            }
        };
        const stopRightRotation = () => {
            if(allowed.stopRightRotation)
                rocket.rotatingRight = false;
            else {
                throw new TypeError("stopRightRotation is not a function")
            }
        };

        while(!end){
            let err;
            try{eval(code)} catch (e) {
                err = e;
            };
            let isend = checkEnd(rocket);
            //if (logs.length >= 1000) return false;
            if (err){
                console.log(err);
                return;
            } else if (!isend.end){
                updateRocket(rocket)
                const newrocket = deepCopy(rocket);
                logs.push(newrocket);
            } else {
                end = true;
                didLand = isend.land;
            }
        }
        return didLand;
    };

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
    }

    const updateRocket = (rocket) => {
        rocket.timeSinceStart = Date.now() - constants.STARTTIME;
        const deltaTimeMultiplier = 1;// deltaTime / INTERVAL;

        rocket.position.y = rocket.position.y + deltaTimeMultiplier * rocket.velocity.y;
        // Update ballistic properties
        // xxx : #3
        if (rocket.rotatingRight && rocket.usedfuel < constants.FUELLIMIT) { // xxx : #4
            rocket.rotationVelocity += deltaTimeMultiplier * constants.RTHRUST;
            rocket.usedfuel += deltaTimeMultiplier * constants.RTHRUST * 2; // xxx : #4
        }
        if (rocket.rotatingLeft && rocket.usedfuel < constants.FUELLIMIT) { // xxx : #4
            rocket.rotationVelocity -= deltaTimeMultiplier * constants.RTHRUST;
            rocket.usedfuel += deltaTimeMultiplier * constants.RTHRUST * 2; // xxx : #4
        }
        if (rocket.position.x < 0) rocket.position.x = canvasWidth;

        if (rocket.position.x > canvasWidth) rocket.position.x = 0;

        rocket.position.x += deltaTimeMultiplier * rocket.velocity.x;
        rocket.angle += deltaTimeMultiplier * ((Math.PI / 180) * rocket.rotationVelocity);
        rocket.velocity.y += deltaTimeMultiplier * constants.GRAVITY;

        rocket.displayPosition.x = rocket.position.x;

        if (rocket.engineOn && rocket.usedfuel < constants.FUELLIMIT) { // xxx : #4
            rocket.velocity.x += deltaTimeMultiplier * (constants.THRUST * Math.sin(rocket.angle));
            rocket.velocity.y -= deltaTimeMultiplier * (constants.THRUST * Math.cos(rocket.angle));
            rocket.usedfuel += deltaTimeMultiplier * constants.THRUST * 20; // xxx : #4
        }

        // console.log("fuel : " + fuel.toFixed(2) + "L & time : " + time + "ms");

        // Log new rotations
        const rotations = Math.floor(rocket.angle / (Math.PI * 2));
        if (Math.abs(rocket.angle - rocket.lastRotationAngle) > Math.PI * 2 && (rotations > rocket.lastRotation || rotations < rocket.lastRotation)) {
            bonusPointsManager.addNamedPoint("newRotation");
            rocket.rotationCount++;
            rocket.lastRotation = rotations;
            rocket.lastRotationAngle = rocket.angle;
            //_flipConfetti.push(makeConfetti(state, 10, rocket.displayPosition, rocket.position.y > 0 ? rocket.velocity : { x: rocket.velocity.x, y: 0 }));
        }

        // Log new max speed and height
        if (rocket.position.y < rocket.maxHeight) rocket.maxHeight = rocket.position.y;

        if (getVectorVelocity(rocket.velocity) > getVectorVelocity(rocket.maxVelocity)) {
            rocket.maxVelocity = { ...rocket.velocity };
        }

        // Record bonus points for increments of height and speed
        // Ints here are pixels / raw values, not MPH or FT
        if (rocket.position.y < rocket.heightMilestone + Math.min(-3500, rocket.heightMilestone * 3)) {
            rocket.heightMilestone = rocket.position.y;
            bonusPointsManager.addNamedPoint("newHeight");
        }

        if (getVectorVelocity(rocket.velocity) > getVectorVelocity(rocket.velocityMilestone) + 10) {
            rocket.velocityMilestone = { ...rocket.velocity };
            bonusPointsManager.addNamedPoint("newSpeed");
        }

        rocket.displayPosition.y = rocket.position.y < TRANSITION_TO_SPACE ? TRANSITION_TO_SPACE : rocket.position.y;
    }

    const checkEnd = (rocket) => {
        if (rocket.timeSinceStart > constants.TIMELIMIT){
            return {end: true, land: false}
        } else if (rocket.position.y + constants.ROCKET_HEIGHT / 2 < _landingData.terrainHeight ||
        (rocket.position.y + constants.ROCKET_HEIGHT / 2 >= _landingData.terrainHeight && !CTX.isPointInPath(_landingData.terrainPath2D, rocket.position.x * state.get("scaleFactor"), (rocket.position.y + constants.ROCKET_HEIGHT / 2) * state.get("scaleFactor")))){
            return { end: false, land: false};
        } else {
            return { end: true, land: false};
        }
    };

    const draw = (logs, didLand) => {
        let animationID;
        let randomConfetti = [];
        const drawFromLogs = () => {
            let currentState = logs.shift();

            CTX.fillStyle = state.get("theme").backgroundGradient;
            CTX.fillRect(0, 0, canvasWidth, canvasHeight);

            // Move stars in parallax as lander flies high
            state.get("stars").draw(currentState.velocity);

            // Move terrain as lander flies high
            CTX.save();
            CTX.translate(0, transition(0, state.get("terrain").getLandingData().terrainHeight, clampedProgress(TRANSITION_TO_SPACE, 0, currentState.position.y)));
            state.get("terrain").draw();
            CTX.restore();


            bonusPointsManager.draw(currentState.position.y < TRANSITION_TO_SPACE);
            if (randomConfetti.length > 0) {
                randomConfetti.forEach((c) => c.draw(deltaTime));
            }

            drawRocket(currentState); //Draw rocket when the game is not ended or the rocket succesfully landed

            if (currentState.position.y > TRANSITION_TO_SPACE) {
                drawTrajectory(state, currentState.position, currentState.angle, currentState.velocity, currentState.rotationVelocity);
            }
            //if (_flipConfetti.length > 0) _flipConfetti.forEach((c) => c.draw(deltaTime)); //confetties when the rocket flips

            //if (_gameEndConfetti) _gameEndConfetti.draw(deltaTime); //confetties when the rocket lands
    
            //if (_gameEndExplosion) _gameEndExplosion.draw(deltaTime); //rocket pieces when the rocket explodes
    
            // Draw speed and angle text beside lander, even after crashing
            if (currentState.position.y > TRANSITION_TO_SPACE) {
                drawHUD(currentState);
            } else {
                CTX.save();
                const animateHUDProgress = clampedProgress(constants.ROCKET_HEIGHT, -constants.ROCKET_HEIGHT, currentState.position.y);
                CTX.globalAlpha = transition(0, 1, animateHUDProgress, easeInOutSine);
                CTX.translate(0, transition(16, 0, animateHUDProgress, easeInOutSine));
                drawBottomHUD(currentState);
                CTX.restore();
            }
            animationID = window.requestAnimationFrame(drawFromLogs)
            if (logs.length <= 0) {
                window.cancelAnimationFrame(animationID);
                setTimeout(animationEnded, 2000);
            }
        }
        drawFromLogs();
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

        // Draw the lander
        //
        // We want the center of rotation to be in the center of the bottom
        // rectangle, excluding the tip of the lander. To accomplish this, the
        // lander is drawn offset to the top and left of _position.x and y.
        // The tip is also drawn offset to the top of that so that the lander
        // is a bit taller than LANDER_HEIGHT.
        //
        //                                      /\
        //                                     /  \
        // Start at top left of this segment → |  |
        // and work clockwise.                 |__|
        CTX.beginPath();
        CTX.moveTo(-constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(0, -constants.ROCKET_HEIGHT);
        CTX.lineTo(constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(-constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").landerGradient;
        CTX.fill();
        
        CTX.beginPath();
        CTX.moveTo(-constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.lineTo(0, -(constants.ROCKET_HEIGHT));
        CTX.lineTo(constants.ROCKET_WIDTH / 2, -constants.ROCKET_HEIGHT / 2);
        CTX.arc(0, 0, Math.sqrt(constants.ROCKET_WIDTH * constants.ROCKET_WIDTH + constants.ROCKET_HEIGHT * constants.ROCKET_HEIGHT) / 2, 2 * Math.PI - Math.atan2(constants.ROCKET_HEIGHT, constants.ROCKET_WIDTH), Math.PI + Math.atan2(constants.ROCKET_HEIGHT, constants.ROCKET_WIDTH), true);
        CTX.fillStyle = state.get("theme").threeGradient("#EB8C0C", '#6a3b0c', "#401f1a", constants.ROCKET_WIDTH, 0, 0.5);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(-constants.ROCKET_WIDTH / 2, 0);
        CTX.lineTo(-constants.ROCKET_WIDTH , 5 *constants.ROCKET_HEIGHT / 8);
        CTX.lineTo(-constants.ROCKET_WIDTH / 2, constants.ROCKET_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#DFE5E5", "#4A4E6F", "#3D4264", constants.ROCKET_WIDTH / 2, -3 * constants.ROCKET_WIDTH / 4, 0.8);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(constants.ROCKET_WIDTH / 2, 0);
        CTX.lineTo(constants.ROCKET_WIDTH , 5 *constants.ROCKET_HEIGHT / 8);
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
        if (rocket.usedfuel < constants.FUELLIMIT) {
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

    return {
        draw,
        updateIterator
    };
};
