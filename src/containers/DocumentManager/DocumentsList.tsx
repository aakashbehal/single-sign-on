import { useState, useEffect } from "react";
import DatePicker from 'react-date-picker';

import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { useDispatch, useSelector } from "react-redux";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import ViewDocument from "../../components/modal/ViewDocument";

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]

const DocumentsList = ({ location }) => {
    const dispatch = useDispatch();
    const params = new URLSearchParams(location.search);
    const AccountId = params.get('account_id');
    const [tenures, setTenures] = useState(tenuresInit)
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null)

    const { documents, totalCount, error, loading } = useSelector((state: any) => ({
        documents: state.myDocuments.documents.data,
        totalCount: state.myDocuments.documents.totalCount,
        error: state.myDocuments.documents.error,
        loading: state.myDocuments.documents.loading
    }))

    useEffect(() => {
        search(pageCount, currentPage)
        return () => {
            dispatch(MyDocumentsActionCreator.resetDocumentList())
        }
    }, [])

    const search = (pageSize = pageCount, pageNumber = 0) => {
        dispatch(MyDocumentsActionCreator.getMyDocumentList({
            pageSize,
            pageNumber,
            accountNumber: AccountId,
            orgType: 'CT'
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

    const downloadHandler = (document) => {
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
                        <Form className="" style={{ marginTop: '2rem' }}>
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
                                {/* <Col className={Styles.button_center}>
                                    <Button variant="dark" type="submit">Search</Button>{" "}
                                    <Button variant="dark">Reset</Button>
                                </Col> */}
                            </Col>
                        </Form>
                    </div>
                    }
                </Col>
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModal(true)}>Upload Document</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={documents}
                isLoading={loading}
                map={{
                    fileName: "Name",
                    documentType: "Document Type",
                    originalAccountNo: "Original Account Number",
                    equabliAccountNo: "Equabli Account Number",
                    clientAccountNo: "Client Account Number",
                    generateDate: "Generated Date",
                    uploadDate: "upload Date",
                    shareDate: "Share Date",
                    receiveDate: "Receive Date",
                    fileSize: "File Size",
                    sharedBy: "Shared By",
                    sharedWith: "Shared With",
                }}
                totalCount={totalCount}
                actionArray={['fileName']}
                handleNavigate={(data) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'documents'}
                searchCriteria={{}}
                addEditArray={
                    {
                        download: (data) => downloadHandler(data),
                        share: (data) => console.log(`share action`, data),
                        view: (data) => {
                            setShowDocument(true)
                            setDocumentToShow(data)
                        },
                        delete: (data) => console.log(`Delete Action`, data)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>
        {
            uploadDocModal
            && <DocumentUpload show={uploadDocModal} onHide={() => setUploadDocModal(false)} accountId={123} Styles={Styles} parentComponent="documents" search={search} />
        }
        {
            showDocument &&
            <ViewDocument show={showDocument} onHide={() => setShowDocument(false)} documentData={documentToShow} />
        }
    </>)
}

export default DocumentsList

