import { useState, useEffect } from "react";
import { Col, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import DocumentUpload from "../../components/modal/DocumentUpload";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";

const SummaryDrillDownNotHave = ({ location }) => {
    const dispatch = useDispatch();
    const params = location.search.replace("?", "");
    const searchParams = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('uploadDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [uploadDocModal, setUploadDocModal] = useState(false)
    const [uploadDocModalRequest, setUploadDocModalRequest] = useState(false)
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [columnsSaved, setColumnsSaved] = useState<any>([])
    let [searchObj, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    const {
        documents,
        totalCount,
        error,
        columns,
        loading,
        defaultColumns
    } = useSelector((state: any) => ({
        documents: state.summary.summaryDocumentsNot.data,
        totalCount: state.summary.summaryDocumentsNot.totalCount,
        error: state.summary.summaryDocumentsNot.error,
        columns: state.summary.summaryDocumentsNot.columns,
        loading: state.summary.summaryDocumentsNot.loading,
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
                if (dC.tableName === 'accounts') {
                    return dC
                }
            })
            setColumnsSaved(columns[0].columnNames)
        } else {
            setColumnsSaved(columns)
        }
    }, [columns])

    const search = (
        pageSize,
        pageNumber
    ) => {
        searchObj = { ...searchObj, pageSize, pageNumber, docTypeCode: searchParams.docTypeCode, sortParam: sortElement, sortOrder: sortType }
        dispatch(SummaryActionCreator.getSummaryDrillDownNot(searchObj))
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

    return (<>
        <Col sm={12}>
            <Row>
                <AdvanceSearch
                    parentComponent={'documentNotSummary'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
                />
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModalRequest(true)}>Request {searchParams.docTypeCode} for {searchParams.inComplete} Accounts</Button>
                </Col>
                <Col md={2} sm={2}>
                    <Button variant="dark" style={{ width: "100%" }} onClick={() => setUploadDocModal(true)}>Upload {searchParams.docTypeCode} for {searchParams.inComplete} Accounts</Button>
                </Col>
            </Row>
            <br />
        </Col>
        <Col>
            <TableComponent
                data={documents}
                isLoading={loading}
                map={{
                    clientAccountNumber: "Client Account Number",
                    originalAccountNumber: "Original Account Number",
                    equabliAccountNumber: "Equabli Account Number",
                    fileName: "File Name",
                    generateDate: "Generation Date",
                    uploadDate: "Upload Date"
                }}
                totalCount={totalCount}
                actionArray={[]}
                handleNavigate={(data) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'documentNotSummary'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data) => console.log(data),
                    }
                }
                handleDocumentManagerSummary={searchParams}
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}
            ></TableComponent>
        </Col>
        {
            uploadDocModalRequest
            && <DocumentUpload
                show={uploadDocModalRequest}
                onHide={() => setUploadDocModalRequest(false)}
                accountId={123} Styles={Styles}
                parentComponent="documentNotSummary_request"
                search={search}
                details={{
                    ...searchParams,
                    pageSize: totalCount
                }}
            />
        }
        {
            uploadDocModal
            && <DocumentUpload
                show={uploadDocModal}
                onHide={() => setUploadDocModal(false)}
                accountId={123} Styles={Styles}
                parentComponent="documentNotSummary"
                search={search}
                details={{
                    ...searchParams,
                    pageSize: totalCount
                }}
            />
        }
        {
            showDocument &&
            <ViewDocument
                show={showDocument}
                onHide={() => setShowDocument(false)}
                documentData={documentToShow}
            />
        }
    </>)
}

export default SummaryDrillDownNotHave