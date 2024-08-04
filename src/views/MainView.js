import React, { useEffect, useState } from "react";
import logo from 'assets/favicon-540x540.png';
import './MainView.css';
export default function MainView() {

const introContent = "CodeMos is a unique OnlineJudge platform that can enhance creative algorithm problem solving skills. On this platform, users face the challenge of writing an algorithm to safely land a rocket that randomly crashes into a planet. In this process, you can solve complex problems using various internal functions we provide. If a user writes an effective algorithm and successfully lands the rocket, the achievement can be checked with a score. And after writing the code, you can directly check the effect of your algorithm through the provided simulation, and compete with other users.";    return (
        <div className="con">
            <div className="content">
                <img className="logo" src = {logo}></img>
                <p className="main-title">CodeMos</p>
                <div className="introduction">{introContent}</div>
            </div>
        </div>
    );
}
