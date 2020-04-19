import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@material-ui/core";
import Drupal from "./resource/Drupal";
import moment from "moment";

enum CreationStatus {
    Name,
    Length,
    Description
}

const RequestModal = (props: { onClose: () => void }) => {
    const [creationForm, setForm] = useState<{
        description: string,
        length: string,
        type: string,
    }>({
        description: "",
        length: "00:00:00",
        type: "",
    });

    const [creationStatus, setCreationStatus] = useState<CreationStatus>(CreationStatus.Name);

    let description: string | undefined = undefined;
    let inputField: JSX.Element | JSX.Element[] | undefined = undefined;
    let previousHandler: () => void = () => {
    };
    let nextHandler: () => void = () => {
    };

    switch (creationStatus) {
        case CreationStatus.Name:
            description = "Alább add meg a létrehozandó kérés témáját!";
            inputField = (
                <>
                    <Button onClick={() => {
                        setForm({...creationForm, type: "Szabadidő"});
                        setCreationStatus(CreationStatus.Length);
                    }}>
                        Szabadidő
                    </Button>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="requestName"
                        label="Kérés címe"
                        type="text"
                        fullWidth
                        onChange={(event) => {
                            const newForm = {
                                ...creationForm,
                                type: event.target.value,
                            };
                            console.log(newForm);
                            setForm(newForm);
                        }}
                        value={creationForm.type}
                    />
                </>);
            previousHandler = () => {
                props.onClose();
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Description);
            };
            break;
        case CreationStatus.Description:
            description = "Add meg az eseményhez tartozó leírást!";
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="requestDesc"
                label="Kérés leírása"
                type="text"
                fullWidth
                multiline
                onChange={(event) => {
                    setForm({...creationForm, description: event.target.value})
                }}
                value={creationForm.description}
            />);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Name);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Length);
            };
            break;
        case CreationStatus.Length:
            if (creationForm.type === "Szabadidő"){
                description = "Mennyi időt szeretnél (óra:perc formátumban)"
            }else {
                description = "Mennyi időre van szükség, hogy az esemény elvégezhető legyen? (óra:perc formátumban)";
            }
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="requestLength"
                label="Cselekmény hossza"
                type="text"
                fullWidth
                onChange={(event) => {
                    setForm({...creationForm, length: event.target.value})
                }}
                value={creationForm.length}
            />);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Description);
            };
            nextHandler = () => {
                Drupal.backend.createEventRequest({
                    type: creationForm.type,
                    description: creationForm.description,
                    length: moment(creationForm.length, ['hh:mm:ss', 'hh:mm']),
                })
                    .then(_ => {
                        props.onClose();
                    });
            };
            break;
    }

    return (
        <div>
            <Dialog open onClose={props.onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Kérés létrehozó</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {description}
                    </DialogContentText>
                    {inputField}
                </DialogContent>
                <DialogActions>
                    <Button onClick={previousHandler} color="secondary">
                        Vissza
                    </Button>
                    <Button onClick={nextHandler} color="primary">
                        Tovább
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RequestModal;