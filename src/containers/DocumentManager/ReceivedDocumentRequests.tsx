import { useEffect, useRef, useState } from "react";
import DatePicker from 'react-date-picker';
import { Typeahead } from "react-bootstrap-typeahead"
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs, Modal, Container } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import { SentDocumentRequestActionCreator } from "../../store/actions/sentDocumentRequest.actions";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";
import { ReceiveDocumentRequestActionCreator } from "../../store/actions/receivedDocumentRequest.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]

const ReceivedDocumentRequests = () => {
    const dispatch = useDispatch()
    const { addToast } = useToasts();
    const [tenures, setTenures] = useState(tenuresInit)
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [showBulkRequest, setShowBulkRequest] = useState(false)
    const [showRequestNewDocument, setShowRequestNewDocument] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [details, setDetails] = useState<any>(null);

    const {
        receiveDocumentRequests,
        totalCount,
        loading,
        error,
        documentTypes,
        loadingDocumentTypes,
        errorDocumentTypes,
        downloadRequest,
        downloadRequestSuccess,
        downloadRequestError,
        deleteRequest,
        deleteRequestSuccess,
        deleteRequestError
    } = useSelector((state: any) => ({
        receiveDocumentRequests: state.receiveDocumentRequest.data,
        totalCount: state.receiveDocumentRequest.totalCount,
        loading: state.receiveDocumentRequest.loading,
        error: state.receiveDocumentRequest.error,
        documentTypes: state.types.documentType.data,
        loadingDocumentTypes: state.types.documentType.loading,
        errorDocumentTypes: state.types.documentType.error,
        downloadRequest: state.receiveDocumentRequest.downloadRequest,
        downloadRequestSuccess: state.receiveDocumentRequest.downloadRequestSuccess,
        downloadRequestError: state.receiveDocumentRequest.downloadRequestError,
        deleteRequest: state.receiveDocumentRequest.deleteRequest,
        deleteRequestSuccess: state.receiveDocumentRequest.deleteRequestSuccess,
        deleteRequestError: state.receiveDocumentRequest.deleteRequestError
    }))

    useEffect(() => {
        search(pageCount, currentPage)
        dispatch(TypesActionCreator.getDocumentTypes('CL'))
    }, [])

    useEffect(() => {
        // if (sendRequestSuccess) {
        //     addToast(createMessage('success', `Sent`, 'Document Request'), { appearance: 'success', autoDismiss: true });
        //     setShowRequestNewDocument(false);
        //     search(pageCount, currentPage)
        // }
        // if (sendRequestError) { addToast(createMessage('error', `sending`, 'document request'), { appearance: 'error', autoDismiss: false }); }
        if (deleteRequestSuccess) {
            addToast(createMessage('success', `deleted`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            search(pageCount, currentPage)
        }
        if (deleteRequestError) { addToast(createMessage('error', `deleting`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
    }, [
        // sendRequestSuccess,
        // sendRequestError,
        deleteRequestSuccess,
        deleteRequestError])

    const search = (pageSize = pageCount, pageNumber = 1) => {
        dispatch(ReceiveDocumentRequestActionCreator.getReceiveDocumentRequest({
            pageSize,
            pageNumber
        }))
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

    const downloadDocument = (document) => {
        console.log(document)
    }

    return (<>
        <Col sm={12}>
            <Row>
                <Col md={10} sm={10} className={Styles.search_input}>
                    <CgSearch size={20} className={Styles.search} />
                    <Form.Control type="text" name="my_document_search" className={Styles.my_document_search} onMouseDown={() => setShowAdvanceSearch(false)} placeholder="Search" ></Form.Control>
                    <CgOptions size={20} className={Styles.advanceSearch} onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
                    {showAdvanceSearch && <div className={Styles.advance_search}>
                        <Form className="">
                            <br />
                            <Row>
                                <Col lg={12} md={12}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12} >
                                            <Form.Control
                                                as="select"
                                                name="service_offered"
                                                className="select_custom white">
                                                <option></option>
                                                {
                                                    (tenures && tenures.length > 0) &&
                                                    tenures.map((tenure: any, index: number) => {
                                                        return <option key={`cr_${index}`} value={tenure.statusCode}>{tenure.status}</option>
                                                    })
                                                }
                                            </Form.Control>
                                        </Col>
                                        <Form.Label className="label_custom white">Document Type</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control className="select_custom white" type="text" name="document_name" />
                                        </Col>
                                        <Form.Label className="label_custom white">Document Name</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col sm={12}>
                                <Row>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Generation Date From</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Generation Date To</Form.Label>
                                    </Form.Group>
                                </Row>
                            </Col>
                            <Col sm={12}>
                                <Row>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Upload Date From</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Upload Date To</Form.Label>
                                    </Form.Group>
                                </Row>
                            </Col>
                            <Col sm={12}>
                                <Row>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Share Date From</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Share Date To</Form.Label>
                                    </Form.Group>
                                </Row>
                            </Col>
                            <Col sm={12}>
                                <Row>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Received Date From</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                dayPlaceholder={'dd'}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Received Date To</Form.Label>
                                    </Form.Group>

                                </Row>
                                <Col className={Styles.button_center}>
                                    <Button variant="dark" type="submit">Search</Button>{" "}
                                    <Button variant="dark">Reset</Button>
                                </Col>
                            </Col>
                        </Form>
                    </div>
                    }
                </Col>
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModal(true)}>Fulfill Bulk Request</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={receiveDocumentRequests}
                isLoading={loading}
                map={{
                    "documentType": "Requested Document",
                    "originalAccountNumber": "Original Account Number",
                    "equabliAccountNumber": "Equabli Account Number",
                    "clientAccountNumber": "Client Account Number",
                    "requestDate": "Requested Date",
                    "dueDate": "Due Date",
                    "fulfillmentDate": "Fulfillment Date",
                    "fileName": "Document Name",
                    "requestedFrom": "Requested By"
                }}
                totalCount={totalCount}
                actionArray={[]}
                handleNavigate={() => { }}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'receiveDocumentRequest'}
                searchCriteria={{}}
                addEditArray={
                    {
                        download: (data) => downloadDocument(data),
                        upload: (data) => setUploadDocModal(true),
                        delete: (data) => handleDetails(data)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>
        {
            uploadDocModal
            && <DocumentUpload
                show={uploadDocModal}
                onHide={() => setUploadDocModal(false)}
                accountId={123}
                Styles={Styles}
                parentComponent="receiveDocumentRequest"
                search={search}
                details={details}
            />
        }
        {
            showDeleteConfirm
            && <DeleteConfirm
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                confirmDelete={() => deleteAlert()}
                details={details}
                type='receiveDocumentRequest'
            />
        }
    </>)
}

export default ReceivedDocumentRequests

