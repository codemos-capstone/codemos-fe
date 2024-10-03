import { json } from "react-router-dom";

export function makeInitState(problem, canvasSize){
    const initRocket = {
        position: { x: canvasSize[1] / 2, y: canvasSize[0] / 2 },
        displayPosition: { x: canvasSize[1] / 2, y: canvasSize[0] / 2 },
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
        getTimeLeft: true,
        getFuel: true,
        getX : true,
        getY : true,
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

    if(problem){
        constants.TIMELIMIT = problem.timeLimit === null ? -1: problem.timeLimit;
        constants.FUELLIMIT = problem.fuelLimit === null ? -1: problem.fuelLimit;
        initRocket.position.x = problem.initialX === null ? 0: problem.initialX * canvasSize[1];
        initRocket.position.y = problem.initialY === null ? 0: problem.initialY * canvasSize[0];
        initRocket.angle = problem.initialAngle === null ? 0: problem.initialAngle;
        initRocket.velocity.x = problem.initialVelocityX === null ? 0: problem.initialVelocityX;
        initRocket.velocity.y = problem.initialVelocityY === null ? 0: problem.initialVelocityY;
        initRocket.rotationVelocity = problem.rotationVelocity === null ? 0: problem.rotationVelocity;

        if(problem.restrictedMethods){}
    }

    const initState = [initRocket, constants, allowed]
    return initState;
}