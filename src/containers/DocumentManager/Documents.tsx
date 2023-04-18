import { useEffect, useMemo, useReducer, useState } from "react";
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
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
import { commonServices, userService } from "../../services";
import SkeletonLoading from "../../helpers/skeleton-loading";
import Subscription from "./Subscription";

const usageReducer = (state: any, action: any) => {
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

interface invoice {
    org: string
    amount: number
}

const Documents = ({ location }: { location: any }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [userType, setUserType] = useState<string>()
    const [collapse, setCollapse] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');
    const [usage, setUsage] = useReducer(usageReducer, initState);
    const [showSubscription, setShowSubscription] = useState(false);
    const [invoicing, setInvoicing] = useState<invoice[]>([])

    const {
        connectedUsers
    } = useSelector((state: any) => ({
        connectedUsers: state.users.data,
        loading: state.users.loading,
        error: state.users.error,
    }))

    useEffect(() => {
        let org: any = {}
        let invoicingTemp: invoice[] = []
        connectedUsers.map((user: any) => {
            if (!org[user.orgCode]) {
                org[user.orgCode] = 1
                let amount = 0
                if (user.orgCode === "FRECS") {
                    amount = 80
                } else {
                    amount = 425
                }
                invoicingTemp.push({ org: user.orgCode, amount })
            }
        })
        setInvoicing(invoicingTemp)
    }, [connectedUsers])

    useEffect(() => {
        setUserType(userService.getUserType())
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
            setUsage({ type: 'SET_USAGE_SUCCESS', payload: usage })
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
                                        <Button variant="dark" onClick={() => setShowSubscription(true)}>Upgrade Your Plan</Button>
                                    </div>
                                </Col>
                            }
                        </Col>
                        {
                            userType === 'Client' &&
                            <Col className={Styles.inner_document_summary}
                                style={{
                                    borderWidth: collapse ? '0' : '1px',
                                    background: collapse ? '#e9ecef' : 'white'
                                }}>
                                <h5>{userType === 'Client' ? 'Invoices' : 'Payment Invoice'}</h5>
                                <br />
                                {
                                    !usage.error && usage.loading &&
                                    <SkeletonLoading repeats={1} />
                                }
                                {
                                    !usage.error && !usage.loading &&
                                    <Col sm={12} className="no_padding">
                                        <div className={Styles.progress_container} style={{
                                            background: '#ebeaea',
                                            padding: '1rem',
                                            borderRadius: '6px',
                                            margin: 0,
                                            marginBottom: '1rem'
                                        }}>
                                            {
                                                invoicing && invoicing.map((invoice: invoice) => {
                                                    return <p style={{
                                                        borderBottom: '2px solid white',
                                                        justifyContent: 'space-between',
                                                        display: 'flex',
                                                        padding: '5px 0',
                                                        margin: 0
                                                    }}><span>{invoice.org}</span> - <span><b>$ {invoice.amount}.05</b></span></p>
                                                })
                                            }
                                            <h3 style={{
                                                textAlign: 'right',
                                                marginTop: '1rem'
                                            }}>$505.10</h3>
                                        </div>
                                        <Button variant="dark" onClick={() => setShowSubscription(true)}>Download Detailed Report</Button>
                                    </Col>
                                }
                            </Col>
                        }
                    </Col>
                </Row >
            </Col >
        </Col >
    }
    const handleSelect = (e: any) => {
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
                        {(selectedTab === "my_documents" || selectedTab === "my_documents_side") && <MyDocuments />}
                    </Tab>
                    <Tab eventKey="sent_document_requests" title="Sent Document Requests">
                        {(selectedTab === "sent_document_requests" || selectedTab === "sent_document_requests_side") && <SentDocumentRequests />}
                    </Tab>
                    <Tab eventKey="received_document_requests" title="Received Document Request">
                        {(selectedTab === "received_document_requests" || selectedTab === "received_document_requests_side") && <ReceivedDocumentRequests />}
                    </Tab>
                    <Tab eventKey="download_history" title="Download History">
                        {(selectedTab === "download_history" || selectedTab === "download_history_side") && <DownloadHistory />}
                    </Tab>
                    {/*<Tab eventKey="templates" title="">
                    </Tab> */}
                </Tabs >
            </Col >
            <Subscription onHide={setShowSubscription} show={showSubscription} />
        </>
    )
};

export default Documents