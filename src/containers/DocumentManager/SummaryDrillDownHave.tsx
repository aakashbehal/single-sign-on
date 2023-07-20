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
import { MiscActionCreator } from "../../store/actions/common/misc.actions";

const SummaryDrillDownHave = ({ location }: { location: any }) => {
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
        dispatch(MiscActionCreator.getColumnForAllTables('accounts'))
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
            setColumnsSaved(defaultColumns)
        } else {
            setColumnsSaved(columns)
        }
    }, [columns])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        searchObj = {
            ...searchObj, pageSize, pageNumber, sortParam: sortElement, sortOrder: sortType, ...searchParams
        }
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
                    setShowAdvanceSearch={(flag: any) => setShowAdvanceSearch(flag)}
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
                    documentName: "File Name",
                    generateDate: "Generation Date",
                    uploadDate: "Upload Date",
                    fileSize: "File Size",
                    sharedBy: "Shared By",
                }}
                totalCount={totalCount}
                actionArray={['documentName']}
                handleNavigate={(data: any) => {
                    setShowDocument(true)
                    setDocumentToShow(data)
                }}
                currencyColumns={[]}
                sortElement={(header: any) => setSortElement(header)}
                sortType={(type: any) => setSortType(type)}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'documentSummary'}
                searchCriteria={{}}
                hideShareArray={columnsSaved}
                addEditArray={
                    {
                        download: (data: any) => console.log(data),
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