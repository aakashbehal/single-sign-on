import React, { useRef, useState } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { BsPlusCircleFill } from "react-icons/bs"
import MultipleInputs from "../Common/MultipleInputs"

const DATA_TYPES = ["STRING", "NUMBER", "NUMERIC", "DATE"]
const DATE_FORMAT = [
    "d/M/yy",
    "dd/MM/yyyy",
    "d/M/yyyy",
    "dd/MM/yy",
    "dd-MM-yyyy",
    "d-M-yyyy",
    "dd-MM-yy",
    "MM/dd/yyyy",
    "M/d/yyyy",
    "MM/dd/yy",
    "MM-dd-yyyy",
    "M-d-yyyy",
    "MM-dd-yy",
    "yyyy-MM-dd",
    "yyyy/MM/dd",
    "yy-MM-dd",
    "yy/MM/dd",
    "d MMM yyyy",
    "dd MMM yyyy",
    "MMM d yyyy",
    "MMM dd yyyy",
    "d MMMM yyyy",
    "dd MMMM yyyy",
    "MMMM d yyyy",
    "MMMM dd yyyy"
]
const POSSIBLE_VALUE_TYPES = ["INLINE", "LOOKUP", "REF_TYPE"]
const LOOKUP_VALUES = ["subscription_type", "CONJUNCTION_TYPE", "DOCUMENT_DUPLICATION_TYPE"]
const LOOKUP_COLUMNS = ["CODE", "VALUE", "DESC", "EXTERNAL_CODE", "EXTERNAL_NAME"]
const REF_TYPE_VALUES = ["DOC_TYPE", "PRODUCT_CODE"]

type IAdditionSettings = {
    validation: boolean
    possibleValues: boolean
    transformation: boolean
}

