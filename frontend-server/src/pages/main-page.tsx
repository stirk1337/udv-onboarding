import { Navigate } from "react-router-dom";
import Logout from "../components/logout";

function MainPage({onLogin, isAuth} : any) {
    return ( 
        <>
            {!isAuth && <Navigate to="/"/>}
            <Logout onLogin={onLogin}/>
        </>
     );
}

export default MainPage;