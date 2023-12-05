import { useEffect, useState } from "react";
import { Col, ProgressBar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AiFillWarning } from "react-icons/ai";
import { useHistory } from "react-router-dom";

import Styles from "./DocumentManager.module.sass";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import SummaryFilters from "../../components/Common/SummaryFilters";
import SkeletonLoading from "../../helpers/skeleton-loading";
import NoRecord from "../../components/Common/NoResult";


const DocumentCoverage = ({ collapse }: any) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [searchObj, setSearchObj] = useState({
        duration: null,
        product: null,
        portfolio: null,
        userId: null
    })

    const {
        documentCoverage,
        loadingCoverage,
        errorCoverage
    } = useSelector((state: any) => ({
        documentCoverage: state.summary.documentCoverage,
        loadingCoverage: state.summary.loadingCoverage,
        errorCoverage: state.summary.errorCoverage
    }))

    useEffect(() => {
        return () => {
            dispatch(SummaryActionCreator.resetDocumentSummary())
        }
    }, [])

    useEffect(() => {
        dispatch(SummaryActionCreator.getDocumentCoverage(searchObj))
    }, [searchObj])

    const drillDownHandler = (data: any) => {
        let searchObjTemp = { ...searchObj, ...data }
        const params = new URLSearchParams(searchObjTemp).toString();
        history.push({
            pathname: '/documents/accounts_documents',
            search: params,
        });
    }

    const textHandler = (dC: any) => {
        let documentType = dC.documentType;
        if (documentType.slice(-1) !== 's') {
            documentType += 's'
        }
        return <p className={Styles.ProgressDesc}><span className={Styles.clickable} onClick={() => drillDownHandler(dC)}>{dC.complete}</span> out of <b>{dC.total}</b> accounts have <b>{documentType}</b></p>
    }

    return (
        <Col sm={12} className={Styles.inner_document_summary}
            style={{
                borderWidth: collapse ? '0' : '1px',
                background: collapse ? '#e9ecef' : 'white'
            }}>
            <h5>Document Coverage</h5>
            <br />
            <SummaryFilters searchObj={searchObj} setSearchObj={setSearchObj} />
            <hr />
            {errorCoverage &&
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id={`tooltip-error`}>
                            Error in fetching
                        </Tooltip>
                    }
                >
                    <AiFillWarning size={20} className={Styles.details_warning} />
                </OverlayTrigger>
            }
            <Col sm={12} className={`no_padding ${Styles.progress_container_outer}`}>
                {
                    !errorCoverage && loadingCoverage &&
                    <SkeletonLoading repeats={3} />
                    // <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                }
                {
                    !errorCoverage && !loadingCoverage && documentCoverage.length === 0 &&
                    <NoRecord />
                    // <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                }
                {
                    !loadingCoverage && documentCoverage && documentCoverage.length > 0
                    && documentCoverage.map((dC: any, index: any) => {
                        // if (dC.total) {
                        return (
                            <div key={`dC_${index}`} className={`${Styles.progress_container}`}>
                                <p className={Styles.ProgressTitle}><b>{dC.title}</b></p>
                                <ProgressBar className={Styles.progressbar} now={dC.percentage} label={`${dC.percentage}% `} />
                                {textHandler(dC)}
                                <hr />
                            </div>
                        )
                        // }
                    })
                }
            </Col>
        </Col >
    )
}

export default DocumentCoverage