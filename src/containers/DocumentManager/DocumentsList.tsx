import { useState, useEffect, useRef } from "react";
import { saveAs } from 'file-saver';
import { Col, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import { checkIfAdvanceSearchIsActive, downloadFromLink } from "../../helpers/util";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import { createMessage } from "../../helpers/messages";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import Share from "../../components/modal/Share";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import MoveDocumentModal from "../../components/modal/MoveDocumentModal";
import { useParams } from "react-router-dom";


const DocumentsList = ({ location }: { location: any }) => {
    let documentListMap = {
        name: "Name",
        documentType: "Document Type",
        originalAccountNumber: "Original Account Number",
        equabliAccountNo: "Equabli Account Number",
        clientAccountNumber: "Client Account Number",
        generateDate: "Generated Date",
        uploadDate: "Upload Date",
        shareDate: "Share Date",
        receiveDate: "Receive Date",
        fileSize: "File Size",
        sharedBy: "Shared By",
        sharedWith: "Shared With",
    }
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const aRef = useRef<any>()
    const params = new URLSearchParams(location.search);
    const AccountId = params.get('account_id');
    const { aid }: { aid: string } = useParams();
    const DocumentGroup = params.get('dgc');
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('documentName')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [columnsSaved, setColumnsSaved] = useState<any>([])
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    const [showShare, setShowShare] = useState(null);
    const [moveModalShow, setMoveModalShow] = useState(null)
    const [documentMapList, setDocumentMapList] = useState<any>(documentListMap)
    let [searchObj, text, isAdvanceSearch, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    const {
        documents,
        totalCount,
        error,
        columns,
        loading,
        defaultColumns,
        deleteRequest,
        deleteSuccess,
        deleteError,
        downloadRequest,
        downloadError,
        downloadSuccess,
        downloadLink
    } = useSelector((state: any) => ({
        documents: state.myDocuments.documents.data,
        totalCount: state.myDocuments.documents.totalCount,
        error: state.myDocuments.documents.error,
        columns: state.myDocuments.documents.columns,
        loading: state.myDocuments.documents.loading,
        defaultColumns: state.misc.allTableColumns.data,
        deleteRequest: state.myDocuments.documents.deleteRequest,
        deleteSuccess: state.myDocuments.documents.deleteSuccess,
        deleteError: state.myDocuments.documents.deleteError,
        downloadRequest: state.myDocuments.documentDownload.loading,
        downloadError: state.myDocuments.documentDownload.error,
        downloadSuccess: state.myDocuments.documentDownload.success,
        downloadLink: state.myDocuments.documentDownload.downloadLink
    }))

    useEffect(() => {
        setInitObj({
            pageSize: pageSize,
            pageNumber: pageNumber,
            textSearch: null,
            sortOrder: sortType,
            sortParam: sortElement
        })
        dispatch(MiscActionCreator.getColumnForAllTables('document'))
        if (AccountId === 'Other') {
            let temp = { ...documentMapList, otherReason: 'Error' }
            setDocumentMapList(temp)
        }
        return () => {
            dispatch(MyDocumentsActionCreator.resetDocumentList())
        }
    }, []);

    useEffect(() => {
        if (searchObj !== null) {
            search(pageSize, pageNumber)
        }
    }, [searchObj, text, sortElement, sortType])

    useEffect(() => {
        if (!loading && columns?.length === 0 && (defaultColumns && defaultColumns.length > 0)) {
            setColumnsSaved(defaultColumns)
        } else {
            setColumnsSaved(columns)
        }
    }, [columns])


    useEffect(() => {
        if (deleteSuccess) {
            addToast(createMessage('success', `deleted`, 'Document'), { appearance: 'success', autoDismiss: true });
            setShowDeleteConfirm(false)
            search(pageSize, pageNumber)
        }
        if (deleteError) { addToast(createMessage('error', `deleting`, 'document'), { appearance: 'error', autoDismiss: false }); }
    }, [
        deleteSuccess,
        deleteError])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        searchObj = { ...searchObj, textSearch: text, pageSize, pageNumber, accountNumber: AccountId, docGroupCode: DocumentGroup, sortParam: sortElement, sortOrder: sortType }
        dispatch(MyDocumentsActionCreator.getMyDocumentList(searchObj))
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

    const downloadHandler = async (document: any) => {
        //download file
        // addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
        // await downloadSignedFile(document)
        dispatch(MyDocumentsActionCreator.downloadDocument([document.id]))
        // addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
    }

    useEffect(() => {
        if (!downloadRequest && downloadSuccess && downloadLink) {
            downloadFromLink(downloadLink)
            dispatch(MyDocumentsActionCreator.restDownloadDocument())
        }
    }, [downloadRequest, downloadError, downloadSuccess, downloadLink])

    const handleDetails = (document: any) => {
        setDetails(document)
        setShowDeleteConfirm(true)
    }

    const deleteAlert = () => {
        dispatch(MyDocumentsActionCreator.deleteDocument(details.id))
    }

    const handleDocumentMove = (data: any) => {
        setMoveModalShow(data)
    }

    return (<>
        <a href="" ref={aRef} target="_self"></a>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'documents'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag: any) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
                />
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} disabled={AccountId === 'Other' ? true : false} onClick={() => setUploadDocModal(true)}>Upload Document</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={documents}
                isLoading={loading}
                map={documentMapList}
                totalCount={totalCount}
                actionArray={['name']}
                handleNavigate={(data: any) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header: any) => setSortElement(header)}
                sortType={(type: any) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'documents'}
                searchCriteria={{}}
                hideShareArray={[...columnsSaved, 'otherReason']}
                addEditArray={
                    {
                        download: (data: any) => downloadHandler(data),
                        share: (data: any) => setShowShare(data),
                        view: (data: any) => {
                            setShowDocument(true)
                            setDocumentToShow(data)
                        },
                        delete: (data: any) => handleDetails(data),
                        move: AccountId !== 'Other' ? undefined : (data: any) => handleDocumentMove(data)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col >
        {
            uploadDocModal
            && <DocumentUpload show={uploadDocModal} onHide={() => setUploadDocModal(false)} accountId={123} Styles={Styles} parentComponent="documents" search={search} details={{ accountId: AccountId, docGroupCode: DocumentGroup }} />
        }
        {
            showDocument &&
            <ViewDocument show={showDocument} onHide={() => setShowDocument(false)} documentData={documentToShow} />
        }
        {
            showDeleteConfirm
            && <DeleteConfirm
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                confirmDelete={() => deleteAlert()}
                details={details}
                type='documents'
            />
        }
        {
            showShare
            && <Share
                show={showShare}
                parentComponent="documents"
                onHide={() => setShowShare(null)}
                searchHandler={() => search(pageSize, pageNumber)}
            />
        }
        {
            moveModalShow
            && <MoveDocumentModal
                show={moveModalShow}
                parentComponent="documents"
                onHide={() => setMoveModalShow(null)}
                search={() => search(pageSize, pageNumber)}
                details={moveModalShow}
            />
        }
    </>)
}

export default DocumentsList

