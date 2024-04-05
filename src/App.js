import { React, useState } from "react"
import MainPage from "views/MainPage"
import Game from "views/Game"
import Docs from "views/Docs"
import Login from "views/LoginPage"
import User from "views/User"

export default function App(){
    const [page, setPage] = useState('main');
    const [isLogin, setIsLogin] = useState(false);
    let pageContent
    if (page === 'main')
        pageContent = <MainPage setPage={setPage} isLogin={isLogin}/>;
    else if (page === 'docs') {
        pageContent = <Docs />
    } else if (page === 'login') {
        pageContent = <Login isLogin={isLogin} setIsLogin={setIsLogin} />
    } else if (page === 'user-page'){
        pageContent = <User isLogin={isLogin} setPage={setPage} />
    } else if (page === 'game'){
        pageContent = <Game setPage={setPage} isLogin={isLogin}/>
    } else
        pageContent = <MainPage isLogin={isLogin} setPage={setPage}/>;
    return(
        <div className={page}>
            {pageContent}
        </div>
    )

}