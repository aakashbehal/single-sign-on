import { useEffect, useRef, useState } from "react"
import { Col, Row, Form, Button } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi"

import Styles from "./User.module.sass"
import { FileNameConfigActionCreator } from "../../store/actions/fileNameConfig.actions";
import { fileNameConfigService, userService } from "../../services";
import UseDocumentTitle from "../../helpers/useDocumentTitle"
import { useToasts } from "react-toast-notifications"
import { createMessage } from "../../helpers/messages"

const PARTNER_DEFAULT = {
    1: 'CID',
    2: 'DTI',
    3: 'CAN',
    4: null,
    5: null,
    6: null
}

const CLIENT_DEFAULT = {
    1: 'CAN',
    2: 'DTI',
    3: null,
    4: null,
    5: null,
}

const DocumentGeneralConfiguration = () => {
    const { addToast } = useToasts();
    UseDocumentTitle('Document General Configuration')
    const dispatch = useDispatch();
    const configRef = useRef<any>();
    const [modeSelected, setModeSelected] = useState('CREATE_NEW');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [userType, setUserType] = useState(null)
    const [fieldsSelected, setFieldSelected] = useState<any>({});
    const [mode, setMode] = useState([
        {
            keycode: 'CREATE_NEW',
            keyvalue: 'Keep both files'
        },
        {
            keycode: 'REPLACE',
            keyvalue: 'Replace existing'
        }
    ])

    const {
        loadingConjunction,
        errorConjunction,
        dataConjunction,
        loadingFieldOptions,
        errorFieldOptions,
        dataFieldOptions,
        dataFileNamingConfig,
        loadingFileNamingConfig,
        errorFileNamingConfig
    } = useSelector((state: any) => ({
        loadingConjunction: state.fileNameConfig.conjunction.loading,
        errorConjunction: state.fileNameConfig.conjunction.error,
        dataConjunction: state.fileNameConfig.conjunction.data,
        loadingFieldOptions: state.fileNameConfig.fieldOptions.loading,
        errorFieldOptions: state.fileNameConfig.fieldOptions.error,
        dataFieldOptions: state.fileNameConfig.fieldOptions.data,
        dataFileNamingConfig: state.fileNameConfig.fileNamingConfig.data,
        loadingFileNamingConfig: state.fileNameConfig.fileNamingConfig.loading,
        errorFileNamingConfig: state.fileNameConfig.fileNamingConfig.error
    }))

    useEffect(() => {
        const user = userService.getUser();
        setUserType(user.role)
        if (user.role === 'Client') {
            setFieldSelected(CLIENT_DEFAULT)
        } else {
            setFieldSelected(PARTNER_DEFAULT)
        }
        dispatch(FileNameConfigActionCreator.getUserConfig({ userUuid: user.userUuid, userType: user.role }))
        dispatch(FileNameConfigActionCreator.getConjunction())
        dispatch(FileNameConfigActionCreator.getFieldOptions({ userType: user.role }))
    }, [])

    useEffect(() => {
        console.log(fieldsSelected)
    }, [fieldsSelected])

    useEffect(() => {
        if (
            dataFileNamingConfig
            && dataFileNamingConfig.fileConfiguration
        ) {
            handleDefaultAndSavedSelection()
        }
    }, [dataFieldOptions, dataFileNamingConfig])

    const handleDefaultAndSavedSelection = async () => {
        // setFilteredOptions(dataFieldOptionsFiltered)
        const { fieldFinal, selectionFinal } = await fileNameConfigService.handleDefaultAndSavedSelection(dataFieldOptions, dataFileNamingConfig, userType, fieldsSelected)
        setFilteredOptions(fieldFinal)
        setFieldSelected(selectionFinal)
    }

    const handleMove = (field, direction) => {
        const fieldsSelectedTemp = Object.assign({}, fieldsSelected)
        let temp = null
        if (direction === 'down') {
            temp = fieldsSelectedTemp[field]
            fieldsSelectedTemp[field] = fieldsSelectedTemp[field + 1]
            fieldsSelectedTemp[field + 1] = temp
        } else {
            temp = fieldsSelectedTemp[field]
            fieldsSelectedTemp[field] = fieldsSelectedTemp[field - 1]
            fieldsSelectedTemp[field - 1] = temp
        }
        setFieldSelected(fieldsSelectedTemp)
    }

    const handleSelection = (field, selected) => {
        const fieldsSelectedTemp = Object.assign({}, fieldsSelected)
        const dataFieldOptionsFiltered = dataFieldOptions.map((fO) => {
            if (selected === fO.shortCode) {
                fO.available = false
            }
            if (!selected && (fieldsSelectedTemp[field] === fO.shortCode)) {
                fO.available = true
            }
            return fO
        })
        fieldsSelectedTemp[field] = selected
        setFilteredOptions(dataFieldOptionsFiltered)
        setFieldSelected(fieldsSelectedTemp)
    }

    const handleSave = (e) => {
        e.preventDefault()
        const {
            conjunction,
            field_1,
            field_2,
            field_3,
            field_4,
            field_5,
            field_6,
        } = configRef.current
        console.log(
            conjunction.value,
            field_1.value,
            field_2.value,
            field_3.value,
            field_4.value,
            field_5.value,
            field_6.value,)
        addToast(createMessage('', `FILE_NAME_CONFIGURATION_SAVED_SUCCESS`, ''), { appearance: 'success', autoDismiss: false });
    }

    const resetHandler = () => {
        if (userType === 'Client') {
            setFieldSelected(CLIENT_DEFAULT)
        } else {
            setFieldSelected(PARTNER_DEFAULT)
        }
        configRef.current.conjunction.value = '_'
    }

    return <>
        <Row style={{ margin: 0 }} className="form_container">
            <Col sm={3}></Col>
            <Col sm={6}>
                <Row>
                    <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>File Name Configuration</h5></Col>
                </Row>
                <br />
                <br />
                <Form ref={configRef} onSubmit={(e) => handleSave(e)}>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-5">
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="select"
                                        name="conjunction"
                                        className="select_custom">
                                        {/* <option></option> */}
                                        {
                                            (dataConjunction && dataConjunction.length > 0) &&
                                            dataConjunction.map((cR: any, index: number) => {
                                                return <option key={`cr_${index}`} value={cR.shortCode}>{cR.type}</option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Form.Label className="label_custom">Conjunction / Concatenation Parameter</Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-5">
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="select"
                                        name="field_1"
                                        className="select_custom"
                                        disabled
                                        value={fieldsSelected[1] || ''}>
                                        {/* <option></option> */}
                                        {
                                            (dataFieldOptions && dataFieldOptions.length > 0) &&
                                            dataFieldOptions.map((cR: any, index: number) => {
                                                return <option
                                                    key={`cr_${index}`}
                                                    value={cR.shortCode}>
                                                    {cR.docConcatVal}
                                                </option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Form.Label className="label_custom">Field 1</Form.Label>
                                <div className={Styles.movement_group}>
                                    <HiArrowNarrowDown onClick={() => handleMove(1, 'down')} />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-5">
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="select"
                                        name="field_2"
                                        value={fieldsSelected[2] || ''}
                                        disabled
                                        className="select_custom">
                                        {/* <option></option> */}
                                        {
                                            (dataFieldOptions && dataFieldOptions.length > 0) &&
                                            dataFieldOptions.map((cR: any, index: number) => {
                                                return <option
                                                    key={`cr_${index}`}
                                                    value={cR.shortCode}>
                                                    {cR.docConcatVal}
                                                </option>
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Form.Label className="label_custom">Field 2</Form.Label>
                                <div className={Styles.movement_group}>
                                    <HiArrowNarrowUp onClick={() => handleMove(2, 'up')} />
                                    {
                                        (userType !== 'Client'
                                            || fieldsSelected[3])
                                        && <HiArrowNarrowDown onClick={() => handleMove(2, 'down')} />
                                    }
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-5">
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="select"
                                        name="field_3"
                                        value={fieldsSelected[3] || ''}
                                        disabled={userType !== 'Client'}
                                        onChange={(e) => handleSelection(3, e.target.value)}
                                        className="select_custom">
                                        {
                                            userType === 'Client'
                                            && <option></option>}
                                        {
                                            (dataFieldOptions && dataFieldOptions.length > 0) &&
                                            dataFieldOptions.map((cR: any, index: number) => {
                                                if (userType !== 'Client') {
                                                    return <option disabled={!cR.available} key={`cr_${index}`} value={cR.shortCode}>{cR.docConcatVal}</option>
                                                } else if (userType === 'Client' && !cR.default) {
                                                    return <option disabled={!cR.available} key={`cr_${index}`} value={cR.shortCode}>{cR.docConcatVal}</option>
                                                } else {
                                                    return false
                                                }
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Form.Label className="label_custom">Field 3</Form.Label>
                                <div className={Styles.movement_group}>
                                    {
                                        (userType !== 'Client'
                                            || fieldsSelected[3])
                                        && <HiArrowNarrowUp onClick={() => handleMove(3, 'up')} />
                                    }
                                    {
                                        fieldsSelected[4] &&
                                        <HiArrowNarrowDown onClick={() => handleMove(3, 'down')} />
                                    }
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-5">
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="select"
                                        name="field_4"
                                        onChange={(e) => handleSelection(4, e.target.value)}
                                        value={fieldsSelected[4] || ''}
                                        className="select_custom">
                                        <option></option>
                                        {
                                            (filteredOptions && filteredOptions.length > 0) &&
                                            filteredOptions.map((cR: any, index: number) => {
                                                if (!cR.default) {
                                                    return <option disabled={!cR.available} key={`cr_${index}`} value={cR.shortCode}>{cR.docConcatVal}</option>
                                                } else {
                                                    return false
                                                }
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Form.Label className="label_custom">Field 4</Form.Label>
                                {
                                    fieldsSelected[4] &&
                                    <div className={Styles.movement_group}>
                                        <HiArrowNarrowUp onClick={() => handleMove(4, 'up')} />
                                        {
                                            fieldsSelected[5] &&
                                            <HiArrowNarrowDown onClick={() => handleMove(4, 'down')} />
                                        }
                                    </div>
                                }
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-5" >
                                <Col md={12} sm={12}>
                                    <Form.Control
                                        as="select"
                                        name="field_5"
                                        onChange={(e) => handleSelection(5, e.target.value)}
                                        value={fieldsSelected[5] || ''}
                                        className="select_custom">
                                        <option></option>
                                        {
                                            (filteredOptions && filteredOptions.length > 0) &&
                                            filteredOptions.map((cR: any, index: number) => {
                                                if (!cR.default) {
                                                    return <option disabled={!cR.available} key={`cr_${index}`} value={cR.shortCode}>{cR.docConcatVal}</option>
                                                } else {
                                                    return false
                                                }
                                            })
                                        }
                                    </Form.Control>
                                </Col>
                                <Form.Label className="label_custom">Field 5</Form.Label>
                                {
                                    fieldsSelected[5] &&
                                    <div className={Styles.movement_group}>
                                        <HiArrowNarrowUp onClick={() => handleMove(5, 'up')} />
                                        {
                                            fieldsSelected[6] &&
                                            <HiArrowNarrowDown onClick={() => handleMove(5, 'down')} />
                                        }
                                    </div>
                                }
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        {
                            userType !== 'Client'
                            &&
                            <Col lg={12} md={6} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control
                                            as="select"
                                            name="field_6"
                                            onChange={(e) => handleSelection(6, e.target.value)}
                                            value={fieldsSelected[6] || ''}
                                            className="select_custom">
                                            <option></option>
                                            {
                                                (filteredOptions && filteredOptions.length > 0) &&
                                                filteredOptions.map((cR: any, index: number) => {
                                                    if (!cR.default) {
                                                        return <option disabled={!cR.available} key={`cr_${index}`} value={cR.shortCode}>{cR.docConcatVal}</option>
                                                    } else {
                                                        return false
                                                    }
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                    <Form.Label className="label_custom">Field 6</Form.Label>
                                    {
                                        fieldsSelected[6] &&
                                        <div className={Styles.movement_group}>
                                            <HiArrowNarrowUp onClick={() => handleMove(6, 'up')} />
                                        </div>
                                    }
                                </Form.Group>
                            </Col>
                        }
                        <Col sm={12} style={{ marginLeft: '1rem' }}>
                            <Button variant="dark" style={{ width: "140px" }} type="submit">Save</Button>{" "}
                            <Button variant="dark" style={{ width: "140px" }} onClick={() => resetHandler()}>Reset to Default</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
            <Col sm={3}></Col>
        </Row>
        <br />
        {
            userType === 'Client'
            && <>
                <Row style={{ margin: 0 }} className="form_container">
                    <Col sm={3}></Col>
                    <Col sm={6}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Document Retention Policy</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form onSubmit={(e) => handleSave(e)}>
                            <Row>
                                <Col lg={12} md={6}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={11} sm={11}>
                                                <Form.Control className="select_custom" type="text" name="charge_off_balance_from" value={dataFileNamingConfig.retentionPolicyInDay} />
                                            </Col>
                                            <Col md={1} style={{ display: 'flex', alignItems: 'center' }}><p style={{ margin: 0 }}>Days</p></Col>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Retain document after closure of account till</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} type="submit">Save</Button>{" "}
                                    <Button variant="dark" style={{ width: "140px" }} onClick={resetHandler}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
                <br />
                <Row style={{ margin: 0 }} className="form_container">
                    <Col sm={3}></Col>
                    <Col sm={6}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Other Configuration</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form onSubmit={(e) => handleSave(e)}>
                            <Row>
                                <Col lg={12} md={6}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={12} sm={12}>
                                                {
                                                    mode && mode.map((m, index) => (
                                                        <Form.Check
                                                            key={`default-${index}`}
                                                            inline
                                                            type="radio"
                                                            onClick={(e: any) => {
                                                                setModeSelected(e.target.value)
                                                            }}
                                                            checked={dataFileNamingConfig.documentKeepPolicy === m.keycode}
                                                            value={m.keycode}
                                                            name='mode'
                                                            label={m.keyvalue}
                                                        />
                                                    ))
                                                }
                                            </Col>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Incase of Document Duplication</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} type="submit">Save</Button>{" "}
                                    <Button variant="dark" style={{ width: "140px" }} onClick={resetHandler}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col sm={3}></Col>
                </Row>
            </>
        }
    </>
}

export default DocumentGeneralConfiguration