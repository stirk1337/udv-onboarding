import { Navigate } from "react-router-dom";
import Content from "../components/user-components/content";

function MainPage({isAuth, userRole} : any) {

    return ( 
        <div>
            {!isAuth && <Navigate to="/"/>}
            {userRole === 'employee' && <Navigate to="/employee"/>}
            <Content />
        </div>
     );
}

export default MainPage;