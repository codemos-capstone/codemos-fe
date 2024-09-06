import { useState } from "react";

export default function useLogin() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        fetch(`${serverAddress}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then(token => {
            // console.log('Login successful!');
            sessionStorage.setItem('accessToken', token.accessToken);
            alert("로그인 성공");
            window.location.href = "/";
        })
        .catch(err => {
            console.error("Login failed:", err.message);
            alert("아이디 혹은 비밀번호를 확인하세요.");
        });
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin
    };
}
