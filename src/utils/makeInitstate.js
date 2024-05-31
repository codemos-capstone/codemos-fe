import { json } from "react-router-dom";

export function makeInitState(problem, canvasSize){
    console.log(problem);
    //const preset = JSON.parse(problem);
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

    console.log(problem);
    if(problem){
        constants.TIMELIMIT = problem.timeLimit;
        constants.FUELLIMIT = problem.fuelLimit;
        initRocket.position.x = 400;
        initRocket.position.y = 40;
        initRocket.angle = problem.initialAngle;
        initRocket.velocity.x = problem.initialVelocityX;
        initRocket.velocity.y = problem.initialVelocityY;
    }

    const initState = [initRocket, constants, allowed]
    return initState;
}