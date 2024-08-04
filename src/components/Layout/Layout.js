import Header from "components/Layout/Header";
import React from "react";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

export default function Layout(){
    return(
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}