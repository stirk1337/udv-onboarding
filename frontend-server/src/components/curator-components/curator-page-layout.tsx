import { Outlet } from "react-router-dom";
import CuratorHeader from "./curator-header";
import Header from "../user-components/header";

type CuratorPageLayoutProps = {
    userRole: string
}

function CuratorPageLayout({userRole}: CuratorPageLayoutProps) {
    return ( 
        <>
            {userRole === 'employee' && <Header/>}
            {userRole === 'curator' && <CuratorHeader/>}
            <Outlet/>
        </>
     );
}

export default CuratorPageLayout;