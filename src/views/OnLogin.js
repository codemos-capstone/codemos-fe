import React, { useEffect } from "react"
import { useLocation } from 'react-router-dom';

export default function OnLogin(){
    const serverAddress = "https://codemos.site"
    const location = useLocation();
    const code = location.search.split(/code=([^&]*)/)[1];
    useEffect(() => {
        // fetch(serverAddress + "/google", {
        //     method: "POST"
        // })
    }, []);
    
    return(
        <div style={{color: "#fff"}}>구글 로그인 중</div>
    );
}