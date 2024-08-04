import Header from "components/Layout/Header";
import React from "react";
import Footer from "./footer";
import { Outlet } from "react-router-dom";
import StarField from "components/StarField";

export default function Layout(){
    return(
        <>
            <StarField /> {/* 전체 앱에 StarField 배경을 추가합니다. */}
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}