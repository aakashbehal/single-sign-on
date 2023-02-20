import { useEffect, useRef, useState } from "react";
import DatePicker from 'react-date-picker';
import { Typeahead } from "react-bootstrap-typeahead"
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs, Modal, Container } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { debounce } from "lodash"

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import { SentDocumentRequestActionCreator } from "../../store/actions/sentDocumentRequest.actions";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { createMessage } from "../../helpers/messages";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { UserActionCreator } from "../../store/actions/user.actions";
import { checkIfAdvanceSearchIsActive, getSignedURL } from "../../helpers/util";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import DocumentTypes from "../../components/Common/DocumentType";
import AdvanceSearch from "../../components/Common/AdvanceSearch";

const SentDocumentRequests = () => {
    const dispatch = useDispatch();
    const aRef = useRef<any>()
    const { addToast } = useToasts();

    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('id')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [showBulkRequest, setShowBulkRequest] = useState(false)
    const [showRequestNewDocument, setShowRequestNewDocument] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [advanceSearchObj, setAdvanceSearchObj] = useState({});
    const [columnsSaved, setColumnsSaved] = useState<any>([])

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
        search(pageCount, currentPage)
    }, [advanceSearchObj, sortElement, sortType])

    useEffect(() => {
        if (!loading && columns.length === 0 && (defaultColumns && defaultColumns.length > 0)) {
            const columns = defaultColumns.filter((dC) => {
                if (dC.tableName === 'documentFolder') {
                    return dC
                }
            })
            setColumnsSaved(columns[0].columnNames)
        } else {
            setColumnsSaved(columns)
        }
    }, [columns])

    useEffect(() => {
        if (sendRequestSuccess) {
            addToast(createMessage('success', `Sent`, 'Document Request'), { appearance: 'success', autoDismiss: true });
            setShowRequestNewDocument(false);
            search(pageCount, currentPage)
            setTimeout(() => {
                dispatch(SummaryActionCreator.reRender())
            }, 1000)
        }
        if (sendRequestError) { addToast(createMessage('error', `sending`, 'document request'), { appearance: 'error', autoDismiss: false }); }
        if (deleteRequestSuccess) {
            addToast(createMessage('success', `deleted`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            search(pageCount, currentPage)
            dispatch(SummaryActionCreator.reRender())
        }
        if (deleteRequestError) { addToast(createMessage('error', `deleting`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
    }, [sendRequestSuccess,
        sendRequestError,
        deleteRequestSuccess,
        deleteRequestError])

    const search = (
        pageSize = pageCount,
        pageNumber = 0,
        textValue = null,
        sort = sortType,
        column = sortElement
    ) => {
        let searchObj: any = {
            pageSize,
            pageNumber,
            documentName: textValue,
            sortOrder: sort,
            sortParam: column
        }
        if (!checkIfAdvanceSearchIsActive(advanceSearchObj)) {
            searchObj = { ...searchObj, ...advanceSearchObj }
        }
        dispatch(SentDocumentRequestActionCreator.getSentDocumentRequest(searchObj))
        setShowAdvanceSearch(false)
    }

    /**
     * function is used in pagination
     * @param pageSize 
     * @param pageNumber 
     */
    const handlePagination = (pageSize: number, pageNumber: number) => {
        setPageCount(pageSize)
        search(pageSize, pageNumber)
    }

    const deleteAlert = () => {
        dispatch(SentDocumentRequestActionCreator.deleteDocumentRequest(details.id))
    }

    const handleDetails = (document) => {
        setDetails(document)
        setShowDeleteConfirm(true)
    }

    const downloadHandler = async (document) => {
        //download file
        let filePath = await getSignedURL(document.filePath)
        aRef.current.href = filePath;
        aRef.current.download = document.documentName;
        aRef.current.click();
        dispatch(DownloadHistoryActionCreator.saveDownloadHistory([document.documentId]))
    }


    return (<>
        <a href="" ref={aRef} target="_blank"></a>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'sentDocumentRequest'}
                    Styles={Styles}
                    searchHandler={(criteria) => search(pageCount, 1, criteria)}
                    setAdvanceSearchObj={(obj) => setAdvanceSearchObj(obj)}
                    advanceSearchObj={advanceSearchObj}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag) => setShowAdvanceSearch(flag)}
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
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'sentDocumentRequest'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data) => downloadHandler(data),
                        delete: (data) => handleDetails(data),
                        viewDocument: (data) => {
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
            && <DocumentUpload show={showBulkRequest} onHide={() => setShowBulkRequest(false)} accountId={123} Styles={Styles} parentComponent="sentDocumentRequest" />
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

const RequestNewDocument = ({ show, onHide, dispatch }) => {
    const ref = useRef<any>();
    const sendRequestRef = useRef<any>()
    const [defaultSelect, setDefaultSelect] = useState<any>([])
    const [usersSelected, setUserSelected] = useState<any>([])

    const {
        users,
        loading,
        error
    } = useSelector((state: any) => ({
        users: state.users.data,
        loading: state.users.loading,
        error: state.users.error
    }))

    useEffect(() => {
        dispatch(UserActionCreator.getConnectedUsers())
    }, [])

    const handleRequest = (e) => {
        e.preventDefault()
        const {
            originalAccountNumber,
            clientAccountNumber,
            docTypeCode
        } = sendRequestRef.current
        dispatch(SentDocumentRequestActionCreator.sentDocumentRequest({
            "sendRequests": usersSelected,
            "originalAccountNumber": originalAccountNumber.value,
            "clientAccountNumber": clientAccountNumber.value,
            "docTypeCode": docTypeCode.value
        }))
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
                            <Col lg={12} md={6} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Typeahead
                                            isLoading={loading}
                                            id="public-methods-example"
                                            labelKey="firstName"
                                            multiple
                                            defaultSelected={defaultSelect}
                                            ref={ref}
                                            allowNew={true}
                                            newSelectionPrefix='Not a Platform User: '
                                            onChange={(selected) => {
                                                let selectedUpdated = selected.map((s: any) => {
                                                    let temp = {
                                                        "firstName": s.firstName,
                                                        "principleId": s.principleId,
                                                        "orgTypeCode": s.orgType,
                                                        "orgCode": s.orgCode
                                                    }
                                                    return temp
                                                })
                                                setUserSelected(selectedUpdated)
                                            }}
                                            options={users}
                                        />
                                    </Col>
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
                            <Col lg={12} md={6} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="originalAccountNumber"></Form.Control>
                                    </Col>
                                    <Form.Label className="label_custom white">Original Account Number</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={6} className="no_padding">
                                <Form.Group as={Col} className="mb-5">
                                    <Col md={12} sm={12}>
                                        <Form.Control type="text" name="clientAccountNumber"></Form.Control>
                                    </Col>
                                    <Form.Label className="label_custom white">Client Account Number</Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12} md={6} >
                                <Form.Group as={Col} className="mb-5">
                                    <DocumentTypes />
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
