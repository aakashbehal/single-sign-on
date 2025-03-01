import React, { useEffect, useState } from 'react'
import { Modal, Button, Container } from "react-bootstrap"
import { CgSpinnerAlt } from 'react-icons/cg';

import Styles from "./Modal.module.sass";
import { commonServices } from '../../services';

const ViewDocument = ({ onHide, show, documentData }: { onHide: any, show: any, documentData: any }) => {

    const [documentType, setDocumentType] = useState('')
    const [imageUrl, setImageUrl] = useState<any>("")
    const [loadingImage, setLoadingImage] = useState(false)

    useEffect(() => {
        const splitDocumentName = documentData.fileName ? documentData.fileName.split('.') : documentData.documentName.split('.')
        setDocumentType((splitDocumentName[splitDocumentName.length - 1]).toLowerCase())
    }, [documentData])

    useEffect(() => {
        viewImage()
    }, [documentType])

    const viewImage = async () => {
        if (documentType === 'png' || documentType === 'jpg' || documentType === 'jpeg' || documentType === 'pdf') {
            setLoadingImage(true)
        }
        let fileUrl = await commonServices.getSignedURL(documentData.objectKey || documentData.filePath, documentData.fileSizeOriginal)
        setImageUrl(fileUrl)
    }

    const handleNoPreview = () => {
        return <p><b>Preview not available, Please download</b></p>
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
                <p>{documentData.fileName || documentData.documentName}</p>
            </Modal.Header>
            < Modal.Body className="show-grid">
                <Container className={Styles.center_document} style={{ minHeight: '3rem' }}>
                    {
                        documentType === 'pdf'
                    }
                    {
                        loadingImage
                        && <CgSpinnerAlt className="spinner" size={50} style={{ position: 'absolute' }} />
                    }
                    {
                        (documentType === 'png' || documentType === 'jpg' || documentType === 'jpeg')
                        && <img onLoad={() => setLoadingImage(false)} src={imageUrl} width="100%" />
                    }
                    {
                        documentType === 'pdf'
                        && <object data={imageUrl} type="application/pdf" width="100%" height="500px" onLoad={() => setLoadingImage(false)} >
                            <p>Unable to display PDF file. <a href={imageUrl}>Download</a> instead.</p>
                        </object>
                    }
                    {
                        (
                            documentType === 'txt'
                            || documentType === 'xlsx'
                            || documentType === ""
                            || documentType === null
                            || documentType === undefined
                        )
                        && handleNoPreview()
                    }
                </Container>
            </Modal.Body>
        </Modal >
    )
}

export default ViewDocument
