import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function ResetPassword() {

    const containerStyle = {
        marginTop: '10%',
        maxWidth: '300px',
        margin: 'auto',
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)'
    };
    
    const labelStyle = {
        float: 'left',
        fontSize: '60%'
    };
    
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");

        if(newPassword == confirmPassword) try {
            await axios.post(
                serverAddress + "/auth/reset-password",
                { newPassword },
                {
                    params: { token },
                }
            );
            alert("비밀번호가 성공적으로 재설정되었습니다.");
            navigate("/login");
        } catch (error) {
            console.error("비밀번호 재설정 실패:", error);
            alert("비밀번호 재설정에 실패했습니다. 다시 시도해주세요.");
        } else {
            alert("비밀번호 재 확인")
        }
    };

    return (
        
        <div className="login-container" style={containerStyle}>
            <h2>비밀번호 재설정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password" style={labelStyle}>Password</label>
                    <input type="password" id="reg-password" name="password" placeholder="Enter your password" onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                    <input type="password" id="re-password" name="re-password" placeholder="Re-enter your password" onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{ margin: '5px' }}>비밀번호 재설정</button>
            </form>
        </div>
    );
}
