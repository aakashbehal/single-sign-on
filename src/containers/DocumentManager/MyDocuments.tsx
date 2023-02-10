import { useState, useEffect, useRef } from "react";
import DatePicker from 'react-date-picker';

import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { useDispatch, useSelector } from "react-redux";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import { useHistory } from "react-router-dom";

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]

const MyDocuments = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const advanceSearchRef = useRef<any>();
    const [tenures, setTenures] = useState(tenuresInit)
    const [generationDateFrom, setGenerationDateFrom] = useState<any>(null)
    const [generationDateTo, setGenerationDateTo] = useState<any>(null)
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)

    const { folders, totalCount, error, loading } = useSelector((state: any) => ({
        folders: state.myDocuments.folders.data,
        totalCount: state.myDocuments.folders.totalCount,
        error: state.myDocuments.folders.error,
        loading: state.myDocuments.folders.loading
    }))

    useEffect(() => {
        search(pageCount, currentPage)
    }, [])

    const showDocumentListPage = (data, column) => {
        history.push({
            pathname: '/documents/document_list',
            search: `account_id=${data.folderName}`,
        });
    }

    const search = (pageSize = pageCount, pageNumber = 1, folderName = null, modifiedDateFrom = null, modifiedDateTo = null) => {
        dispatch(MyDocumentsActionCreator.getMyDocumentFolders({
            pageSize,
            pageNumber,
            folderName,
            modifiedDateFrom,
            modifiedDateTo
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

    const downloadDocument = (document) => {
        console.log(document)
    }

    const advanceSearchHandler = (e) => {
        e.preventDefault()
        const {
            document_name
        } = advanceSearchRef.current
        console.log(document_name.value)
        console.log(generationDateFrom, generationDateTo)
        search(pageCount, 1, document_name.value, generationDateFrom, generationDateTo)
        setShowAdvanceSearch(false)
    }

    return (<>
        <Col sm={12}>
            <Row>
                <Col md={10} sm={10} className={Styles.search_input}>
                    <CgSearch size={20} className={Styles.search} />
                    <Form.Control type="text" name="my_document_search" className={Styles.my_document_search} onMouseDown={() => setShowAdvanceSearch(false)} placeholder="Search" ></Form.Control>
                    <CgOptions size={20} className={Styles.advanceSearch} onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
                    {showAdvanceSearch && <div className={Styles.advance_search}>
                        <Form ref={advanceSearchRef} onSubmit={(e) => advanceSearchHandler(e)}>
                            <Row>
                                <Col lg={12} md={12}>
                                    {/* <Form.Group as={Col} className="mb-4">
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
                                    </Form.Group> */}
                                    <Form.Group as={Col} className="mb-4 mt-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control className="select_custom white" type="text" name="document_name" />
                                        </Col>
                                        <Form.Label className="label_custom white">Folder Name</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col sm={12}>
                                <Row>
                                    <Form.Group as={Col} className="mb-4 mt-2">
                                        <Col md={12} sm={12}>
                                            <DatePicker
                                                format={'MM/dd/yyyy'}
                                                className="select_custom white"
                                                monthPlaceholder={'mm'}
                                                onChange={setGenerationDateFrom}
                                                dayPlaceholder={'dd'}
                                                value={generationDateFrom}
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
                                                onChange={setGenerationDateTo}
                                                dayPlaceholder={'dd'}
                                                value={generationDateTo}
                                                yearPlaceholder={'yyyy'} />
                                        </Col>
                                        <Form.Label className="label_custom white">Generation Date To</Form.Label>
                                    </Form.Group>
                                </Row>
                            </Col>
                            {/* <Col sm={12}>
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
                            </Col> */}
                            <Col sm={12}>
                                {/* <Row>
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
                                </Row> */}
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
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModal(true)}>Upload Document</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={folders}
                isLoading={loading}
                map={{
                    "folderName": "Name",
                    "fileSize": "Size",
                    "modifiedDate": "Modified Date",
                    "shareDate": "Shared Date",
                    "receiveDate": "Received Date",
                    "shareBy": "Shared By",
                    "sharedWith": "Shared With"
                }}
                totalCount={totalCount}
                actionArray={['folderName']}
                handleNavigate={(data, column) => showDocumentListPage(data, column)}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'myDocuments'}
                searchCriteria={{}}
                addEditArray={
                    {
                        download: (data) => downloadDocument(data),
                        share: (data) => console.log(`share action`),
                        view: (data) => console.log(`View Action`),
                        delete: (data) => console.log(`Delete Action`)
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
                parentComponent="myDocument"
                search={search} />
        }
    </>)
}

export default MyDocuments

