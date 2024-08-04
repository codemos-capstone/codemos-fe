import React, { useEffect, useState } from "react"
import { Routes, Route, useLocation } from 'react-router-dom';
import Docs from "views/Docs"
import LoginPage from "views/LoginPage"
import Leader from "views/Leader"
import OnLogin from "views/OnLogin"
import OAuthMiddle from "hooks/auth";
import ResetPassword from "components/Sign/ResetPassword";
import ProblemEdit from "components/Problem/ProblemEdit";
import ProblemList from "components/Problem/ProblemList";
import Landing from "views/Landing";
import StarField from "./components/StarField"; 
import CodeSpaces from "./views/CodeSpaces"; 
import MainView from "./views/MainView"; 
import UserPage from "views/UserPage";
import Layout from "components/Layout/Layout";

export default function App(){
    const location = useLocation();
    let pageName = location.pathname.split('/')[1];
    if (pageName === "") { pageName = 'main' }

    return(
        <div className={pageName}>
            <StarField /> {/* 전체 앱에 StarField 배경을 추가합니다. */}
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<MainView />} />
                    <Route path="/landing" element={<Landing/>}/>
                    {/* <Route path="/" element={<MainPage/>}/> */}
                    <Route path="/codespaces" element={<CodeSpaces/>}/>
                    <Route path="/docs" element={<Docs isVisible={false} />} />
                    <Route path="/login" element={<LoginPage/>} />
                    {/*<Route path="/userpage" element={<User/>} />*/}
                    <Route path="/leader" element={<Leader />} />
                    <Route path="/google/callback" element={<OnLogin />} />
                    <Route path="/oauthMiddle" element={<OAuthMiddle />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/admin">
                        <Route path="problem" element={<ProblemList />} />
                        <Route path="problem/edit/:id?" element={<ProblemEdit />} />
                    </Route>
                    <Route path="/userpage" element={<UserPage />} />
                </Route>
            </Routes>
        </div>
    )
}
