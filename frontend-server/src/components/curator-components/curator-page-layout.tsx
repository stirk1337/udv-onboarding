import { Outlet, useNavigate } from "react-router-dom";
import CuratorHeader from "./curator-header";
import Header from "../user-components/header";
import { useEffect } from "react";

type CuratorPageLayoutProps = {
    userRole: string
}

function CuratorPageLayout({userRole}: CuratorPageLayoutProps) {
    const navigate = useNavigate()
    const path = location.pathname.split('/')[1]

    useEffect(() => {
        if(path !== userRole && userRole !== 'undefined') {
            navigate('/' + userRole)
        }
    })

    return ( 
        <>
            {userRole === 'employee' && <Header/>}
            {userRole === 'curator' && <CuratorHeader/>}
            {path === userRole && <Outlet/>}
        </>
     );
}

export default CuratorPageLayout;