import React from 'react'
import { Modal, Container, Row, Col, Button, Form } from "react-bootstrap"

const AddConsumerEmail = (props: any) => {
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Row>
                        <Col xs={12} md={8}>
                            <Form>

                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddConsumerEmail
