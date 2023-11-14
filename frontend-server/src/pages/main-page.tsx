import { Navigate } from "react-router-dom";
import Logout from "../components/logout";
import Header from "../components/user-components/header";
import Content from "../components/user-components/content";

function MainPage({onLogin, isAuth, userRole} : any) {

    return ( 
        <div>
            {!isAuth && <Navigate to="/"/>}
            {userRole === 'curator' && <Navigate to="/curator"/>}
            <Content />
            {/*<Logout onLogin={onLogin}/>*/}
        </div>
     );
}

export default MainPage;