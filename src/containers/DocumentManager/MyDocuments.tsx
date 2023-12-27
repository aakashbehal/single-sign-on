import { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import { createZipForFolderDownload, downloadFromLink } from "../../helpers/util";
import { createMessage } from "../../helpers/messages";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import Share from "../../components/modal/Share";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";

const MyDocuments = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const { addToast } = useToasts();
    const [sortElement, setSortElement] = useState('modifiedDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [columnsSaved, setColumnsSaved] = useState<any>([]);
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [showShare, setShowShare] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [details, setDetails] = useState<any>(null);
    let [searchObj, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    const { folders,
        columns,
        totalCount,
        error,
        loading,
        defaultColumns,
        deleteRequest,
        deleteSuccess,
        deleteError,
        downloadRequest,
        downloadError,
        downloadSuccess,
        downloadLinks
    } = useSelector((state: any) => ({
        folders: state.myDocuments.folders.data,
        columns: state.myDocuments.folders.columns,
        totalCount: state.myDocuments.folders.totalCount,
        error: state.myDocuments.folders.error,
        loading: state.myDocuments.folders.loading,
        defaultColumns: state.misc.allTableColumns.data,
        deleteRequest: state.myDocuments.folders.deleteRequest,
        deleteSuccess: state.myDocuments.folders.deleteSuccess,
        deleteError: state.myDocuments.folders.deleteError,
        downloadRequest: state.myDocuments.folderDownload.loading,
        downloadError: state.myDocuments.folderDownload.error,
        downloadSuccess: state.myDocuments.folderDownload.success,
        downloadLinks: state.myDocuments.folderDownload.downloadLinks
    }))

    useEffect(() => {
        setInitObj({
            pageSize: pageSize,
            pageNumber: pageNumber,
            textSearch: null,
            sortOrder: sortType,
            sortParam: sortElement
        })
        dispatch(MiscActionCreator.getColumnForAllTables('documentFolder'))
    }, [])

    useEffect(() => {
        console.log(`--searchObj--`, searchObj)
        if (searchObj !== null) {
            if (searchObj.textSearch !== null && searchObj.textSearch !== '') {
                setPageNumber(1)
                searchText(pageSize, 1)
            } else {
                search(pageSize, pageNumber)
            }
        }
    }, [searchObj, sortElement, sortType])

    useEffect(() => {
        if (!loading && columns.length === 0 && (defaultColumns && defaultColumns.length > 0)) {
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

    useEffect(() => {
        if (!downloadRequest && downloadSuccess && downloadLinks) {
            downloadLinks.map((dL: string) => {
                downloadFromLink(dL)
            })
            dispatch(MyDocumentsActionCreator.restDownloadFolder())
        }
    }, [downloadRequest, downloadError, downloadSuccess, downloadLinks])

    const showDocumentListPage = (data: any) => {
        history.push({
            pathname: '/documents/document_list',
            search: `account_id=${data.folderName}&dgc=${data.docGroupCode}`,
        });
    }

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        searchObj = { ...searchObj, pageSize, pageNumber, sortParam: sortElement, sortOrder: sortType }
        dispatch(MyDocumentsActionCreator.getMyDocumentFolders(searchObj))
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

    const downloadDocument = async (document: any) => {
        dispatch(MyDocumentsActionCreator.downloadFolder([document.folderName]))
    }

    const handleDetails = (document: any) => {
        setDetails(document)
        setShowDeleteConfirm(true)
    }

    const deleteHandler = () => {
        dispatch(MyDocumentsActionCreator.deleteFolder(details.folderName))
    }

    return (<>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'myDocuments'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag: any) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
                />
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
                    "docGroupName": "Document Group",
                    "fileSize": "Size",
                    "modifiedDate": "Modified Date",
                    "lastShareDate": "Last Shared Date",
                    "receiveDate": "Received Date",
                    "shareBy": "Shared By",
                    "sharedWith": "Shared With"
                }}
                totalCount={totalCount}
                actionArray={['folderName']}
                handleNavigate={(data: any, column: any) => showDocumentListPage(data)}
                currencyColumns={[]}
                sortElement={(header: any) => setSortElement(header)}
                sortType={(type: any) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'myDocuments'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data: any) => downloadDocument(data),
                        share: (data: any) => setShowShare(data),
                        view: (data: any) => showDocumentListPage(data),
                        delete: (data: any) => handleDetails(data)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>
        {
            showDeleteConfirm
            && <DeleteConfirm
                show={showDeleteConfirm}
                onHide={() => setShowDeleteConfirm(false)}
                confirmDelete={() => deleteHandler()}
                details={details}
                type='myDocument'
            />
        }
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
        {
            showShare
            && <Share
                show={showShare}
                parentComponent="myDocument"
                searchHandler={() => search(pageSize, pageNumber)}
                onHide={() => setShowShare(null)}
            />
        }
    </>)
}

export default MyDocuments

