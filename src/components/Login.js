import { React, useState } from "react";

const btnTexts = require('lang/kor.json').login;

export default function Login({ setForm }){
    const serverAddress = "";
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    function handleLogin(e){
        e.preventDefault();
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
            console.log("Cannot login", err)
        })
    }
    function pageToggle(){
        setForm('register')
    }
    const containerStyle = {
        maxWidth: '300px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
        
    }

    return(
        <div className="login-container" style={containerStyle}>
            <h2>{btnTexts[1]}</h2>
            <form onSubmit={handleLogin} method="post">
                <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input type="text" id="id" name="id" onChange={(e) => setUserid(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label> {/*For issue*/}
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{margin: '5px'}}>{btnTexts[1]}</button>
                <button id="register-btn" type="button" onClick={pageToggle}>{btnTexts[2]}</button>
            </form>
        </div>
    )
}