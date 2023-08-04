import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { Button, Col, Form, Row } from 'react-bootstrap';
import xlsx from 'json-as-xlsx';
import { CgSpinnerAlt } from 'react-icons/cg';
import { RiSettings3Fill, RiSettings3Line } from 'react-icons/ri';
import { HiArrowNarrowDown, HiArrowNarrowUp } from 'react-icons/hi';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

import { history } from "../../helpers"
import { FileNameConfigActionCreator } from '../../store/actions/fileNameConfig.actions';
import { TypesActionCreator } from '../../store/actions/common/types.actions';
import { IConfiguration } from './DocumentGeneralConfiguration';
import { fileNameConfigService, userService } from '../../services';
import Styles from "./User.module.sass"
import { createMessage } from '../../helpers/messages';
import ExampleNaming from '../../components/modal/ExampleNaming';
import NamingAdditionalFields from '../../components/modal/NamingAdditionalFields';

const NamingConfigurationOthers = () => {
    const { id }: { id: string } = useParams()
    const dispatch = useDispatch()
    const { addToast } = useToasts();
    const clientDefault = ["CAN", "DT"]
    const partnerDefault = ["CIDSC", "DT", "CAN"]
    const configRef = useRef<any>();
    const configNameSaveRef = useRef<any>();
    const [uniqueIdentifier, setUniqueIdentifier] = useState<any>(null)
    const [groupIdentifier, setGroupIdentifier] = useState<any>(null)
    const [filteredOptions, setFilteredOptions] = useState<any>([]);
    const [fieldsSelected, setFieldSelected] = useState<any>({});
    const [formError, setFormError] = useState<any>({
        configName: false
    })
    const [userType, setUserType] = useState(null)
    const [details, setDetails] = useState<IConfiguration | null>(null)
    const [show, setShow] = useState<boolean>(false)
    const [showAdditional, setShowAdditional] = useState<boolean>(false)
    const {
        saveSuccess,
        saveError,
    } = useSelector((state: any) => ({
        saveSuccess: state.fileNameConfig.saveConfig.success,
        saveError: state.fileNameConfig.saveConfig.error,
    }))

    const {
        isLoading,
        dataConjunction,
        dataFieldOptions,
        dataFileNamingConfig,
        dataUserConjunction,
        productTypes,
        documentTypes
    } = useSelector((state: any) => ({
        isLoading: state.fileNameConfig.conjunction.loading,
        dataConjunction: state.fileNameConfig.conjunction.data,
        dataFieldOptions: state.fileNameConfig.fieldOptions.data,
        dataFileNamingConfig: state.fileNameConfig.fileNamingConfig.data,
        dataUserConjunction: state.fileNameConfig.userConjunction.data,
        productTypes: state.types.productType.data,
        documentTypes: state.types.documentType.data,
    }))

    useEffect(() => {
        if (saveSuccess) {
            addToast(createMessage('', `FILE_NAME_CONFIGURATION_SAVED_SUCCESS`, ''), { appearance: 'success', autoDismiss: true });
            history.push(`/profile/document_general_configuration`)
        }
        if (saveError) {
            addToast(createMessage('error', `User Configuration`, 'Save'), { appearance: 'error', autoDismiss: false });
        }
    }, [saveSuccess, saveError])

    useEffect(() => {
        const config = localStorage.getItem('naming_config')!
        const user = userService.getUser();
        setDetails(() => {
            return JSON.parse(config)
        })
        setUserType(user.recordSource);
        dispatch(FileNameConfigActionCreator.getUserConfig())
        dispatch(FileNameConfigActionCreator.getFieldOptions())
        dispatch(FileNameConfigActionCreator.getConjunction())
        // dispatch(FileNameConfigActionCreator.getUserSeparator())
        dispatch(TypesActionCreator.getProductTypes())
        dispatch(TypesActionCreator.getDocumentTypes())
        return () => {
            localStorage.removeItem('naming_config')
        }
    }, [])

    useEffect(() => {
        if (details?.userDocConfig) {
            for (let i = 0; i < details.userDocConfig.length; i++) {
                if (details.userDocConfig[i].isDocumentGroupIdentifier) {
                    setGroupIdentifier(details.userDocConfig[i].docMgrConfigSelectedCode.replace('field', 'field_'))
                }
                if (details.userDocConfig[i].isDocumentUniqueIdentifier) {
                    setUniqueIdentifier(details.userDocConfig[i].docMgrConfigSelectedCode.replace('field', 'field_'))
                }
            }
        }
    }, [details])

    useEffect(() => {
        if (
            dataFieldOptions?.length > 0
        ) {
            handleDefaultAndSavedSelection()
        }
    }, [dataFieldOptions, dataFileNamingConfig])

    const handleDefaultAndSavedSelection = async () => {
        let selectedTemp = {}
        if (userType === 'Client' || userType === 'Equabli') {
            selectedTemp = {
                1: 'CAN',
                2: 'DT',
                3: null,
                4: null,
                5: null,
                6: null,
            }
        } else {
            selectedTemp = {
                1: 'CIDSC',
                2: 'DT',
                3: 'CAN',
                4: null,
                5: null,
                6: null,
                7: null
            }
        }
        setFieldSelected(selectedTemp)
        const { fieldFinal, selectionFinal }: { fieldFinal: any, selectionFinal: any } = await fileNameConfigService.handleDefaultAndSavedSelection(dataFieldOptions, dataFileNamingConfig, userType, selectedTemp, details)
        setFilteredOptions(fieldFinal)
        setFieldSelected(selectionFinal)
    }

    const handleSave = (e: any, type: any) => {
        e.preventDefault();
        const {
            config_name,
            conjunction,
            field_1,
            field_2,
            field_3,
            field_4,
            field_5,
            field_6,
            field_7
        } = configRef.current

        if (!config_name.value) {
            setFormError({ configName: true })
            return
        } else {
            setFormError({ configName: false })
        }

        if (!uniqueIdentifier) {
            addToast('A Unique identifier is required', { appearance: 'info', autoDismiss: false })
            return
        }

        const configRequest: any = {
            "namingConfigGroupName": config_name.value,
            "separatorCode": conjunction.value,
            userDocConfig: []
        }
        if (field_1.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field1",
                "domainAttributeMappingSelectedCode": field_1.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_1',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_1'
            })
        }
        if (field_2.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field2",
                "domainAttributeMappingSelectedCode": field_2.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_2',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_2'
            })
        }
        if (field_3.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field3",
                "domainAttributeMappingSelectedCode": field_3.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_3',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_3'
            })
        }
        if (field_4.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field4",
                "domainAttributeMappingSelectedCode": field_4.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_4',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_4'
            })
        }
        if (field_5.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field5",
                "domainAttributeMappingSelectedCode": field_5.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_5',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_5'
            })
        }
        if (field_6.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field6",
                "domainAttributeMappingSelectedCode": field_6.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_6',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_6'
            })
        }
        if (field_7 && field_7.value) {
            configRequest.userDocConfig.push({
                "docMgrConfigSelectedCode": "field7",
                "domainAttributeMappingSelectedCode": field_7.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_7',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_7'
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
        }
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
            if (selected === fO.attributeCode) {
                fO.available = false
            }
            if (!selected && (fieldsSelectedTemp[field] === fO.attributeCode)) {
                fO.available = true
            }
            if (tempMap.indexOf(fO.attributeCode) === -1) {
                fO.selected = false
                fO.available = true
            }
            return fO
        })
        console.log(fieldsSelectedTemp, dataFieldOptionsFiltered)
        setFilteredOptions(dataFieldOptionsFiltered)
        setFieldSelected(fieldsSelectedTemp)
    }

    const disableHandler = (fieldName: any) => {
        console.log(fieldName)
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

    const handleIdentifiers = (type: string, field: string) => {
        if (type === 'group') {
            if (uniqueIdentifier === field) {
                addToast(`Group Identifier and Unique Identifier cannot be the same field`, { appearance: 'info', autoDismiss: true });
            } else if (groupIdentifier === field) {
                setGroupIdentifier('')
            } else {
                setGroupIdentifier(field)
            }
        } else {
            if (groupIdentifier === field) {
                addToast(`Unique Identifier and Group Identifier cannot be the same field`, { appearance: 'info', autoDismiss: true });
            } else if (uniqueIdentifier === field) {
                setUniqueIdentifier('')
            } else {
                setUniqueIdentifier(field)
            }
        }
    }

    return (
        <Col className='form_container'>
            {
                isLoading
                && <CgSpinnerAlt style={{ textAlign: 'center', width: '100%' }} className="spinner" size={50} />
            }
            {
                !isLoading
                &&
                <Row style={{ margin: 0 }}>
                    <Col sm={2}>
                    </Col>
                    <Col lg={8} sm={12}>
                        <br />
                        <Form ref={configRef} onSubmit={(e) => handleSave(e, 'config')}>
                            {
                                <Row>
                                    <Col lg={12} md={12} className="no_padding">
                                        <Form.Group as={Col} className="mb-5">
                                            <Col md={12} sm={12}>
                                                <Form.Control
                                                    as="input"
                                                    name="config_name"
                                                    defaultValue={details ? details.namingConfigGroupName : ''}
                                                    className="select_custom white">
                                                </Form.Control>
                                                <span style={{ color: 'red' }}><small>{formError["configName"] ? 'Configuration Name is Required' : ''}</small></span>
                                            </Col>
                                            <Form.Label className="label_custom">Name</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            }
                            {
                                <Row>
                                    <Col lg={12} md={12} className="no_padding">
                                        <Form.Group as={Col}>
                                            <Col md={12} sm={12}>
                                                <Form.Control
                                                    as="select"
                                                    name="conjunction"
                                                    defaultValue={details ? details.separatorCode : "_"}
                                                    className="select_custom white">
                                                    {
                                                        dataConjunction &&
                                                        dataConjunction.map((cR: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={cR.keyCode}>{cR.description}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom">Conjunction / Concatenation Parameter</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            }
                            <Row>
                                <div className="naming_config_inputs">
                                    <div></div>
                                    <div>Arrange</div>
                                    <div>Group Identifier</div>
                                    <div>Unique Identifier</div>
                                    <div>Additional Settings</div>
                                </div>
                                {
                                    fieldsSelected
                                    && Object.keys(fieldsSelected).map((keyName, keyIndex) => (
                                        <div className="naming_config_inputs">
                                            <div>
                                                <Form.Group as={Col} className="mb-5 no_padding">
                                                    <Form.Control
                                                        as="select"
                                                        name={`field_${keyIndex + 1}`}
                                                        className="select_custom white"
                                                        disabled={disableHandler(fieldsSelected[keyName])}
                                                        onChange={(e) => handleSelection(keyIndex + 1, e.target.value)}
                                                        value={fieldsSelected[keyName] || ''}>
                                                        {!fieldsSelected[Number(keyName) + 1]
                                                            && <option></option>}
                                                        {(filteredOptions && filteredOptions.length > 0) &&
                                                            filteredOptions.map((cR: any, index: number) => {
                                                                return <option disabled={!cR.available} key={`cr_${index}`} value={cR.attributeCode}>
                                                                    {cR.attributeName}
                                                                </option>;
                                                            })}
                                                    </Form.Control>
                                                    <Form.Label className="label_custom" style={{ left: 0 }}>Field {keyIndex + 1}
                                                        {(fieldsSelected[keyName] === 'PC' || fieldsSelected[keyName] === 'DT') &&
                                                            <BsFillQuestionCircleFill size={14} style={{ marginLeft: '1rem', color: 'black', cursor: 'pointer' }} onClick={() => downloadProductCodes(fieldsSelected[keyName] === 'DT' ? 'Document Types' : 'Product Codes')} />}

                                                        {(fieldsSelected[keyName] === 'DGD') && <span className={Styles.date_format}>Format: DDMMYYYY</span>}
                                                    </Form.Label>
                                                </Form.Group>
                                            </div>
                                            <div>
                                                {keyIndex !== 0
                                                    && fieldsSelected[keyName]
                                                    && <HiArrowNarrowUp className={Styles.arrange_arrow} onClick={() => handleMove(keyIndex + 1, 'up')} />}
                                                {keyIndex !== (Object.keys(fieldsSelected).length - 1)
                                                    && fieldsSelected[keyName]
                                                    && fieldsSelected[Number(keyName) + 1]
                                                    && <HiArrowNarrowDown className={Styles.arrange_arrow} onClick={() => handleMove(keyIndex + 1, 'down')} />}
                                            </div>
                                            <div style={{ paddingTop: '1rem' }}>
                                                <input
                                                    type="checkbox"
                                                    className="switch small"
                                                    onChange={() => handleIdentifiers('group', `field_${keyIndex + 1}`)}
                                                    name="consent"
                                                    checked={groupIdentifier === `field_${keyIndex + 1}`} />
                                            </div>
                                            <div style={{ paddingTop: '1rem' }}>
                                                <input
                                                    type="checkbox"
                                                    className="switch small"
                                                    onChange={() => handleIdentifiers('unique', `field_${keyIndex + 1}`)}
                                                    name="consent"
                                                    checked={uniqueIdentifier === `field_${keyIndex + 1}`} />
                                            </div>
                                            <div>
                                                <RiSettings3Line className={Styles.arrange_arrow} size={30} onClick={() => setShowAdditional(true)} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </Row>
                            <Col sm={12}>
                                <Button variant="dark" style={{ width: "140px" }} ref={configNameSaveRef} type="submit">Save</Button>{" "}
                                {
                                    id !== '_NEW_CONFIGURATION'
                                    && <Button variant="dark" style={{ width: "140px" }} onClick={() => setShow(true)}>Example</Button>
                                }
                            </Col>
                        </Form>
                    </Col >
                    <Col sm={2}></Col>
                </Row >
            }
            {
                show && <ExampleNaming show={show} onHide={() => setShow(false)} details={details} />
            }
            {
                showAdditional && <NamingAdditionalFields show={showAdditional} onHide={() => setShowAdditional(false)} />
            }
        </Col>
    )
}

export default NamingConfigurationOthers