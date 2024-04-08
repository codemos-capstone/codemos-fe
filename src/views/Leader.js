import React, { useState } from "react";
import "./Leader.css"
import Leaderboard from "components/Leaderboard";

const btnTexts = require('lang/kor.json').leader;

export default function Leader(){
    const [page, setPage] = useState(0)

    const handlePage = (moveBy) => {
        let temp = page + moveBy;
        if (temp < 0 || temp > 9) return;
        else setPage(temp);
    }

    return(
        <div className="container">
            <div>
                <h1 style={{textAlign: 'center'}}>{btnTexts.btns[0]}</h1>
            </div>
            <div id="board" style={{width: "50%", margin: "auto"}}><Leaderboard page={page} /></div>
            <div className="btns">
                <button className="page-lbtn" onClick={() => {handlePage(-1);}}>&lt;&lt;</button>
                <button className="page-rbtn" onClick={() => {handlePage(1);}}>&gt;&gt;</button>
            </div>
            <div className="btns load" style={{margin: "30px 2px"}}>
                <div><button className="load-btn" onClick={() => {handlePage(0);}}>{btnTexts.btns[1]}</button></div>
            </div>
        </div>
    )
}