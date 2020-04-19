import React, {useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem
} from "@material-ui/core";
import Drupal from "./resource/Drupal";

enum CreationStatus {
    Username,
    Password,
    Email,
    Role
}

const UserCreationModal = (props: { onClose: () => void }) => {
    const [creationForm, setForm] = useState<{
        username: string,
        password: string,
        email: string,
        role: string
    }>({
        username: "",
        password: "",
        email: "",
        role: "gyerek",
    });

    const [creationStatus, setCreationStatus] = useState<CreationStatus>(CreationStatus.Username);

    let description: string | undefined = undefined;
    let inputField: JSX.Element | undefined = undefined;
    let previousHandler: () => void = () => {
    };
    let nextHandler: () => void = () => {
    };

    switch (creationStatus) {
        case CreationStatus.Username:
            description = "Alább add meg a létrehozandó felhasználó nevét!";
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="userName"
                label="Felhasználó neve"
                type="text"
                fullWidth
                onChange={(event) => {
                    const newForm = {
                        ...creationForm,
                        username: event.target.value,
                    };
                    console.log(newForm);
                    setForm(newForm);
                }}
                value={creationForm.username}
            />);
            previousHandler = () => {
                props.onClose();
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Email);
            };
            break;
        case CreationStatus.Email:
            description = "Add meg a felhasználó email címét!";
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="userEmail"
                label="Email cím"
                type="email"
                fullWidth
                onChange={(event) => {
                    setForm({...creationForm, email: event.target.value})
                }}
                value={creationForm.email}
            />);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Username);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Password);
            };
            break;
        case CreationStatus.Password:
            description = "Add meg a felhasználó jelszavát!";
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="userPass"
                label="Jelszó"
                type="password"
                fullWidth
                onChange={(event) => {
                    setForm({...creationForm, password: event.target.value})
                }}
                value={creationForm.password}
            />);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Email);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Role);
            };
            break;
        case CreationStatus.Role:
            description = "Add meg a felhasználó jelszavát!";
            inputField = (<TextField
                id="select-role"
                select
                label="Szerepkör"
                value={creationForm.role}
                onChange={(event) => {
                    //@ts-ignore
                    setForm({...creationForm, role: event.target.value})
                }}
            >
                {[{text: "Gyerek", value: "gyerek"}, {text: "Szülő", value: "szulo"}, {text: "Nagyszülő", value: "nagyszulo"}].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.text}
                    </MenuItem>
                ))}
            </TextField>);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Role);
            };
            nextHandler = () => {
                Drupal.backend.createUser({
                    username: creationForm.username,
                    password: creationForm.password,
                    role: creationForm.role,
                    email: creationForm.email
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
                <DialogTitle id="form-dialog-title">Felhasználó létrehozó</DialogTitle>
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

export default UserCreationModal;