import React, { useEffect, useRef } from 'react'
import { Modal, Button } from "react-bootstrap"

const DeleteConfirm = ({ onHide, show, confirmDelete, text = "Deletion", actionText = 'Delete' }) => {
    const deleteRef: any = useRef<any>(null);

    useEffect(() => {
        if (deleteRef !== null) {
            // deleteRef.current.focus()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="sm"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Confirm {text}
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="danger" ref={deleteRef} onClick={confirmDelete}>{actionText}</Button>
                <Button variant="dark" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteConfirm
