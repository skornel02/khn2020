import React from 'react';
import {UserRole} from "./resource/Types";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FolderIcon from '@material-ui/icons/Folder';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

interface Props {
    toMain?: () => void,
    toRequests?: () => void,
    toUsers?: () => void,
    userRole: UserRole
}

function Menu(props: Props) {
    return (
        <>
            <ul className="flex">
                <li className="mr-6">
                    <a className="text-blue-500 hover:text-blue-800" href="#fooldal" onClick={props.toMain}>Főoldal</a>
                </li>
                <li className="mr-6">
                    <a className="text-blue-500 hover:text-blue-800" href="#kerelmek"
                       onClick={props.toRequests}>Kérelmek</a>
                </li>
                <li className="mr-6">
                    <a className="text-blue-500 hover:text-blue-800" href="#csaladtagok" onClick={props.toUsers}>Család
                        tagok</a>
                </li>
            </ul>
            <BottomNavigation value={"recents"} onChange={() => {}}>
                <BottomNavigationAction label="Recents" value="recents" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
                <BottomNavigationAction label="Folder" value="folder" icon={<FolderIcon />} />
            </BottomNavigation>
        </>
    );
}

export default Menu;