import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Col, Row, Form, Button, OverlayTrigger, Tooltip, Table, Modal } from "react-bootstrap"
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
import { FiEdit2 } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"
import NoRecord from "../../components/Common/NoResult"
import DeleteConfirm from "../../components/modal/DeleteConfirm"

export interface IDocConfig {
    docMgrConfigSelectedCode: string,
    domainAttributeMappingSelectedCode: string,
    attributeName: string,
    isMandatory: boolean,
    regex: string | null
}
export interface IConfiguration {
    namingConfigGroupCode: string
    namingConfigGroupName: string
    separatorCode: string
    userDocConfig: IDocConfig[]
}

const DocumentGeneralConfiguration = () => {
    UseDocumentTitle('Document General Configuration')
    const ref = useRef<any>();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [userType, setUserType] = useState(null)
    const [showConfig, setShowConfig] = useState(false)
    const [configurationDetails, setConfigurationDetails] = useState(null)
    useEffect(() => {
        const user = userService.getUser();
        setUserType(user.recordSource);
    }, [])

    const {
        saveSuccess,
        saveError,
    } = useSelector((state: any) => ({
        saveSuccess: state.fileNameConfig.saveConfig.success,
        saveError: state.fileNameConfig.saveConfig.error,
    }))

    useEffect(() => {
        if (saveSuccess) {
            addToast(createMessage('', `FILE_NAME_CONFIGURATION_SAVED_SUCCESS`, ''), { appearance: 'success', autoDismiss: true });
            ref.current.refreshData()
            setConfigurationDetails(null)
            setShowConfig(false)
        }
        if (saveError) {
            addToast(createMessage('error', `User Configuration`, 'Save'), { appearance: 'error', autoDismiss: false });
        }
    }, [saveSuccess, saveError])

    return <>
        {<ListOfUserFileNamingConfiguration ref={ref} dispatch={dispatch} setConfigurationDetails={setConfigurationDetails} setShowConfig={setShowConfig} />}
        {showConfig && <FileNamingModal userType={userType} setConfigurationDetails={setConfigurationDetails} dispatch={dispatch} show={showConfig} onHide={() => {
            setShowConfig(false)
        }} details={configurationDetails} />}
        <br />
        {
            (userType === 'Client' || userType === 'Equabli')
            && <Row>
                <Col sm={6}>
                    <RetentionPolicy dispatch={dispatch} />
                </Col>
                <Col sm={6}>
                    <DocumentPolicy dispatch={dispatch} />
                </Col>
            </Row>
        }
    </>
}

