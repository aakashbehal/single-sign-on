import React, { useEffect, useState } from 'react'
import { Modal, Button, Container } from "react-bootstrap"
import { CgSpinnerAlt } from 'react-icons/cg';
import { getSignedURL } from '../../helpers/util';


import Styles from "./Modal.module.sass";

const ViewDocument = ({ onHide, show, documentData }) => {

    const [documentType, setDocumentType] = useState('')
    const [imageUrl, setImageUrl] = useState<any>("")
    const [loadingImage, setLoadingImage] = useState(false)

    useEffect(() => {
        const splitDocumentName = documentData.fileName.split('.')
        setDocumentType(splitDocumentName[splitDocumentName.length - 1])
    }, [documentData])

    useEffect(() => {
        viewImage()
    }, [documentType])

    const viewImage = async () => {
        if (documentType === 'pdf' || documentType === 'png') {
            setLoadingImage(true)
        }
        let fileUrl = await getSignedURL(documentData.objectKey)
        setImageUrl(fileUrl)
    }

    const handleNoPreview = () => {
        return <p>Preview not available, Please download</p>
    }

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
                <p>{documentData.fileName}</p>
            </Modal.Header>
            < Modal.Body className="show-grid">
                <Container className={Styles.center_document} style={{ minHeight: '3rem' }}>
                    {
                        loadingImage
                        && <CgSpinnerAlt className="spinner" size={50} style={{ position: 'absolute' }} />
                    }
                    {
                        documentType === 'png'
                        && <img onLoad={() => setLoadingImage(false)} src={imageUrl} alt={documentData.fileName} width="100%" />
                    }
                    {
                        documentType === 'pdf'
                        && <object data={imageUrl}
                            onLoad={() => setLoadingImage(false)}
                            width="800"
                            height="500">
                        </object>
                    }
                    {
                        (
                            documentType === 'txt'
                            || documentType === 'xlsx'
                        )
                        && handleNoPreview()
                    }
                </Container>
            </Modal.Body>
        </Modal >
    )
}

export default ViewDocument
