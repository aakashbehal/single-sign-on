import React, { useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash';
import { CgOptions, CgSearch } from 'react-icons/cg'
import DatePicker from 'react-date-picker';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import DocumentTypes from './DocumentType';
import { checkIfAdvanceSearchIsActive, dateFormatterForRequestDocManager } from '../../helpers/util';
import { useDispatch, useSelector } from 'react-redux';
import { UserActionCreator } from '../../store/actions/user.actions';
import { ProductTypes } from '../../store/types.d';
import DocumentGroup from '../../containers/DocumentManager/DocumentGroup';
import { DocumentGroupActionCreator } from '../../store/actions/documentGroup.actions';

const FIELD_MAPPER: any = {
    myDocuments: [
        // "originalAccountNumber",
        "equabliAccountNumber",
        // "clientAccountNumber",
        "documentName",
        "DocumentType",
        "DocumentTypeNot",
        "modifiedDateFrom",
        "modifiedDateTo",
        "shareDateFrom",
        "shareDateTo",
        "ReceiveDateFrom",
        "ReceiveDateTo",
        "shareBy",
        "shareWith",
        "portfolioId",
        "productType"
    ],
    documents: [
        "documentName",
        "DocumentType",
        "shareDateFrom",
        "shareDateTo",
        "ReceiveDateFrom",
        "ReceiveDateTo",
        "shareBy",
        "shareWith",
        "uploadDateFrom",
        "uploadDateTo",
        "generatedDateFrom",
        "generatedDateTo"
    ],
    sentDocumentRequest: [
        "documentName",
        "DocumentType",
        // "originalAccountNumber",
        "equabliAccountNumber",
        // "clientAccountNumber",
        "requestedDateFrom",
        "requestedDateTo",
        "dueDateFrom",
        "dueDateTo",
        "fulfillmentDateFrom",
        "fulfillmentDateTo",
        "requestedFrom",
        "requestedStatus"
    ],
    receiveDocumentRequest: [
        "documentName",
        "DocumentType",
        // "originalAccountNumber",
        "equabliAccountNumber",
        // "clientAccountNumber",
        "requestedDateFrom",
        "requestedDateTo",
        "dueDateFrom",
        "dueDateTo",
        "fulfillmentDateFrom",
        "fulfillmentDateTo",
        "requestedBy",
        "requestedStatus"
    ],
    documentSummary: [
        "documentName",
        // "originalAccountNumber",
        "equabliAccountNumber",
        // "clientAccountNumber",
        "shareBy",
        "uploadDateFrom",
        "uploadDateTo",
        "generatedDateFrom",
        "generatedDateTo"
    ],
    documentNotSummary: [
        "originalAccountNumber",
        "equabliAccountNumber",
        "clientAccountNumber",
    ]
}

const AdvanceSearch = ({ parentComponent,
    Styles,
    showAdvanceSearch,
    setShowAdvanceSearch,
    textSearchHook,
    advanceSearchHook,
    resetHandlerHook,
    searchObj
}: any) => {
    const dispatch = useDispatch();
    const requestFromRef = useRef<any>();
    const requestByRef = useRef<any>();
    const sharedWithRef = useRef<any>();
    const sharedByRef = useRef<any>();
    const advanceSearchRef = useRef<any>();
    const documentTypeRef = useRef<any>();
    const productTypeRef = useRef<any>();
    const documentTypeNotRef = useRef<any>();
    const textSearchRef = useRef<HTMLInputElement | null>(null);
    const [advanceSearchActive, setAdvanceSearchActive] = useState<any>(false);
    const [requestedFromSelected, setRequestedFromSelected] = useState<any>([])
    const [requestedBySelected, setRequestedBySelected] = useState<any>([])
    const [sharedBySelected, setSharedBySelected] = useState<any>([])
    const [sharedWithSelected, setSharedWithSelected] = useState<any>([])
    const [productTypeValue, setProductTypeValue] = useState('')
    const [dates, setDates] = useState<any>({
        generationDateFrom: null,
        generationDateTo: null,
        uploadDateFrom: null,
        uploadDateTo: null,
        shareDateFrom: null,
        shareDateTo: null,
        receiveDateFrom: null,
        receiveDateTo: null,
        modifiedDateFrom: null,
        modifiedDateTo: null,
        requestedDateFrom: null,
        requestedDateTo: null,
        dueDateFrom: null,
        dueDateTo: null,
        fulfillmentDateFrom: null,
        fulFillmentDateTo: null
    })

    const {
        users,
        loading,
        error,
        productTypes,
        loadingProductTypes,
        errorProductTypes,
    } = useSelector((state: any) => ({
        users: state.users.data,
        loading: state.users.loading,
        error: state.users.error,
        productTypes: state.documentGroup.data,
        loadingProductTypes: state.documentGroup.loading,
        errorProductTypes: state.documentGroup.data.error,
    }))

    useEffect(() => {
        dispatch(DocumentGroupActionCreator.getAllDocumentGroup({}))
        dispatch(UserActionCreator.getConnectedUsers())
        if (!checkIfAdvanceSearchIsActive(searchObj)) {
            setAdvanceSearchActive(true)
        } else {
            setAdvanceSearchActive(false)
        }
    }, [searchObj])

    const debouncedSearch = debounce(async (criteria) => {
        textSearchHook(criteria)
    }, 500);

    async function handleSearchInput(e: any) {
        debouncedSearch(e.target.value);
    }

    const advanceSearchHandler = (e: any) => {
        e.preventDefault()
        if (showAdvanceSearch) {
            if (textSearchRef && textSearchRef.current?.value) {
                textSearchRef.current.value = "";
            }
            let advanceSearchTemp: any = {}
            const {
                document_type,
                product_type,
                document_name,
                original_account_number,
                client_account_number,
                equabli_account_number,
                requested_status,
                portfolio_id
            } = advanceSearchRef.current
            console.log(`--documentTypeRef.current?.value`, document_type, document_type.value)
            advanceSearchTemp.docTypeCode = document_type?.value || null
            advanceSearchTemp.docGroupCode = product_type?.value || null
            advanceSearchTemp.portfolioId = portfolio_id?.value || null
            advanceSearchTemp.documentName = document_name?.value.trim() || null
            advanceSearchTemp.generationDateFrom = dates.generationDateFrom ? dateFormatterForRequestDocManager(dates.generationDateFrom) : null
            advanceSearchTemp.generationDateTo = dates.generationDateTo ? dateFormatterForRequestDocManager(dates.generationDateTo) : null
            advanceSearchTemp.uploadDateFrom = dates.uploadDateFrom ? dateFormatterForRequestDocManager(dates.uploadDateFrom) : null
            advanceSearchTemp.uploadDateTo = dates.uploadDateTo ? dateFormatterForRequestDocManager(dates.uploadDateTo) : null
            advanceSearchTemp.shareDateFrom = dates.shareDateFrom ? dateFormatterForRequestDocManager(dates.shareDateFrom) : null
            advanceSearchTemp.shareDateTo = dates.shareDateTo ? dateFormatterForRequestDocManager(dates.shareDateTo) : null
            advanceSearchTemp.receiveDateFrom = dates.receivedDateFrom ? dateFormatterForRequestDocManager(dates.receivedDateFrom) : null
            advanceSearchTemp.receiveDateTo = dates.receivedDateTo ? dateFormatterForRequestDocManager(dates.receivedDateTo) : null
            advanceSearchTemp.modifiedDateFrom = dates.modifiedDateFrom ? dateFormatterForRequestDocManager(dates.modifiedDateFrom) : null
            advanceSearchTemp.modifiedDateTo = dates.modifiedDateTo ? dateFormatterForRequestDocManager(dates.modifiedDateTo) : null
            advanceSearchTemp.requestedDateFrom = dates.requestedDateFrom ? dateFormatterForRequestDocManager(dates.requestedDateFrom) : null
            advanceSearchTemp.requestedDateTo = dates.requestedDateTo ? dateFormatterForRequestDocManager(dates.requestedDateTo) : null
            advanceSearchTemp.dueDateFrom = dates.dueDateFrom ? dateFormatterForRequestDocManager(dates.dueDateFrom) : null
            advanceSearchTemp.dueDateTo = dates.dueDateTo ? dateFormatterForRequestDocManager(dates.dueDateTo) : null
            advanceSearchTemp.fulFillmentDateFrom = dates.fulFillmentDateFrom ? dateFormatterForRequestDocManager(dates.fulFillmentDateFrom) : null
            advanceSearchTemp.fulFillmentDateTo = dates.fulFillmentDateTo ? dateFormatterForRequestDocManager(dates.fulFillmentDateTo) : null
            advanceSearchTemp.originalAccountNumber = original_account_number?.value.trim() || null
            advanceSearchTemp.clientAccountNumber = client_account_number?.value.trim() || null
            advanceSearchTemp.equabliAccountNumber = equabli_account_number?.value.trim() || null
            advanceSearchTemp.sharedBy = sharedBySelected.length === 0 ? null : sharedBySelected[0]
            advanceSearchTemp.sharedWith = sharedWithSelected.length === 0 ? null : sharedWithSelected[0]
            advanceSearchTemp.requestedFrom = requestedFromSelected.length === 0 ? null : requestedFromSelected[0]
            advanceSearchTemp.requestedBy = requestedBySelected.length === 0 ? null : requestedBySelected[0]
            advanceSearchTemp.requestStatus = requested_status?.value || null
            advanceSearchHook(advanceSearchTemp)
        }
    }

    const handleReset = async () => {
        // Common
        documentTypeRef.current.reset();
        advanceSearchRef.current["document_name"].value = ""
        if (FIELD_MAPPER[parentComponent].includes('portfolioId')) {
            advanceSearchRef.current["portfolio_id"].value = ""
        }
        setDates({
            generationDateFrom: null,
            generationDateTo: null,
            uploadDateFrom: null,
            uploadDateTo: null,
            shareDateFrom: null,
            shareDateTo: null,
            receiveDateFrom: null,
            receiveDateTo: null,
            modifiedDateFrom: null,
            modifiedDateTo: null,
            requestedDateFrom: null,
            requestedDateTo: null,
            dueDateFrom: null,
            dueDateTo: null,
            fulFillmentDateFrom: null,
            fulFillmentDateTo: null
        })
        // advanceSearchRef.current["original_account_number"].value = ""
        // advanceSearchRef.current["client_account_number"].value = ""
        advanceSearchRef.current["equabli_account_number"].value = ""
        if (FIELD_MAPPER[parentComponent].includes('requestedStatus')) {
            advanceSearchRef.current["requested_status"].value = ""
        }
        setRequestedFromSelected([])
        setRequestedBySelected([])
        setSharedBySelected([])
        setSharedWithSelected([])
        requestFromRef.current?.clear()
        requestByRef.current?.clear()
        sharedWithRef.current?.clear()
        sharedByRef.current?.clear()
        setProductTypeValue('')
        resetHandlerHook({})
    }

    const dateHandler = (from: any, date: any) => {
        const dateTemp = Object.assign({}, dates)
        dateTemp[from] = date
        setDates(dateTemp)
    }

    return (
        <Col
            md={(parentComponent === 'sentDocumentRequest' || parentComponent === "documentNotSummary") ? 8 : parentComponent === "documentSummary" ? 12 : 10}
            sm={(parentComponent === 'sentDocumentRequest' || parentComponent === "documentNotSummary") ? 8 : parentComponent === "documentSummary" ? 12 : 10}
            className={Styles.search_input}>
            <CgSearch
                size={20}
                className={Styles.search} />
            <Form.Control
                type="text"
                name="my_document_search"
                ref={textSearchRef}
                className={Styles.my_document_search}
                onMouseDown={() => setShowAdvanceSearch(false)}
                onChange={(e) => handleSearchInput(e)}
                onKeyDown={(e: any) => { if (e.code === 'Enter') handleSearchInput(e) }}
                placeholder="Search"
            ></Form.Control>
            <CgOptions
                size={20}
                className={`${Styles.advanceSearch} ${advanceSearchActive ? Styles.active : Styles.inActive}`}
                onClick={() => setShowAdvanceSearch(!showAdvanceSearch)} />
            <div className={`${Styles.advance_search} ${showAdvanceSearch ? Styles.show : Styles.hide}`}>
                <Form ref={advanceSearchRef} onSubmit={(e) => advanceSearchHandler(e)}>
                    <Col sm={12}>
                        <Row className="align-items-center">
                            {
                                FIELD_MAPPER[parentComponent].includes('documentName')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Form.Control className="select_custom white" type="text" name="document_name" />
                                    <Form.Label className="label_custom white">{parentComponent === 'myDocuments' ? "Folder Name" : "Document Name"}</Form.Label>
                                </Col>
                            }

                            {
                                FIELD_MAPPER[parentComponent].includes('DocumentType')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DocumentTypes ref={documentTypeRef} />
                                    <Form.Label className="label_custom white">{parentComponent === 'myDocuments' ? "Folder that contain Document Type" : "Document Type"}</Form.Label>
                                </Col>
                            }
                            {/* {
                                FIELD_MAPPER[parentComponent].includes('documentName')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DocumentTypes ref={documentTypeNotRef} />
                                    <Form.Label className="label_custom white">Folder that do not contain Document Type</Form.Label>
                                </Col>
                            } */}
                            {
                                FIELD_MAPPER[parentComponent].includes('portfolioId')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Form.Control
                                        className="select_custom white"
                                        type="text"
                                        name="portfolio_id" />
                                    <Form.Label className="label_custom white">Portfolio Id</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('productType')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Form.Control
                                        as="select"
                                        name="product_type"
                                        ref={productTypeRef}
                                        value={productTypeValue}
                                        onChange={(e) => { setProductTypeValue(e.target.value) }}
                                        className="select_custom white">
                                        <option disabled value="">Select Product Type...</option>
                                        {
                                            (productTypes && productTypes?.pickedDocGroups?.length > 0) &&
                                            productTypes?.pickedDocGroups?.map((dT: any, index: number) => {
                                                return <option key={`cr_${index}`} value={dT.code}>{dT.name}</option>
                                            })
                                        }
                                    </Form.Control>
                                    <Form.Label className="label_custom white">Product Type</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('originalAccountNumber')
                                && <Col sm={12} className="my-1 mt-4">
                                    <Form.Control
                                        className="select_custom white"
                                        type="text"
                                        name="original_account_number" />
                                    <Form.Label className="label_custom white">Original Account Number</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('clientAccountNumber')
                                && <Col sm={12} className="my-1 mt-4">
                                    <Form.Control
                                        className="select_custom white"
                                        type="text"
                                        name="client_account_number" />
                                    <Form.Label className="label_custom white">Client Account Number</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('equabliAccountNumber')
                                && <Col sm={12} className="my-1 mt-4">
                                    <Form.Control
                                        className="select_custom white"
                                        type="text"
                                        name="equabli_account_number" />
                                    <Form.Label className="label_custom white">Equabli Account Number</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('generatedDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["generationDateFrom"]}
                                        onChange={(date: any) => dateHandler("generationDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Generation Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('modifiedDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["modifiedDateFrom"]}
                                        onChange={(date: any) => dateHandler("modifiedDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Modified Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('modifiedDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["modifiedDateTo"]}
                                        onChange={(date: any) => dateHandler("modifiedDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Modified Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('generatedDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["generationDateTo"]}
                                        minDate={new Date(dates["generationDateFrom"])}
                                        onChange={(date: any) => dateHandler("generationDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Generation Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('uploadDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["uploadDateFrom"]}
                                        onChange={(date: any) => dateHandler("uploadDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Upload Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('uploadDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["uploadDateTo"]}
                                        minDate={new Date(dates["uploadDateFrom"])}
                                        onChange={(date: any) => dateHandler("uploadDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Upload Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('shareDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["shareDateFrom"]}
                                        onChange={(date: any) => dateHandler("shareDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Share Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('shareDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["shareDateTo"]}
                                        minDate={new Date(dates["shareDateFrom"])}
                                        onChange={(date: any) => dateHandler("shareDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Share Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('requestedDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["requestedDateFrom"]}
                                        onChange={(date: any) => dateHandler("requestedDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Requested Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('requestedDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["requestedDateTo"]}
                                        minDate={new Date(dates["requestedDateFrom"])}
                                        onChange={(date: any) => dateHandler("requestedDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Requested Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('ReceiveDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["receivedDateFrom"]}
                                        onChange={(date: any) => dateHandler("receivedDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Received Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('ReceiveDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["receivedDateTo"]}
                                        minDate={new Date(dates["receivedDateFrom"])}
                                        onChange={(date: any) => dateHandler("receivedDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Received Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('dueDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["dueDateFrom"]}
                                        onChange={(date: any) => dateHandler("dueDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Due Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('dueDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["dueDateTo"]}
                                        minDate={new Date(dates["dueDateFrom"])}
                                        onChange={(date: any) => dateHandler("dueDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Due Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('fulfillmentDateFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["fulfillmentDateFrom"]}
                                        onChange={(date: any) => dateHandler("fulfillmentDateFrom", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Fulfillment Date From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('fulfillmentDateTo')
                                && <Col sm={6} className="my-1 mt-4">
                                    <DatePicker
                                        format={'MM/dd/yyyy'}
                                        className="select_custom white"
                                        monthPlaceholder={'mm'}
                                        dayPlaceholder={'dd'}
                                        value={dates["fulfillmentDateTo"]}
                                        minDate={new Date(dates["fulfillmentDateFrom"])}
                                        onChange={(date: any) => dateHandler("fulfillmentDateTo", date)}
                                        yearPlaceholder={'yyyy'} />
                                    <Form.Label className="label_custom white">Fulfillment Date To</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('requestedFrom')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Typeahead
                                        isLoading={loading}
                                        id="public-methods-example"
                                        labelKey="modifiedFirstName"
                                        multiple
                                        ref={requestFromRef}
                                        className="input_custom_type_ahead"
                                        allowNew={true}
                                        newSelectionPrefix='Not a Platform User: '
                                        onChange={(selected) => {
                                            let selectedUpdated = selected.map((s: any) => {
                                                if (s.customOption) {
                                                    return s.firstName
                                                }
                                                return s.loginKey
                                            })
                                            setRequestedFromSelected(selectedUpdated)
                                        }}
                                        options={users}
                                    />
                                    <Form.Label className="label_custom white">Requested From</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('requestedBy')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Typeahead
                                        isLoading={loading}
                                        id="public-methods-example"
                                        labelKey="modifiedFirstName"
                                        ref={requestByRef}
                                        className="input_custom_type_ahead"
                                        allowNew={true}
                                        newSelectionPrefix='Not a Platform User: '
                                        onChange={(selected) => {
                                            let selectedUpdated = selected.map((s: any) => {
                                                return s.firstName
                                            })
                                            setRequestedBySelected(selectedUpdated)
                                        }}
                                        options={users}
                                    />
                                    <Form.Label className="label_custom white">Requested By</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('requestedStatus')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Form.Control
                                        as="select"
                                        name="requested_status"
                                        className="select_custom">
                                        <option></option>
                                        {
                                            [
                                                {
                                                    shortCode: 'open',
                                                    value: 'Open'
                                                },
                                                {
                                                    shortCode: 'fulfilled',
                                                    value: 'Fulfilled'
                                                }
                                            ].map((agency: any, index: number) => {
                                                return (
                                                    <option
                                                        key={`agency_${index}`}
                                                        value={agency.shortCode}
                                                    >
                                                        {agency.value}
                                                    </option>
                                                )
                                            })
                                        }
                                    </Form.Control>
                                    <Form.Label className="label_custom white">Requested Status</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('shareBy')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Typeahead
                                        isLoading={loading}
                                        id="public-methods-example"
                                        labelKey="modifiedFirstName"
                                        ref={sharedByRef}
                                        className="input_custom_type_ahead"
                                        newSelectionPrefix='Not a Platform User: '
                                        onChange={(selected) => {
                                            let selectedUpdated = selected.map((s: any) => {
                                                return s.firstName
                                            })
                                            setSharedBySelected(selectedUpdated)
                                        }}
                                        options={users}
                                    />
                                    <Form.Label className="label_custom white">Shared By</Form.Label>
                                </Col>
                            }
                            {
                                FIELD_MAPPER[parentComponent].includes('shareWith')
                                && <Col sm={6} className="my-1 mt-4">
                                    <Typeahead
                                        isLoading={loading}
                                        id="public-methods-example"
                                        labelKey="modifiedFirstName"
                                        ref={sharedWithRef}
                                        className="input_custom_type_ahead"
                                        newSelectionPrefix='Not a Platform User: '
                                        onChange={(selected) => {
                                            let selectedUpdated = selected.map((s: any) => {
                                                return s.firstName
                                            })
                                            setSharedWithSelected(selectedUpdated)
                                        }}
                                        options={users}
                                    />
                                    <Form.Label className="label_custom white">SharedWith</Form.Label>
                                </Col>
                            }
                        </Row>
                    </Col>
                    <Col className={`${Styles.button_right} mt-4 no_padding`}>
                        <Col>
                            <Button variant="dark" type="submit">Search</Button>{" "}
                            <Button variant="dark" onClick={() => handleReset()}>Reset</Button>{" "}
                            <Button variant="" onClick={() => setShowAdvanceSearch(false)}>Cancel</Button>{ }
                        </Col>
                    </Col>
                </Form >
            </div >
        </Col >
    )
}

export default AdvanceSearch