import React, { useEffect, useState } from 'react'
import { Modal, Button, Container } from "react-bootstrap"

import Styles from "./Modal.module.sass";

const ViewDocument = ({ onHide, show, documentData }) => {

    const [documentType, setDocumentType] = useState('')

    useEffect(() => {
        const splitDocumentName = documentData.fileName.split('.')
        setDocumentType(splitDocumentName[splitDocumentName.length - 1])
    }, [documentData])

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="xl"
            animation={true}
        >
            <Modal.Header closeButton>
                <p>{documentData.fileName} {documentType}</p>
            </Modal.Header>
            < Modal.Body className="show-grid">
                <Container className={Styles.center_document}>
                    {
                        documentType === 'png'
                        && <img src={documentData.filePath} alt="" />
                    }
                    {
                        documentType === 'pdf'
                        && <object data={documentData.filePath}
                            width="800"
                            height="500">
                        </object>
                    }
                </Container>
            </Modal.Body>
        </Modal >
    )
}

export default ViewDocument
