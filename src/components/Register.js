import { React, useState } from "react";

const btnTexts = require('lang/kor.json').login;

export default function Register({ setForm }){
    const serverAddress = "";
    const [username, setUsername] = useState("");
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    function handleRegister(e){
        e.preventDefault();
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
            //pageToggle();
            //showSuccessMessage();
        })
        .catch((err) => {
            console.log("Cannot register", err)
        })
    }
    function pageToggle(){
        setForm('login')
    }
    const containerStyle = {
        maxWidth: '300px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)'
    }

    return(
        <div className="register-container" style={containerStyle}>
        <h2>{btnTexts[2]}</h2>
        <form onSubmit={handleRegister} method="post">
            <div className="form-group">
                <label htmlFor="Username">Username</label>
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="form-group">
                <label htmlFor="id">ID</label>
                <input type="text" id="reg-id" name="id" onChange={(e) => setUserid(e.target.value)} required />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="reg-password" name="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={{margin: '5px'}}>{btnTexts[2]}</button>
            <button id="back" type="button" onClick={pageToggle}>{btnTexts[3]}</button>
        </form>
    </div>
    )
}