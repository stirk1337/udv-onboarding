import {Navigate} from 'react-router-dom';

type AuthCheckerProps ={
    children: JSX.Element;
    isAuth: boolean;
}

function AuthChecker({ children, isAuth}: AuthCheckerProps) {
  console.log(isAuth)
  return (
    isAuth ? children : <Navigate to={'/enter-page'}/>
  );
}

export default AuthChecker;