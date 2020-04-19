import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button} from "@material-ui/core";
import Drupal from "./resource/Drupal";
import moment from "moment";

const RequestModal = (props: {onClose: () => void}) => {
    const [requestName, setRequestName] = useState<string>("");
    const [requestDescription, setRequestDescription] = useState<string>("");
    const [requestLength, setRequestLength] = useState<moment.Moment>(moment());
    const [requestReadyStatus, setRequestReadyStatus] = useState<string>("name");

    const [modalText, setModalText] = useState<string>("Alább add meg a létrehozandó kérés témáját!");
    const [modalInput, setModalInput] = useState<JSX.Element>(<TextField
        autoFocus
        margin="dense"
        id="requestName"
        label="Kérés címe"
        type="text"
        fullWidth
        onChange={(event) => {
            console.log(event.target);
            setRequestName(event.target.value)
        }}
        value={requestName}
    />);

    const createRequest = () => {
        switch (requestReadyStatus) {
            case "name":
                setModalText("Add meg az eseményhez tartozó leírást!");
                setModalInput(<TextField
                    autoFocus
                    margin="dense"
                    id="requestDesc"
                    label="Kérés leírása"
                    type="text"
                    fullWidth
                    multiline
                    onChange={(event) => setRequestDescription(event.target.value)}
                    value={requestDescription}
                />)
                setRequestReadyStatus("description")
                break;
            case "description":
                setModalText("Mennyi időre van szükség, hogy az esemény elvégezhető legyen? (óra:perc formátumban)");
                setModalInput(<TextField
                    autoFocus
                    margin="dense"
                    id="requestLength"
                    label="Cselekmény hossza"
                    type="text"
                    fullWidth
                    onChange={(event) => setRequestLength(moment(event.target.value, ["hh:mm"]))}
                    value={requestLength.hours() + ":" + requestLength.minutes()}
                />);
                setRequestReadyStatus("length");
                break;
            case "length":{
                Drupal.backend.createEventRequest({
                    type: requestName,
                    description: requestDescription,
                    length: requestLength,
                })
                    .then(_ => {
                        props.onClose();
                    })
                break;
            }
        }
    }

    return (
        <div>
            <Dialog open onClose={props.onClose} aria-labelledby="form-dialog-title" >
                <DialogTitle id="form-dialog-title">Kérés létrehozó</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {modalText}
                    </DialogContentText>
                    {modalInput}
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="secondary">
                        Mégse
                    </Button>
                    <Button onClick={createRequest} color="primary">
                        Tovább
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RequestModal;