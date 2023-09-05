import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FileNameConfigActionCreator } from '../../store/actions/fileNameConfig.actions';
import { Button, Col, Form, Row } from 'react-bootstrap';

const DocumentPolicy = ({ dispatch }: any) => {
    const otherSaveRef = useRef<any>()
    const [modeSelected, setModeSelected] = useState('KBF');
    const [mode, setMode] = useState([
        {
            keycode: 'KBF',
            keyvalue: 'Keep Both Files'
        },
        {
            keycode: 'RE',
            keyvalue: 'Replace Existing'
        }
    ])

    const {
        isLoadingDocumentPolicy,
        dataDocumentPolicy,
        dataUserDocumentPolicy,
    } = useSelector((state: any) => ({
        isLoadingDocumentPolicy: state.fileNameConfig.userDocumentPolicy.loading,
        dataUserDocumentPolicy: state.fileNameConfig.userDocumentPolicy.data,
        dataDocumentPolicy: state.fileNameConfig.documentPolicy.data,
    }))

    useEffect(() => {
        if (dataUserDocumentPolicy) {
            setModeSelected((dataUserDocumentPolicy ? dataUserDocumentPolicy.configValSelectedCode : "KBF"))
        }
    }, [dataUserDocumentPolicy])

    useEffect(() => {
        dispatch(FileNameConfigActionCreator.getDocumentPolicy())
        dispatch(FileNameConfigActionCreator.getUserDocumentPolicy())
    }, [])

    const resetHandler = () => {
        setModeSelected('KBF')
        setTimeout(() => {
            otherSaveRef.current.click()
        }, 0)
    }
    const handleSave = () => {
        let configRequest = [{
            "configShortCode": "DP",
            "configValShortCode": modeSelected,
            "orgTypeCode": "CT"
        }]
        dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
    }
    return (
        <>
            {
                !isLoadingDocumentPolicy && <Row style={{ margin: 0 }} className="form_container">
                    <Col lg={12} sm={12}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Other Configuration</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form onSubmit={(e) => handleSave()}>
                            <Row>
                                <Col lg={12} md={6}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={12} sm={12}>
                                                {
                                                    mode && mode.map((m: any, index: number) => (
                                                        <Form.Check
                                                            key={`default-${index}`}
                                                            inline
                                                            type="radio"
                                                            onChange={(e: any) => {
                                                                setModeSelected(e.target.value)
                                                            }}
                                                            checked={m.keycode == modeSelected}
                                                            value={m.keycode}
                                                            name='mode'
                                                            label={m.keyvalue}
                                                        />
                                                    ))
                                                }
                                            </Col>
                                            <span style={{ color: 'red', marginLeft: "1rem" }}><small></small></span>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Incase of Document Duplication</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="mt-4" style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} ref={otherSaveRef} type="submit">Save</Button>{" "}
                                    <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler()}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            }
        </>
    )
}

export default DocumentPolicy