const ListOfUserFileNamingConfiguration = forwardRef(({ dispatch, setConfigurationDetails, setShowConfig }: any, ref) => {
    const { addToast } = useToasts();
    const [showConfirmDelete, setShowConfirmDelete] = useState<Boolean>(false)
    const [toDelete, setToDelete] = useState<string>('')
    const {
        confListLoading,
        confListError,
        confList,
        deleteRequest,
        deleteSuccess,
        deleteError
    } = useSelector((state: any) => ({
        confListLoading: state.fileNameConfig.fileNamingConfigList.loading,
        confListError: state.fileNameConfig.fileNamingConfigList.error,
        confList: state.fileNameConfig.fileNamingConfigList.data,
        deleteRequest: state.fileNameConfig.fileNamingConfigList.deleteRequest,
        deleteSuccess: state.fileNameConfig.fileNamingConfigList.deleteSuccess,
        deleteError: state.fileNameConfig.fileNamingConfigList.deleteError,
    }))

    useEffect(() => {
        getListOfUserConfig()
    }, [])

    useEffect(() => {
        if (deleteSuccess) {
            addToast(createMessage('success', 'user configuration', 'delete'), { appearance: 'success', autoDismiss: true });
            getListOfUserConfig()
            setConfigurationDetails(null)
            setShowConfig(false)
        }
        if (deleteError) {
            addToast(createMessage('error', `User Configuration`, 'Delete'), { appearance: 'error', autoDismiss: false });
        }
    }, [deleteRequest,
        deleteSuccess,
        deleteError])

    useImperativeHandle(ref, () => ({
        refreshData() {
            getListOfUserConfig()
        }
    }));

    const getListOfUserConfig = () => {
        dispatch(FileNameConfigActionCreator.getListOfUserConfig())
    }

    const formatConfiguration = (confArr: IDocConfig[], separatorCode: string, type: string): string => {
        let confString = ``
        for (let index = 0; index < confArr.length; index++) {
            let text = type === 'short' ? (confArr[index].domainAttributeMappingSelectedCode) : `<${confArr[index].attributeName}>`
            confString += (text).trim() + ((index < confArr.length - 1) ? separatorCode : '')
        }
        return confString
    }

    const handleEdit = (config: IConfiguration) => {
        setConfigurationDetails(config)
        setShowConfig(true)
    }

    const addNewHandler = () => {
        setShowConfig(true)
    }

    const deleteConfiguration = (conf: IConfiguration) => {
        setToDelete(conf.namingConfigGroupCode)
        setShowConfirmDelete(true)
    }

    const approveHandler = () => {
        dispatch(FileNameConfigActionCreator.deleteUserConfiguration(toDelete))
    }

    return (
        <Row className="form_container" style={{ margin: 0 }}>
            <Col sm={12} className="no_padding" style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => addNewHandler()}>+ Add New</Button>
            </Col>
            {
                !confListLoading && confList.length === 0
                && <NoRecord />
            }
            {
                !confListLoading && <Table striped hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                    <thead>
                        <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                            <th>#</th>
                            <th style={{ width: "15%" }}>Name</th>
                            <th style={{ width: "25%" }}>File Name</th>
                            <th style={{ width: "60%" }}>File Name Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            confList && confList.map((conf: IConfiguration, index: number) => {
                                return <tr key={`confList_${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{conf.namingConfigGroupName}</td>
                                    <td>{formatConfiguration(conf.userDocConfig, conf.separatorCode, 'short')}</td>
                                    <td>{formatConfiguration(conf.userDocConfig, conf.separatorCode, 'long')}</td>
                                    <td className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>
                                        <span>
                                            <OverlayTrigger
                                                placement="bottom"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={
                                                    <Tooltip id={`tooltip-error`}>
                                                        Edit
                                                    </Tooltip>
                                                }
                                            >
                                                <FiEdit2 onClick={() => handleEdit(conf)} size={20} style={{ cursor: 'pointer' }} />
                                            </OverlayTrigger>
                                        </span> &nbsp;
                                        <span>
                                            <OverlayTrigger
                                                placement="bottom"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={
                                                    <Tooltip id={`tooltip-error`}>
                                                        Delete
                                                    </Tooltip>
                                                }
                                            >
                                                {/* onClick={() => handleDetails(cT)} */}
                                                <AiOutlineDelete onClick={() => deleteConfiguration(conf)} size={20} style={{ cursor: 'pointer' }} />
                                            </OverlayTrigger>
                                        </span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            }
            {
                showConfirmDelete
                &&
                <DeleteConfirm
                    show={showConfirmDelete}
                    onHide={() => setShowConfirmDelete(false)}
                    confirmDelete={approveHandler}
                    details={toDelete}
                    type="configuration"
                />
            }
        </Row>

    )
})

const FileNamingModal = ({ show, onHide, details, setConfigurationDetails, userType, dispatch }: any) => {
    const { addToast } = useToasts();
    const clientDefault = ["CAN", "DT", "PC"]
    const partnerDefault = ["CIDSC", "DT", "CAN", "PC"]
    const configRef = useRef<any>();
    const configNameSaveRef = useRef<any>();
    const [uniqueIdentifier, setUniqueIdentifier] = useState<any>(null)
    const [groupIdentifier, setGroupIdentifier] = useState<any>(null)
    const [filteredOptions, setFilteredOptions] = useState<any>([]);
    const [fieldsSelected, setFieldSelected] = useState<any>({});
    const [formError, setFormError] = useState<any>({
        configName: false
    })

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
        dispatch(FileNameConfigActionCreator.getUserConfig())
        dispatch(FileNameConfigActionCreator.getFieldOptions())
        dispatch(FileNameConfigActionCreator.getConjunction())
        // dispatch(FileNameConfigActionCreator.getUserSeparator())
        dispatch(TypesActionCreator.getProductTypes())
        dispatch(TypesActionCreator.getDocumentTypes())
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
        return () => {
            setConfigurationDetails(null)
        }
    }, [])

    useEffect(() => {
        if (
            dataFieldOptions?.length > 0
        ) {
            console.log(`this ran`)
            handleDefaultAndSavedSelection()
        }
    }, [dataFieldOptions, dataFileNamingConfig])

    const handleDefaultAndSavedSelection = async () => {
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
            if (json[fieldsSelected[key]]) {
                documentNameGenerated += `${index === 0 ? '' : json.conj}${json[fieldsSelected[key]]}`
            }
            index++
        }
        return documentNameGenerated
    }

    const handleIdentifiers = (type: string, field: string) => {
        if (type === 'group') {
            if (uniqueIdentifier === field) {
                addToast(`Group Identifier and Unique Identifier cannot be the same field`, { appearance: 'info', autoDismiss: true });
            } else {
                setGroupIdentifier(field)
            }
        } else {
            if (groupIdentifier === field) {
                addToast(`Unique Identifier and Group Identifier cannot be the same field`, { appearance: 'info', autoDismiss: true });
            } else {
                setUniqueIdentifier(field)
            }
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            className='fileNamingConfigurationModal'
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add File Naming Configuration
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                {
                    isLoading
                    && <CgSpinnerAlt style={{ textAlign: 'center', width: '100%' }} className="spinner" size={50} />
                }
                {
                    !isLoading
                    &&
                    <Row style={{ margin: 0 }}>
                        <Col lg={7} sm={12}>
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
                                                        className="select_custom">
                                                    </Form.Control>
                                                    <span style={{ color: 'red' }}><small>{formError["configName"] ? 'Configuration Name is Required' : ''}</small></span>
                                                </Col>
                                                <Form.Label className="label_custom white">Name</Form.Label>
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
                                                        className="select_custom">
                                                        {
                                                            dataConjunction &&
                                                            dataConjunction.map((cR: any, index: number) => {
                                                                return <option key={`cr_${index}`} value={cR.keyCode}>{cR.description}</option>
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Col>
                                                <Form.Label className="label_custom white">Conjunction / Concatenation Parameter</Form.Label>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                }
                                <Row>
                                    <Col sm={6}></Col>
                                    <Col sm={6} className={Styles.identifier_group}>
                                        <Col sm={2} className="no_padding">
                                            <p>Arrange</p>
                                        </Col>
                                        <Col sm={5}>
                                            <p>Group Identifier</p>
                                        </Col>
                                        <Col sm={5}>
                                            <p>Unique Identifier</p>
                                        </Col>
                                    </Col>
                                </Row>
                                {
                                    fieldsSelected
                                    && Object.keys(fieldsSelected).map((keyName, keyIndex) => {
                                        return (
                                            <Row key={`options_${keyIndex}`}>
                                                <Col lg={12} md={12} className="no_padding">
                                                    <Form.Group as={Col} className="mb-5">
                                                        <Col sm={12}>
                                                            <Row style={{ margin: 0 }}>
                                                                <Col sm={6} className="no_padding">
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
                                                                                return <option disabled={!cR.available} key={`cr_${index}`} value={cR.attributeCode}>
                                                                                    {cR.attributeName}
                                                                                </option>
                                                                            })
                                                                        }
                                                                    </Form.Control>
                                                                </Col>
                                                                <Col sm={6} style={{ position: 'relative' }}>
                                                                    <Row style={{ margin: 0, height: '45px' }}>
                                                                        <Col sm={2} className="no_padding" style={{
                                                                            display: 'flex',
                                                                            justifyContent: 'center',
                                                                            alignItems: 'center'
                                                                        }}>
                                                                            {
                                                                                keyIndex !== 0
                                                                                && fieldsSelected[keyName]
                                                                                && <HiArrowNarrowUp className={Styles.arrange_arrow} onClick={() => handleMove(keyIndex + 1, 'up')} />
                                                                            }
                                                                            {
                                                                                keyIndex !== (Object.keys(fieldsSelected).length - 1)
                                                                                && fieldsSelected[keyName]
                                                                                && fieldsSelected[Number(keyName) + 1]
                                                                                && <HiArrowNarrowDown className={Styles.arrange_arrow} onClick={() => handleMove(keyIndex + 1, 'down')} />
                                                                            }
                                                                        </Col>
                                                                        <Col sm={10} >
                                                                            <Row sm={12} style={{ height: '45px' }}>
                                                                                <Col md={6} sm={12} className="switch_box" style={{ justifyContent: 'center' }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="switch small"
                                                                                        onChange={() => handleIdentifiers('group', `field_${keyIndex + 1}`)}
                                                                                        name="consent"
                                                                                        checked={groupIdentifier === `field_${keyIndex + 1}`}
                                                                                    />
                                                                                </Col>
                                                                                <Col md={6} sm={12} className="switch_box" style={{ justifyContent: 'center' }}>
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        className="switch small"
                                                                                        onChange={() => handleIdentifiers('unique', `field_${keyIndex + 1}`)}
                                                                                        name="consent"
                                                                                        checked={uniqueIdentifier === `field_${keyIndex + 1}`}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Form.Label className="label_custom white">Field {keyIndex + 1}
                                                            {
                                                                (fieldsSelected[keyName] === 'PC' || fieldsSelected[keyName] === 'DT') &&
                                                                <BsFillQuestionCircleFill size={14} style={{ marginLeft: '1rem', color: 'black', cursor: 'pointer' }} onClick={() => downloadProductCodes(fieldsSelected[keyName] === 'DT' ? 'Document Types' : 'Product Codes')} />
                                                            }

                                                            {
                                                                (fieldsSelected[keyName] === 'DGD') && <span className={Styles.date_format}>Format: DDMMYYYY</span>
                                                            }
                                                        </Form.Label>

                                                    </Form.Group>
                                                </Col>
                                            </Row>)
                                    })
                                }
                                <Col sm={12}>
                                    <Button variant="dark" style={{ width: "140px" }} ref={configNameSaveRef} type="submit">Save</Button>{" "}
                                    {/* <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler(e, 'config')}>Reset to Default</Button> */}
                                </Col>
                            </Form>
                        </Col >
                        <Col lg={5} sm={12} >
                            <Row>
                                <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Examples</h5></Col>
                            </Row>
                            <br />
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
                                    {
                                        showExample({
                                            conj: details ? details.separatorCode : "_",
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
            </Modal.Body>
        </Modal>
    )
}

const RetentionPolicy = ({ dispatch }: any) => {
    const retentionSaveRef = useRef<any>();
    const retentionRef = useRef<any>();
    const [retention, setRetention] = useState<any>(60)
    const [minMaxError, setMinMaxError] = useState<any>(false)

    const {
        isLoadingRetention,
        dataUserRetentionPolicy,
        dataRetentionPolicy,
    } = useSelector((state: any) => ({
        isLoadingRetention: state.fileNameConfig.userRetentionPolicy.loading,
        dataUserRetentionPolicy: state.fileNameConfig.userRetentionPolicy.data,
        dataRetentionPolicy: state.fileNameConfig.retentionPolicy.data
    }))

    useEffect(() => {
        dispatch(FileNameConfigActionCreator.getRetentionPolicy())
        dispatch(FileNameConfigActionCreator.getUserRetentionPolicy())
    }, [])

    useEffect(() => {
        if (dataUserRetentionPolicy) {
            setRetention(dataUserRetentionPolicy ? dataUserRetentionPolicy.configValSelectedCode : dataRetentionPolicy.defaultValue)
        }
    }, [dataUserRetentionPolicy])

    const handleSave = () => {
        if (Number(retention) < 60 || Number(retention) > 365) {
            setMinMaxError(true)
            return
        } else {
            setMinMaxError(false)
            let configRequest = [{
                "configShortCode": "RP",
                "configValShortCode": retention,
                "orgTypeCode": "CT"
            }]
            dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
        }
    }

    const resetHandler = () => {
        setRetention(60)
        setTimeout(() => {
            retentionSaveRef.current.click()
        }, 0)
    }

    return (
        <>
            {
                !isLoadingRetention && <Row style={{ margin: 0 }} className="form_container">
                    <Col lg={12} sm={12}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Document Retention Policy</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form ref={retentionRef} onSubmit={(e) => handleSave()}>
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
                                    <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler()}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            }
        </>

    )
}

const DocumentPolicy = ({ dispatch }: any) => {
    const otherSaveRef = useRef<any>()
    const [modeSelected, setModeSelected] = useState('KBF');
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

    const {
        isLoadingDocumentPolicy,
        dataDocumentPolicy,
        dataUserDocumentPolicy,
    } = useSelector((state: any) => ({
        isLoadingDocumentPolicy: state.fileNameConfig.userDocumentPolicy.loading,
        dataUserDocumentPolicy: state.fileNameConfig.userDocumentPolicy.data,
        dataDocumentPolicy: state.fileNameConfig.documentPolicy.data,
    }))

    useEffect(() => {
        if (dataUserDocumentPolicy) {
            setModeSelected((dataUserDocumentPolicy ? dataUserDocumentPolicy.configValSelectedCode : "KBF"))
        }
    }, [dataUserDocumentPolicy])

    useEffect(() => {
        dispatch(FileNameConfigActionCreator.getDocumentPolicy())
        dispatch(FileNameConfigActionCreator.getUserDocumentPolicy())
    }, [])

    const resetHandler = () => {
        setModeSelected('KBF')
        setTimeout(() => {
            otherSaveRef.current.click()
        }, 0)
    }
    const handleSave = () => {
        let configRequest = [{
            "configShortCode": "DP",
            "configValShortCode": modeSelected,
            "orgTypeCode": "CT"
        }]
        dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
    }
    return (
        <>
            {
                !isLoadingDocumentPolicy && <Row style={{ margin: 0 }} className="form_container">
                    <Col lg={12} sm={12}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Other Configuration</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form onSubmit={(e) => handleSave()}>
                            <Row>
                                <Col lg={12} md={6}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={12} sm={12}>
                                                {
                                                    mode && mode.map((m: any, index: number) => (
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
                                            <span style={{ color: 'red', marginLeft: "1rem" }}><small></small></span>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Incase of Document Duplication</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="mt-4" style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} ref={otherSaveRef} type="submit">Save</Button>{" "}
                                    <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler()}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            }
        </>
    )
}

export default DocumentGeneralConfiguration