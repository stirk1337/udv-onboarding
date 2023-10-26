import { Link } from "react-router-dom";

function EnterPage() {
    return ( 
        <>
            <Link to="/registrations">Зарегестрироваться</Link>
            <Link to="/login">Войти</Link>
        </>
     );
}

export default EnterPage;