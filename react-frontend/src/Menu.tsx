import React, {useState} from 'react';
import {UserRole} from "./resource/Types";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {Edit, Home, Person} from "@material-ui/icons";

interface Props {
    toMain: () => void,
    toRequests: () => void,
    toUsers?: () => void,
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
                if (props.toUsers) {
                    props.toUsers();
                }
                break;
            case "edit":
                props.toRequests();
                break;
        }
    };

    return (
        <>
            <BottomNavigation value={menu} onChange={handleChange}>
                <BottomNavigationAction label="Főoldal" value="home" icon={<Home />} />
                <BottomNavigationAction label="Kérelmek" value="edit" icon={<Edit />} />
                <BottomNavigationAction label="Emberek" value="people" icon={<Person />} />
            </BottomNavigation>
        </>
    );
}

export default Menu;