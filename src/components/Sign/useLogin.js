import { useState } from "react";

export default function useLogin() {
    const serverAddress = process.env.SERVER_ADDRESS;
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
            console.log('Login successful!');
            sessionStorage.setItem('accessToken', token.accessToken);
            alert("로그인 성공");
            window.location.href = "/"; // 루트 패스로 이동
        })
        .catch(err => {
            console.error("Login failed:", err.message);
            alert(err.message);
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
