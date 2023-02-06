import { useState, useEffect } from "react";
import DatePicker from 'react-date-picker';

import { Col, Form, Row, Button, Tab, Tabs } from "react-bootstrap";
import { CgOptions, CgSearch } from "react-icons/cg";
import Styles from "./DocumentManager.module.sass";
import { useDispatch, useSelector } from "react-redux";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import { useHistory } from "react-router-dom";
import TableComponent from "../../components/Table/Table";

const DownloadHistory = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)

    const { folders, totalCount, error, loading } = useSelector((state: any) => ({
        folders: state.myDocuments.folders.data,
        totalCount: state.myDocuments.folders.totalCount,
        error: state.myDocuments.folders.error,
        loading: state.myDocuments.folders.loading
    }))

    useEffect(() => {
        search(pageCount, currentPage)
    }, [])

    const showDocumentListPage = (data, column) => {
        history.push({
            pathname: '/documents/document_list',
            search: `account_id=${data.folderName}`,
        });
    }

    const search = (pageSize = pageCount, pageNumber = 0) => {
        // dispatch(MyDocumentsActionCreator.getMyDocumentFolders({
        //     pageSize,
        //     pageNumber
        // }))
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
                data={folders}
                isLoading={false}
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
                        download: (data) => console.log(`download Action`),
                        share: (data) => console.log(`share action`),
                        view: (data) => console.log(`View Action`),
                        delete: (data) => console.log(`Delete Action`)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>
    </>)
}

export default DownloadHistory;