import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { BsRobot } from 'react-icons/bs';

const Automation = () => {
    return <div className='form_container'>
        <Row>
            <Col sm={12} style={{ textAlign: 'center' }}>
                <BsRobot size={50} />
                <h4>Coming Soon</h4>
            </Col>
        </Row>
    </div>
}

export default Automation