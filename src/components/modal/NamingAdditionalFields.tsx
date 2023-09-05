import React, { useRef, useState, useEffect } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { BsPlusCircleFill } from "react-icons/bs"
import MultipleInputs from "../Common/MultipleInputs"
import { useDispatch, useSelector } from 'react-redux';
import { TypesActionCreator } from "../../store/actions/common/types.actions"
import { RootState } from "../../store";

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
const LOOKUP_VALUES = ["SUBSCRIPTION_TYPE", "CONJUNCTION_TYPE", "DOCUMENT_DUPLICATION_TYPE"]
const LOOKUP_COLUMNS = ["CODE", "VALUE", "DESC", "EXTERNAL_CODE", "EXTERNAL_NAME"]
const REF_TYPE_VALUES = ["DOC_TYPE", "PRODUCT_CODE"]

type IAdditionSettings = {
    validation: boolean
    possibleValues: boolean
    transformation: boolean
}

export interface IAdditionSettingsJson {
    dataType?: string | null
    minRange?: number
    maxRange?: number
    minLength?: number
    maxLength?: number
    isFixLength?: boolean
    possibleValType?: string
    possibleValSubType?: string
    possibleVal?: string
}

interface IMinMax {
    min: number
    max: number
}

const NamingAdditionalFields = (
    { show, onHide, additionSettingsJson, setAdditionalSettingsJson, field }:
        { show: boolean, onHide: any, additionSettingsJson: { [key: string]: IAdditionSettingsJson }, setAdditionalSettingsJson: any, field: string }
) => {
    const configRef = useRef<HTMLFormElement>(null)
    const dispatch = useDispatch();
    const [addition, setAdditional] = useState<any>({})
    const { lookUp, error, loading } = useSelector((state: any) => ({
        lookUp: state.types.lookUp.data,
        error: state.types.lookUp.error,
        loading: state.types.lookUp.loading
    }))

    const [dataType, setDataType] = useState<string>('')
    const [additionSettings, setAdditionalSettings] = useState<IAdditionSettings>({
        validation: false,
        possibleValues: false,
        transformation: false
    })
    const [dateFormat, setDateFormat] = useState('')
    const [possibleValueType, setPossibleValueType] = useState('')
    const [possibleValuesSubType, setPossibleValuesSubType] = useState('')
    const [possibleValue, setPossibleValue] = useState('')
    const [multipleValues, setMultipleValues] = useState([])
    const [stringLength, setStringLength] = useState<IMinMax>({
        min: 0,
        max: 0
    })
    const [numberRange, setNumberRange] = useState<IMinMax>({
        min: 0,
        max: 0
    })
    useEffect(() => {
        dispatch(TypesActionCreator.getAllLookupValues(null))
        if (additionSettingsJson && additionSettingsJson[field]) {
            setAdditional(additionSettingsJson[field])
        }
    }, [])

    // check if already have additional settings
    useEffect(() => {
        let tempSetting = Object.assign(additionSettings)
        if (addition.dataType) {
            setDataType(addition.dataType)
            setStringLength({
                min: addition.minLength,
                max: addition.maxLength
            })
            setNumberRange({
                min: addition.minRange,
                max: addition.maxRange
            })
            tempSetting.validation = true
        }
        if (addition.possibleVal) {
            setPossibleValueType(addition.possibleValType)
            setPossibleValuesSubType(addition.possibleValSubType)
            setPossibleValue(addition.possibleVal)
            tempSetting.possibleValues = true
        }
        setAdditionalSettings(tempSetting)
    }, [addition])

    const handleSave = () => {
        let settings: IAdditionSettingsJson = {
            dataType: dataType || null,
            minRange: numberRange.min,
            maxRange: numberRange.max,
            minLength: stringLength.min,
            maxLength: stringLength.max,
            isFixLength: false,
            possibleValType: possibleValueType,
            possibleValSubType: possibleValuesSubType,
            possibleVal: possibleValue,
        }
        setAdditionalSettingsJson(settings, field)
    }

    const handleSelection = (type: string) => {
        console.log(type)
        let temp: any = Object.assign({}, additionSettings)
        temp[type] = !temp[type]
        if (!temp['possibleValues']) {
            setPossibleValueType("")
            setPossibleValuesSubType("")
            setPossibleValue("")
        }
        if (!temp['validation']) {
            setDataType("")
            setStringLength({
                min: 0,
                max: 0
            })
            setNumberRange({
                min: 0,
                max: 0
            })
        }
        setAdditionalSettings(temp)
    }

    const validationHandler = () => {
        return <React.Fragment>
            <Form.Group as={Col} className="mb-5 mt-5 no_padding">
                <Form.Control
                    as="select"
                    name="data_type white"
                    className="select_custom white"
                    value={addition.dataType}
                    onChange={(e) => {
                        setDataType(e.target.value)
                    }}>
                    <option></option>
                    {
                        (lookUp?.DATA_TYPE && lookUp?.DATA_TYPE?.lookUps.length > 0) &&
                        lookUp?.DATA_TYPE?.lookUps.map((dt: any, index: number) => {
                            return <option key={`cr_${index}`} value={dt.keyCode}>{dt.keyValue}</option>
                        })
                    }
                </Form.Control>
                <Form.Label className="label_custom" style={{ left: 0 }}>Data Type</Form.Label>
            </Form.Group>
            {
                dataType === 'ST'
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                        <Form.Control
                            as="input"
                            name="regex"
                            className="select_custom white"
                            value={stringLength.min}
                            onChange={(e) => setStringLength((prev: { min: number, max: number }) => {
                                return { ...prev, min: +e.target.value }
                            })}
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Minimum Length</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                        <Form.Control
                            as="input"
                            name="regex"
                            className="select_custom white"
                            value={stringLength.max}
                            onChange={(e) => setStringLength((prev: { min: number, max: number }) => {
                                return { ...prev, max: +e.target.value }
                            })}
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Maximum Length</Form.Label>
                    </Form.Group>
                </React.Fragment>
            }
            {
                (dataType === 'NB' || dataType === 'NR')
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                        <Form.Control
                            as="input"
                            name="regex"
                            className="select_custom white"
                            value={numberRange.min}
                            onChange={(e) => setNumberRange((prev: { min: number, max: number }) => {
                                return { ...prev, min: +e.target.value }
                            })}
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Minimum</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                        <Form.Control
                            as="input"
                            name="regex"
                            className="select_custom white"
                            value={numberRange.max}
                            onChange={(e) => setNumberRange((prev: { min: number, max: number }) => {
                                return { ...prev, max: +e.target.value }
                            })}
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Maximum</Form.Label>
                    </Form.Group>
                </React.Fragment>
            }
            {
                dataType === 'DT'
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
                    value={addition.possibleValType}
                    onChange={(e) => {
                        setPossibleValueType(e.target.value)
                    }}>
                    <option></option>
                    {
                        (lookUp?.POSSIBLE_VALUE_TYPE && lookUp?.POSSIBLE_VALUE_TYPE?.lookUps.length > 0) &&
                        lookUp?.POSSIBLE_VALUE_TYPE?.lookUps.map((pvt: any, index: number) => {
                            return <option key={`cr_${index}`} value={pvt.keyCode}>{pvt.keyValue}</option>
                        })
                    }
                </Form.Control>
                <Form.Label className="label_custom" style={{ left: 0 }}>Possible Value Type</Form.Label>
            </Form.Group>

            {
                (possibleValueType === 'IL')
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            value={possibleValuesSubType}
                            onChange={(e) => {
                                setPossibleValuesSubType(e.target.value)
                            }}>
                            <option></option>
                            {
                                (lookUp?.POSSIBLE_VALUE_SUB_TYPE_INLINE && lookUp?.POSSIBLE_VALUE_SUB_TYPE_INLINE?.lookUps.length > 0) &&
                                lookUp?.POSSIBLE_VALUE_SUB_TYPE_INLINE?.lookUps.map((lV: any, index: number) => {
                                    return <option key={`cr_${index}`} value={lV.keyCode}>{lV.keyValue}</option>
                                })
                            }
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Data Type</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="input"
                            name="inline_value"
                            className="select_custom white"
                            value={possibleValue}
                            onChange={(e) => setPossibleValue(e.target.value)}
                        >
                        </Form.Control>
                        <Form.Label className="label_custom" style={{ left: 0 }}>Value</Form.Label>
                    </Form.Group>
                </React.Fragment>
            }
            {
                possibleValueType === 'LK'
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            value={possibleValuesSubType}
                            onChange={(e) => {
                                setPossibleValuesSubType(e.target.value)
                            }}>
                            <option></option>
                            {
                                lookUp &&
                                Object.keys(lookUp).map((lV: any, index: number) => {
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
                            value={possibleValue}
                            onChange={(e) => setPossibleValue(e.target.value)}>
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
                possibleValueType === 'RT'
                &&
                <React.Fragment>
                    <Form.Group as={Col} className="mb-3 mt-5 no_padding">
                        <Form.Control
                            as="select"
                            name="data_type white"
                            className="select_custom white"
                            value={possibleValuesSubType}
                            onChange={(e) => {
                                setPossibleValuesSubType(e.target.value)
                            }}>
                            <option></option>
                            {
                                (lookUp?.POSSIBLE_VALUE_SUB_TYPE_REF && lookUp?.POSSIBLE_VALUE_SUB_TYPE_REF?.lookUps.length > 0) &&
                                lookUp?.POSSIBLE_VALUE_SUB_TYPE_REF?.lookUps.map((rt: any, index: number) => {
                                    return <option key={`cr_${index}`} value={rt.keyCode}>{rt.keyValue}</option>
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
                            value={possibleValue}
                            onChange={(e) => setPossibleValue(e.target.value)}>
                            <option></option>
                            {
                                (lookUp?.REFERENCE_VALUE_TYPE && lookUp?.REFERENCE_VALUE_TYPE?.lookUps.length > 0) &&
                                lookUp?.REFERENCE_VALUE_TYPE?.lookUps.map((lV: any, index: number) => {
                                    return <option key={`cr_${index}`} value={lV.keyCode}>{lV.keyValue}</option>
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
                        <Form ref={configRef} style={{ width: "100%" }}>
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
                <Button variant="dark" onClick={() => handleSave()}>Submit</Button>
                <Button variant="dark" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default NamingAdditionalFields