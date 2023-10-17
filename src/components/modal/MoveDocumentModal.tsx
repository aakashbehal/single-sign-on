import React, { useEffect, useRef, useState } from 'react'
import { Modal, Row, Col, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { CgSpinnerAlt } from 'react-icons/cg';

import Styles from "./Modal.module.sass";
import { MiscActionCreator } from '../../store/actions/common/misc.actions';
import { FileNameConfigActionCreator } from '../../store/actions/fileNameConfig.actions';
import DocumentTypes from '../Common/DocumentType';
import { TypesActionCreator } from '../../store/actions/common/types.actions';
import DatePicker from 'react-date-picker';
import { dateFormatterForRequestFileUpload } from '../../helpers/util';
import { MyDocumentsActionCreator } from '../../store/actions/myDocuments.actions';
import { useToasts } from 'react-toast-notifications';

export default ({ show, onHide, parentComponent, details, search }: any) => {
    const dispatch = useDispatch()
    const { addToast } = useToasts();
    const formRef = useRef<any>()
    const [isEnable, setIsEnable] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')
    const [folderName, setFolderName] = useState('')
    const [configurationSelected, setConfigurationSelected] = useState('')
    const [fields, setFields] = useState([])
    const [generationDate, setGenerationDate] = useState<any>(null)
    const [documentName, setDocumentName] = useState(details.documentName)
    const [submitted, setSubmitted] = useState(false)

    const {
        clientAccountNumbers,
        loading,
        error,
        confListLoading,
        confListError,
        confList,
        productTypes,
        loadingProductTypes,
        errorProductTypes,
        moveDocumentSuccess,
        moveDocumentError,
        moveDocumentLoading,
    } = useSelector((state: any) => ({
        clientAccountNumbers: state.misc.clientAccountNumbers.data,
        loading: state.misc.clientAccountNumbers.loading,
        error: state.misc.clientAccountNumbers.error,
        confListLoading: state.fileNameConfig.fileNamingConfigList.loading,
        confListError: state.fileNameConfig.fileNamingConfigList.error,
        confList: state.fileNameConfig.fileNamingConfigList.data,
        productTypes: state.types.productType.data,
        loadingProductTypes: state.types.productType.loading,
        errorProductTypes: state.types.productType.error,
        moveDocumentSuccess: state.myDocuments.moveDocument.success,
        moveDocumentError: state.myDocuments.moveDocument.error,
        moveDocumentLoading: state.myDocuments.moveDocument.loading,
    }))

    useEffect(() => {
        if (selectedOption === 'FL') {
            dispatch(MiscActionCreator.getClientAccountNumbers())
        }
        if (selectedOption === 'NC') {
            dispatch(TypesActionCreator.getProductTypes())
            dispatch(FileNameConfigActionCreator.getListOfUserConfig())
        }
    }, [selectedOption])

    useEffect(() => {
        let selectedConf = confList.filter((conf: any) => {
            if (conf.namingConfigGroupCode == configurationSelected) {
                return conf
            }
            return false
        })
        setFields(selectedConf[0]?.userDocConfig)
    }, [configurationSelected])

    useEffect(() => {
        if (moveDocumentSuccess) {
            addToast(`Document Move Successfully`, { appearance: 'success', autoDismiss: true });
            setSubmitted(false)
            search()
            onHide()
        }
        if (moveDocumentError) {
            addToast(`Error in moving Document`, { appearance: 'error', autoDismiss: true });
            setSubmitted(false)

        }
        if (moveDocumentLoading) {
            setSubmitted(true)
        }
    }, [moveDocumentSuccess,
        moveDocumentError,
        moveDocumentLoading])

    const onSubmitHandler = () => {
        const {
            folder_name,
            configuration_name,
            CAN,
            OAN,
            CSC,
            DN,
            PF,
            document_type,
            product_type,
        } = formRef.current
        let formObj: any = {
            moveDocumentType: selectedOption,
            otherDocumentId: details.id
        }
        if (selectedOption === 'FL') {
            formObj.recordIdentifiers = [folder_name.value]
        } else if (selectedOption === 'NC') {
            formObj.namingConfiguration = {
                namingConfigGroupCode: configuration_name.value,
                attributes: []
            }
            if (CAN?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "CAN",
                    "attributeValue": CAN?.value
                })
            }
            if (OAN?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "OAN",
                    "attributeValue": OAN?.value
                })
            }
            if (CSC?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "CSC",
                    "attributeValue": CSC?.value
                })
            }
            if (DN?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "DN",
                    "attributeValue": DN?.value
                })
            }
            if (PF?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "PF",
                    "attributeValue": PF?.value
                })
            }
            if (product_type?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "DG",
                    "attributeValue": product_type?.value
                })
            }
            if (document_type?.value) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "DT",
                    "attributeValue": document_type?.value
                })
            }
            if (generationDate) {
                formObj.namingConfiguration.attributes.push({
                    "attributeCode": "DGD",
                    "attributeValue": dateFormatterForRequestFileUpload(generationDate)
                })
            }
        } else {
            formObj.fileName = documentName
        }
        console.log(`---formObj`, formObj)
        dispatch(MyDocumentsActionCreator.moveDocument(formObj))
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
                    Move "<b>{`${details.documentName}`}</b>"
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid" style={{ padding: '2rem' }}>
                <Col className={Styles.button_center} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setSelectedOption('FL')} className={`${Styles.button_move_options} ${selectedOption === 'FL' ? `${Styles.active}` : ''}`} >Move to a Folder</Button>{" "}
                    <Button onClick={() => setSelectedOption('NC')} className={`${Styles.button_move_options} ${selectedOption === 'NC' ? `${Styles.active}` : ''}`} >Select Naming configuration</Button>{""}
                    <Button onClick={() => setSelectedOption('CN')} className={`${Styles.button_move_options} ${selectedOption === 'CN' ? `${Styles.active}` : ''}`} >Change File Name</Button>
                </Col>
                <Col>
                    <Form ref={formRef}>
                        {
                            selectedOption === 'FL' &&
                            <Col sm={12} className="mt-5 no_padding">
                                <Form.Control
                                    as="select"
                                    name="folder_name"
                                    value={folderName}
                                    onChange={(e) => setFolderName(e.target.value)}
                                    className="select_custom">
                                    <option></option>
                                    {
                                        (clientAccountNumbers && clientAccountNumbers.length > 0) &&
                                        clientAccountNumbers.map((cAn: any, index: number) => {
                                            return <option key={`cr_${index}`} value={cAn}>{cAn}</option>
                                        })
                                    }
                                </Form.Control>
                                <Form.Label className="label_custom white">Select Folder</Form.Label>
                            </Col>
                        }
                        {
                            selectedOption === 'NC' &&
                            <>
                                <Col sm={12} className="mt-5 no_padding">
                                    <Form.Control
                                        as="select"
                                        name="configuration_name"
                                        value={configurationSelected}
                                        onChange={(e) => setConfigurationSelected(e.target.value)}
                                        className="select_custom">
                                        <option></option>
                                        {
                                            (confList && confList.length > 0) &&
                                            confList.map((cL: any, index: number) => {
                                                return <option key={`cL_${index}`} value={cL.namingConfigGroupCode}>{cL.namingConfigGroupName}</option>
                                            })
                                        }
                                    </Form.Control>
                                    <Form.Label className="label_custom white">Select Naming Configuration</Form.Label>
                                </Col>
                                {
                                    fields && fields.map((field: any, index: number) => {
                                        if (field.attributeCode === 'CAN'
                                            || field.attributeCode === 'OAN'
                                            || field.attributeCode === 'CSC'
                                            || field.attributeCode === 'DN'
                                            || field.attributeCode === 'PF'
                                        ) {
                                            return <Form.Group as={Col} className={`mb-5 no_padding ${index === 0 ? 'mt-5' : ''}`}>
                                                <Col md={12} sm={12} className='no_padding'>
                                                    <Form.Control
                                                        as="input"
                                                        name={field.attributeCode}
                                                        placeholder={`Please Enter ${field.attributeName}`}
                                                        className="select_custom white ">
                                                    </Form.Control>
                                                    {/* <span style={{ color: 'red' }}><small>{formError["configName"] ? 'Configuration Name is Required' : ''}</small></span> */}
                                                </Col>
                                                <Form.Label className="label_custom white">Field {index + 1} - {field.attributeName}</Form.Label>
                                            </Form.Group>
                                        }
                                        else if (
                                            field.attributeCode === 'DT'
                                        ) {
                                            return <Form.Group as={Col} className={`mb-5 no_padding ${index === 0 ? 'mt-5' : ''}`}>
                                                <Col md={12} sm={12} className='no_padding'>
                                                    <DocumentTypes />
                                                </Col>
                                                <Form.Label className="label_custom white">Field {index + 1} - {field.attributeName}</Form.Label>
                                            </Form.Group>
                                        }
                                        else if (
                                            field.attributeCode === 'DG'
                                        ) {
                                            return <Form.Group as={Col} className="mb-5 no_padding">
                                                <Col md={12} sm={12} className="no_padding" >
                                                    <Form.Control
                                                        as="select"
                                                        name="product_type"
                                                        className="select_custom white">
                                                        <option disabled value="" selected>Select Product Type...</option>
                                                        {
                                                            (productTypes && productTypes.length > 0) &&
                                                            productTypes.map((dT: any, index: number) => {
                                                                return <option key={`cr_${index}`} value={dT.code}>{dT.name}</option>
                                                            })
                                                        }
                                                    </Form.Control>
                                                </Col>
                                                <Form.Label className="label_custom white">Field {index + 1} -  {field.attributeName}</Form.Label>
                                            </Form.Group>
                                        }
                                        else if (
                                            field.attributeCode === 'DGD'
                                        ) {
                                            return <Form.Group as={Col} className={`mb-5 no_padding ${index === 0 ? 'mt-5' : ''}`}>
                                                <Col md={12} sm={12} className='no_padding'>
                                                    <DatePicker
                                                        format={'MM/dd/yyyy'}
                                                        className="select_custom white"
                                                        monthPlaceholder={'mm'}
                                                        dayPlaceholder={'dd'}
                                                        value={generationDate}
                                                        maxDate={new Date()}
                                                        onChange={setGenerationDate}
                                                        yearPlaceholder={'yyyy'} />
                                                </Col>
                                                <Form.Label className="label_custom white">Field {index + 1} - {field.attributeName}</Form.Label>
                                            </Form.Group>
                                        }
                                    })
                                }
                            </>
                        }
                        {
                            selectedOption === 'CN' &&
                            <Col sm={12} className="mt-5 no_padding">
                                <Form.Control
                                    as="input"
                                    name="document_name"
                                    onChange={(e) => setDocumentName(e.target.value)}
                                    value={documentName}
                                    className="select_custom white ">
                                </Form.Control>
                                <Form.Label className="label_custom white">Document Name</Form.Label>
                            </Col>
                        }
                    </Form>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Col className={Styles.button_center}>
                    <Button variant="dark" onClick={() => onSubmitHandler()} disabled={submitted}>Move</Button>{" "}
                    <Button variant="dark" disabled={isEnable} onClick={onHide}>Cancel</Button>
                </Col>
            </Modal.Footer>
        </Modal >
    )
}
