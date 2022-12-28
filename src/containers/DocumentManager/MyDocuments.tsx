import { useState } from "react";
import DatePicker from 'react-date-picker';

import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]

const myDocs = [
    {
        name: 'Portfolio-567890',
        ModifiedDate: '03/23/2020',
        shareDate: '04/23/2020',
        receivedDate: '-',
        size: '753kb',
        sharedBy: 'Me',
        sharedWith: [
            { name: 'Sarah Smith', email: 'sarah.smith@gmail.com' },
            { name: 'Nina Frazier', email: 'nina.fraizer@gmail.com' },
            { name: 'Nina Frazier', email: 'nina.fraizer@gmail.com' },
            { name: 'Nina Frazier', email: 'nina.fraizer@gmail.com' }
        ]
    },
    {
        name: 'Portfolio-567890',
        ModifiedDate: '03/23/2020',
        shareDate: '-',
        receivedDate: '01/22/2021',
        size: '753kb',
        sharedBy: 'CKS Financial',
        sharedWith: [
            { name: 'Sarah Smith', email: 'sarah.smith@gmail.com' },
            { name: 'Nina Frazier', email: 'nina.fraizer@gmail.com' }
        ]
    }
]

const MyDocuments = () => {
    const [tenures, setTenures] = useState(tenuresInit)
    const [documents, setDocuments] = useState(myDocs)
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    /**
     * function is used in pagination
     * @param pageSize 
     * @param pageNumber 
     */
    const handlePagination = (pageSize: number, pageNumber: number) => { }


    return (<>
        <Col sm={12}>
            <Row>
                <Col md={10} sm={10} className={Styles.search_input}>
                    <CgSearch size={20} className={Styles.search} />
                    <Form.Control type="text" name="my_document_search" className={Styles.my_document_search} onMouseDown={() => setShowAdvanceSearch(false)} placeholder="Search" ></Form.Control>
                    <CgOptions size={20} className={Styles.advanceSearch} onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
                    {showAdvanceSearch && <div className={Styles.advance_search}>
                        <Form className="">
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
        {/* <Col>
            <TableComponent
                data={documents}
                isLoading={false}
                map={{
                    name: 'Name',
                    ModifiedDate: 'Modified Date',
                    shareDate: 'Shared Date',
                    receivedDate: 'Received Date',
                    size: 'Size',
                    sharedBy: 'Shared By',
                    sharedWith: 'Shared With'
                }}
                totalCount={2}
                actionArray={[]}
                handleNavigate={() => { }}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'myDocuments'}
                searchCriteria={{}}
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col> */}
        {
            uploadDocModal
            && <DocumentUpload show={uploadDocModal} onHide={() => setUploadDocModal(false)} accountId={123} Styles={Styles} />
        }
    </>)
}

export default MyDocuments

