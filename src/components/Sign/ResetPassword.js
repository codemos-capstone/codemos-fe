import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
    const serverAddress = process.env.SERVER_ADDRESS;
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");

        try {
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
        }
    };

    return (
        <div>
            <h2>비밀번호 재설정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="newPassword">새 비밀번호</label>
                    <input type="password" id="newPassword" name="newPassword" placeholder="새 비밀번호를 입력하세요" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit">비밀번호 재설정</button>
            </form>
        </div>
    );
}
