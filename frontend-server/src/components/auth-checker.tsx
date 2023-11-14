import {Navigate} from 'react-router-dom';

type AuthCheckerProps ={
    children: JSX.Element;
    isAuth: boolean;
    userRole: string
}

function AuthChecker({ children, isAuth, userRole}: AuthCheckerProps) {
  const rootLocation = location.pathname.split('/')[1]
  return (
    <>
      {isAuth ? children : <Navigate to={'/login'}/>}
      {userRole !== rootLocation && <Navigate to={'/'}/>}
    </>
  );
}

export default AuthChecker;