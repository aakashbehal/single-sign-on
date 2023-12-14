import React, { useRef, useState, useEffect } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import { BsPlusCircleFill } from "react-icons/bs"
import MultipleInputs from "../Common/MultipleInputs"
import { useDispatch, useSelector } from 'react-redux';
import { TypesActionCreator } from "../../store/actions/common/types.actions"
import { Typeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { RootState } from "../../store";

const DATE_FORMAT = [
    { name: "d/M/yy" },
    { name: "dd/MM/yyyy" },
    { name: "d/M/yyyy" },
    { name: "dd/MM/yy" },
    { name: "dd-MM-yyyy" },
    { name: "d-M-yyyy" },
    { name: "dd-MM-yy" },
    { name: "MM/dd/yyyy" },
    { name: "M/d/yyyy" },
    { name: "MM/dd/yy" },
    { name: "MM-dd-yyyy" },
    { name: "M-d-yyyy" },
    { name: "MM-dd-yy" },
    { name: "yyyy-MM-dd" },
    { name: "yyyy/MM/dd" },
    { name: "yy-MM-dd" },
    { name: "yy/MM/dd" },
    { name: "d MMM yyyy" },
    { name: "dd MMM yyyy" },
    { name: "MMM d yyyy" },
    { name: "MMM dd yyyy" },
    { name: "d MMMM yyyy" },
    { name: "dd MMMM yyyy" },
    { name: "MMMM d yyyy" },
    { name: "MMMM dd yyyy" },
    { name: "MMddyyyy" },
    { name: "MM.dd.yyyy" },
    { name: "M.d.yyyy" },
    { name: "MM.d.yyyy" },
    { name: "M.dd.yyyy" },
    { name: "MM.d.yy" }
]
const LOOKUP_COLUMNS = ["CODE", "VALUE", "DESC", "EXTERNAL_CODE", "EXTERNAL_NAME"]

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
    const ref = useRef<any>();
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
    const [selectedDateFormat, setSelectedDateFormat] = useState<any>([])
    const [dateString, setDateString] = useState('')
    useEffect(() => {
        let string = ''
        selectedDateFormat.map((s: any, index: number) => {
            string += `${s.name}${index + 1 < selectedDateFormat.length ? ',' : ''}`
        })
        setDateString(string)
    }, [selectedDateFormat])

    // const [dateFormat, setDateFormat] = useState('')
    const [possibleValueType, setPossibleValueType] = useState('')
    const [possibleValuesSubType, setPossibleValuesSubType] = useState('')
    const [possibleValue, setPossibleValue] = useState<any>('')
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
        console.log(`--addition--`, addition)
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
        if (addition.dataType === 'DT') {
            setPossibleValue(addition.possibleVal.split(',').map((s: string) => {
                return { name: s }
            }))
        } else {
            setPossibleValue(addition.possibleVal)
        }
        if (addition.dataType !== 'DT' && addition.possibleVal) {
            setPossibleValueType(addition.possibleValType)
            setPossibleValuesSubType(addition.possibleValSubType)
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
            possibleVal: dataType === 'DT' ? dateString : possibleValue,
        }
        setAdditionalSettingsJson(settings, field)
    }

    const handleSelection = (type: string) => {
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
                        (lookUp?.DATA_TYPE && lookUp?.DATA_TYPE?.lookups.length > 0) &&
                        lookUp?.DATA_TYPE?.lookups.map((dt: any, index: number) => {
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
            {/* {
                dataType === 'DT'
                &&
                <Form.Group as={Col} className="mb-5 mt-3 no_padding">
                    <Form.Control
                        as="select"
                        name="date_type"
                        className="select_custom white"
                        value={possibleValue || dateFormat}
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
            } */}
            {
                dataType === 'DT' &&
                <Form.Group as={Col} className="mb-4 no_padding">
                    <Col md={12} sm={12} className="no_padding">
                        {/* <Form.Control defaultValue={editCost ? editCost.cost : ''} className="select_custom white" type="number" name="document_name" /> */}
                        <Typeahead
                            defaultSelected={possibleValue === '' ? [] : possibleValue}
                            id="public-methods-example"
                            labelKey={"name"}
                            multiple
                            className="transformDate"
                            options={DATE_FORMAT}
                            onChange={(selected) => {
                                setSelectedDateFormat(selected)
                            }}
                            ignoreDiacritics={false}
                            placeholder="Choose Date formats..."
                            ref={ref}
                        />
                        {/* <span style={{ color: 'red' }}><small>{formError["requiredDoc"] ? 'At least One Document Type is required' : ''}</small></span> */}
                    </Col>
                    <Form.Label className="label_custom" style={{ left: 0 }}>Required Documents</Form.Label>
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
                        (lookUp?.POSSIBLE_VALUE_TYPE && lookUp?.POSSIBLE_VALUE_TYPE?.lookups.length > 0) &&
                        lookUp?.POSSIBLE_VALUE_TYPE?.lookups.map((pvt: any, index: number) => {
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
                                (lookUp?.POSSIBLE_VALUE_SUB_TYPE_INLINE && lookUp?.POSSIBLE_VALUE_SUB_TYPE_INLINE?.lookups.length > 0) &&
                                lookUp?.POSSIBLE_VALUE_SUB_TYPE_INLINE?.lookups.map((lV: any, index: number) => {
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
                                (lookUp?.REFERENCE_VALUE_TYPE && lookUp?.REFERENCE_VALUE_TYPE?.lookups.length > 0) &&
                                lookUp?.REFERENCE_VALUE_TYPE?.lookups.map((rt: any, index: number) => {
                                    return <option key={`cr_${index}`} value={rt.keyCode}>{rt.keyValue}</option>
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
                                (lookUp?.POSSIBLE_VALUE_SUB_TYPE_REF && lookUp?.POSSIBLE_VALUE_SUB_TYPE_REF?.lookups.length > 0) &&
                                lookUp?.POSSIBLE_VALUE_SUB_TYPE_REF?.lookups.map((rt: any, index: number) => {
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
                                (lookUp?.REFERENCE_VALUE_TYPE && lookUp?.REFERENCE_VALUE_TYPE?.lookups.length > 0) &&
                                lookUp?.REFERENCE_VALUE_TYPE?.lookups.map((lV: any, index: number) => {
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