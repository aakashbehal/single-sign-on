import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import Styles from "./Modal.module.sass";
import { useDispatch, useSelector } from 'react-redux';
import { TypesActionCreator } from '../../store/actions/common/types.actions';
import { FileNameConfigActionCreator } from '../../store/actions/fileNameConfig.actions';
import DocumentTypes from '../Common/DocumentType';
import { DocumentGroupActionCreator } from '../../store/actions/documentGroup.actions';

export default ({ onHide, show, namingConfig, missing }: { onHide: any, show: boolean, namingConfig: any, missing: { product: boolean, documentType: boolean } }) => {
    const dispatch = useDispatch();
    const formRef = useRef<any>()
    const [error, setError] = useState({
        product: false,
        documentType: false
    })
    const {
        productTypes,
        loadingProductTypes,
        errorProductTypes,
    } = useSelector((state: any) => ({
        productTypes: state.documentGroup.data,
        loadingProductTypes: state.documentGroup.loading,
        errorProductTypes: state.documentGroup.error
    }))

    useEffect(() => {
        dispatch(DocumentGroupActionCreator.getAllDocumentGroup({}))
    }, [])

    const handleSave = () => {
        let tempError = { ...error }
        setError({
            product: false,
            documentType: false
        })
        const {
            productType,
            document_type
        } = formRef.current
        if (missing.product) {
            if (!productType.value) {
                tempError.product = true
            } else {
                namingConfig.defaultDocGroupConfigCode = productType.value
            }
        }
        if (missing.documentType) {
            if (!document_type.value) {
                tempError.documentType = true
            } else {
                namingConfig.defaultDocTypeCode = document_type.value
            }
        }
        setError(tempError)
        if (tempError.product || tempError.documentType) return
        dispatch(FileNameConfigActionCreator.saveUserConfiguration(namingConfig))
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
                <Modal.Title id="contained-modal-title-vcenter">
                    Missing required Fields, Please set Default
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Col lg={12} sm={12} >
                    {/* <Row style={{ padding: '1rem 2rem' }} className="form_container"> */}
                    <Form ref={formRef}>
                        {
                            missing.product &&
                            <Col sm={12} className="my-1 mt-4">
                                <Form.Control
                                    as="select"
                                    name="productType"
                                    className="select_custom white">
                                    <option disabled value="" selected>Select Product Type...</option>
                                    {
                                        (productTypes && productTypes?.pickedDocGroups?.length > 0) &&
                                        productTypes?.pickedDocGroups.map((dT: any, index: number) => {
                                            return <option key={`cr_${index}`} value={dT.code}>{dT.name}</option>
                                        })
                                    }
                                </Form.Control>
                                <span style={{ color: 'red' }}><small>{error['product'] ? 'Please Select Product Type' : ''}</small></span>
                                <Form.Label className="label_custom white">Product Type Code</Form.Label>
                            </Col>
                        }
                        {
                            missing.documentType &&
                            <Col sm={12} className="my-1 mt-5">
                                <DocumentTypes />
                                <span style={{ color: 'red' }}><small>{error['documentType'] ? 'Please select Document Type ' : ''}</small></span>
                                <Form.Label className="label_custom white">Document Type</Form.Label>
                            </Col>
                        }
                    </Form>
                    {/* </Row> */}
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => handleSave()}>Save</Button>
                <Button variant="dark" onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal >
    )
}
