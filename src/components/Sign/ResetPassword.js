import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
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
            alert("Successfully reset your password.");
            navigate("/login");
        } catch (error) {
            console.error("Failed to reset password:", error);
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
}
