import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(serverAddress + "/auth/change-pwd?email=" + email);
            alert("Password reset mail is sent. Check your mailbox.");
        } catch (error) {
            console.error("Failed to send the reset mail:", error);
            alert("Failed to send the reset mail. Please try again.");
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit">Send Email</button>
            </form>
        </div>
    );
}
