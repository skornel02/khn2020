import React from 'react';
import {UserRole} from "./resource/Types";

interface Props {
    toMain?: () => void,
    toRequests?: () => void,
    toUsers?: () => void,
    userRole: UserRole
}

function Menu(props: Props) {
    return (
        <ul className="flex">
            <li className="mr-6">
                <a className="text-blue-500 hover:text-blue-800" href="#fooldal" onClick={props.toMain}>Főoldal</a>
            </li>
            <li className="mr-6">
                <a className="text-blue-500 hover:text-blue-800" href="#kerelmek" onClick={props.toRequests}>Kérelmek</a>
            </li>
            <li className="mr-6">
                <a className="text-blue-500 hover:text-blue-800" href="#csaladtagok" onClick={props.toUsers}>Család tagok</a>
            </li>
        </ul>
    );
}

export default Menu;