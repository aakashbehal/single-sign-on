import React, { ReactEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
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
import NamingAdditionalFields, { IAdditionSettingsJson } from '../../components/modal/NamingAdditionalFields';
import { DocumentHighlighter, ISelection, TextSelectionHook } from '../../components/TextSelection/TextSelection';
import { AiOutlineDelete } from 'react-icons/ai';
import TransformationNameModel from '../../components/modal/TransformationNameModel';

const NamingConfiguration = () => {
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
    const [nameTransform, setNameTransform] = useState<any>(null);
    const [confirmChange, setConfirmChange] = useState<boolean>(false)
    const [formError, setFormError] = useState<any>({
        configName: false
    })
    const [userType, setUserType] = useState(null)
    const [details, setDetails] = useState<IConfiguration | null>(null)
    const [show, setShow] = useState<boolean>(false)
    const [showAdditional, setShowAdditional] = useState<string>('')
    const [additionSettingsJson, setAdditionalSettingsJson] = useState<any>(null)
    const [nameTransformationState, documentName, { selectionEventListener, deleteSelection, reset, handleSetDocumentName, handleSetState }] = TextSelectionHook()

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
        dataConjunction: state.fileNameConfig.conjunction.data.CONJUNCTION_TYPE,
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
        const user = userService.getUser();
        if (id !== '_NEW_CONFIGURATION') {
            const config: any = localStorage.getItem('naming_config')!
            const configParsed = JSON.parse(config)
            if (configParsed?.fields !== 'null' && configParsed?.fields?.length > 0) {
                setNameTransform(true)
                handleSetDocumentName(configParsed?.sample)
                handleSetState(JSON.parse(configParsed?.fields))
                let tempFieldSelected: any = {}
                for (let [index, conf] of configParsed.userDocConfig.entries()) {
                    tempFieldSelected[index] = conf.attributeCode
                }
                setFieldSelected(tempFieldSelected)
                setFilteredOptions(() => {
                    return dataFieldOptions.map((options: any) => {
                        options.selected = false
                        options.available = true
                        return options
                    })
                })
            } else {
                setNameTransform(false)
                handleDefaultAndSavedSelection()
            }
            let updatedConfig: any = {}
            for (let [index, conf] of configParsed.userDocConfig[0].validationRules.entries()) {
                if (Object.keys(conf).length !== 0) {
                    updatedConfig[`field_${index + 1}`] = conf
                }
            }
            setAdditionalSettingsJson(updatedConfig)
            setDetails(configParsed)
        }
        setUserType(user.recordSource);
        dispatch(FileNameConfigActionCreator.getUserConfig())
        dispatch(FileNameConfigActionCreator.getFieldOptions())
        dispatch(FileNameConfigActionCreator.getConjunction())
        // dispatch(FileNameConfigActionCreator.getUserSeparator())
        dispatch(TypesActionCreator.getProductTypes())
        dispatch(TypesActionCreator.getDocumentTypes())
        // return () => {
        //     localStorage.removeItem('naming_config')
        // }
    }, [])

    useEffect(() => {
        if (details?.userDocConfig) {
            for (let i = 0; i < details.userDocConfig.length; i++) {
                if (details.userDocConfig[i].isDocumentGroupIdentifier) {
                    setGroupIdentifier(details.userDocConfig[i].fileFieldCode.replace('field', 'field_'))
                }
                if (details.userDocConfig[i].isDocumentUniqueIdentifier) {
                    setUniqueIdentifier(details.userDocConfig[i].fileFieldCode.replace('field', 'field_'))
                }
            }
        }
    }, [details])

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
        const { fieldFinal, selectionFinal }: { fieldFinal: any, selectionFinal: any } = await fileNameConfigService.handleDefaultAndSavedSelection(dataFieldOptions, userType, selectedTemp, details)
        setFilteredOptions(fieldFinal)
        setFieldSelected(selectionFinal)
    }

    const addFileWithValidation = (field: string) => {
        if (additionSettingsJson && additionSettingsJson[field]) {
            let setting = additionSettingsJson[field]
            if (!setting.dataType) {
                delete setting.dataType
            }
            return setting
        } else {
            return {}
        }
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
        if (nameTransform) {
            configRequest.sample = documentName
            configRequest.fields = nameTransformationState
        }

        if (field_1?.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field1",
                "attributeCode": field_1.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_1',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_1',
                validationRule: addFileWithValidation("field_1")
            })
        }
        if (field_2?.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field2",
                "attributeCode": field_2.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_2',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_2',
                validationRule: addFileWithValidation("field_2")
            })
        }
        if (field_3?.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field3",
                "attributeCode": field_3.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_3',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_3',
                validationRule: addFileWithValidation("field_3")
            })
        }
        if (field_4?.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field4",
                "attributeCode": field_4.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_4',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_4',
                validationRule: addFileWithValidation("field_4")
            })
        }
        if (field_5?.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field5",
                "attributeCode": field_5.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_5',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_5',
                validationRule: addFileWithValidation("field_5")
            })
        }
        if (field_6?.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field6",
                "attributeCode": field_6.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_6',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_6',
                validationRule: addFileWithValidation("field_6")
            })
        }
        if (field_7 && field_7.value) {
            configRequest.userDocConfig.push({
                "fileFieldCode": "field7",
                "attributeCode": field_7.value,
                isMandatory: true,
                "isDocumentUniqueIdentifier": uniqueIdentifier === 'field_7',
                "isDocumentGroupIdentifier": groupIdentifier === 'field_7',
                validationRule: addFileWithValidation("field_7")
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
        setFilteredOptions(dataFieldOptionsFiltered)
        setFieldSelected(fieldsSelectedTemp)
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

    const handleNameTransformationSelection = (selection: boolean) => {
        if (documentName) {
            setConfirmChange(true)
        } else {
            handleConfirmSelection(selection)
        }
    }

    const handleConfirmSelection = (selection: boolean) => {
        reset()
        setAdditionalSettingsJson(null)
        setNameTransform(selection)
        setFieldSelected((prevSelection: any) => selection ? {} : prevSelection)
        if (!selection) {
            handleDefaultAndSavedSelection()
        } else {
            setFilteredOptions(() => {
                return dataFieldOptions.map((options: any) => {
                    options.selected = false
                    options.available = true
                    return options
                })
            })
        }
        setConfirmChange(false)
    }

    const handleAddition = (setting: IAdditionSettingsJson, field: string) => {
        let isEmpty = (Object.values(setting)).every(v => !v);
        let temp = Object.assign({}, additionSettingsJson)
        if (isEmpty) {
            delete temp[field]
        } else {
            temp[field] = setting
        }
        setAdditionalSettingsJson(temp)
        setShowAdditional('')
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
                    <Col sm={1}>
                    </Col>
                    <Col lg={10} sm={12}>
                        <br />
                        <Form ref={configRef} onSubmit={(e) => handleSave(e, 'config')}>
                            {
                                <Col lg={12} md={12} className="no_padding">
                                    <Row>
                                        <Form.Group as={Col} className="mb-2">
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
                                        <Form.Group as={Col}>
                                            <Col md={12} sm={12}>
                                                <Form.Control
                                                    as="select"
                                                    name="conjunction"
                                                    defaultValue={details ? details.separatorCode : "_"}
                                                    className="select_custom white">
                                                    {
                                                        dataConjunction &&
                                                        dataConjunction?.lookUps.map((cR: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={cR.keyCode}>{cR.description}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom">Conjunction / Concatenation Parameter</Form.Label>
                                        </Form.Group>
                                    </Row>
                                    <hr />
                                </Col>
                            }
                            <Form.Group as={Col} className="mb-2 mt-2">
                                <Row>
                                    <Col md={2}>
                                        <p >Name Transformation</p>
                                    </Col>
                                    <Col md={3}>
                                        <div className={Styles.required_not_required}>
                                            <p className={nameTransform === true ? Styles.selected : ''} onClick={() => handleNameTransformationSelection(true)}>Required</p>
                                            <p className={nameTransform === false ? Styles.selected : ''} onClick={() => handleNameTransformationSelection(false)}>Not Required</p>
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Group>
                            {
                                nameTransform && <DocumentHighlighter
                                    documentName={documentName}
                                    handleSetDocumentName={handleSetDocumentName}
                                    selectEventListenerHook={selectionEventListener}
                                    selections={nameTransformationState} />
                            }
                            {
                                nameTransform === false
                                && <NameTransformationNotRequired
                                    fieldsSelected={fieldsSelected}
                                    filteredOptions={filteredOptions}
                                    handleIdentifiers={handleIdentifiers}
                                    groupIdentifier={groupIdentifier}
                                    uniqueIdentifier={uniqueIdentifier}
                                    additionSettingsJson={additionSettingsJson}
                                    configNameSaveRef={configNameSaveRef}
                                    disableHandler={disableHandler}
                                    id={id}
                                    setShow={setShow}
                                    handleSelection={handleSelection}
                                    downloadProductCodes={downloadProductCodes}
                                    handleMove={handleMove}
                                    setShowAdditional={setShowAdditional}
                                />
                            }
                            {
                                nameTransform === true
                                && documentName
                                && <NameTransformationRequired
                                    nameTransformationState={nameTransformationState}
                                    fieldsSelected={fieldsSelected}
                                    filteredOptions={filteredOptions}
                                    handleSelection={handleSelection}
                                    handleIdentifiers={handleIdentifiers}
                                    groupIdentifier={groupIdentifier}
                                    uniqueIdentifier={uniqueIdentifier}
                                    additionSettingsJson={additionSettingsJson}
                                    configNameSaveRef={configNameSaveRef}
                                    deleteSelection={deleteSelection}
                                    setShowAdditional={setShowAdditional}
                                    id={id}
                                    setShow={setShow}
                                />
                            }
                        </Form>
                    </Col >
                    <Col sm={2}></Col>
                </Row >
            }
            {
                show && <ExampleNaming show={show} onHide={() => setShow(false)} details={details} />
            }
            {
                !!showAdditional && <NamingAdditionalFields
                    show={!!showAdditional}
                    onHide={() => setShowAdditional('')}
                    additionSettingsJson={additionSettingsJson}
                    setAdditionalSettingsJson={(setting: IAdditionSettingsJson, field: string) => handleAddition(setting, field)}
                    field={showAdditional}
                />
            }
            {
                confirmChange &&
                <TransformationNameModel onHide={() => setConfirmChange(false)} show={confirmChange} confirmChange={() => handleConfirmSelection(false)} />
            }
        </Col>
    )
}

const NameTransformationRequired = ({
    nameTransformationState,
    fieldsSelected,
    filteredOptions,
    handleSelection,
    handleIdentifiers,
    groupIdentifier,
    uniqueIdentifier,
    additionSettingsJson,
    configNameSaveRef,
    deleteSelection,
    setShowAdditional,
    id,
    setShow
}: any) => {
    return <React.Fragment>
        <Row>
            <div className="naming_config_inputs naming_config_inputs_not_required">
                <div>Text</div>
                <div>Type</div>
                <div>Group Identifier</div>
                <div>Unique Identifier</div>
                <div>Validation</div>
                <div>Delete</div>
            </div>
            {
                nameTransformationState
                && nameTransformationState.map((nameObj: ISelection, keyIndex: number) => (
                    <div key={`nameTransformation_${keyIndex}`} className="naming_config_inputs naming_config_inputs_not_required">
                        <div>
                            <p className='mt-3' style={{ fontWeight: 'bold' }}>{nameObj.text}</p>
                        </div>
                        <div>
                            <Form.Group as={Col} className="mb-5 no_padding">
                                <Form.Control
                                    as="select"
                                    name={`field_${keyIndex + 1}`}
                                    className="select_custom white"
                                    onChange={(e) => handleSelection(keyIndex, e.target.value)}
                                    value={fieldsSelected[keyIndex]}>
                                    <option></option>
                                    {(filteredOptions && filteredOptions.length > 0) &&
                                        filteredOptions.map((cR: any, index: number) => {
                                            return <option disabled={!cR.available} key={`cr_${index}`} value={cR.attributeCode}>
                                                {cR.attributeName}
                                            </option>;
                                        })}
                                </Form.Control>
                            </Form.Group>
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
                            <RiSettings3Line className={`${Styles.arrange_arrow} ${(additionSettingsJson && additionSettingsJson[`field_${keyIndex + 1}`]) ? Styles.is_additional : ''}`} size={30} onClick={() => setShowAdditional(`field_${keyIndex + 1}`)} />
                        </div>
                        <div>
                            {
                                (nameTransformationState.length - 1 === keyIndex) &&
                                <AiOutlineDelete className={Styles.arrange_arrow} size={30} onClick={() => deleteSelection(keyIndex)} />
                            }
                        </div>
                    </div>
                ))
            }
        </Row>
        <Col sm={12} style={{ textAlign: 'center' }}>
            <Button variant="dark" style={{ width: "140px" }} ref={configNameSaveRef} type="submit">Save</Button>{" "}
            {/* <Button variant="dark" onClick={() => setNameTransform(true)}>Name Transformation</Button>{" "} */}
            {
                id !== '_NEW_CONFIGURATION'
                && <Button variant="dark" style={{ width: "140px" }} onClick={() => setShow(true)}>Example</Button>
            }
        </Col>
    </React.Fragment>
}

const NameTransformationNotRequired = ({
    fieldsSelected,
    filteredOptions,
    handleIdentifiers,
    groupIdentifier,
    uniqueIdentifier,
    additionSettingsJson,
    configNameSaveRef,
    disableHandler,
    id,
    setShow,
    handleSelection,
    downloadProductCodes,
    handleMove,
    setShowAdditional
}: any) => {
    return <React.Fragment>
        <Row>
            <div className="naming_config_inputs">
                <div></div>
                <div>Arrange</div>
                <div>Group Identifier</div>
                <div>Unique Identifier</div>
                <div>Validation</div>
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
                            {
                                fieldsSelected[keyName] && <input
                                    type="checkbox"
                                    className="switch small"
                                    onChange={() => handleIdentifiers('group', `field_${keyIndex + 1}`)}
                                    name="consent"
                                    checked={groupIdentifier === `field_${keyIndex + 1}`} />
                            }
                        </div>
                        <div style={{ paddingTop: '1rem' }}>
                            {
                                fieldsSelected[keyName]
                                && <input
                                    type="checkbox"
                                    className="switch small"
                                    onChange={() => handleIdentifiers('unique', `field_${keyIndex + 1}`)}
                                    name="consent"
                                    checked={uniqueIdentifier === `field_${keyIndex + 1}`} />
                            }
                        </div>
                        <div>
                            {
                                fieldsSelected[keyName] &&
                                <RiSettings3Line className={`${Styles.arrange_arrow} ${(additionSettingsJson && additionSettingsJson[`field_${keyIndex + 1}`]) ? Styles.is_additional : ''}`} size={30} onClick={() => setShowAdditional(`field_${keyIndex + 1}`)} />
                            }
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
    </React.Fragment>
}

export default NamingConfiguration