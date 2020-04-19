import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@material-ui/core";
import Drupal from "./resource/Drupal";
import moment from "moment";
import {DrupalUser, EventLocation, ScheduleEvent} from "./resource/Types";

// @ts-ignore

enum CreationStatus {
    Name,
    Description,
    Who,
    Where,
    Length,
    When,
    DueDate,
}

export interface ScheduleEventCreationInput {
    name: string,
    description: string,
    length: string,
    locationUUID: string,
    userUUIDs: string[]
    dueDateEnabled: boolean
    dueDate: string,
    isRepeat: boolean
    repeatRule: string,
    timeAt: string
}

const ScheduleEventModal: React.FunctionComponent<{
    onClose: () => void,
    users: DrupalUser[],
    locations: EventLocation[],
    events: ScheduleEvent[],
    initialState?: ScheduleEventCreationInput
}> = props => {
    let initState: ScheduleEventCreationInput = {
        description: "",
        name: "",
        locationUUID: "-",
        userUUIDs: [],
        dueDateEnabled: false,
        dueDate: moment().format('YYYY-MM-DD'),
        isRepeat: false,
        repeatRule: "* * * * * * *",
        timeAt: moment().add(1, 'days').format('YYYY-MM-DD[T]HH:mm:ss'),
        length: "00:00:00",
    }

    if (props.initialState) {
        initState = {...props.initialState};
    }

    const [creationForm, setForm] = useState<ScheduleEventCreationInput>(initState);

    const [creationStatus, setCreationStatus] = useState<CreationStatus>(CreationStatus.Name);

    let description: string | undefined = undefined;
    let inputField: JSX.Element | JSX.Element[] | undefined = undefined;
    let previousHandler: () => void = () => {
    };
    let nextHandler: () => void = () => {
    };

    switch (creationStatus) {
        case CreationStatus.Name:
            description = "Add meg az esemény típusát!";
            inputField = (
                <>
                    <Button onClick={() => {
                        setForm({...creationForm, name: "Bevásárlás"});
                        setCreationStatus(CreationStatus.Description);
                    }}>
                        Bevásárlás
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
                                name: event.target.value,
                            };
                            setForm(newForm);
                        }}
                        value={creationForm.name}
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
            if (creationForm.name === "Bevásárlás") {
                description = "Itt adhatod meg a bevásárlólistát!"
            } else {
                description = "Add meg az eseményhez tartozó leírást!";
            }
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
                setCreationStatus(CreationStatus.Who);
            };
            break;
        case CreationStatus.Who:
            if (creationForm.name === "Bevásárlás") {
                description = "Kik mennek bevásárolni?"
            } else {
                description = "Add meg kik vesznek részt!";
            }
            inputField = (
                <>
                    <InputLabel id="label">Résztvevők</InputLabel>
                    <Select multiple labelId="label" id="select" value={creationForm.userUUIDs} onChange={e => {
                        // @ts-ignore
                        const ray: string[] = e.target.value;
                        setForm({...creationForm, userUUIDs: ray})
                    }}>
                        {props.users.map(user => <MenuItem key={user.id} value={user.uuid}>{user.username}</MenuItem>)}
                    </Select>
                </>
            );
            previousHandler = () => {
                setCreationStatus(CreationStatus.Description);
            };
            nextHandler = () => {
                if (creationForm.userUUIDs.length !== 0) {
                    setCreationStatus(CreationStatus.Where);
                }
            }
            break;
        case CreationStatus.Where:
            description = "Add meg hol!";
            inputField = (
                <>
                    <InputLabel id="label">Helyszín</InputLabel>
                    <Select labelId="label" id="select" value={creationForm.locationUUID} onChange={e => {
                        if (typeof e.target.value === "string") {
                            const uuid: string = e.target.value;
                            setForm({...creationForm, locationUUID: uuid})
                        }
                    }}>
                        <MenuItem value="-" key="0">Sehol</MenuItem>
                        {props.locations.map(location => <MenuItem key={location.id}
                                                                   value={location.uuid}>{location.name}</MenuItem>)}
                    </Select>
                </>
            );
            previousHandler = () => {
                setCreationStatus(CreationStatus.Who);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.DueDate);
            };
            break;
        case CreationStatus.DueDate:
            description = "Add van-e határidő, és ha igen mikor!";
            inputField = (<>
                <FormControlLabel
                    control={<Checkbox
                        checked={creationForm.dueDateEnabled}
                        onChange={e => {
                            setForm({...creationForm, dueDateEnabled: e.target.checked})
                        }}
                    />}
                    label="Határidő"
                />
                <div hidden={!creationForm.dueDateEnabled}>
                    <TextField
                        id="date"
                        label="Határidő"
                        type="date"
                        value={creationForm.dueDate}
                        onChange={e => {
                            console.log(e.target.value);
                            setForm({...creationForm, dueDate: e.target.value})
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </>);
            previousHandler = () => {
                setCreationStatus(CreationStatus.Where);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.Length);
            };
            break;
        case CreationStatus.Length:
            description = "Mennyi időre van szükség, hogy az esemény elvégezhető legyen? (óra:perc formátumban)";
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
                setCreationStatus(CreationStatus.DueDate);
            };
            nextHandler = () => {
                setCreationStatus(CreationStatus.When);
            };
            break;
        case CreationStatus.When:
            description = "Add mikor, vagy egy ismétlési szabály CRON használatával!";
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
                        label="Határidő"
                        type="datetime-local"
                        value={creationForm.timeAt}
                        onChange={e => {
                            setForm({...creationForm, timeAt: e.target.value})
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
                setCreationStatus(CreationStatus.Length);
            };
            nextHandler = () => {
                const data = {
                    name: creationForm.name,
                    repeatRule: creationForm.isRepeat ? creationForm.repeatRule.replace("MON-FRI", "1-5") : "0",
                    content: creationForm.description,
                    length: moment(creationForm.length, ['hh:mm:ss']),
                    startDateTime: moment(creationForm.timeAt, ['YYYY-MM-DD[T]HH:mm:ss']),
                    locationUUID: creationForm.locationUUID,
                    dueDate: creationForm.dueDateEnabled ? creationForm.dueDate : "",
                    userUUIDs: creationForm.userUUIDs,
                };

                Drupal.backend.createScheduleEvent(data)
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

export default ScheduleEventModal;