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
import { checkIfAdvanceSearchIsActive, downloadSignedFile } from "../../helpers/util";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import { createMessage } from "../../helpers/messages";
import DeleteConfirm from "../../components/modal/DeleteConfirm";
import Share from "../../components/modal/Share";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";


const DocumentsList = ({ location }) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const aRef = useRef<any>()
    const params = new URLSearchParams(location.search);
    const AccountId = params.get('account_id');
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
    let [searchObj, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    const {
        documents,
        totalCount,
        error,
        columns,
        loading,
        defaultColumns,
        deleteRequest,
        deleteSuccess,
        deleteError
    } = useSelector((state: any) => ({
        documents: state.myDocuments.documents.data,
        totalCount: state.myDocuments.documents.totalCount,
        error: state.myDocuments.documents.error,
        columns: state.myDocuments.documents.columns,
        loading: state.myDocuments.documents.loading,
        defaultColumns: state.misc.allTableColumns.data,
        deleteRequest: state.myDocuments.documents.deleteRequest,
        deleteSuccess: state.myDocuments.documents.deleteSuccess,
        deleteError: state.myDocuments.documents.deleteError
    }))

    useEffect(() => {
        setInitObj({
            pageSize: pageSize,
            pageNumber: pageNumber,
            textSearch: null,
            sortOrder: sortType,
            sortParam: sortElement
        })
        return () => {
            dispatch(MyDocumentsActionCreator.resetDocumentList())
        }
    }, []);

    useEffect(() => {
        if (searchObj !== null) {
            search(pageSize, pageNumber)
        }
    }, [searchObj, sortElement, sortType])

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
        pageSize,
        pageNumber
    ) => {
        searchObj = { ...searchObj, pageSize, pageNumber, accountNumber: AccountId, sortParam: sortElement, sortOrder: sortType }
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

    const downloadHandler = async (document) => {
        //download file
        addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
        await downloadSignedFile(document)
        addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
    }

    const handleDetails = (document) => {
        setDetails(document)
        setShowDeleteConfirm(true)
    }

    const deleteAlert = () => {
        dispatch(MyDocumentsActionCreator.deleteDocument(details.id))
    }

    return (<>
        <a href="" ref={aRef} target="_self"></a>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'documents'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag) => setShowAdvanceSearch(flag)}
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
                data={documents}
                isLoading={loading}
                map={{
                    documentName: "Name",
                    documentType: "Document Type",
                    originalAccountNo: "Original Account Number",
                    equabliAccountNo: "Equabli Account Number",
                    clientAccountNo: "Client Account Number",
                    generateDate: "Generated Date",
                    uploadDate: "Upload Date",
                    shareDate: "Share Date",
                    receiveDate: "Receive Date",
                    fileSize: "File Size",
                    sharedBy: "Shared By",
                    sharedWith: "Shared With",
                }}
                totalCount={totalCount}
                actionArray={['documentName']}
                handleNavigate={(data) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'documents'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data) => downloadHandler(data),
                        share: (data) => setShowShare(data),
                        view: (data) => {
                            setShowDocument(true)
                            setDocumentToShow(data)
                        },
                        delete: (data) => handleDetails(data)
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
    </>)
}

export default DocumentsList

