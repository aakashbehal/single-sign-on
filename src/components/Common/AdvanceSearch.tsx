import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash';
import { CgOptions, CgSearch } from 'react-icons/cg'
import { Button, Col, Form, Row } from 'react-bootstrap';
import DocumentTypes from './DocumentType';
import { checkIfAdvanceSearchIsActive, dateFormatterForRequestDocManager } from '../../helpers/util';
import DatePicker from 'react-date-picker';

const AdvanceSearch = ({ parentComponent, Styles, searchHandler, setAdvanceSearchObj, advanceSearchObj, showAdvanceSearch, setShowAdvanceSearch }: any) => {
    const advanceSearchRef = useRef<any>();
    const documentTypeRef = useRef<any>()
    const [advanceSearchActive, setAdvanceSearchActive] = useState<any>(false);
    const [dates, setDates] = useState<any>({
        generationDateFrom: null,
        generationDateTo: null,
        uploadDateFrom: null,
        uploadDateTo: null,
        shareDateFrom: null,
        shareDateTo: null,
        receivedDateFrom: null,
        receivedDateTo: null
    })

    useEffect(() => {
        if (!checkIfAdvanceSearchIsActive(advanceSearchObj)) {
            setAdvanceSearchActive(true)
        } else {
            setAdvanceSearchActive(false)
        }
    }, [advanceSearchObj])

    const debouncedSearch = debounce(async (criteria) => {
        searchHandler(criteria)
    }, 500);

    async function handleSearchInput(e) {
        debouncedSearch(e.target.value);
    }

    const advanceSearchHandler = (e) => {
        e.preventDefault()
        setAdvanceSearchActive(false)
        if (showAdvanceSearch) {
            let advanceSearchTemp: any = Object.assign({}, advanceSearchObj)
            const {
                document_type,
                document_name,
                original_account_number,
                client_account_number,
                equabli_account_number,
                portfolio_id
            } = advanceSearchRef.current
            //Common
            advanceSearchTemp.docTypeCode = document_type.value !== "" ? document_type.value : null
            advanceSearchTemp.documentName = document_name.value !== "" ? document_name.value : null
            if (parentComponent === 'documents') {
                // Document List
                advanceSearchTemp.generationDateFrom = dates.generationDateFrom ? dateFormatterForRequestDocManager(dates.generationDateFrom) : null
                advanceSearchTemp.generationDateTo = dates.generationDateTo ? dateFormatterForRequestDocManager(dates.generationDateTo) : null
                advanceSearchTemp.uploadDateFrom = dates.uploadDateFrom ? dateFormatterForRequestDocManager(dates.uploadDateFrom) : null
                advanceSearchTemp.uploadDateTo = dates.uploadDateTo ? dateFormatterForRequestDocManager(dates.uploadDateTo) : null
                advanceSearchTemp.shareDateFrom = dates.shareDateFrom ? dateFormatterForRequestDocManager(dates.shareDateFrom) : null
                advanceSearchTemp.shareDateTo = dates.shareDateTo ? dateFormatterForRequestDocManager(dates.shareDateTo) : null
                advanceSearchTemp.receiveDateFrom = dates.receivedDateFrom ? dateFormatterForRequestDocManager(dates.receivedDateFrom) : null
                advanceSearchTemp.receiveDateTo = dates.receivedDateTo ? dateFormatterForRequestDocManager(dates.receivedDateTo) : null
            } else {
                // Document Folder
                advanceSearchTemp.originalAccountNumber = original_account_number.value !== "" ? original_account_number.value : null
                advanceSearchTemp.clientAccountNumber = client_account_number.value !== "" ? client_account_number.value : null
                advanceSearchTemp.equabliAccountNumber = equabli_account_number.value !== "" ? equabli_account_number.value : null
                advanceSearchTemp.portfolioId = portfolio_id.value !== "" ? portfolio_id.value : null
            }
            setAdvanceSearchObj(advanceSearchTemp)
        }
    }

    const handleReset = async () => {
        // Common
        documentTypeRef.current.reset();
        advanceSearchRef.current["document_name"].value = ""
        if (parentComponent === 'documents') {
            // Document list
            setDates({
                generationDateFrom: null,
                generationDateTo: null,
                uploadDateFrom: null,
                uploadDateTo: null,
                shareDateFrom: null,
                shareDateTo: null,
                receivedDateFrom: null,
                receivedDateTo: null
            })
        } else {
            // Document Folder
            advanceSearchRef.current["original_account_number"].value = ""
            advanceSearchRef.current["client_account_number"].value = ""
            advanceSearchRef.current["equabli_account_number"].value = ""
        }
        if (parentComponent === 'sentDocumentRequest') {
            advanceSearchRef.current["portfolio_id"].value = ""
        }
        setAdvanceSearchObj({})
    }

    const dateHandler = (from, date) => {
        const dateTemp = Object.assign({}, dates)
        dateTemp[from] = date
        setDates(dateTemp)
    }

    return (
        <Col md={parentComponent === 'sentDocumentRequest' ? 8 : 10} sm={parentComponent === 'sentDocumentRequest' ? 8 : 10} className={Styles.search_input}>
            <CgSearch
                size={20}
                className={Styles.search} />
            <Form.Control
                type="text"
                name="my_document_search"
                className={Styles.my_document_search}
                onMouseDown={() => setShowAdvanceSearch(false)}
                onChange={(e) => handleSearchInput(e)}
                placeholder="Search"
            ></Form.Control>
            <CgOptions
                size={20}
                className={`${Styles.advanceSearch} ${advanceSearchActive ? Styles.active : Styles.inActive}`}
                onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
            <div className={`${Styles.advance_search} ${showAdvanceSearch ? Styles.show : Styles.hide}`}>
                <Form ref={advanceSearchRef} onSubmit={(e) => advanceSearchHandler(e)}>
                    <Row>
                        <Col lg={12} md={12}>
                            <Form.Group as={Col} className="mb-4 mt-4">
                                <Col md={12} sm={12}>
                                    <Form.Control className="select_custom white" type="text" name="document_name" />
                                </Col>
                                <Form.Label className="label_custom white">{parentComponent === 'myDocuments' ? "Folder Name" : "Document Name"}</Form.Label>
                            </Form.Group>
                            <Form.Group as={Col} className="mb-4">
                                <Col md={12} sm={12} >
                                    <DocumentTypes ref={documentTypeRef} />
                                </Col>
                                <Form.Label className="label_custom white">{parentComponent === 'myDocuments' ? "Folder that contain Document Type" : "Document Type"}</Form.Label>
                            </Form.Group>
                            {/* <Form.Group as={Col} className="mb-4">
                                <Col md={12} sm={12} >
                                    <DocumentTypes ref={documentTypeNoRef} />
                                </Col>
                                <Form.Label className="label_custom white">Folder that do not contain Document Type</Form.Label>
                            </Form.Group> */}
                            {
                                parentComponent === 'sentDocumentRequest'
                                &&
                                <Form.Group as={Col} className="mb-4">
                                    <Col md={12} sm={12}>
                                        <Form.Control
                                            className="select_custom white"
                                            type="text"
                                            name="portfolio_id" />
                                    </Col>
                                    <Form.Label className="label_custom white">Portfolio Id</Form.Label>
                                </Form.Group>
                            }
                            {
                                parentComponent !== 'documents'
                                && <>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control
                                                className="select_custom white"
                                                type="text"
                                                name="original_account_number" />
                                        </Col>
                                        <Form.Label className="label_custom white">Original Account Number</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control
                                                className="select_custom white"
                                                type="text"
                                                name="client_account_number" />
                                        </Col>
                                        <Form.Label className="label_custom white">Client Account Number</Form.Label>
                                    </Form.Group>
                                    <Form.Group as={Col} className="mb-4">
                                        <Col md={12} sm={12}>
                                            <Form.Control
                                                className="select_custom white"
                                                type="text"
                                                name="equabli_account_number" />
                                        </Col>
                                        <Form.Label className="label_custom white">Equabli Account Number</Form.Label>
                                    </Form.Group>
                                </>
                            }
                            {
                                parentComponent === 'documents'
                                && <>
                                    <Col sm={12}>
                                        <Row>
                                            <Form.Group as={Col} className="mb-4">
                                                <Col md={12} sm={12}>
                                                    <DatePicker
                                                        format={'MM/dd/yyyy'}
                                                        className="select_custom white"
                                                        monthPlaceholder={'mm'}
                                                        dayPlaceholder={'dd'}
                                                        value={dates["generationDateFrom"]}
                                                        onChange={(date) => dateHandler("generationDateFrom", date)}
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
                                                        value={dates["generationDateTo"]}
                                                        onChange={(date) => dateHandler("generationDateTo", date)}
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
                                                        value={dates["uploadDateFrom"]}
                                                        onChange={(date) => dateHandler("uploadDateFrom", date)}
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
                                                        value={dates["uploadDateTo"]}
                                                        onChange={(date) => dateHandler("uploadDateTo", date)}
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
                                                        value={dates["shareDateFrom"]}
                                                        onChange={(date) => dateHandler("shareDateFrom", date)}
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
                                                        value={dates["shareDateTo"]}
                                                        onChange={(date) => dateHandler("shareDateTo", date)}
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
                                                        value={dates["receivedDateFrom"]}
                                                        onChange={(date) => dateHandler("receivedDateFrom", date)}
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
                                                        value={dates["receivedDateTo"]}
                                                        onChange={(date) => dateHandler("receivedDateTo", date)}
                                                        yearPlaceholder={'yyyy'} />
                                                </Col>
                                                <Form.Label className="label_custom white">Received Date To</Form.Label>
                                            </Form.Group>

                                        </Row>
                                    </Col>
                                </>
                            }
                            <Col className={Styles.button_right}>
                                <Col>
                                    <Button variant="dark" type="submit">Search</Button>{" "}
                                    <Button variant="dark" onClick={() => handleReset()}>Reset</Button>{" "}
                                    <Button variant="" onClick={() => setShowAdvanceSearch(false)}>Cancel</Button>{ }
                                </Col>
                            </Col>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Col>
    )
}

export default AdvanceSearch