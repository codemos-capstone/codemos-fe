import React from "react";
import './Matter.css';
import Profile from 'assets/images/profile.jpeg'

export default function Matter() {
  return (
      <div className="prob">
        <div></div>
          <div>
            <p>Basic</p>
            <p>10002</p>
            <p>The rocket Falls Falls abcdefg abc test softwareEnginerr</p>
          </div>
          <div className="filters"> 
            <button>Low Fuel</button>
            <button>HARD</button>
            <button>DP</button>
            <button>Graph</button>
            <button>MST</button>
            <button>Time Limit</button>
            <button>Low Fuel</button>
            <button>HARD</button>
            <button>DP</button>
            <button>Graph</button>
            <button>MST</button>
            <button>Time Limit</button>
          </div>
          <div className="prob_right">
              <img src={Profile} ></img>
            <p>Ezcho</p>
            <button>Try</button>
          </div>
        </div>
  );
};
