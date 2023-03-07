import { useEffect, useMemo, useState } from "react";
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { CgOptions, CgSearch } from "react-icons/cg";
import { useHistory } from "react-router-dom";

import Styles from "./DocumentManager.module.sass";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs"
import MyDocuments from "./MyDocuments";
import ReceivedDocumentRequests from "./ReceivedDocumentRequests";
import SentDocumentRequests from "./SentDocumentRequests";
import DownloadHistory from "./DownloadHistory";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import DocumentRequirement from "./DocumentRequirement";
import DocumentCoverage from "./DocumentCoverage";




const Documents = ({ location }) => {
    const history = useHistory();
    const dispatch = useDispatch()
    const [collapse, setCollapse] = useState(false);
    const [selectedTab, setSelectedTab] = useState('');

    useEffect(() => {
        dispatch(MiscActionCreator.getColumnForAllTables())
    }, [])

    useEffect(() => {
        const tab = location.pathname.split('/')
        setSelectedTab(tab[tab.length - 1])
    }, [location])

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
                            <Col sm={12} className="no_padding">
                                <div className={Styles.progress_container}>
                                    <ProgressBar className={Styles.progressbar} now={60} label={`60%`} />
                                    <br />
                                    <p><b>9 GB used out of 15 GB</b></p>
                                    <p><b>Total 15K documents</b></p>
                                    <Button variant="dark">Upgrade Your Plan</Button>
                                </div>
                            </Col>
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