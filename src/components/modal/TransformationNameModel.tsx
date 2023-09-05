import React from 'react'
import { Button, Modal } from "react-bootstrap"

const TransformationNameModel = ({ onHide, show, confirmChange }: { onHide: any, show: boolean, confirmChange: any }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    You have unsaved changes, Please confirm you action?
                </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="dark" onClick={() => confirmChange()}>Confirm</Button>
                <Button variant="dark" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default TransformationNameModel