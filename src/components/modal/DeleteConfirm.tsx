import React, { useEffect, useRef } from 'react'
import { Modal, Button, Container } from "react-bootstrap"


const DeleteConfirm = ({ onHide, show, confirmDelete, text = "Deletion", actionText = 'Delete', details, type }: IDeleteConfirm) => {
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
            {
                details && type === 'myDocument' &&
                < Modal.Body className="show-grid">
                    <Container>
                        <p>
                            Are you sure you want to delete the <b>{details.folderName}</b> folder
                        </p>
                    </Container>
                </Modal.Body>
            }
            {
                details && type === 'costConfiguration' &&
                < Modal.Body className="show-grid">
                    <Container>
                        <p>
                            Are you sure you want to delete Cost
                            Configuration for <b>{details.documentType}</b>
                        </p>
                    </Container>
                </Modal.Body>
            }
            {
                details && type === 'requiredDocuments' &&
                < Modal.Body className="show-grid">
                    <Container>
                        <p>
                            Are you sure you want to delete Required Document
                            Configuration for <b>{details.productName}</b>
                        </p>
                    </Container>
                </Modal.Body>
            }
            {
                details && type === 'sentDocumentRequest'
                && <Modal.Body className="show-grid">
                    <Container>
                        <p>
                            Are you sure you want to delete Document
                            Request for <b>{details.documentType}</b> requested from <b>{details.requestedFrom}</b>
                        </p>
                    </Container>
                </Modal.Body>
            }
            {
                details && type === 'receiveDocumentRequest'
                && <Modal.Body className="show-grid">
                    <Container>
                        <p>
                            Are you sure you want to delete Document
                            Request for <b>{details.documentType}</b> requested from <b>{details.requestedFrom}</b>
                        </p>
                    </Container>
                </Modal.Body>
            }
            <Modal.Footer>
                <Button variant="danger" ref={deleteRef} onClick={confirmDelete}>{actionText}</Button>
                <Button variant="dark" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default DeleteConfirm
