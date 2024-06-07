import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [email, setEmail] = useState("");

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
        <div>
            <h2>비밀번호 재설정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" name="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit">재설정 메일 보내기</button>
            </form>
        </div>
    );
}
