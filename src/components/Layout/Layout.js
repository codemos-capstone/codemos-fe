import React from "react";
import Header from "./Header";
import Footer from "./footer";
import { Outlet } from "react-router-dom";
import StarField from "./StarField";
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
    const { loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width:'100%', minHeight: '100%', justifyContent: "space-around"}}>
            <StarField />
            <Header />
            <main style={{display: "flex", flexGrow: '1', justifyContent: "center"}}>
                <Outlet />
            </main>
            <Footer />            
        </div>
    );
}