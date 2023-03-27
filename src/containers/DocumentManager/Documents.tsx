import { useEffect, useMemo, useReducer, useState } from "react";
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import Styles from "./DocumentManager.module.sass";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs"
import MyDocuments from "./MyDocuments";
import ReceivedDocumentRequests from "./ReceivedDocumentRequests";
import SentDocumentRequests from "./SentDocumentRequests";
import DownloadHistory from "./DownloadHistory";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import DocumentRequirement from "./DocumentRequirement";
import DocumentCoverage from "./DocumentCoverage";
import { commonServices } from "../../services";
import SkeletonLoading from "../../helpers/skeleton-loading";

const usageReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USAGE_LOADING':
            return {
                ...state,
                loading: true,
                error: false
            }
        case 'SET_USAGE_SUCCESS':
            return {
                ...state,
                loading: false,
                ...action.payload
            }
        case 'SET_USAGE_ERROR':
            return {
                ...state,
                loading: false,
                error: true
            }
        default:
            return state
    }
}

const initState = { used: '', percentage: 0, total: '', totalDocument: 0, loading: false, error: false }

const Documents = ({ location }) => {
    const history = useHistory();
    const dispatch = useDispatch()
    const [collapse, setCollapse] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');
    const [usage, setUsage] = useReducer(usageReducer, initState);

    useEffect(() => {
        dispatch(MiscActionCreator.getColumnForAllTables())
        getUsage()
    }, [])

    useEffect(() => {
        const tab = location.pathname.split('/')
        setSelectedTab(tab[tab.length - 1])
    }, [location])

    const getUsage = async () => {
        try {
            setUsage({ type: 'SET_USAGE_LOADING' })
            const usage = await commonServices.getUsage()
            setUsage({ type: 'SET_USAGE_SUCCESS', payload: { ...usage, percentage: 30 } })
        } catch (error) {
            setUsage({ type: 'SET_USAGE_ERROR' })
        }
    }

    const documentSummary = () => {
        return <Col sm={12} className="form_container">
            <Row>
                <Col sm={11}><h4 style={{ marginLeft: '1rem' }}>Document Summary</h4></Col>
                <Col sm={1} style={{ textAlign: 'right', paddingRight: '2rem', cursor: 'pointer' }} onClick={() => setCollapse((collapse) => !collapse)}>
                    {!collapse && <BsArrowsAngleContract size={20} />}
                    {collapse && <BsArrowsAngleExpand size={20} />}
                </Col>
            </Row>
            <Col sm={12} className={collapse ? Styles.collapse_summary : ''}>
                <Row>
                    <Col sm={5} >
                        <DocumentCoverage collapse={collapse} />
                    </Col >
                    <Col sm={5}  >
                        <DocumentRequirement collapse={collapse} />
                    </Col>
                    <Col sm={2} >
                        <Col className={Styles.inner_document_summary}
                            style={{
                                borderWidth: collapse ? '0' : '1px',
                                background: collapse ? '#e9ecef' : 'white'
                            }}>
                            <h5>Usage</h5>
                            <br />
                            {
                                !usage.error && usage.loading &&
                                <SkeletonLoading repeats={1} />
                            }
                            {
                                !usage.error && !usage.loading &&
                                <Col sm={12} className="no_padding">
                                    <div className={Styles.progress_container}>
                                        <ProgressBar striped={false} className={Styles.progressbar} now={usage.percentage} label={`${usage.percentage}%`} />
                                        <br />
                                        <p><b>{(usage.used).toUpperCase()} used out of {usage.total}</b></p>
                                        <p><b>Total {usage.totalDocument} document{usage.totalDocument > 1 ? "s" : ""}</b></p>
                                        <Button variant="dark">Upgrade Your Plan</Button>
                                    </div>
                                </Col>
                            }
                        </Col>
                    </Col>
                </Row >
            </Col >
        </Col >
    }
    const handleSelect = (e) => {
        history.push({
            pathname: `/documents/${e}`
        });
    }
    return (
        <>
            {
                documentSummary()
            }
            <br />
            <Col className="no_padding">
                <Tabs
                    activeKey={selectedTab}
                    id="fill-tab-example"
                    fill
                    className="mb-3"
                    onSelect={handleSelect}
                >
                    <Tab eventKey="my_documents" title="My Documents">
                        {selectedTab === "my_documents" && <MyDocuments />}
                    </Tab>
                    <Tab eventKey="sent_document_requests" title="Sent Document Requests">
                        {selectedTab === "sent_document_requests" && <SentDocumentRequests />}
                    </Tab>
                    <Tab eventKey="received_document_requests" title="Received Document Request">
                        {selectedTab === "received_document_requests" && <ReceivedDocumentRequests />}
                    </Tab>
                    <Tab eventKey="download_history" title="Download History">
                        {selectedTab === "download_history" && <DownloadHistory />}
                    </Tab>
                    {/*<Tab eventKey="templates" title="">
                    </Tab> */}
                </Tabs >
            </Col >
        </>
    )
};

export default Documents