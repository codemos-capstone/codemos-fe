import React, { useEffect, useRef } from "react";

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

export default function GameCanvas({ size, code, initState, animationEnded }){
    const canvasRef = useRef(null);
    let scale = window.devicePixelRatio;

    useEffect(() => {
        const canvasElement = canvasRef.current;
        const CTX = canvasElement.getContext('2d');

        canvasElement.width = Math.floor(size[1] * scale);
        canvasElement.height = Math.floor(size[0] * scale);
        
        scale = window.devicePixelRatio;
        const scaleFactor = scale;
        CTX.scale(scale, scale);

        //const audioManager = makeAudioManager();

        const challengeManager = makeChallengeManager();
        const seededRandom = makeSeededRandom();

        const appState = new Map()
            .set("CTX", CTX)
            .set("canvasWidth", size[1])
            .set("canvasHeight", size[0])
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
        const lander = makeLander(appState, [initState[1], initState[2]], animationEnded);

        //landerControls.attachEventListeners();
        challengeManager.populateCornerInfo();
        //terrain.setShowLandingSurfaces();

        const logs = [initState[0]]
        const landingEffect = lander.updateIterator(code, logs);
        lander.draw(logs, landingEffect);
    }, [])

    return <canvas ref={ canvasRef } style={{width: `${size[1]}px`, height: `${size[0]}px`}}></canvas>
}