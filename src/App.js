import React, { useEffect, useState } from "react"
import { Routes, Route, useLocation } from 'react-router-dom';
//import MainPage from "views/MainPage"
import Docs from "views/Docs"
import LoginPage from "views/LoginPage"
import User from "views/User"
import Leader from "views/Leader"
import OnLogin from "views/OnLogin"
import OAuthMiddle from "hooks/auth";
import ResetPassword from "components/Sign/ResetPassword";
import ProblemEdit from "components/Problem/ProblemEdit";
import ProblemList from "components/Problem/ProblemList";
import Landing from "views/Landing";
import StarField from "./components/StarField"; 
import CodeSpace from "./views/CodeSpace"; 
import MainView from "./views/MainView"; 

export default function App(){
    const location = useLocation();
    let pageName = location.pathname.split('/')[1];
    if (pageName === "") { pageName = 'main' }
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        if (sessionStorage.getItem('jwtToken')) setIsLogin(true);
    }, []);

    return(
        <div className={pageName}>
            <StarField /> {/* 전체 앱에 StarField 배경을 추가합니다. */}
            <Routes>
                <Route path="/" element={<MainView/>}/>
                <Route path="/landing" element={<Landing/>}/>
                {/* <Route path="/" element={<MainPage isLogin={isLogin} setIsLogin={setIsLogin} />}/> */}
                <Route path="/codespace" element={<CodeSpace isLogin={isLogin} setIsLogin={setIsLogin} />}/>
                <Route path="/docs" element={<Docs isVisible={false} />} />
                <Route path="/login" element={<LoginPage setIsLogin={setIsLogin} />} />
                <Route path="/userpage" element={<User isLogin={isLogin} />} />
                <Route path="/leader" element={<Leader />} />
                <Route path="/google/callback" element={<OnLogin />} />
                <Route path="/oauthMiddle" element={<OAuthMiddle />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/admin/problem" element={<ProblemList />} />
                <Route path="/admin/problem/edit/:id?" element={<ProblemEdit />} />
            </Routes>
        </div>
    )
}
