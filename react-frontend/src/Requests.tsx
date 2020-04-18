import React from 'react';
import {EventRequest} from "./resource/Types";

function Requests(props: { requests: EventRequest[] | undefined }) {
    const renderRequest = () => {
        if (!props.requests){
            return null;
        }

        return props.requests.map(request => {
            return <div>
                <p>Kérés: {request.type}</p>
                <p>Leírás: {request.description}</p>
            </div>;
        })
    }

    return (
        <div>
            {renderRequest()}
        </div>
    );
}

export default Requests;