import { useEffect, useRef, useState } from "react";
import DatePicker from 'react-date-picker';
import { Typeahead } from "react-bootstrap-typeahead"
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs, Modal, Container } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import { SentDocumentRequestActionCreator } from "../../store/actions/sentDocumentRequest.actions";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { createMessage } from "../../helpers/messages";
import DeleteConfirm from "../../components/modal/DeleteConfirm";

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]

const SentDocumentRequests = () => {
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
    const [details, setDetails] = useState<any>(null);

    const {
        sentDocumentRequests,
        totalCount,
        loading,
        error,
        documentTypes,
        loadingDocumentTypes,
        errorDocumentTypes,
        sendRequest,
        sendRequestSuccess,
        sendRequestError,
        deleteRequest,
        deleteRequestSuccess,
        deleteRequestError
    } = useSelector((state: any) => ({
        sentDocumentRequests: state.sentDocumentRequest.data,
        totalCount: state.sentDocumentRequest.totalCount,
        loading: state.sentDocumentRequest.loading,
        error: state.sentDocumentRequest.error,
        documentTypes: state.types.documentType.data,
        loadingDocumentTypes: state.types.documentType.loading,
        errorDocumentTypes: state.types.documentType.error,
        sendRequest: state.sentDocumentRequest.sendRequest,
        sendRequestSuccess: state.sentDocumentRequest.sendRequestSuccess,
        sendRequestError: state.sentDocumentRequest.sendRequestError,
        deleteRequest: state.sentDocumentRequest.deleteRequest,
        deleteRequestSuccess: state.sentDocumentRequest.deleteRequestSuccess,
        deleteRequestError: state.sentDocumentRequest.deleteRequestError
    }))

    useEffect(() => {
        search(pageCount, currentPage)
        dispatch(TypesActionCreator.getDocumentTypes('CL'))
    }, [])

    useEffect(() => {
        if (sendRequestSuccess) {
            addToast(createMessage('success', `Sent`, 'Document Request'), { appearance: 'success', autoDismiss: true });
            setShowRequestNewDocument(false);
            search(pageCount, currentPage)
        }
        if (sendRequestError) { addToast(createMessage('error', `sending`, 'document request'), { appearance: 'error', autoDismiss: false }); }
        if (deleteRequestSuccess) {
            addToast(createMessage('success', `deleted`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            search(pageCount, currentPage)
        }
        if (deleteRequestError) { addToast(createMessage('error', `deleting`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
    }, [sendRequestSuccess,
        sendRequestError,
        deleteRequestSuccess,
        deleteRequestError])

    const search = (pageSize = pageCount, pageNumber = 0) => {
        dispatch(SentDocumentRequestActionCreator.getSentDocumentRequest({
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

    return (<>
        <Col sm={12}>
            <Row>
                <Col md={8} sm={8} className={Styles.search_input}>
                    <CgSearch size={20} className={Styles.search} />
                    <Form.Control type="text" name="my_document_search" className={Styles.my_document_search} onMouseDown={() => setShowAdvanceSearch(false)} placeholder="Search" ></Form.Control>
                    <CgOptions size={20} className={Styles.advanceSearch} onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
                    {showAdvanceSearch && <div className={Styles.advance_search}>
                        <Form >
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
                    "fulfillment": "Fulfillment Date",
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
                addEditArray={
                    {
                        download: (data) => console.log("download", data),
                        delete: (data) => handleDetails(data)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>

        {
            showRequestNewDocument
            && <RequestNewDocument show={showRequestNewDocument} onHide={() => setShowRequestNewDocument(false)} documentTypes={documentTypes} dispatch={dispatch} />
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
    </>)
}

const RequestNewDocument = ({ show, onHide, documentTypes, dispatch }) => {
    const ref = useRef<any>();
    const sendRequestRef = useRef<any>()
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(['aakashbehal@gmail.com', 'abc@gmail.com']);
    const [defaultSelect, setDefaultSelect] = useState<any>([])
    const [usersSelected, setUserSelected] = useState<any>([])

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
                                            labelKey="email"
                                            multiple
                                            defaultSelected={defaultSelect}
                                            ref={ref}
                                            allowNew={true}
                                            newSelectionPrefix='Not a Platform User: '
                                            onChange={(selected) => {
                                                let selectedUpdated = selected.map((s) => {
                                                    if (typeof s === 'object') {
                                                        return s.email
                                                    }
                                                    return s
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
                                    <Form.Control
                                        as="select"
                                        name="docTypeCode"
                                        className="select_custom white">
                                        <option></option>
                                        {
                                            (documentTypes && documentTypes.length > 0) &&
                                            documentTypes.map((dT: any, index: number) => {
                                                return <option key={`cr_${index}`} value={dT.shortCode}>{dT.documentType}</option>
                                            })
                                        }
                                    </Form.Control>
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
