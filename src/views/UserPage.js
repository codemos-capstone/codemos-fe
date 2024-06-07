import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "components/Header/Header";
import Footer from "components/footer/footer";
import UserInfo from "components/UserInfo/UserInfo";

export default function UserPage(){
    const serverAddress = process.env.REACT_APP_SERVER_ADDRESS;
    const [user, setUser] = useState({
        username: "Hi",
        email: "tt@tt.com",
        solvedCtn: 999,
        solved: [
            1000, 1001, 1002, 1003, 1005, 1006, 1007, 1008, 1009, 1010
        ]
    })
    useEffect(() => {
        fetchUser(serverAddress, setUser);
    }, []);
    
    return (
        <div className="container" style={{}}>
            <Header />
            <div className="body" style={{width: "100%", display: "flex", justifyContent: "center", marginTop: "5%"}}>
                <UserInfo user={user} />
            </div>
            <Footer />
        </div>
    )

}

async function fetchUser(serverAddress, setUser) {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await axios.get(`${serverAddress}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error(`Error fetching user info:`, error);
      console.log(`Failed to load user info. Please try again later.`);
    }
}