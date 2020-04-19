import React, {useState} from 'react';
import {UserRole} from "./resource/Types";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {Edit, ExitToApp, Home, Person} from "@material-ui/icons";
import Drupal from "./resource/Drupal";
import banner from "./assets/banner.png";

interface Props {
    toMain: () => void,
    toRequests: () => void,
    toUsers: () => void,
    toLogin: () => void
    userRole: UserRole
}

function Menu(props: Props) {
    const [menu, setMenu] = useState<string>("home");

    const handleChange = (event: any, newValue: any) => {
        setMenu(newValue);
        switch (newValue) {
            case "home":
                props.toMain();
                break;
            case "people":
                props.toUsers();
                break;
            case "edit":
                props.toRequests();
                break;
            case "logout":
                Drupal.logout();
                props.toLogin();
                break;
        }
    };

    return (
        <>
            <BottomNavigation value={menu} onChange={handleChange} style={{backgroundImage: "url('" + banner + "')", backgroundPosition: "center", backgroundSize: "cover"}}>
                <BottomNavigationAction style={{backgroundColor: "rgba(255,255,255,0.5)"}} label="Kijelentkezés" value="logout" icon={<ExitToApp />} />
                <BottomNavigationAction style={{backgroundColor: "rgba(255,255,255,0.5)"}} label="Főoldal" value="home" icon={<Home />} />
                {props.userRole === UserRole.Parent ?
                <BottomNavigationAction style={{backgroundColor: "rgba(255,255,255,0.5)"}} label="Kérelmek" value="edit" icon={<Edit />} />
                : null}
                <BottomNavigationAction style={{backgroundColor: "rgba(255,255,255,0.5)"}} label="Emberek" value="people" icon={<Person />} />
            </BottomNavigation>
        </>
    );
}

export default Menu;