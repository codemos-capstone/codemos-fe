import React, { useLayoutEffect, useEffect, useRef } from "react";

import { makeLander } from "utils/lander/lander.js";
import { makeStarfield } from "utils/starfield.js";
import { makeTerrain } from "utils/terrain.js";
import { showStatsAndResetControl } from "utils/stats.js";
//import { manageInstructions } from "utils/instructions.js";
//import { makeAudioManager } from "utils/helpers/audio.js";
import { makeChallengeManager } from "utils/challenge.js";
import { makeSeededRandom } from "utils/helpers/seededrandom.js";
import { makeBonusPointsManager } from "utils/bonuspoints.js";
import { makeTheme } from "utils/theme.js";
import { makeInitState } from "utils/makeInitstate";
//import rocketImg from "assets/images/rocket.png";

export default function GameCanvas({ code, problem, endAnimation, setScore }) {
    const canvasRef = useRef(null);
    const img = new Image();
    let score;
  
    useLayoutEffect(() => {
      const scale = window.devicePixelRatio;
      const canvasElement = canvasRef.current;
      const CTX = canvasElement.getContext("2d");
  
      const { width, height } = canvasElement.getBoundingClientRect();
      const initState = makeInitState(problem, [height, width]);
      console.log("initState", initState);
  
      canvasElement.width = Math.floor(width * scale);
      canvasElement.height = Math.floor(height * scale);
  
      const scaleFactor = scale;
      CTX.scale(scale, scale);
  
      const challengeManager = makeChallengeManager();
      const seededRandom = makeSeededRandom();
  
      const appState = new Map()
        .set("CTX", CTX)
        .set("canvasWidth", width)
        .set("canvasHeight", height)
        .set("canvasElement", canvasElement)
        .set("scaleFactor", scaleFactor)
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
      const lander = makeLander(appState, [initState[1], initState[2]], endAnimation);
  
      challengeManager.populateCornerInfo();
  
      const logs = [initState[0]];
      const language = 'c';
      const cCode = `
            #include <stdio.h>
            #include <math.h>

            extern double getVelocityX();
            extern double getVelocityY();
            extern double getHeight();
            extern double getAngle();
            extern double getRotationVelocity();
            extern void stopRightRotation();
            extern void stopLeftRotation();
            extern void rotateLeft();
            extern void rotateRight();
            extern void engineOn();
            extern void engineOff();

            double landAlt = -0.28;

            double calcTargetAngle() {
                double angle = 0;
                angle -= (getVelocityX() * 4);
                if (angle > 70) angle = 70;
                if (angle < -70) angle = -70;
                return angle;
            }

            void angleControl(double targetAngle) {
                if (getAngle() - targetAngle + (getRotationVelocity() * 300) > 0) {
                    stopRightRotation();
                    rotateLeft();
                } else {
                    stopLeftRotation();
                    rotateRight();
                }
            }

            void engineControl() {
if (((getVelocityY() + fabs(getVelocityX())) > (getHeight() - landAlt) / 1600 &&
     ((getAngle() > 0 && getVelocityX() < -0.1) || (getAngle() < 0 && getVelocityX() > 2))) ||
     ((getHeight() - landAlt) < getVelocityY() * 3 && getVelocityY() / 20 > (getHeight() - landAlt) / (getVelocityY() * 75)) &&
     fabs(getAngle()) < 90) {
    engineOn();
} else {
    engineOff();
}

            }

            void main() {
                angleControl(calcTargetAngle());
                engineControl();
            }




          `;
    
      // Asynchronous function to handle runSimulation
      async function runGame() {
        console.log("code", code);
        let landingEffect = await lander.runSimulation(cCode, logs,language);
        //let landingEffect = await lander.updateIterator(code, logs,language);
        console.log("logs", logs);
        // Ensure this block runs after runSimulation is complete
        if (landingEffect) {
          score = lander.draw(logs, landingEffect);
          console.log("score", score);
          setScore(score);
        }
      }
  
      // Call the async function
      runGame();
    }, []);
  
    return (
      <canvas
        ref={canvasRef}
        style={{
          width: "90%",
          minWidth: "25rem",
          minHeight: "15rem",
          marginBottom: "1rem",
        }}
      ></canvas>
    );
  }