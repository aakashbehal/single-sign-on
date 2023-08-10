import React, { useRef } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"

const NamingAdditionalFields = ({ show, onHide }: { show: boolean, onHide: any }) => {
    const configRef = useRef<HTMLFormElement>(null)

    const handleSave = (event: Event) => {
        console.log(event)
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
                    Additional Settings
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Col lg={12} sm={12} >
                    <Row style={{ padding: '1rem 2rem' }} className="form_container">
                        <Form ref={configRef} onSubmit={(e: any) => handleSave(e)} style={{ width: "100%" }}>
                            <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                                <Form.Control
                                    as="input"
                                    name="regex"
                                    className="select_custom white"
                                >
                                </Form.Control>
                                <Form.Label className="label_custom" style={{ left: 0 }}>Minimum Length</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                                <Form.Control
                                    as="input"
                                    name="regex"
                                    className="select_custom white"
                                >
                                </Form.Control>
                                <Form.Label className="label_custom" style={{ left: 0 }}>Maximum Length</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                                <Form.Control
                                    as="input"
                                    name="regex"
                                    className="select_custom white"
                                >
                                </Form.Control>
                                <Form.Label className="label_custom" style={{ left: 0 }}>Regex</Form.Label>
                            </Form.Group>
                        </Form>
                    </Row>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>Submit</Button>
                <Button variant="dark" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default NamingAdditionalFields