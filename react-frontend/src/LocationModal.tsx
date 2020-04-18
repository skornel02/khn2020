import React, {ChangeEvent, useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button} from "@material-ui/core";
import Drupal from "./resource/Drupal";

const LocationModal = (props: {onClose: () => void}) => {
    const [locationName, setLocationName] = useState<string>("");

    const createLocation = () => {
        Drupal.backend.createLocation({name: locationName})
            .then(_ => {
                props.onClose();
            })
    }

    return (
        <div>
            <Dialog open onClose={props.onClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Helyszín létrehozó</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Az alábbi beviteli mezőbe írd be, hogy milyen helyszín szeretnél hozzáadni (pl. számítógép).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="location"
                        label="Helyszín neve"
                        type="text"
                        fullWidth
                        onChange={(event) => setLocationName(event.target.value)}
                        value={locationName}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="secondary">
                        Mégse
                    </Button>
                    <Button onClick={createLocation} color="primary">
                        Létrehozás
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default LocationModal;