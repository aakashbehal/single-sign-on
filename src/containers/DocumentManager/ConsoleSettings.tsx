import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { CgRowFirst } from 'react-icons/cg'
import { MdContentCopy } from 'react-icons/md'

import { userService } from '../../services'
import Styles from "./DocumentManager.module.sass"

const ConsoleSettings = () => {
    const ApiKeyRef = useRef<any>()
    const [apiKey, setApiKey] = useState<string>('')
    const [copied, setCopied] = useState<Boolean>(false)

    useEffect(() => {
        const user = userService.getUser()
        let key = user.apiKey || '-'
        setApiKey(key)
    }, [])

    const handleReset = (event: FormEvent) => {
        event.stopPropagation()
    }

    const copyToClipboard = (e: any) => {
        e.preventDefault()
        navigator.clipboard.writeText(apiKey)
        setCopied(true)
    }

    return <Row className="form_container">
        <Col lg={3} sm={12}></Col>
        <Col lg={6} sm={12}>
            <Form ref={ApiKeyRef} onSubmit={(e) => handleReset(e)} className='mt-4'>
                <Row>
                    <Col lg={12} md={12}>
                        <Form.Group as={Col} className="mb-4">
                            <Row>
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        className="select_custom"
                                        type="text"
                                        name="api_key"
                                        disabled={true}
                                        color='black'
                                        defaultValue={apiKey} />
                                    {
                                        apiKey !== '-' &&
                                        <MdContentCopy className={`${Styles.copyToClip} ${copied ? Styles.copied : ''}`} onClick={(e) => copyToClipboard(e)} size={25} />
                                    }
                                </Col>
                            </Row>
                            <Form.Label className="label_custom" style={{ left: '10px' }}>API Key</Form.Label>
                        </Form.Group>
                    </Col>
                    <Col sm={12} style={{ textAlign: 'center', marginLeft: '1rem' }}>
                        <Button variant="dark" style={{ width: "140px" }} type="submit">Re-generate</Button>{" "}
                    </Col>
                </Row>
            </Form>
        </Col>
        <Col lg={3} sm={12}></Col>
    </Row >
}

export default ConsoleSettings 