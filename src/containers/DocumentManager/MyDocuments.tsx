import { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { useDispatch, useSelector } from "react-redux";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import { useHistory } from "react-router-dom";
import { checkIfAdvanceSearchIsActive, createZipForFolderDownload } from "../../helpers/util";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";
import AdvanceSearch from "../../components/Common/AdvanceSearch";

const MyDocuments = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const { addToast } = useToasts();
    const [sortElement, setSortElement] = useState('modifiedDate')
    const [sortType, setSortType] = useState('desc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [advanceSearchObj, setAdvanceSearchObj] = useState({});
    const [columnsSaved, setColumnsSaved] = useState<any>([]);
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);

    const { folders,
        columns,
        totalCount,
        error,
        loading,
        defaultColumns
    } = useSelector((state: any) => ({
        folders: state.myDocuments.folders.data,
        columns: state.myDocuments.folders.columns,
        totalCount: state.myDocuments.folders.totalCount,
        error: state.myDocuments.folders.error,
        loading: state.myDocuments.folders.loading,
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

    const showDocumentListPage = (data) => {
        history.push({
            pathname: '/documents/document_list',
            search: `account_id=${data.folderName}`,
        });
    }

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
            folderName: textValue,
            sortOrder: sort,
            sortParam: column
        }
        if (!checkIfAdvanceSearchIsActive(advanceSearchObj)) {
            searchObj = { ...searchObj, ...advanceSearchObj }
        }
        dispatch(MyDocumentsActionCreator.getMyDocumentFolders(searchObj))
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

    const downloadDocument = async (document) => {
        addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
        await createZipForFolderDownload(document.documentPaths, document.folderName)
        addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
    }


    return (<>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'myDocuments'}
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
                handleNavigate={(data, column) => showDocumentListPage(data)}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'myDocuments'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data) => downloadDocument(data),
                        share: (data) => console.log(`share action`),
                        view: (data) => showDocumentListPage(data),
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

