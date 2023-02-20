import { useState, useEffect, useRef } from "react";
import DatePicker from 'react-date-picker';


import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { useDispatch, useSelector } from "react-redux";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { checkIfAdvanceSearchIsActive, dateFormatterForRequestDocManager, getSignedURL } from "../../helpers/util";
import DocumentTypes from "../../components/Common/DocumentType";
import { debounce } from "lodash";
import AdvanceSearch from "../../components/Common/AdvanceSearch";


const DocumentsList = ({ location }) => {
    const dispatch = useDispatch();
    const params = new URLSearchParams(location.search);
    const aRef = useRef<any>()
    const AccountId = params.get('account_id');
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('documentName')
    const [sortType, setSortType] = useState('desc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [advanceSearchObj, setAdvanceSearchObj] = useState({});
    const [columnsSaved, setColumnsSaved] = useState<any>([])

    const {
        documents,
        totalCount,
        error,
        columns,
        loading,
        defaultColumns
    } = useSelector((state: any) => ({
        documents: state.myDocuments.documents.data,
        totalCount: state.myDocuments.documents.totalCount,
        error: state.myDocuments.documents.error,
        columns: state.myDocuments.documents.columns,
        loading: state.myDocuments.documents.loading,
        defaultColumns: state.misc.allTableColumns.data
    }))

    useEffect(() => {
        return () => {
            dispatch(MyDocumentsActionCreator.resetDocumentList())
        }
    }, []);

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

    const search = (pageSize = pageCount, pageNumber = 1, documentName = null, sort = sortType, column = sortElement) => {
        let searchObj: any = {
            pageSize,
            pageNumber,
            accountNumber: AccountId,
            documentName,
            sortOrder: sort,
            sortParam: column
        }
        if (!checkIfAdvanceSearchIsActive(advanceSearchObj)) {
            searchObj = { ...searchObj, ...advanceSearchObj }
        }
        dispatch(MyDocumentsActionCreator.getMyDocumentList(searchObj))
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

    const downloadHandler = async (document) => {
        //download file
        let filePath = await getSignedURL(document.objectKey)
        aRef.current.href = filePath;
        aRef.current.download = document.fileName;
        aRef.current.click();
        dispatch(DownloadHistoryActionCreator.saveDownloadHistory([document.id]))
    }


    return (<>
        <a href="" ref={aRef} target="_blank"></a>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'documents'}
                    Styles={Styles}
                    searchHandler={(criteria) => search(pageCount, 1, criteria)}
                    setAdvanceSearchObj={(obj) => setAdvanceSearchObj(obj)}
                    advanceSearchObj={advanceSearchObj}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag) => setShowAdvanceSearch(flag)}
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
                    uploadDate: "upload Date",
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
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'documents'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
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

