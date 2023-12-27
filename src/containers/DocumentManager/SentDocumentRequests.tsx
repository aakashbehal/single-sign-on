import { useEffect, useRef, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead"
import { Col, Form, Row, Button, Tab, Tabs, Modal, Container } from "react-bootstrap";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import { SentDocumentRequestActionCreator } from "../../store/actions/sentDocumentRequest.actions";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { createMessage } from "../../helpers/messages";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { downloadSignedFile } from "../../helpers/util";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import DocumentTypes from "../../components/Common/DocumentType";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";


const SentDocumentRequests = () => {
    const dispatch = useDispatch();
    const aRef = useRef<any>()
    const { addToast } = useToasts();

    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('id')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showBulkRequest, setShowBulkRequest] = useState(false)
    const [showRequestNewDocument, setShowRequestNewDocument] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [columnsSaved, setColumnsSaved] = useState<any>([])
    let [searchObj, text, isAdvanceSearch, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    const {
        sentDocumentRequests,
        totalCount,
        columns,
        loading,
        error,
        sendRequest,
        sendRequestSuccess,
        sendRequestError,
        deleteRequest,
        deleteRequestSuccess,
        deleteRequestError,
        defaultColumns
    } = useSelector((state: any) => ({
        sentDocumentRequests: state.sentDocumentRequest.data,
        totalCount: state.sentDocumentRequest.totalCount,
        columns: state.sentDocumentRequest.columns,
        loading: state.sentDocumentRequest.loading,
        error: state.sentDocumentRequest.error,
        sendRequest: state.sentDocumentRequest.sendRequest,
        sendRequestSuccess: state.sentDocumentRequest.sendRequestSuccess,
        sendRequestError: state.sentDocumentRequest.sendRequestError,
        deleteRequest: state.sentDocumentRequest.deleteRequest,
        deleteRequestSuccess: state.sentDocumentRequest.deleteRequestSuccess,
        deleteRequestError: state.sentDocumentRequest.deleteRequestError,
        defaultColumns: state.misc.allTableColumns.data
    }))

    useEffect(() => {
        setInitObj({
            pageSize: pageSize,
            pageNumber: pageNumber,
            textSearch: null,
            sortOrder: sortType,
            sortParam: sortElement
        })
        dispatch(MiscActionCreator.getColumnForAllTables('sentDocumentRequest'))
    }, [])

    useEffect(() => {
        if (searchObj !== null) {
            search(pageSize, pageNumber)
        }
    }, [searchObj, text, sortElement, sortType])

    useEffect(() => {
        if (!loading && columns.length === 0 && (defaultColumns && defaultColumns.length > 0)) {
            setColumnsSaved(defaultColumns)
        } else {
            setColumnsSaved(columns)
        }
    }, [columns])

    useEffect(() => {
        if (sendRequestSuccess) {
            addToast(createMessage('success', `Sent`, 'Document Request'), { appearance: 'success', autoDismiss: true });
            setShowRequestNewDocument(false);
            search(pageSize, pageNumber)
            setTimeout(() => {
                dispatch(SummaryActionCreator.reRender())
            }, 1000)
        }
        if (sendRequestError) { addToast(createMessage('error', `sending`, 'document request'), { appearance: 'error', autoDismiss: false }); }
        if (deleteRequestSuccess) {
            addToast(createMessage('success', `deleted`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            search(pageSize, pageNumber)
            dispatch(SummaryActionCreator.reRender())
        }
        if (deleteRequestError) { addToast(createMessage('error', `deleting`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
    }, [sendRequestSuccess,
        sendRequestError,
        deleteRequestSuccess,
        deleteRequestError])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        searchObj = { ...searchObj, textSearch: text, pageSize, pageNumber, sortParam: sortElement, sortOrder: sortType }
        dispatch(SentDocumentRequestActionCreator.getSentDocumentRequest(searchObj))
        setShowAdvanceSearch(false)
    }

    /**
     * function is used in pagination
     * @param pageSize 
     * @param pageNumber 
     */
    const handlePagination = (pageSize: number, pageNumber: number) => {
        setPageSize(pageSize)
        search(pageSize, pageNumber)
    }

    const deleteAlert = () => {
        dispatch(SentDocumentRequestActionCreator.deleteDocumentRequest(details.id))
    }

    const handleDetails = (document: any) => {
        setDetails(document)
        setShowDeleteConfirm(true)
    }

    const downloadHandler = async (document: any) => {
        //download file
        addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
        await downloadSignedFile(document)
        // dispatch(DownloadHistoryActionCreator.saveDownloadHistory([document.fullFilledDocument]))
        addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
    }


    return (<>
        <a href="" ref={aRef} target="_blank"></a>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'sentDocumentRequest'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag: any) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
                />
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setShowBulkRequest(true)}>Import Bulk Request</Button>
                </Col>
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setShowRequestNewDocument(true)}>Request New Document</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={sentDocumentRequests}
                isLoading={loading}
                map={{
                    "documentType": "Requested Document",
                    "originalAccountNumber": "Original Account Number",
                    "equabliAccountNumber": "Equabli Account Number",
                    "clientAccountNumber": "Client Account Number",
                    "requestDate": "Requested Date",
                    "dueDate": "Due Date",
                    "fulfillmentDate": "Fulfillment Date",
                    "fileName": "File Name",
                    "requestedFrom": "Requested From",
                }}
                totalCount={totalCount}
                actionArray={[]}
                handleNavigate={() => { }}
                currencyColumns={[]}
                sortElement={(header: any) => setSortElement(header)}
                sortType={(type: any) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'sentDocumentRequest'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data: any) => downloadHandler(data),
                        delete: (data: any) => handleDetails(data),
                        viewDocument: (data: any) => {
                            setShowDocument(true)
                            setDocumentToShow(data)
                        }
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>

        {
            showRequestNewDocument
            && <RequestNewDocument show={showRequestNewDocument} onHide={() => setShowRequestNewDocument(false)} dispatch={dispatch} />
        }
        {
            showBulkRequest
            && <DocumentUpload show={showBulkRequest} onHide={() => setShowBulkRequest(false)} accountId={123} Styles={Styles} parentComponent="sentDocumentRequest" search={search} />
        }
        {
            showDeleteConfirm
            && <DeleteConfirm
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                confirmDelete={() => deleteAlert()}
                details={details}
                type='sentDocumentRequest'
            />
        }
        {
            showDocument &&
            <ViewDocument show={showDocument} onHide={() => setShowDocument(false)} documentData={documentToShow} />
        }

    </>)
}

const RequestNewDocument = ({ show, onHide, dispatch }: { show: any, onHide: any, dispatch: any }) => {
    const ref = useRef<any>();
    const sendRequestRef = useRef<any>()
    const [defaultSelect, setDefaultSelect] = useState<any>([])
    const [usersSelected, setUserSelected] = useState<any>([])
    const [formError, setFormError] = useState({
        sendRequests: false,
        originalAccountNumber: false,
        clientAccountNumber: false,
        docTypeCode: false
    })

    const {
        users,
        loading,
        error,
        clientAccountNumbers
    } = useSelector((state: any) => ({
        users: state.users.data,
        loading: state.users.loading,
        error: state.users.error,
        clientAccountNumbers: state.misc.clientAccountNumbers.data,
    }))

    const validate = (formObj: any) => {
        let formIsValid = true;
        const error: any = {
            sendRequests: false,
            originalAccountNumber: false,
            clientAccountNumber: false,
            docTypeCode: false
        }
        for (let key in formObj) {
            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
            if (formObj["sendRequests"].length === 0) {
                error["sendRequests"] = true
            }
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        return formIsValid
    }

    const handleRequest = (e: any) => {
        e.preventDefault()
        const {
            originalAccountNumber,
            clientAccountNumber,
            document_type
        } = sendRequestRef.current
        const requestObj = {
            "sendRequests": usersSelected,
            attributes: {
                "originalAccountNumber": originalAccountNumber.value,
                "clientAccountNumber": clientAccountNumber.value,
            },
            "docTypeCode": document_type.value,
            // "externalSystemId": null
        }
        if (validate(requestObj)) {
            dispatch(SentDocumentRequestActionCreator.sentDocumentRequest(requestObj))
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="xl"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Request New Document
                </Modal.Title>
            </Modal.Header>
            < Modal.Body className="show-grid">
                <Container className={Styles.center_document}>
                    <Form ref={sendRequestRef} onSubmit={(e) => handleRequest(e)}>
                        <br />
                        <Row>
                            <Col lg={12} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Typeahead
                                            isLoading={loading}
                                            id="public-methods-example"
                                            labelKey="modifiedFirstName"
                                            multiple
                                            ref={ref}
                                            allowNew={true}
                                            newSelectionPrefix='Not a Platform User: '
                                            onChange={(selected) => {
                                                let selectedUpdated = selected.map((s: any) => {
                                                    if (s.customOption) {
                                                        return s.modifiedFirstName
                                                    }
                                                    return s.loginKey
                                                })
                                                setUserSelected(selectedUpdated)
                                            }}
                                            options={users}
                                        />
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["sendRequests"] ? 'At least one recipient is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Send Request To</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col lg={12} md={6} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text"></Form.Control>
                                    </Col>
                                    <Form.Label className="label_custom white">Portfolio Id</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col lg={12} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="originalAccountNumber"></Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["originalAccountNumber"] ? 'Original Account Number is required ' : ''}</small></span>
                                    <Form.Label className="label_custom white">Original Account Number</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} className="no_padding">
                                <Form.Group as={Col} className="mb-4 ">
                                    <Col md={12} sm={12}>
                                        <Form.Control
                                            as="select"
                                            name="clientAccountNumber"
                                            className="select_custom white"
                                        >
                                            <option value=""></option>
                                            {
                                                (clientAccountNumbers && clientAccountNumbers.length > 0) &&
                                                clientAccountNumbers.map((cAn: any, index: number) => {
                                                    return <option key={`cr_${index}`} value={cAn}>{cAn}</option>
                                                })
                                            }
                                        </Form.Control>
                                    </Col>
                                    <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["clientAccountNumber"] ? 'Client Account Number is required' : ''}</small></span>
                                    <Form.Label className="label_custom white">Client Account Number</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={12} >
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12} className="no_padding">
                                        <DocumentTypes />
                                    </Col>
                                    <span style={{ color: 'red' }}><small>{formError["docTypeCode"] ? 'Document Type is required' : ''}</small></span>
                                    <Form.Label className="label_custom white">Document Type</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Col className={Styles.button_center}>
                            <Button variant="dark" type="submit" style={{ width: '100%' }}>Request</Button>{" "}
                        </Col>
                    </Form>
                </Container>
            </Modal.Body>
        </Modal >
    )
}

export default SentDocumentRequests
