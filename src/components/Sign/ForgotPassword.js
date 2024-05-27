import React, { useState } from "react";
import axios from "axios";



export default function ForgotPassword() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [email, setEmail] = useState("");


    const containerStyle = {
        marginTop: '10%',
        maxWidth: '300px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
    };
    const labelStyle = {
        float: 'left',
        fontSize: '60%'
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(serverAddress + "/auth/change-pwd?email=" + email);
            alert("비밀번호 재설정 메일이 발송되었습니다. 메일함을 확인해주세요.");
        } catch (error) {
            console.error("비밀번호 재설정 메일 발송 실패:", error);
            alert("비밀번호 재설정 메일 발송에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="login-container" style={containerStyle}>
        <h2>비밀번호 재설정</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="id" style={labelStyle}>Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" style={{ margin: '5px' }}>재설정 메일 전송</button>
        </form>
        </div>
    );
}
