import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { FileNameConfigActionCreator } from '../../store/actions/fileNameConfig.actions';
import { Button, Col, Form, Row } from 'react-bootstrap';

const RetentionPolicy = ({ dispatch }: any) => {
    const retentionSaveRef = useRef<any>();
    const retentionRef = useRef<any>();
    const [retention, setRetention] = useState<any>(60)
    const [minMaxError, setMinMaxError] = useState<any>(false)

    const {
        isLoadingRetention,
        dataUserRetentionPolicy,
        dataRetentionPolicy,
    } = useSelector((state: any) => ({
        isLoadingRetention: state.fileNameConfig.userRetentionPolicy.loading,
        dataUserRetentionPolicy: state.fileNameConfig.userRetentionPolicy.data,
        dataRetentionPolicy: state.fileNameConfig.retentionPolicy.data
    }))

    useEffect(() => {
        // dispatch(FileNameConfigActionCreator.getRetentionPolicy())
        dispatch(FileNameConfigActionCreator.getUserRetentionPolicy())
    }, [])

    useEffect(() => {
        if (dataUserRetentionPolicy) {
            setRetention(dataUserRetentionPolicy ? dataUserRetentionPolicy.configValSelectedCode : dataRetentionPolicy.defaultValue)
        }
    }, [dataUserRetentionPolicy])

    const handleSave = () => {
        if (Number(retention) < 60 || Number(retention) > 365) {
            setMinMaxError(true)
            return
        } else {
            setMinMaxError(false)
            let configRequest = [{
                "configShortCode": "RP",
                "configValShortCode": retention,
                "orgTypeCode": "CT"
            }]
            dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
        }
    }

    const resetHandler = () => {
        setRetention(60)
        setTimeout(() => {
            retentionSaveRef.current.click()
        }, 0)
    }

    return (
        <>
            {
                !isLoadingRetention && <Row style={{ margin: 0 }} className="form_container">
                    <Col lg={12} sm={12}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Document Retention Policy</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form ref={retentionRef} onSubmit={(e) => handleSave()}>
                            <Row>
                                <Col lg={12} md={12}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={11} sm={11}>
                                                <Form.Control
                                                    className="select_custom white"
                                                    type="number"
                                                    name="retention_policy"
                                                    onChange={(e) => {
                                                        setRetention(e.target.value)
                                                    }}
                                                    value={retention} />
                                            </Col>
                                            <Col md={1} style={{ display: 'flex', alignItems: 'center' }}><p style={{ margin: 0 }}>Days</p></Col>
                                            <span style={{ color: 'red', marginLeft: "1rem" }}><small>{minMaxError ? 'Retention Policy Should be between 60 to 365 days' : ''}</small></span>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Retain document after closure of account till</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} ref={retentionSaveRef} type="submit">Save</Button>{" "}
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


export default RetentionPolicy