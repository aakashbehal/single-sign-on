import React, { useEffect, useRef, useState } from 'react'
import { Modal, Row, Col, Button, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useHistory } from 'react-router'

const InventoryAction = ({ show, onHide, queue, searchCriteria }: any) => {
    const history = useHistory()
    const inventoryActionRef = useRef<any>()
    const [formInputs, setFormInputs] = useState<any>({})
    const [accountQueue, setAccountQueue] = useState<any>([])
    const [newAccountStatusCode, setNewAccountStatusCode] = useState<any>({})
    const accountConfig = useSelector((state: any) => state.misc.accountConfig.config);
    const [formError, setFormError] = useState({
        toQueueCode: false,
        toReasonCode: false,
        toStatusCode: false
    })

    useEffect(() => {
        if (JSON.stringify(formInputs) !== "{}") {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            searchCriteria = { ...searchCriteria, ...formInputs }
            let searchParams = 'isInventory=true'
            for (let key in searchCriteria) {
                searchParams += `&${key}=${searchCriteria[key]}`
            }
            history.push({
                pathname: "/inventory/action_queue",
                search: searchParams
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formInputs])

    useEffect(() => {
        const n = accountConfig.filter((ac: any) => {
            if (ac.queueId === Number(queue)) return ac
            else return false
        })
        setAccountQueue(n)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountConfig])


    const validate = (formObj: any) => {
        let formIsValid = true;
        const error: any = {
            toQueueCode: false,
            toReasonCode: false,
            toStatusCode: false
        }
        for (let key in formObj) {

            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        return formIsValid
    }

    const onSubmitHandler = () => {
        const {
            new_queue,
            new_account_status,
            new_reason_code
        } = inventoryActionRef.current;
        let formObj: any = {}
        formObj["toQueueCode"] = new_queue.value
        formObj["toStatusCode"] = new_account_status.value
        formObj["toReasonCode"] = new_reason_code.value
        if (validate(formObj)) {
            setFormInputs((formInputs: any) => {
                return { ...formInputs, ...formObj }
            })
        }
    }

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
                <Modal.Title id="contained-modal-title-vcenter">
                    Action
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Form ref={inventoryActionRef} >
                    <Form.Group as={Row}>
                        <Form.Label column md={5} sm={12}>New Queue</Form.Label>
                        <Col md={7} sm={12}>
                            <Form.Control as="select" name="new_queue" onChange={(e) => {
                                const nAccountStatus = accountConfig.filter((aC: any) => {
                                    if (aC.queueId === +e.target.value) return aC
                                    else return false
                                })
                                setNewAccountStatusCode(nAccountStatus[0])
                            }}>
                                <option></option>
                                {
                                    accountQueue && accountQueue.length > 0 && accountQueue[0].nextQueue.map((nQ: any, index: number) => {
                                        return <option key={`nq_${index} `} value={nQ.queueId}>{nQ.shortName} - {nQ.fullName}</option>
                                    })
                                }
                            </Form.Control>
                            <span style={{ color: 'red' }}><small>{formError["toQueueCode"] ? 'New Queue is required' : ''}</small></span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column md={5} sm={12}>New Account Status</Form.Label>
                        <Col md={7} sm={12}>
                            <Form.Control as="select" name="new_account_status">
                                <option></option>
                                {
                                    JSON.stringify(newAccountStatusCode) !== "{}" && newAccountStatusCode.queueStatuses.map((nQ: any, index: number) => {
                                        return <option key={`nq_${index} `} value={nQ.queueStatusId}>{nQ.shortName} - {nQ.fullName}</option>
                                    })
                                }
                            </Form.Control>
                            <span style={{ color: 'red' }}><small>{formError["toStatusCode"] ? 'New Account Status is required' : ''}</small></span>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column md={5} sm={12}>New Reason Code</Form.Label>
                        <Col md={7} sm={12}>
                            <Form.Control as="select" name="new_reason_code" >
                                <option></option>
                                {
                                    JSON.stringify(newAccountStatusCode) !== "{}" && newAccountStatusCode.queueReasons.map((rC: any, index: number) => {
                                        return <option key={`rc_${index} `} value={rC.queueReasonId}>{rC.shortName} - {rC.fullName}</option>
                                    })}
                            </Form.Control>
                            <span style={{ color: 'red' }}><small>{formError["toReasonCode"] ? 'New Reason Code is required' : ''}</small></span>
                        </Col>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onSubmitHandler}>Submit</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default InventoryAction
