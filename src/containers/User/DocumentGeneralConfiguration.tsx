import { useEffect, useRef, useState } from "react"
import { Col, Row, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi"

import Styles from "./User.module.sass"
import { FileNameConfigActionCreator } from "../../store/actions/fileNameConfig.actions";
import { fileNameConfigService, userService } from "../../services";
import UseDocumentTitle from "../../helpers/useDocumentTitle"
import { useToasts } from "react-toast-notifications"
import { createMessage } from "../../helpers/messages"
import { CgSpinnerAlt } from "react-icons/cg"
import { BsFillQuestionCircleFill } from "react-icons/bs"
import { TypesActionCreator } from "../../store/actions/common/types.actions"
import xlsx from "json-as-xlsx"

const DocumentGeneralConfiguration = () => {
    const clientDefault = ["CAN", "DT", "PC"]
    const partnerDefault = ["CIDSC", "DT", "CAN", "PC"]
    const { addToast } = useToasts();
    UseDocumentTitle('Document General Configuration')
    const dispatch = useDispatch();
    const configRef = useRef<any>();
    const retentionRef = useRef<any>();
    const configNameSaveRef = useRef<any>();
    const retentionSaveRef = useRef<any>();
    const otherSaveRef = useRef<any>();
    const [modeSelected, setModeSelected] = useState('KBF');
    const [filteredOptions, setFilteredOptions] = useState<any>([]);
    const [userType, setUserType] = useState(null)
    const [fieldsSelected, setFieldSelected] = useState<any>({});
    const [minMaxError, setMinMaxError] = useState<any>(false)
    const [mode, setMode] = useState([
        {
            keycode: 'KBF',
            keyvalue: 'Keep Both Files'
        },
        {
            keycode: 'RE',
            keyvalue: 'Replace Existing'
        }
    ])
    const [retention, setRetention] = useState<any>(60)

    const {
        dataConjunction,
        isLoading,
        dataFieldOptions,
        dataFileNamingConfig,
        dataUserRetentionPolicy,
        isLoadingRetention,
        dataUserConjunction,
        dataRetentionPolicy,
        dataDocumentPolicy,
        dataUserDocumentPolicy,
        isLoadingDocumentPolicy,
        saveLoading,
        saveSuccess,
        saveError,
        productTypes,
        documentTypes
    } = useSelector((state: any) => ({
        dataConjunction: state.fileNameConfig.conjunction.data,
        isLoading: state.fileNameConfig.conjunction.loading,
        dataFieldOptions: state.fileNameConfig.fieldOptions.data,
        dataFileNamingConfig: state.fileNameConfig.fileNamingConfig.data,
        dataUserRetentionPolicy: state.fileNameConfig.userRetentionPolicy.data,
        isLoadingRetention: state.fileNameConfig.userRetentionPolicy.loading,
        dataUserConjunction: state.fileNameConfig.userConjunction.data,
        dataUserDocumentPolicy: state.fileNameConfig.userDocumentPolicy.data,
        isLoadingDocumentPolicy: state.fileNameConfig.userDocumentPolicy.loading,
        dataRetentionPolicy: state.fileNameConfig.retentionPolicy.data,
        dataDocumentPolicy: state.fileNameConfig.documentPolicy.data,
        saveLoading: state.fileNameConfig.saveConfig.loading,
        saveSuccess: state.fileNameConfig.saveConfig.success,
        saveError: state.fileNameConfig.saveConfig.error,
        productTypes: state.types.productType.data,
        documentTypes: state.types.documentType.data,
    }))

    useEffect(() => {
        if (dataUserRetentionPolicy) {
            setRetention(dataUserRetentionPolicy ? dataUserRetentionPolicy.configValSelectedCode : dataRetentionPolicy.defaultValue)
        }
        if (dataUserDocumentPolicy) {
            setModeSelected((dataUserDocumentPolicy ? dataUserDocumentPolicy.configValSelectedCode : "KBF"))
        }
    }, [dataUserRetentionPolicy, dataUserDocumentPolicy])

    useEffect(() => {
        const user = userService.getUser();
        setUserType(user.recordSource);
        let selectedTemp = {}
        if (user.recordSource === 'Client' || user.recordSource === 'Equabli') {
            selectedTemp = {
                1: 'CAN',
                2: 'DT',
                3: 'PC',
                4: null,
                5: null,
                6: null,
            }
        } else {
            selectedTemp = {
                1: 'CIDSC',
                2: 'DT',
                3: 'CAN',
                4: 'PC',
                5: null,
                6: null,
                7: null
            }
        }
        setFieldSelected(selectedTemp)
        dispatch(FileNameConfigActionCreator.getUserConfig())
        dispatch(FileNameConfigActionCreator.getFieldOptions())
        dispatch(FileNameConfigActionCreator.getConjunction())
        dispatch(FileNameConfigActionCreator.getDocumentPolicy())
        dispatch(FileNameConfigActionCreator.getRetentionPolicy())
        dispatch(FileNameConfigActionCreator.getUserRetentionPolicy())
        dispatch(FileNameConfigActionCreator.getUserSeparator())
        dispatch(FileNameConfigActionCreator.getUserDocumentPolicy())
        dispatch(TypesActionCreator.getProductTypes())
        dispatch(TypesActionCreator.getDocumentTypes())
    }, [])

    useEffect(() => {
        if (
            dataFieldOptions.length > 0
        ) {
            handleDefaultAndSavedSelection()
        }
    }, [dataFieldOptions, dataFileNamingConfig])

    useEffect(() => {
        if (saveSuccess) {
            addToast(createMessage('', `FILE_NAME_CONFIGURATION_SAVED_SUCCESS`, ''), { appearance: 'success', autoDismiss: true });
        }
        if (saveError) {
            addToast(createMessage('error', `User Configuration`, 'Save'), { appearance: 'error', autoDismiss: false });
        }
    }, [saveSuccess, saveError])

    const handleDefaultAndSavedSelection = async () => {
        const { fieldFinal, selectionFinal }: { fieldFinal: any, selectionFinal: any } = await fileNameConfigService.handleDefaultAndSavedSelection(dataFieldOptions, dataFileNamingConfig, userType, fieldsSelected)
        setFilteredOptions(fieldFinal)
        setFieldSelected(selectionFinal)
    }

    const handleMove = async (field: any, direction: any) => {
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

    const handleSelection = (field: any, selected: any) => {
        const fieldsSelectedTemp = Object.assign({}, fieldsSelected)
        fieldsSelectedTemp[field] = selected
        const tempMap = Object.values(fieldsSelectedTemp)
        let dataFieldOptionsFiltered = filteredOptions.map((fO: any) => {
            if (selected === fO.shortCode) {
                fO.available = false
            }
            if (!selected && (fieldsSelectedTemp[field] === fO.shortCode)) {
                fO.available = true
            }
            if (tempMap.indexOf(fO.shortCode) === -1) {
                fO.selected = false
                fO.available = true
            }
            return fO
        })
        setFilteredOptions(dataFieldOptionsFiltered)
        setFieldSelected(fieldsSelectedTemp)
    }

    const handleSave = (e: any, type: any) => {
        e.preventDefault();
        const configRequest: any = []
        if (type === 'config') {
            const {
                conjunction,
                field_1,
                field_2,
                field_3,
                field_4,
                field_5,
                field_6,
                field_7
            } = configRef.current
            configRequest.push({
                "configShortCode": "SEPARATOR",
                "configValShortCode": conjunction.value
            })
            if (field_1.value) {
                configRequest.push({
                    "configShortCode": "field1",
                    "configValShortCode": field_1.value
                })
            }
            if (field_2.value) {
                configRequest.push({
                    "configShortCode": "field2",
                    "configValShortCode": field_2.value
                })
            }
            if (field_3.value) {
                configRequest.push({
                    "configShortCode": "field3",
                    "configValShortCode": field_3.value
                })
            }
            if (field_4.value) {
                configRequest.push({
                    "configShortCode": "field4",
                    "configValShortCode": field_4.value
                })
            }
            if (field_5.value) {
                configRequest.push({
                    "configShortCode": "field5",
                    "configValShortCode": field_5.value
                })
            }
            if (field_6.value) {
                configRequest.push({
                    "configShortCode": "field6",
                    "configValShortCode": field_6.value,
                })
            }
            if (field_7 && field_7.value) {
                configRequest.push({
                    "configShortCode": "field7",
                    "configValShortCode": field_7.value,
                })
            }
        } else if (type === 'retention') {
            if (Number(retention) < 60 || Number(retention) > 365) {
                setMinMaxError(true)
                return
            } else {
                setMinMaxError(false)
                configRequest.push({
                    "configShortCode": "RP",
                    "configValShortCode": retention,
                    "orgTypeCode": "CT"
                })
            }
        } else if (type === 'mode') {
            configRequest.push({
                "configShortCode": "DP",
                "configValShortCode": modeSelected,
                "orgTypeCode": "CT"
            })
        }
        dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
    }

    const resetHandler = async (e: any, type: any) => {
        if (type === 'config') {
            let selectedTemp = {}
            if (userType === 'Client' || userType === 'Equabli') {
                selectedTemp = {
                    1: 'CAN',
                    2: 'DT',
                    3: 'PC',
                    4: null,
                    5: null,
                    6: null,
                }
            } else {
                selectedTemp = {
                    1: 'CIDSC',
                    2: 'DT',
                    3: 'CAN',
                    4: 'PC',
                    5: null,
                    6: null,
                    7: null
                }
            }
            configRef.current.conjunction.value = '_'
            setFieldSelected(selectedTemp)
            const tempMap = Object.values(selectedTemp)
            let dataFieldOptionsFiltered = filteredOptions.map((fO: any) => {
                if (tempMap.indexOf(fO.shortCode) === -1) {
                    fO.selected = false
                    fO.available = true
                }
                return fO
            })
            setFilteredOptions(dataFieldOptionsFiltered)
            setTimeout(async () => {
                configNameSaveRef.current.click()
            }, 100)
        } else if (type === 'retention') {
            setRetention(60)
            setTimeout(() => {
                retentionSaveRef.current.click()
            }, 0)
        } else if (type === 'mode') {
            setModeSelected('KBF')
            setTimeout(() => {
                otherSaveRef.current.click()
            }, 0)
        }
    }

    const disableHandler = (fieldName: any) => {
        let flag = false
        if ((userType === 'Client' || userType === 'Equabli') && clientDefault.indexOf(fieldName) !== -1) {
            flag = true
        } else if (partnerDefault.indexOf(fieldName) !== -1) {
            flag = true
        }
        return flag
    }

    const downloadProductCodes = (fileName: string) => {
        let settings = {
            fileName: fileName
        }
        let objToDownload: any = []
        let tempJson: any = []
        if (fileName === 'Product Codes') {
            objToDownload = [
                {
                    sheet: "Matrix",
                    columns: [
                        { label: "Product Code", value: "productCode" },
                        { label: "Product Name", value: "productName" }
                    ],
                    content: [],
                }
            ]
            tempJson = productTypes && productTypes.map((data: any) => {
                let obj: any = {
                    "productCode": data.shortName,
                    "productName": data.fullName
                }
                return obj
            })
        } else {
            objToDownload = [
                {
                    sheet: "Matrix",
                    columns: [
                        { label: "Document Code", value: "documentCode" },
                        { label: "Document Name", value: "documentName" }
                    ],
                    content: [],
                }
            ]
            tempJson = documentTypes && documentTypes.map((data: any) => {
                let obj: any = {
                    "documentCode": data.shortCode,
                    "documentName": data.documentType
                }
                return obj
            })
        }

        objToDownload[0].content = tempJson
        xlsx(objToDownload, settings)
    }

    const showExample = (json: any) => {
        let index: number = 0
        let documentNameGenerated = ''
        for (let key in fieldsSelected) {
            documentNameGenerated += `${index === 0 ? '' : json.conj}${json[fieldsSelected[key]]}`
            index++
        }
        return documentNameGenerated
    }

    return <>
        {
            isLoading && <CgSpinnerAlt className="spinner" size={50} />
        }
        {
            !isLoading &&
            <Row style={{ margin: 0 }} className="form_container">
                <Col lg={3} sm={12}></Col>
                <Col lg={6} sm={12}>
                    <Row>
                        <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>File Name Configuration</h5></Col>
                    </Row>
                    <br />
                    <br />
                    <Form ref={configRef} onSubmit={(e) => handleSave(e, 'config')}>
                        {
                            JSON.stringify(dataUserConjunction) !== "{}"
                            && <Row>
                                <Col lg={12} md={12} className="no_padding">
                                    <Form.Group as={Col} className="mb-5">
                                        <Col md={12} sm={12}>
                                            <Form.Control
                                                as="select"
                                                name="conjunction"
                                                defaultValue={dataUserConjunction ? dataUserConjunction.configValSelectedCode : dataConjunction.defaultValue}
                                                className="select_custom">
                                                {
                                                    (dataConjunction && dataConjunction.configVals && dataConjunction.configVals.length > 0) &&
                                                    dataConjunction.configVals.map((cR: any, index: number) => {
                                                        return <option key={`cr_${index}`} value={cR.shortCode}>{cR.fieldValue}</option>
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Form.Label className="label_custom">Conjunction / Concatenation Parameter</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                        }
                        {
                            fieldsSelected
                            && Object.keys(fieldsSelected).map((keyName, keyIndex) => {
                                return (
                                    <Row key={`options_${keyIndex}`}>
                                        <Col lg={12} md={12} className="no_padding">
                                            <Form.Group as={Col} className="mb-5">
                                                <Col md={12} sm={12}>
                                                    <Form.Control
                                                        as="select"
                                                        name={`field_${keyIndex + 1}`}
                                                        className="select_custom"
                                                        disabled={
                                                            disableHandler(fieldsSelected[keyName])
                                                        }
                                                        onChange={(e) => handleSelection(keyIndex + 1, e.target.value)}
                                                        value={fieldsSelected[keyName] || ''}>
                                                        {
                                                            !fieldsSelected[Number(keyName) + 1]
                                                            && <option></option>
                                                        }
                                                        {
                                                            (filteredOptions && filteredOptions.length > 0) &&
                                                            filteredOptions.map((cR: any, index: number) => {
                                                                return <option disabled={!cR.available} key={`cr_${index}`} value={cR.shortCode}>
                                                                    {cR.fieldValue}
                                                                </option>
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Col>
                                                <Form.Label className="label_custom">Field {keyIndex + 1}
                                                    {
                                                        (fieldsSelected[keyName] === 'PC' || fieldsSelected[keyName] === 'DT') &&
                                                        <BsFillQuestionCircleFill size={14} style={{ marginLeft: '1rem', color: 'black', cursor: 'pointer' }} onClick={() => downloadProductCodes(fieldsSelected[keyName] === 'DT' ? 'Document Types' : 'Product Codes')} />
                                                    }

                                                    {
                                                        (fieldsSelected[keyName] === 'DGD') && <span className={Styles.date_format}>Format: DDMMYYYY</span>
                                                    }
                                                </Form.Label>
                                                <div className={Styles.movement_group}>
                                                    {
                                                        keyIndex !== 0
                                                        && fieldsSelected[keyName]
                                                        && <HiArrowNarrowUp onClick={() => handleMove(keyIndex + 1, 'up')} />
                                                    }
                                                    {
                                                        keyIndex !== (Object.keys(fieldsSelected).length - 1)
                                                        && fieldsSelected[keyName]
                                                        && fieldsSelected[Number(keyName) + 1]
                                                        && <HiArrowNarrowDown onClick={() => handleMove(keyIndex + 1, 'down')} />
                                                    }
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>)
                            })
                        }
                        <Col sm={12}>
                            <Button variant="dark" style={{ width: "140px" }} ref={configNameSaveRef} type="submit">Save</Button>{" "}
                            <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler(e, 'config')}>Reset to Default</Button>
                        </Col>
                    </Form>
                </Col >
                <Col lg={3} sm={12}>
                    <Row>
                        <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Examples</h5></Col>
                    </Row>
                    <br />
                    <br />
                    <Row style={{ padding: '0 2rem' }}>
                        <ul>
                            <li>
                                <span> Conjunction = </span><b>Underscore[_]</b><br />
                                <span> Client Account Number =</span> <b>40001</b><br />
                                <span> Document Type = </span><b>Bill of Sales </b><br />
                                <span> Product Code = </span><b>Credit Card</b><br />
                                <span> Original Account Number = </span><b>250001</b><br />
                                <span> Document Generation Date = </span><b>20 December 2023</b><br />
                                <span> Document Name =</span> <b>Bills</b><br />
                            </li>
                        </ul>
                        <p className={Styles.document_name_example_p}>
                            {
                                showExample({
                                    conj: dataUserConjunction ? dataUserConjunction.configValSelectedCode : dataConjunction.defaultValue,
                                    CAN: 40001,
                                    DT: 'BS',
                                    PC: 'CC',
                                    OAN: 250001,
                                    DGD: 20122023,
                                    DN: 'Bills'
                                })
                            }
                        </p>
                    </Row>
                </Col>
            </Row >
        }
        <br />
        {
            (userType === 'Client' || userType === 'Equabli')
            && <>
                {
                    !isLoadingRetention
                    &&
                    <Row style={{ margin: 0 }} className="form_container">
                        <Col lg={3} sm={12}></Col>
                        <Col lg={6} sm={12}>
                            <Row>
                                <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Document Retention Policy</h5></Col>
                            </Row>
                            <br />
                            <br />
                            <Form ref={retentionRef} onSubmit={(e) => handleSave(e, 'retention')}>
                                <Row>
                                    <Col lg={12} md={12}>
                                        <Form.Group as={Col} className="mb-4">
                                            <Row>
                                                <Col md={11} sm={11}>
                                                    <Form.Control
                                                        className="select_custom"
                                                        type="number"
                                                        name="retention_policy"
                                                        onChange={(e) => {
                                                            setRetention(e.target.value)
                                                        }}
                                                        value={retention} />
                                                </Col>
                                                <Col md={1} style={{ display: 'flex', alignItems: 'center' }}><p style={{ margin: 0 }}>Days</p></Col>
                                                <span style={{ color: 'red', marginLeft: "1rem" }}><small>{minMaxError ? 'Retention Policy Should be between 60 to 365 days' : ''}</small></span>
                                            </Row>
                                            <Form.Label className="label_custom" style={{ left: '10px' }}>Retain document after closure of account till</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col sm={12} style={{ marginLeft: '1rem' }}>
                                        <Button variant="dark" style={{ width: "140px" }} ref={retentionSaveRef} type="submit">Save</Button>{" "}
                                        <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler(e, 'retention')}>Reset to Default</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                        <Col lg={3} sm={12}></Col>
                    </Row>
                }
                <br />
                {
                    !isLoadingDocumentPolicy
                    && <Row style={{ margin: 0 }} className="form_container">
                        <Col lg={3} sm={12}></Col>
                        <Col lg={6} sm={12}>
                            <Row>
                                <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Other Configuration</h5></Col>
                            </Row>
                            <br />
                            <br />
                            <Form onSubmit={(e) => handleSave(e, 'mode')}>
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
                                                                onChange={(e: any) => {
                                                                    setModeSelected(e.target.value)
                                                                }}
                                                                checked={m.keycode == modeSelected}
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
                                        <Button variant="dark" style={{ width: "140px" }} ref={otherSaveRef} type="submit">Save</Button>{" "}
                                        <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler(e, 'mode')}>Reset to Default</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                        <Col lg={3} sm={12}></Col>
                    </Row>
                }

            </>
        }
    </>
}

export default DocumentGeneralConfiguration

