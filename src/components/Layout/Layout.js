import Header from "components/Layout/Header";
import React from "react";
import Footer from "./footer";
import { Outlet } from "react-router-dom";
import StarField from "components/Layout/StarField";

export default function Layout(){
    return(
        <div style={{ display: 'flex', flexDirection: 'column', width:'100%', minHeight: '100%', justifyContent: "space-around"}}>
            <StarField /> {/* 전체 앱에 StarField 배경을 추가합니다. */}
            <Header />
            <main style={{display: "flex", flexGrow: '1', justifyContent: "center"}}>
                <Outlet />
            </main>
            <Footer />            
        </div>
    )
}