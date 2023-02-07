import { useState, useEffect } from "react";
import DatePicker from 'react-date-picker';

import { Col, Form, Row, Button, Tab, Tabs } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import Styles from "./DocumentManager.module.sass";
import { useDispatch, useSelector } from "react-redux";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import { useHistory } from "react-router-dom";
import TableComponent from "../../components/Table/Table";
import { DownloadHistoryActionCreator } from "../../store/actions/downloadHistory.actions";
import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";

const DownloadHistory = () => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
    const history = useHistory();
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)

    const {
        data,
        totalCount,
        error,
        loading,
        saveDownload,
        saveDownloadSuccess,
        saveDownloadError,
        deleteDownloadHistory,
        deleteDownloadHistorySuccess,
        deleteDownloadHistoryError
    } = useSelector((state: any) => ({
        data: state.downloadHistory.data,
        totalCount: state.downloadHistory.totalCount,
        error: state.downloadHistory.error,
        loading: state.downloadHistory.loading,
        saveDownload: state.downloadHistory.saveDownload,
        saveDownloadSuccess: state.downloadHistory.saveDownloadSuccess,
        saveDownloadError: state.downloadHistory.saveDownloadError,
        deleteDownloadHistory: state.downloadHistory.deleteDownloadHistory,
        deleteDownloadHistorySuccess: state.downloadHistory.deleteDownloadHistorySuccess,
        deleteDownloadHistoryError: state.downloadHistory.deleteDownloadHistoryError
    }))

    useEffect(() => {
        search(pageCount, currentPage)
    }, [])

    useEffect(() => {
        if (deleteDownloadHistorySuccess) {
            addToast(createMessage('success', `Sent`, 'Document Request'), { appearance: 'success', autoDismiss: true });
            search(pageCount, currentPage)
        }
        if (deleteDownloadHistoryError) {

        }
    }, [deleteDownloadHistorySuccess, deleteDownloadHistoryError])

    const showDocumentListPage = (data, column) => {
        history.push({
            pathname: '/documents/document_list',
            search: `account_id=${data.folderName}`,
        });
    }

    const search = (pageSize = pageCount, pageNumber = 0) => {
        dispatch(DownloadHistoryActionCreator.getDownloadHistory({
            pageSize,
            pageNumber
        }))
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

    return (<>
        <Col>
            <TableComponent
                data={data}
                isLoading={loading}
                map={{
                    documentName: "Document Name",
                    documentsize: "Size",
                    downloadDate: "Download Date",
                    downloadStatus: "Status"
                }}
                totalCount={totalCount}
                actionArray={['folderName']}
                handleNavigate={(data, column) => showDocumentListPage(data, column)}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                parentComponent={'downloadHistory'}
                searchCriteria={{}}
                addEditArray={
                    {
                        pause: (data) => console.log(`pause Action`),
                        restartDownload: (data) => console.log(`Restart Download action`),
                        delete: (data) => {
                            dispatch(DownloadHistoryActionCreator.deleteDownloadHistory(data.id))
                        }
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>
    </>)
}

export default DownloadHistory;