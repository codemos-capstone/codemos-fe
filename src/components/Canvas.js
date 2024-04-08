import React, { useRef, useEffect } from "react";

export default function Canvas({ appState }){
    const canvasRef = useRef(null);
    let scale = window.devicePixelRatio;
    let height = window.innerHeight;
    let width = window.innerWidth;
    

    useEffect(()=>{
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        element.width = Math.floor(width * scale);
        element.height = Math.floor(height * scale);
        
        height = window.innerHeight;
        width = window.innerWidth;
        scale = window.devicePixelRatio;
        context.scale(scale, scale)
    }, [window.innerHeight, window.innerWidth])
    useEffect(()=>{
        //draw
    }, [appState])

    return(<canvas ref={canvasRef} style={{width: `${width}px`, height: `${height}px`}}></canvas>);
};