const NamingAdditionalFields = ({ show, onHide }: { show: boolean, onHide: any }) => {
    const configRef = useRef<HTMLFormElement>(null)
    const [dataType, setDataType] = useState('')
    const [additionSettings, setAdditionalSettings] = useState<IAdditionSettings>({
        validation: false,
        possibleValues: false,
        transformation: false
    })
    const [dateFormat, setDateFormat] = useState('')
    const [possibleValues, setPossibleValues] = useState('')
    const [multipleValues, setMultipleValues] = useState([])

    const handleSave = (event: Event) => {
        console.log(event)
    }

    const handleSelection = (type: string) => {
        let temp: any = Object.assign({}, additionSettings)
        temp[type] = !temp[type]
        setAdditionalSettings(temp)
    }

    const validationHandler = () => {
        return <React.Fragment>
            <Form.Group as={Col} className="mb-5 mt-5 no_padding">
                <Form.Control
                    as="select"
                    name="data_type white"
                    className="select_custom white"
                    onChange={(e) => {
                        setDataType(e.target.value)
                    }}>
                    <option></option>
                    {
                        (DATA_TYPES && DATA_TYPES.length > 0) &&
                        DATA_TYPES.map((dt: any, index: number) => {
                            return <option key={`cr_${index}`} value={dt}>{dt}</option>
                        })
                    }
                </Form.Control>
                <Form.Label className="label_custom" style={{ left: 0 }}>Data Type</Form.Label>
            </Form.Group>
            {
                dataType === 'STRING'
                &&
                <React.Fragment>
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
                </React.Fragment>
            }
            {
                (dataType === 'NUMBER' || dataType === 'NUMERIC')
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                        <Form.Control
                            as="input"
                            name="regex"
                            className="select_custom white"
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Minimum</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                        <Form.Control
                            as="input"
                            name="regex"
                            className="select_custom white"
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Maximum</Form.Label>
                    </Form.Group>
                </React.Fragment>
            }
            {
                dataType === 'DATE'
                &&
                <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                    <Form.Control
                        as="select"
                        name="data_type white"
                        className="select_custom white"
                        onChange={(e) => {
                            setDateFormat(e.target.value)
                        }}>
                        <option></option>
                        {
                            (DATE_FORMAT && DATE_FORMAT.length > 0) &&
                            DATE_FORMAT.map((df: any, index: number) => {
                                return <option key={`cr_${index}`} value={df}>{df}</option>
                            })
                        }
                    </Form.Control>
                    <Form.Label className="label_custom" style={{ left: 0 }}>Date Format</Form.Label>
                </Form.Group>
            }
        </React.Fragment>
    }

    const possibleValuesHandler = () => {
        return <React.Fragment>
            <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                <Form.Control
                    as="select"
                    name="data_type"
                    className="select_custom white"
                    onChange={(e) => {
                        setPossibleValues(e.target.value)
                    }}>
                    <option></option>
                    {
                        (POSSIBLE_VALUE_TYPES && POSSIBLE_VALUE_TYPES.length > 0) &&
                        POSSIBLE_VALUE_TYPES.map((pvt: any, index: number) => {
                            return <option key={`cr_${index}`} value={pvt}>{pvt}</option>
                        })
                    }
                </Form.Control>
                <Form.Label className="label_custom" style={{ left: 0 }}>Possible Value Type</Form.Label>
            </Form.Group>
            {
                possibleValues === 'INLINE'
                && <MultipleInputs multipleValues={multipleValues} setMultipleValues={setMultipleValues} />
            }
            {
                possibleValues === 'LOOKUP'
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            onChange={(e) => {
                                setDataType(e.target.value)
                            }}>
                            <option></option>
                            {
                                (LOOKUP_VALUES && LOOKUP_VALUES.length > 0) &&
                                LOOKUP_VALUES.map((lV: any, index: number) => {
                                    return <option key={`cr_${index}`} value={lV}>{lV}</option>
                                })
                            }
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Data Type</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            onChange={(e) => {
                                setDataType(e.target.value)
                            }}>
                            <option></option>
                            {
                                (LOOKUP_COLUMNS && LOOKUP_COLUMNS.length > 0) &&
                                LOOKUP_COLUMNS.map((lV: any, index: number) => {
                                    return <option key={`cr_${index}`} value={lV}>{lV}</option>
                                })
                            }
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Column</Form.Label>
                    </Form.Group>
                </React.Fragment>
            }
            {
                possibleValues === 'REF_TYPE'
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            onChange={(e) => {
                                setDataType(e.target.value)
                            }}>
                            <option></option>
                            {
                                (REF_TYPE_VALUES && REF_TYPE_VALUES.length > 0) &&
                                REF_TYPE_VALUES.map((rt: any, index: number) => {
                                    return <option key={`cr_${index}`} value={rt}>{rt}</option>
                                })
                            }
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Data Type</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            onChange={(e) => {
                                setDataType(e.target.value)
                            }}>
                            <option></option>
                            {
                                (LOOKUP_COLUMNS && LOOKUP_COLUMNS.length > 0) &&
                                LOOKUP_COLUMNS.map((lV: any, index: number) => {
                                    return <option key={`cr_${index}`} value={lV}>{lV}</option>
                                })
                            }
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Column</Form.Label>
                    </Form.Group>
                </React.Fragment>
            }
        </React.Fragment>
    }

    const transformationValues = () => {
        return <React.Fragment>
            <Form.Group as={Col} className="mb-5 mt-5 no_padding">
                <Form.Control
                    as="input"
                    name="transformation_value"
                    className="select_custom white"
                >
                </Form.Control>
                <Form.Label className="label_custom" style={{ left: 0 }}>Value to transform To</Form.Label>
            </Form.Group>
        </React.Fragment>
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
                <Col lg={12} sm={12}>
                    <Row style={{ padding: '1rem 2rem' }} className="form_container">
                        <Form ref={configRef} onSubmit={(e: any) => handleSave(e)} style={{ width: "100%" }}>
                            <Row className="mb-3 mt-3 no_padding" style={{ justifyContent: 'space-between', margin: 0 }}>
                                <Button className="button_align" onClick={() => handleSelection('validation')} variant={additionSettings.validation ? 'light' : 'dark'}><BsPlusCircleFill /> Add Validation</Button>
                            </Row>
                            {
                                additionSettings?.validation
                                && validationHandler()
                            }
                            <hr />
                            <Row className="mb-3 mt-3 no_padding" style={{ justifyContent: 'space-between', margin: 0 }}>
                                <Button className="button_align" onClick={() => handleSelection('possibleValues')} variant={additionSettings.possibleValues ? 'light' : 'dark'}><BsPlusCircleFill />Add Possible Values</Button>
                            </Row>
                            {
                                additionSettings?.possibleValues
                                && possibleValuesHandler()
                            }
                            <hr />
                            <Row className="mb-3 mt-3 no_padding" style={{ justifyContent: 'space-between', margin: 0 }}>
                                <Button className="button_align" onClick={() => handleSelection('transformation')} variant={additionSettings.transformation ? 'light' : 'dark'}><BsPlusCircleFill />Add Transformation</Button>
                            </Row>
                            {
                                additionSettings?.transformation
                                && transformationValues()
                            }
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