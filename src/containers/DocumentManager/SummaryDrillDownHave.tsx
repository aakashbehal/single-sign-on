import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import TableComponent from "../../components/Table/Table";
import { MyDocumentsActionCreator } from "../../store/actions/myDocuments.actions";
import ViewDocument from "../../components/modal/ViewDocument";
import AdvanceSearch from "../../components/Common/AdvanceSearch";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import AdvanceSearchHook from "../../components/CustomHooks/AdvanceSearchHook";

const SummaryDrillDownHave = ({ location }) => {
    const dispatch = useDispatch();
    const params = location.search.replace("?", "");
    const searchParams = JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
    const [sortElement, setSortElement] = useState('uploadDate')
    const [sortType, setSortType] = useState('desc');
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [showDocument, setShowDocument] = useState(false)
    const [documentToShow, setDocumentToShow] = useState(null);
    const [columnsSaved, setColumnsSaved] = useState<any>([]);
    let [searchObj, { setInitObj, textSearch, advanceSearch, resetHandler }] = AdvanceSearchHook()

    const {
        documents,
        totalCount,
        error,
        columns,
        loading,
        defaultColumns
    } = useSelector((state: any) => ({
        documents: state.summary.summaryDocuments.data,
        totalCount: state.summary.summaryDocuments.totalCount,
        error: state.summary.summaryDocuments.error,
        columns: state.summary.summaryDocuments.columns,
        loading: state.summary.summaryDocuments.loading,
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
        dispatch(SummaryActionCreator.getSummaryDrillDown(searchObj))
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
                    parentComponent={'documentSummary'}
                    Styles={Styles}
                    showAdvanceSearch={showAdvanceSearch}
                    setShowAdvanceSearch={(flag) => setShowAdvanceSearch(flag)}
                    textSearchHook={textSearch}
                    searchObj={searchObj}
                    advanceSearchHook={advanceSearch}
                    resetHandlerHook={resetHandler}
                />
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
                    uploadDate: "Upload Date",
                    fileSize: "File Size",
                    sharedBy: "Shared By",
                }}
                totalCount={totalCount}
                actionArray={['fileName']}
                handleNavigate={(data) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header) => setSortElement(header)}
                sortType={(type) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'documentSummary'}
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
            showDocument &&
            <ViewDocument show={showDocument} onHide={() => setShowDocument(false)} documentData={documentToShow} />
        }
    </>)
}

export default SummaryDrillDownHave