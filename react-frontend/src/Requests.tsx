import React from 'react';
import {DrupalUser, EventRequest, RequestStatus} from "./resource/Types";
import {Button} from "@material-ui/core";
import Drupal from "./resource/Drupal";
import moment from "moment";

const Requests: React.FunctionComponent<{
    requests: EventRequest[],
    users: DrupalUser[],
    createEventFromRequest: (request: EventRequest) => void,
}> = props => {
    const updateRequest = (request: EventRequest, status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Accepted:
                props.createEventFromRequest(request);
                break;
            case RequestStatus.Rejected:
                Drupal.backend.updateRequest(request, status);
                break;
        }
    };

    const requests = props.requests
        .filter(request => {
            return request.status === RequestStatus.AwaitingConfirmation && !request.creationDate.isBefore(moment().add(-1, 'day'))
        });

    const renderRequest = () => {
        return requests.map(request => {
            let status: string;

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
                <p>Létrehozta: {props.users.find(user => user.id === request.userId)!.username}</p>
                <p>Kérés: {request.type}</p>
                <p>Leírás: {request.description}</p>
                {request.length !== undefined ? <p>Cselekmény hossza: {request.length.format("HH:mm")}</p> : <></>}
                <p>Elfogadva?: {status}</p>
                <p>Létrehozva: {request.creationDate.format("LLLL")}</p>
                {request.status === RequestStatus.AwaitingConfirmation ? <>
                    <Button color="primary" onClick={() => updateRequest(request, RequestStatus.Accepted)}>
                        Elfogad
                    </Button>
                    <Button color="primary" onClick={() => updateRequest(request, RequestStatus.Rejected)}>
                        Elutasít
                    </Button>
                </> : <></>
                }
            </div>;
        })
    };

    return (
        <div className="block">
            {renderRequest()}
        </div>
    );
}

export default Requests;