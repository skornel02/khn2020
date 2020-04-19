import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, FormControlLabel, FormLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import Drupal from "./resource/Drupal";
import moment from "moment";
import {DrupalUser, EventLocation} from "./resource/Types";

enum CreationStatus {
    Name,
    RepeatRule,
    StartDateTime,
    Length,
    Users
}

const RuleCreationModal: React.FunctionComponent<{
    onClose: () => void,
    users: DrupalUser[],
}> = props => {
    const [creationForm, setForm] = useState<{
        name: string,
        repeatRule: string,
        startDateTime: string,
        length: string,
        userUUIDs: string[],
        isRepeat: boolean
    }>({
        name: "",
        repeatRule: "0",
        startDateTime: moment().add(1, 'days').format('YYYY-MM-DD[T]HH:mm:ss'),
        length: "00:00:00",
        userUUIDs: [],
        isRepeat: false
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
            description = "Add meg az tiltás okát!";
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="requestName"
                label="Tiltás oka"
                type="text"
                fullWidth
                onChange={(event) => {
                    const newForm = {
                        ...creationForm,
                        name: event.target.value,
                    };
                    setForm(newForm);
                }}
                value={creationForm.name}
            />);
            previousHandler = () => {
                props.onClose();
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.RepeatRule);
            };
            break;
        case CreationStatus.RepeatRule:
            description = "Add meg az ismétlést (cron)!";
            inputField = (<>
                <FormControlLabel
                    control={<Checkbox
                        name={"repeat"}
                        checked={creationForm.isRepeat}
                        onChange={e => {
                            setForm({...creationForm, isRepeat: e.target.checked})
                        }}
                    />}
                    label="Ismétlés"
                />
                <div hidden={creationForm.isRepeat}>
                    <TextField
                        id="date"
                        label="Kezdési idő"
                        type="datetime-local"
                        value={creationForm.startDateTime}
                        onChange={e => {
                            setForm({...creationForm, startDateTime: e.target.value})
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <div hidden={!creationForm.isRepeat}>
                    <a target="_blank" href="https://crontab-generator.org/">Katt ide CRON létrehozóért (angol)</a>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="requestName2"
                        label="Cron"
                        type="text"
                        fullWidth
                        onChange={event => {
                            const newForm = {
                                ...creationForm,
                                repeatRule: event.target.value,
                            };
                            setForm(newForm);
                        }}
                        value={creationForm.name}
                    />
                </div>
            </>);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Name);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Length);
            };
            break;
        case CreationStatus.Length:
            description = "Add meg a tiltás hosszát (óra:perc formátumban)!";
            inputField = (<TextField
                autoFocus
                margin="dense"
                id="requestLength"
                label="Tiltás hossza"
                type="text"
                fullWidth
                onChange={(event) => {
                    setForm({...creationForm, length: event.target.value})
                }}
                value={creationForm.length}
            />);
            previousHandler = () => {
                setCreationStatus(CreationStatus.RepeatRule);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Users);
            };
            break;
        case CreationStatus.Users:
            description = "Kiknek szól a tiltás!";
            inputField = (
                <>
                <InputLabel id="label">Résztvevők</InputLabel>
                <Select multiple labelId="label" id="select" value={creationForm.userUUIDs} onChange={e => {
                    // @ts-ignore
                    const ray: string[] = e.target.value;
                    console.log(ray);
                    setForm({...creationForm, userUUIDs: ray})
                }}>
                    {props.users.map(user => <MenuItem key={user.id} value={user.uuid}>{user.username}</MenuItem>)}
                </Select>
            </>);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Length);
            };
            nextHandler = () => {
                Drupal.backend.createRule({
                    name: creationForm.name,
                    length: moment(creationForm.length, ['hh:mm:ss', 'hh:mm']),
                    repeatRule: creationForm.isRepeat ? creationForm.repeatRule : "0",
                    startDateTime: !creationForm.isRepeat ? moment(creationForm.startDateTime, ['YYYY-MM-DD[T]HH:mm:ss']) : moment(),
                    userUUIDs: creationForm.userUUIDs
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
                <DialogTitle id="form-dialog-title">Tiltás létrehozó</DialogTitle>
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

export default RuleCreationModal;