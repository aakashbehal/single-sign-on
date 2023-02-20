import { useEffect, useRef, useState } from "react";
import DatePicker from 'react-date-picker';
import { Typeahead } from "react-bootstrap-typeahead"
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs, Modal, Container } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash"

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import { SentDocumentRequestActionCreator } from "../../store/actions/sentDocumentRequest.actions";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";
import { ReceiveDocumentRequestActionCreator } from "../../store/actions/receivedDocumentRequest.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { checkIfAdvanceSearchIsActive, getSignedURL } from "../../helpers/util";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import AdvanceSearch from "../../components/Common/AdvanceSearch";

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]

const ReceivedDocumentRequests = () => {
    const dispatch = useDispatch();
    const aRef = useRef<any>()
    const { addToast } = useToasts();
    const [tenures, setTenures] = useState(tenuresInit)
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('requestDate')
    const [sortType, setSortType] = useState('desc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [showBulkRequest, setShowBulkRequest] = useState(false)
    const [showRequestNewDocument, setShowRequestNewDocument] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [details, setDetails] = useState<any>(null);
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [advanceSearchObj, setAdvanceSearchObj] = useState({});
    const [columnsSaved, setColumnsSaved] = useState<any>([])

    const {
        receiveDocumentRequests,
        totalCount,
        columns,
        loading,
        error,
        downloadRequest,
        downloadRequestSuccess,
        downloadRequestError,
        deleteRequest,
        deleteRequestSuccess,
        deleteRequestError,
        defaultColumns
    } = useSelector((state: any) => ({
        receiveDocumentRequests: state.receiveDocumentRequest.data,
        totalCount: state.receiveDocumentRequest.totalCount,
        columns: state.receiveDocumentRequest.columns,
        loading: state.receiveDocumentRequest.loading,
        error: state.receiveDocumentRequest.error,
        downloadRequest: state.receiveDocumentRequest.downloadRequest,
        downloadRequestSuccess: state.receiveDocumentRequest.downloadRequestSuccess,
        downloadRequestError: state.receiveDocumentRequest.downloadRequestError,
        deleteRequest: state.receiveDocumentRequest.deleteRequest,
        deleteRequestSuccess: state.receiveDocumentRequest.deleteRequestSuccess,
        deleteRequestError: state.receiveDocumentRequest.deleteRequestError,
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

    const search = (
        pageSize = pageCount,
        pageNumber = 1,
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
        dispatch(ReceiveDocumentRequestActionCreator.getReceiveDocumentRequest(searchObj))
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
        dispatch(ReceiveDocumentRequestActionCreator.deleteDocumentRequest(details.id))
        dispatch(SummaryActionCreator.reRender())
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

    const fulFillHandler = () => {
        search()
        dispatch(SummaryActionCreator.reRender())
    }

    return (<>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'receiveDocumentRequest'}
                    Styles={Styles}
                    searchHandler={(criteria) => search(pageCount, 1, criteria)}
                    setAdvanceSearchObj={(obj) => setAdvanceSearchObj(obj)}
                    advanceSearchObj={advanceSearchObj}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag) => setShowAdvanceSearch(flag)}
                />
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
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data) => downloadHandler(data),
                        upload: (data) => setUploadDocModal(true),
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
            uploadDocModal
            && <DocumentUpload
                show={uploadDocModal}
                onHide={() => setUploadDocModal(false)}
                accountId={123}
                Styles={Styles}
                parentComponent="receiveDocumentRequest"
                search={() => fulFillHandler()}
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
        {
            showDocument &&
            <ViewDocument show={showDocument} onHide={() => setShowDocument(false)} documentData={documentToShow} />
        }
    </>)
}

export default ReceivedDocumentRequests

