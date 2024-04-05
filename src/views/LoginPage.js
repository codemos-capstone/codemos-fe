import { React } from "react";
import Login from "components/Login";
import Register from "components/Register";

import "./LoginPage.css"

const btnTexts = require('lang/kor.json').login;

export default function LoginPage(){
    return(
        <div className="container">
            <div className="success-message" id="successMessage">{btnTexts[0]}</div>
            <Login />
            <Register />
            <div className="home">
                <button id="home" type="button">{btnTexts[4]}</button> {/** onClick={} */}
            </div>
        </div>
    )
}