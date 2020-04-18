import React, {useState} from 'react';
import {UserRole} from "./resource/Types";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {Edit, ExitToApp, Home, Person} from "@material-ui/icons";
import Drupal from "./resource/Drupal";

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
            <BottomNavigation value={menu} onChange={handleChange}>
                <BottomNavigationAction label="Főoldal" value="home" icon={<Home />} />
                {props.userRole === UserRole.Parent ?
                <BottomNavigationAction label="Kérelmek" value="edit" icon={<Edit />} />
                : null}
                <BottomNavigationAction label="Emberek" value="people" icon={<Person />} />
                <BottomNavigationAction label="Kijelentkezés" value="logout" icon={<ExitToApp />} />
            </BottomNavigation>
        </>
    );
}

export default Menu;