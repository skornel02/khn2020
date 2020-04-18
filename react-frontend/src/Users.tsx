import React from 'react';
import {DrupalUser, RequestStatus, UserRole} from "./resource/Types";

const Users = (props: {users: DrupalUser[]}) => {
    const renderUsers = () => {
        if (!props.users){
            return null;
        }

        return props.users.map(user => {
            let role: string;

            switch (user.role) {
                case UserRole.Anon:
                    role = "Ismeretlen!"
                    break;
                case UserRole.Grandma:
                    role = "Nagyszülő!"
                    break;
                case UserRole.Kid:
                    role = "Gyerek!"
                    break;
                case UserRole.Parent:
                    role = "Szülő!"
                    break;
            }

            return <div key={user.id} className="border">
                <p>Név: {user.username}</p>
                <p>Szerepkör: {role}</p>
            </div>;
        })
    }

    return (
        <div>
            {renderUsers()}
        </div>
    );
};

export default Users;