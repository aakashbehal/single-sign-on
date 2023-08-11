import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';

import Styles from "./Modal.module.sass";
import { IConfiguration } from '../../containers/User/DocumentGeneralConfiguration';

const ExampleNaming = ({ onHide, show, details }: { onHide: any, show: boolean, details: IConfiguration | null }) => {
    const [name, setName] = useState<string>('')
    const json: any = {
        conj: details ? details.separatorCode : "_",
        CAN: 40001,
        DT: 'BS',
        PC: 'CC',
        OAN: 250001,
        DGD: 20122023,
        DN: 'Bills'
    }

    useEffect(() => {
        let index: number = 0
        let documentNameGenerated = ''
        for (let config of details?.userDocConfig!) {
            if (json[config.attributeCode]) {
                documentNameGenerated += `${index === 0 ? '' : json.conj}${json[config.attributeCode]}`
            }
            index++
        }
        setName(documentNameGenerated)
    }, [details])

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
                    {details?.namingConfigGroupName || 'New Configuration'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Col lg={12} sm={12} >
                    <Row style={{ padding: '1rem 2rem' }} className="form_container">
                        <ul>
                            <li>
                                <span> Conjunction = </span><b>[{details ? details.separatorCode : "_"}]</b><br />
                                <span> Client Account Number =</span> <b>40001</b><br />
                                <span> Document Type = </span><b>Bill of Sales </b><br />
                                <span> Product Code = </span><b>Credit Card</b><br />
                                <span> Original Account Number = </span><b>250001</b><br />
                                <span> Document Generation Date = </span><b>20 December 2023</b><br />
                                <span> Document Name =</span> <b>Bills</b><br />
                            </li>
                        </ul>
                        <p className={Styles.document_name_example_p}>
                            {name}
                        </p>
                    </Row>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default ExampleNaming