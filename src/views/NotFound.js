import React, { useEffect } from "react";

export default function NotFound(){
    useEffect(()=>{
        window.history.replaceState({}, '', '/404');
    }, [])
    return(
        <div style={{
            height: "100%", // Viewport height
            display: "flex", // Flexbox to center content
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "white",
            fontSize: "30px"}}>
            404 Not Found
        </div>
    )
}