import React from 'react';
import {EventRequest, RequestStatus} from "./resource/Types";

function Requests(props: { requests: EventRequest[] | undefined }) {
    const renderRequest = () => {
        if (!props.requests){
            return null;
        }

        return props.requests.map(request => {
            let status: string;

            console.log(request.status);
            console.log(RequestStatus.AwaitingConfirmation);
            switch (request.status) {
                case RequestStatus.Accepted:
                    status = "Elfogadva!";
                    break;
                case RequestStatus.AwaitingConfirmation:
                    status = "Elfogadásra vár!";
                    break;
                case RequestStatus.Rejected:
                    status = "Elutasítva!";
                    break;
            }

            return <div key={request.id} className="border">
                <p>Kérés: {request.type}</p>
                <p>Leírás: {request.description}</p>
                <p>Cselekmény hossza: {request.length.format("HH:mm")}</p>
                <p>Elfogadva?: {status}</p>
                <p>Létrehozva: {request.creationDate.format("YYYY/MM/DD")}</p>
            </div>;
        })
    }

    return (
        <div className="block">
            {renderRequest()}
        </div>
    );
}

export default Requests;