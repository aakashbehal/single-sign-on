import React, { useEffect, useState } from 'react'
import { Modal, Container, Row, Col, Button } from "react-bootstrap"

const Notifications = ({ show, onHide, data }) => {
    const [notification, setNotification] = useState([])
    useEffect(() => {
        const d = data.filter((dd) => {
            if (dd.requestStatus === 'Requested') return dd
            else return false
        })
        setNotification(d)
    }, [data])

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
                    Pending Actions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Container>
                    <Row>
                        <Col xs={12} md={12}>
                            <ol style={{ paddingLeft: "40px" }}>
                                {
                                    notification &&
                                    notification.map((n: any, index: number) => {
                                        return <li key={`not_${index}`}>{n && n.selectionCriteria ? n.selectionCriteria : null}</li>
                                    })}
                            </ol>
                            {
                                notification
                                && notification.length === 0
                                && <p style={{ textAlign: 'center' }}>No Notifications</p>
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Notifications
