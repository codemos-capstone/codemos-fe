import React from "react"
import { Routes, Route, useLocation } from 'react-router-dom';
import Docs from "views/Docs"
import SignPage from "views/SignPage"
import Leader from "views/Leader"
import OnLogin from "views/OnLogin"
import OAuthMiddle from "hooks/auth";
import ResetPassword from "components/Sign/ResetPassword";
import ProblemEdit from "components/Problem/ProblemEdit";
import ProblemList from "components/Problem/ProblemList";
import Landing from "views/Landing";
import CodeSpaces from "./views/CodeSpaces"; 
import MainView from "./views/MainView"; 
import UserPage from "views/UserPage";
import Layout from "components/Layout/Layout";
import NotFound from "views/NotFound";
import UserProfile from "./views/UserProfile";
import { AuthProvider } from './contexts/AuthContext';

export default function App(){
    const location = useLocation();
    let pageName = location.pathname.split('/')[1];
    if (pageName === "") { pageName = 'main' }

    return(
        <AuthProvider>
        <div className={pageName} style={{ height: "100%", display: "flex"}}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<MainView />} />
                    <Route path="/landing" element={<Landing/>}/>
                    <Route path="/codespaces" element={<CodeSpaces/>}/>
                    <Route path="/docs" element={<Docs isVisible={false} />} />
                    <Route path="/sign/:formType" element={<SignPage/>} />
                    <Route path="/leader/:problemId" element={<Leader />} />
                    <Route path="/google/callback" element={<OnLogin />} />
                    <Route path="/oauthMiddle" element={<OAuthMiddle />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/admin">
                        <Route path="problem" element={<ProblemList />} />
                        <Route path="problem/edit/:id?" element={<ProblemEdit />} />
                    </Route>
                    <Route path="/profile/:nickname" element={<UserProfile />} />
                    <Route path="/userpage" element={<UserPage />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </div>
        </AuthProvider>
    )
}
