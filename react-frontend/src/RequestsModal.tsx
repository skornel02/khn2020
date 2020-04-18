import React from 'react';
import Modal from "react-modal";
import {EventRequest} from "./resource/Types";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: "350px"
    }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

function RequestsModal(props: { onClose: () => void, requests: EventRequest[] | undefined }) {
    const [modalIsOpen, setIsOpen] = React.useState(true);

    function closeModal() {
        setIsOpen(false);
        props.onClose();
    }

    function renderRequests() {
        if (!props.requests) {
            return null
        }

        return props.requests.map(request => {
            return (
                <div>
                    <p>Kérés: {request.type}</p>
                    <p>Leírás: {request.description}</p>
                    <p>Létrehozás ideje: {request.creationDate}</p>
                    <p>Cselekvés hossza: {request.length}</p>
                    <p>Elfoagdva?: {request.status}</p>
                </div>
            )
        })
    }

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Kérelmek"
            >

                <h1 className="text-center">Kérelmek</h1>
                <div>
                    {renderRequests()}
                </div>
            </Modal>
        </div>
    );
}

export default RequestsModal;