import { randomBetween, seededRandomBetween, randomBool, getVectorVelocity, velocityInMPH, getAngleDeltaUpright, getAngleDeltaUprightWithSign, heightInFeet, percentProgress } from "../helpers/helpers.js";
import { scoreLanding, scoreCrash } from "../helpers/scoring.js";
import { GRAVITY, LANDER_WIDTH, LANDER_HEIGHT, CRASH_VELOCITY, CRASH_ANGLE, INTERVAL, TRANSITION_TO_SPACE } from "../helpers/constants.js";
import { makeLanderExplosion } from "./explosion.js";
import { makeConfetti } from "./confetti.js";
import { drawTrajectory } from "./trajectory.js";
import { transition, clampedProgress, easeInOutSine } from "../helpers/helpers.js";

export const makeLander = (state, onGameEnd) => {
    const CTX = state.get("CTX");
    const canvasWidth = state.get("canvasWidth");
    const canvasHeight = state.get("canvasHeight");
    const audioManager = state.get("audioManager");
    const bonusPointsManager = state.get("bonusPointsManager");

    // Use grounded height to approximate distance from ground
    const _landingData = state.get("terrain").getLandingData();
    const _groundedHeight = _landingData.terrainAvgHeight - LANDER_HEIGHT + LANDER_HEIGHT / 2;
    
    // xxx : #3
    const _thrust = 0.01;

    let _position;
    let _displayPosition;
    let _velocity;
    let _rotationVelocity;
    let _angle;
    let _engineOn;
    let _rotatingLeft;
    let _rotatingRight;

    let _timeSinceStart;
    let gameEndData;
    let _gameEndConfetti;
    let _gameEndExplosion;
    let _flipConfetti;
    let _lastRotation;
    let _lastRotationAngle;
    let _rotationCount;
    let _maxVelocity;
    let _velocityMilestone;
    let _maxHeight;
    let _heightMilestone;
    let _babySoundPlayed;

    let _isPressKeyVal;

    // xxx : #4
    let fuel;

    let time;

    const fuelLimit = 100;
    const timeLimit = 5000;


    // xxx : #2
    const resetProps = () => {
        const seededRandom = state.get("seededRandom");
        // const seededRandom = Math.random(); // XXX: temp
        _position = {
            x: canvasWidth / 2,//seededRandomBetween(canvasWidth * 0.33, canvasWidth * 0.66, seededRandom),
            y: canvasHeight / 2// LANDER_HEIGHT * 2,
        };
        _displayPosition = { ..._position };
        _velocity = {
            x: 0, // seededRandomBetween(-_thrust * (canvasWidth / 10), _thrust * (canvasWidth / 10), seededRandom),
            y: 0 // seededRandomBetween(0, _thrust * (canvasWidth / 10), seededRandom),
        };
        _rotationVelocity = 0; // seededRandomBetween(-0.2, 0.2, seededRandom);
        _angle = 0; // seededRandomBetween(Math.PI * 1.5, Math.PI * 2.5, seededRandom);
        _engineOn = false;
        _rotatingLeft = false;
        _rotatingRight = false;

        _timeSinceStart = 0;
        gameEndData = false;
        _gameEndConfetti = false;
        _gameEndExplosion = false;
        _flipConfetti = [];
        _lastRotation = 1;
        _lastRotationAngle = Math.PI * 2;
        _rotationCount = 0;
        _maxVelocity = { ..._velocity };
        _velocityMilestone = { x: 0, y: 0 };
        _maxHeight = _position.y;
        _heightMilestone = 0;
        _babySoundPlayed = false;

        _isPressKeyVal = false;

        fuel = 0;
        time = 0;
    };
    resetProps();

    const _isFixedPositionInSpace = () => _position.y < 0;

    const _setGameEndData = (landed, struckByAsteroid = false) => {
        gameEndData = {
            isPressKey: _isPressKeyVal,
            landed,
            struckByAsteroid,
            speed: velocityInMPH(_velocity),
            angle: Intl.NumberFormat().format(getAngleDeltaUpright(_angle).toFixed(1)),
            durationInSeconds: Intl.NumberFormat().format(Math.round(_timeSinceStart / 1000)),
            rotationsInt: _rotationCount,
            rotationsFormatted: Intl.NumberFormat().format(_rotationCount),
            maxSpeed: velocityInMPH(_maxVelocity),
            maxHeight: heightInFeet(_maxHeight, _groundedHeight),
            speedPercent: percentProgress(0, CRASH_VELOCITY, getVectorVelocity(_velocity)),
            anglePercent: percentProgress(0, CRASH_ANGLE, getAngleDeltaUpright(_angle)),
        };
        if (landed) {
            const score = scoreLanding(getAngleDeltaUpright(_angle), getVectorVelocity(_velocity));

            gameEndData.landerScore = score;

            _gameEndConfetti = makeConfetti(state, Math.round(score));

            _angle = Math.PI * 2;
            _velocity = { x: 0, y: 0 };
            _rotationVelocity = 0;
        } else {
            const score = scoreCrash(getAngleDeltaUpright(_angle), getVectorVelocity(_velocity));

            gameEndData.landerScore = score;

            _gameEndExplosion = makeLanderExplosion(state, _isFixedPositionInSpace() ? _displayPosition : _position, _velocity, _angle, !_isFixedPositionInSpace());

            _velocity = { x: 0, y: 0 };
        }

        onGameEnd(gameEndData);
    };

    const destroy = (asteroidVelocity) => {
        if (!gameEndData) {
            const averageXVelocity = (_velocity.x + asteroidVelocity.x) / 2;
            const averageYVelocity = (_velocity.y + asteroidVelocity.y) / 2;
            _velocity = _isFixedPositionInSpace() ? { x: averageXVelocity, y: asteroidVelocity.y / 2 } : { x: averageXVelocity, y: averageYVelocity };
            _engineOn = false;
            _rotatingLeft = false;
            _rotatingRight = false;
            audioManager.stopEngineSound();
            audioManager.stopBoosterSound1();
            audioManager.stopBoosterSound2();
            _setGameEndData(false, true);
        }
    };

    const _updateProps = (deltaTime) => {
        const deltaTimeMultiplier = 1;// deltaTime / INTERVAL;

        if (time > timeLimit) _setGameEndData(false);

        _position.y = _position.y + deltaTimeMultiplier * _velocity.y;

        if (
            _position.y + LANDER_HEIGHT / 2 < _landingData.terrainHeight ||
            (_position.y + LANDER_HEIGHT / 2 >= _landingData.terrainHeight &&
                !CTX.isPointInPath(_landingData.terrainPath2D, _position.x * state.get("scaleFactor"), (_position.y + LANDER_HEIGHT / 2) * state.get("scaleFactor")))
        ) {
            // Update ballistic properties
            // xxx : #3
            if (_rotatingRight && fuel < fuelLimit) { // xxx : #4
                _rotationVelocity += deltaTimeMultiplier * 0.01;
                fuel += deltaTimeMultiplier * _thrust * 2; // xxx : #4
            }
            if (_rotatingLeft && fuel < fuelLimit) { // xxx : #4
                _rotationVelocity -= deltaTimeMultiplier * 0.01;
                fuel += deltaTimeMultiplier * _thrust * 2; // xxx : #4
            }
            if (_position.x < 0) _position.x = canvasWidth;

            if (_position.x > canvasWidth) _position.x = 0;

            _position.x += deltaTimeMultiplier * _velocity.x;
            _angle += deltaTimeMultiplier * ((Math.PI / 180) * _rotationVelocity);
            _velocity.y += deltaTimeMultiplier * GRAVITY;

            _displayPosition.x = _position.x;

            if (_engineOn && fuel < fuelLimit) { // xxx : #4
                _velocity.x += deltaTimeMultiplier * (_thrust * Math.sin(_angle));
                _velocity.y -= deltaTimeMultiplier * (_thrust * Math.cos(_angle));
                fuel += deltaTimeMultiplier * _thrust * 20; // xxx : #4
            }

            console.log("fuel : " + fuel.toFixed(2) + "L & time : " + time + "ms");

            // Log new rotations
            const rotations = Math.floor(_angle / (Math.PI * 2));
            if (Math.abs(_angle - _lastRotationAngle) > Math.PI * 2 && (rotations > _lastRotation || rotations < _lastRotation)) {
                bonusPointsManager.addNamedPoint("newRotation");
                _rotationCount++;
                _lastRotation = rotations;
                _lastRotationAngle = _angle;
                _flipConfetti.push(makeConfetti(state, 10, _displayPosition, _position.y > 0 ? _velocity : { x: _velocity.x, y: 0 }));
            }

            // Log new max speed and height
            if (_position.y < _maxHeight) _maxHeight = _position.y;

            if (getVectorVelocity(_velocity) > getVectorVelocity(_maxVelocity)) {
                _maxVelocity = { ..._velocity };
            }

            // Record bonus points for increments of height and speed
            // Ints here are pixels / raw values, not MPH or FT
            if (_position.y < _heightMilestone + Math.min(-3500, _heightMilestone * 3)) {
                _heightMilestone = _position.y;
                bonusPointsManager.addNamedPoint("newHeight");
            }

            if (getVectorVelocity(_velocity) > getVectorVelocity(_velocityMilestone) + 10) {
                _velocityMilestone = { ..._velocity };
                bonusPointsManager.addNamedPoint("newSpeed");
            }

            // Play easter egg baby sound
            if (getVectorVelocity(_velocity) > 20 && !_babySoundPlayed) {
                state.get("audioManager").playBaby();
                _babySoundPlayed = true;
            } else if (getVectorVelocity(_velocity) < 20 && _babySoundPlayed) {
                _babySoundPlayed = false;
            }
        } else if (!gameEndData) {
            _engineOn = false;
            _rotatingLeft = false;
            _rotatingRight = false;
            audioManager.stopEngineSound();
            audioManager.stopBoosterSound1();
            audioManager.stopBoosterSound2();

            const landingArea = _landingData.landingSurfaces.find(({ x, width }) => _position.x - LANDER_WIDTH / 2 >= x && _position.x + LANDER_WIDTH / 2 <= x + width);

            const didLand = getVectorVelocity(_velocity) < CRASH_VELOCITY && getAngleDeltaUpright(_angle) < CRASH_ANGLE && landingArea;

            if (didLand) bonusPointsManager.addNamedPoint(landingArea.name);

            _setGameEndData(didLand);
        }

        time += INTERVAL;
    };

    const _drawHUD = () => {
        const textWidth = CTX.measureText("100.0 MPH").width + 2;
        const xPosBasis = Math.abs(_velocity.x) > 6 ? canvasWidth / 2 - textWidth / 2 : Math.min(_position.x + LANDER_WIDTH * 2, canvasWidth - textWidth);
        const yPosBasis = Math.max(_position.y, TRANSITION_TO_SPACE);
        const lineHeight = 14;
        const rotatingLeft = _rotationVelocity < 0;
        const speedColor = getVectorVelocity(_velocity) > CRASH_VELOCITY ? "rgb(255, 0, 0)" : "rgb(0, 255, 0)";
        const angleColor = getAngleDeltaUpright(_angle) > CRASH_ANGLE ? "rgb(255, 0, 0)" : "rgb(0, 255, 0)";

        // Draw HUD text
        CTX.save();
        CTX.font = "400 10px -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillStyle = speedColor;
        CTX.fillText(`${velocityInMPH(_velocity)} MPH`, xPosBasis, yPosBasis - lineHeight);
        CTX.fillStyle = angleColor;
        CTX.fillText(`${getAngleDeltaUprightWithSign(_angle).toFixed(1)}°`, xPosBasis, yPosBasis);
        CTX.fillStyle = state.get("theme").infoFontColor;
        CTX.fillText(`${heightInFeet(_position.y, _groundedHeight)} FT`, xPosBasis, yPosBasis + lineHeight);
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

    const _drawBottomHUD = () => {
        const yPadding = LANDER_HEIGHT;
        const xPadding = LANDER_HEIGHT;

        const secondsUntilTerrain = _velocity.y > 0 ? Math.abs(Math.round((_position.y - canvasHeight + (canvasHeight - _landingData.terrainAvgHeight)) / _velocity.y / 100)) : 99;

        CTX.save();

        CTX.fillStyle = state.get("theme").infoFontColor;
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.textAlign = "left";
        CTX.fillText(`${velocityInMPH(_velocity)}`, xPadding, canvasHeight - yPadding - 24);
        CTX.letterSpacing = "1px";
        CTX.font = "400 16px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText("MPH", xPadding, canvasHeight - yPadding);

        CTX.textAlign = "right";
        CTX.font = "800 24px/1.5 -apple-system, BlinkMacSystemFont, sans-serif";
        CTX.fillText(`${heightInFeet(_position.y, _groundedHeight)}`, canvasWidth - xPadding, canvasHeight - yPadding - 24);
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

    const _drawLander = () => {
        CTX.save();

        // The lander positions is handled differently in two "altitude zones"
        // Zone 1:
        //   The lander is close to the ground - the viewport is static, and the
        //   terrain is visible. The _position is the same as the display position
        // Zone 2:
        //   The lander has transitioned to space, and over the course of two
        //   viewport heights, it's moved linearly to the center of the screen

        // Zone 1 positioning
        CTX.translate(_position.x, _position.y < TRANSITION_TO_SPACE ? TRANSITION_TO_SPACE : _position.y);

        _displayPosition.y = _position.y < TRANSITION_TO_SPACE ? TRANSITION_TO_SPACE : _position.y;

        // Zone 2 positioning
        if (_isFixedPositionInSpace()) {
            const yPosTransition = transition(0, canvasHeight / 2 - TRANSITION_TO_SPACE, clampedProgress(0, -canvasHeight * 2, _position.y), easeInOutSine);

            CTX.translate(0, yPosTransition);
            _displayPosition.y += yPosTransition;
        }

        CTX.rotate(_angle);

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
        CTX.moveTo(-LANDER_WIDTH / 2, -LANDER_HEIGHT / 2);
        CTX.lineTo(0, -LANDER_HEIGHT);
        CTX.lineTo(LANDER_WIDTH / 2, -LANDER_HEIGHT / 2);
        CTX.lineTo(LANDER_WIDTH / 2, LANDER_HEIGHT / 2);
        CTX.lineTo(-LANDER_WIDTH / 2, LANDER_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").landerGradient;
        CTX.fill();
        
        CTX.beginPath();
        CTX.moveTo(-LANDER_WIDTH / 2, -LANDER_HEIGHT / 2);
        CTX.lineTo(0, -(LANDER_HEIGHT));
        CTX.lineTo(LANDER_WIDTH / 2, -LANDER_HEIGHT / 2);
        CTX.arc(0, 0, Math.sqrt(LANDER_WIDTH * LANDER_WIDTH + LANDER_HEIGHT * LANDER_HEIGHT) / 2, 2 * Math.PI - Math.atan2(LANDER_HEIGHT, LANDER_WIDTH), Math.PI + Math.atan2(LANDER_HEIGHT, LANDER_WIDTH), true);
        CTX.fillStyle = state.get("theme").threeGradient("#EB8C0C", '#6a3b0c', "#401f1a", LANDER_WIDTH, 0, 0.5);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(-LANDER_WIDTH / 2, 0);
        CTX.lineTo(-LANDER_WIDTH , 5 *LANDER_HEIGHT / 8);
        CTX.lineTo(-LANDER_WIDTH / 2, LANDER_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#DFE5E5", "#4A4E6F", "#3D4264", LANDER_WIDTH / 2, -3 * LANDER_WIDTH / 4, 0.8);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(LANDER_WIDTH / 2, 0);
        CTX.lineTo(LANDER_WIDTH , 5 *LANDER_HEIGHT / 8);
        CTX.lineTo(LANDER_WIDTH / 2, LANDER_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#3D4264", "#4A4E6F", "#DFE5E5", LANDER_WIDTH / 2, 3 * LANDER_WIDTH / 4, 0.2);
        CTX.fill();

        CTX.beginPath();
        CTX.moveTo(0, 0.2 * LANDER_HEIGHT);
        CTX.lineTo(- LANDER_WIDTH / 4, LANDER_HEIGHT / 2);
        CTX.lineTo(0, 0.8 * LANDER_HEIGHT);
        CTX.lineTo(LANDER_WIDTH / 4, LANDER_HEIGHT / 2);
        CTX.closePath();
        CTX.fillStyle = state.get("theme").threeGradient("#DFE5E5", '#262b4f', "#4A4E6F", LANDER_WIDTH / 2, 0, 0.5);
        CTX.fill();

        // Translate to the top-left corner of the lander so engine and booster
        // flames can be drawn from 0, 0
        CTX.translate(-LANDER_WIDTH / 2, -LANDER_HEIGHT / 2);
        if (fuel < fuelLimit) {
            if (_engineOn || _rotatingLeft || _rotatingRight) {
                CTX.fillStyle = randomBool() ? "#415B8C" : "#F3AFA3";
            }

            // Main engine flame
            if (_engineOn) {
                const _flameHeight = randomBetween(10, 50);
                const _flameMargin = 3;
                CTX.beginPath();
                CTX.moveTo(_flameMargin, LANDER_HEIGHT);
                CTX.lineTo(LANDER_WIDTH - _flameMargin, LANDER_HEIGHT);
                CTX.lineTo(LANDER_WIDTH / 2, LANDER_HEIGHT + _flameHeight);
                CTX.closePath();
                CTX.fill();
            }

            const _boosterLength = randomBetween(5, 25);
            // Right booster flame
            if (_rotatingLeft) {
                CTX.beginPath();
                CTX.moveTo(LANDER_WIDTH, 0);
                CTX.lineTo(LANDER_WIDTH + _boosterLength, LANDER_HEIGHT * 0.05);
                CTX.lineTo(LANDER_WIDTH, LANDER_HEIGHT * 0.1);
                CTX.closePath();
                CTX.fill();
            }

            // Left booster flame
            if (_rotatingRight) {
                CTX.beginPath();
                CTX.moveTo(0, 0);
                CTX.lineTo(-_boosterLength, LANDER_HEIGHT * 0.05);
                CTX.lineTo(0, LANDER_HEIGHT * 0.1);
                CTX.closePath();
                CTX.fill();
            }
        }
        CTX.restore();
    };

    const draw = (timeSinceStart, deltaTime) => {
        _timeSinceStart = timeSinceStart;

        if (!gameEndData) {
            _updateProps(deltaTime);

            if (_position.y > TRANSITION_TO_SPACE) {
                drawTrajectory(state, _position, _angle, _velocity, _rotationVelocity);
            }
        }

        if (_flipConfetti.length > 0) _flipConfetti.forEach((c) => c.draw(deltaTime));

        if (_gameEndConfetti) _gameEndConfetti.draw(deltaTime);

        if (_gameEndExplosion) _gameEndExplosion.draw(deltaTime);

        if (!gameEndData || (gameEndData && gameEndData.landed)) _drawLander();

        // Draw speed and angle text beside lander, even after crashing
        if (_position.y > TRANSITION_TO_SPACE) {
            _drawHUD();
        } else {
            CTX.save();
            const animateHUDProgress = clampedProgress(LANDER_HEIGHT, -LANDER_HEIGHT, _position.y);
            CTX.globalAlpha = transition(0, 1, animateHUDProgress, easeInOutSine);
            CTX.translate(0, transition(16, 0, animateHUDProgress, easeInOutSine));
            _drawBottomHUD();
            CTX.restore();
        }
    };

    return {
        draw,
        destroy,
        resetProps,
        getPosition: () => _position,
        getDisplayPosition: () => _displayPosition,
        getVelocity: () => _velocity,
        getAngle: () => getAngleDeltaUprightWithSign(_angle).toFixed(1), // added, TODO: 검증필요
        getHeight: () => heightInFeet(_position.y, _groundedHeight), // added, TODO: 검증필요
        getRotationVelocity: () => _rotationVelocity, // added, TODO: 검증필요
        engineOn: () => (_engineOn = true),
        engineOff: () => (_engineOn = false),
        rotateLeft: () => (_rotatingLeft = true),
        rotateRight: () => (_rotatingRight = true),
        stopLeftRotation: () => (_rotatingLeft = false),
        stopRightRotation: () => (_rotatingRight = false),
        setIsPressKey: () => (_isPressKeyVal = true)
    };
};
