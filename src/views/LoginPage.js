import { React } from "react";
import Login from "components/Login";

import "./LoginPage.css"

/**Fix 'on click's */

const btnTexts = require('lang/kor.json').login;

export default function LoginPage(){
    return(
        <div className="container">
            <div className="success-message" id="successMessage">{btnTexts[0]}</div>
            <Login />
            <div className="register-container hidden">
                <h2>{btnTexts[2]}</h2>
                <form action="#" method="post">
                    <div className="form-group">
                        <label htmlFor="Username">Username</label>
                        <input type="text" id="username" name="username" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="id">ID</label>
                        <input type="text" id="reg-id" name="id" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="reg-password" name="password" required />
                    </div>
                    <button type="submit">{btnTexts[2]}</button> {/** onClick={register} */}
                    <button id="back" type="button">{btnTexts[3]}</button> {/** onClick={pageToggle} */}
                </form>
            </div>
            <div className="home">
                <button id="home" type="button">{btnTexts[4]}</button> {/** onClick={} */}
            </div>
        </div>
    )
}

/*
let serverAddress = "http://18.179.38.25:8080"

document.addEventListener('DOMContentLoaded', function () {
    var currentPath = window.location.pathname
    history.replaceState(null, null, currentPath.replace('.html', ''))
})
function login(){
    var userid = document.getElementById('id').value;
    var password = document.getElementById('password').value;

    fetch(serverAddress+'/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId: userid, password: password})
    })
    .then((response) => {
        if(!response.ok){
            throw new Error(response.status)
        }
        return response.json()
    }).then((token) => {
        console.log('Login!')
        sessionStorage.setItem('jwtToken', token.accessToken);
        history.back()
    })
    .catch((err) => {
        console.log("Cannot register", err)
    })

    return false
};
function register(){
    var username = document.getElementById('username').value;
    var userid = document.getElementById('reg-id').value;
    var password = document.getElementById('reg-password').value;

    fetch(serverAddress+'/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginId: userid, password: password, nickname: username})
    })
    .then((response) => {
        if(!response.ok){
            throw new Error(response.status)
        }
        return response.json()
    }).then((value) => {
        console.log(value)
        document.getElementById('username').value = '';
        document.getElementById('reg-id').value = '';
        document.getElementById('reg-password').value = '';
        pageToggle();
        showSuccessMessage();
    })
    .catch((err) => {
        console.log("Cannot register", err)
    })

    return false
};

function pageToggle(){
    var login = document.querySelector('.login-container')
    var register = document.querySelector('.register-container')
    login.classList.toggle('hidden')
    register.classList.toggle('hidden')
}

function showSuccessMessage() {
    document.getElementById('successMessage').style.display = 'block';
    setTimeout(() => {
        document.getElementById('successMessage').style.display = 'none';
    }, 2000);
}*/
