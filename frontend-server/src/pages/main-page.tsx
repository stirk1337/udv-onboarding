import { Navigate } from "react-router-dom";
import Logout from "../components/logout";
import Header from "../components/header";
import Content from "../components/content";
import { useState } from "react";

function MainPage({onLogin, isAuth} : any) {
    const [isVisibleProfileButtons, setVisibleProfileButtons] = useState(false)
    
    function profileClickHandler(){
        setVisibleProfileButtons(!isVisibleProfileButtons); 
    }

    return ( 
        <>
            {!isAuth && <Navigate to="/"/>}
            <Header onClickProfile={profileClickHandler}/>
            <Content isVisibleProfileButtons={isVisibleProfileButtons} />
            {/*<Logout onLogin={onLogin}/>*/}
        </>
     );
}

export default MainPage;