import React from "react";
import './Main.css';
import File from './File/File'
import Code from './Code/Code'
import ColabHeader from "./Header/ColabHeader";

export default function Main({isLogin, setIsLogin}){
    return(
        <div className='contents'>
            <ColabHeader></ColabHeader>
            <div className="space">
                <File></File>
                <Code></Code>
            </div>
        </div>
    );
}
