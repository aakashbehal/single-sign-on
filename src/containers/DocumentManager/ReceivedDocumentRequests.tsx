import { useEffect, useState } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";
import { ReceiveDocumentRequestActionCreator } from "../../store/actions/receivedDocumentRequest.actions";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";


const ReceivedDocumentRequests = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('requestDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [details, setDetails] = useState<any>(null);
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [columnsSaved, setColumnsSaved] = useState<any>([])
    let [searchObj, text, isAdvanceSearch, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

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
        setInitObj({
            pageSize: pageSize,
            pageNumber: pageNumber,
            textSearch: null,
            sortOrder: sortType,
            sortParam: sortElement
        })
        dispatch(MiscActionCreator.getColumnForAllTables('receiveDocumentRequest'))
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
        // if (sendRequestSuccess) {
        //     addToast(createMessage('success', `Sent`, 'Document Request'), { appearance: 'success', autoDismiss: true });
        //     setShowRequestNewDocument(false);
        //     search(pageCount, currentPage)
        // }
        // if (sendRequestError) { addToast(createMessage('error', `sending`, 'document request'), { appearance: 'error', autoDismiss: false }); }
        if (deleteRequestSuccess) {
            addToast(createMessage('success', `deleted`, 'Required Documents'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            search(pageSize, pageNumber)
        }
        if (deleteRequestError) { addToast(createMessage('error', `deleting`, 'required Documents'), { appearance: 'error', autoDismiss: false }); }
    }, [
        // sendRequestSuccess,
        // sendRequestError,
        deleteRequestSuccess,
        deleteRequestError])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        searchObj = { ...searchObj, textSearch: text, pageSize, pageNumber, sortParam: sortElement, sortOrder: sortType }
        dispatch(ReceiveDocumentRequestActionCreator.getReceiveDocumentRequest(searchObj))
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
        dispatch(ReceiveDocumentRequestActionCreator.deleteDocumentRequest(details.id))
        dispatch(SummaryActionCreator.reRender())
    }

    const handleDetails = (document: any) => {
        setDetails(document)
        setShowDeleteConfirm(true)
    }

    const downloadHandler = async (document: any) => {
        //download file
        // addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
        // await downloadSignedFile(document)
        // // dispatch(DownloadHistoryActionCreator.saveDownloadHistory([document.fullFilledDocument]))
        // addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
        dispatch(MyDocumentsActionCreator.downloadDocument([document.id]))
    }

    const fulFillHandler = () => {
        search(pageSize, pageNumber)
        dispatch(SummaryActionCreator.reRender())
    }

    return (<>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'receiveDocumentRequest'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag: any) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
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
                sortElement={(header: any) => setSortElement(header)}
                sortType={(type: any) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'receiveDocumentRequest'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data: any) => downloadHandler(data),
                        upload: (data: any) => {
                            setDetails(data)
                            setUploadDocModal(true)
                        },
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

