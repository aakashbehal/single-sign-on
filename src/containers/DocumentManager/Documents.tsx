import { useEffect, useState } from "react";
import { Col, Form, Row, ProgressBar, Button, Tab, Tabs } from "react-bootstrap";
import Styles from "./DocumentManager.module.sass";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CgOptions, CgSearch } from "react-icons/cg";

import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs"
import TableComponent from "../../components/Table/Table";
import MyDocuments from "./MyDocuments";
import ReceivedDocumentRequests from "./ReceivedDocumentRequests";
import SentDocumentRequests from "./SentDocumentRequests";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const tenuresInit = [
    {
        statusCode: 'current_month',
        status: 'Current Month'
    }
]
const productsInit = [
    {
        statusCode: 'all_products',
        status: 'All Products'
    }
]
const portfolioInit = [
    {
        statusCode: 'all_portfolio',
        status: 'All Portfolio'
    }
]
const usersInit = [
    {
        statusCode: 'all_users',
        status: 'All Users'
    }
]

const documentCoverageArr = [
    {
        percentage: 60,
        title: 'Signed Contract or Term & Conditions',
        accountsDone: 558,
        accountsTotal: 931,
        type: 'Signed contract or T&C'
    },
    {
        percentage: 60,
        title: 'Last Activity Statement',
        accountsDone: 249,
        accountsTotal: 416,
        type: 'Last Activity Statement'
    },
    {
        percentage: 10,
        title: 'Charge-off Statement',
        accountsDone: 42,
        accountsTotal: 416,
        type: 'Charge-off Statement'
    },
    {
        percentage: 30,
        title: 'Copy of Truth in Lending Disclosure',
        accountsDone: 65,
        accountsTotal: 215,
        type: 'Lending Disclosure'
    }
];

const options = {
    // responsive: true,
    // maintainAspectRatio: false,
    cutout: 100,
    plugins: {
        datalabels: {
            color: 'white',
            padding: 6,
        },
        legend: {
            position: 'bottom' as const,
        },
    },
}

export const dataRequested = {
    labels: ['Fulfilled', 'Open', 'Overdue'],
    datasets: [
        {
            label: 'Total',
            data: [45, 35, 20],
            backgroundColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#fc3f3f'
            ],
            borderColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#fc3f3f',
            ],
            borderWidth: 1,
        },
    ],
};

export const dataSent = {
    labels: ['Fulfilled', 'Open', 'Overdue'],
    datasets: [
        {
            label: 'Total',
            data: [60, 30, 10],
            backgroundColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#fc3f3f'
            ],
            borderColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#fc3f3f',
            ],
            borderWidth: 1,
        },
    ],
};


const Documents = () => {
    const [tenures, setTenures] = useState(tenuresInit)
    const [products, setProducts] = useState(productsInit)
    const [portfolios, setPortfolios] = useState(portfolioInit)
    const [users, setUsers] = useState(usersInit)
    const [documentCoverage, setDocumentCoverage] = useState(documentCoverageArr)
    const [sortElement, setSortElement] = useState('originalAccountNumber')
    const [sortType, setSortType] = useState('asc');
    const [pageCount, setPageCount] = useState(10)
    const [currentPage, setCurrentPage] = useState(1);
    const [collapse, setCollapse] = useState(false);

    /**
     * function is used in pagination
     * @param pageSize 
     * @param pageNumber 
     */
    const handlePagination = (pageSize: number, pageNumber: number) => { }

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
                    <Col sm={5}>
                        <Col sm={12} className={Styles.inner_document_summary}
                            style={{
                                borderWidth: collapse ? '0' : '1px',
                                background: collapse ? '#e9ecef' : 'white'
                            }}>
                            <h5>Document Coverage</h5>
                            <br />
                            <Form
                            // ref={formSearchAccount} onSubmit={(e) => onSubmitHandler(e)}
                            >
                                <Row>
                                    <Col lg={6} md={12} className="no_padding">
                                        <Form.Group as={Col} className="mb-4">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (tenures && tenures.length > 0) &&
                                                        tenures.map((tenure: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={tenure.statusCode}>{tenure.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Tenure</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-4 ">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (portfolios && portfolios.length > 0) &&
                                                        portfolios.map((portfolio: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={portfolio.statusCode}>{portfolio.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Portfolio</Form.Label>
                                        </Form.Group>
                                    </Col >
                                    <Col lg={6} md={12} className="no_padding">
                                        <Form.Group as={Col} className="mb-4 ">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (products && products.length > 0) &&
                                                        products.map((product: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={product.statusCode}>{product.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Products</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-4 ">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (users && users.length > 0) &&
                                                        users.map((user: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={user.statusCode}>{user.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Users</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row >
                                <hr />
                                <Col sm={12} className={`no_padding ${Styles.progress_container_outer}`}>
                                    {
                                        documentCoverage && documentCoverage.length > 0
                                        && documentCoverage.map((dC, index) => {
                                            return (
                                                <div key={`dC_${index}`} className={Styles.progress_container}>
                                                    <p className={Styles.ProgressTitle}><b>{dC.title}</b></p>
                                                    <ProgressBar className={Styles.progressbar} now={dC.percentage} label={`${dC.percentage}%`} />
                                                    <p className={Styles.ProgressDesc}><span className={Styles.clickable}>{dC.accountsDone}</span> out of <b>{dC.accountsTotal}</b> accounts has {dC.type}</p>
                                                    <hr />
                                                </div>
                                            )
                                        })

                                    }
                                </Col>
                            </Form >
                        </Col >
                    </Col >
                    <Col sm={5}  >
                        <Col sm={12} className={Styles.inner_document_summary}
                            style={{
                                borderWidth: collapse ? '0' : '1px',
                                background: collapse ? '#e9ecef' : 'white'
                            }}>
                            <h5>Document Requirement</h5>
                            <br />
                            <Form
                            // ref={formSearchAccount} onSubmit={(e) => onSubmitHandler(e)}
                            >
                                <Row>
                                    <Col lg={6} md={12} className="no_padding">
                                        <Form.Group as={Col} className="mb-4">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (tenures && tenures.length > 0) &&
                                                        tenures.map((tenure: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={tenure.statusCode}>{tenure.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Tenure</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-4 ">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (portfolios && portfolios.length > 0) &&
                                                        portfolios.map((portfolio: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={portfolio.statusCode}>{portfolio.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Portfolio</Form.Label>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6} md={12} className="no_padding">
                                        <Form.Group as={Col} className="mb-4 ">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (products && products.length > 0) &&
                                                        products.map((product: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={product.statusCode}>{product.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Products</Form.Label>
                                        </Form.Group>
                                        <Form.Group as={Col} className="mb-4 ">
                                            <Col md={12} sm={12} className="no_padding">
                                                <Form.Control
                                                    as="select"
                                                    name="service_offered"
                                                    className="select_custom white">
                                                    {
                                                        (users && users.length > 0) &&
                                                        users.map((user: any, index: number) => {
                                                            return <option key={`cr_${index}`} value={user.statusCode}>{user.status}</option>
                                                        })
                                                    }
                                                </Form.Control>
                                            </Col>
                                            <Form.Label className="label_custom white">Users</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col sm={6} className={`${Styles.chart_container} ${Styles.right_border}`}>
                                        <h5>Sent Requests</h5>
                                        <Doughnut data={dataSent} options={options} />
                                    </Col>
                                    <Col sm={6} className={Styles.chart_container}>
                                        <h5>Received Requests</h5>
                                        <Doughnut data={dataRequested} options={options} />
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
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
                                    <p><b>11.58 GB used out of 15 GB</b></p>
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

    return (
        <>
            {/* {
                documentSummary()
            } */}
            <br />
            <Col className="no_padding">
                <Tabs
                    defaultActiveKey="Documents"
                    id="fill-tab-example"
                    fill
                    className="mb-3"
                >
                    <Tab eventKey="Documents" title="My Documents">
                        <MyDocuments />
                    </Tab>
                    <Tab eventKey="sendDocuments" title="Sent Document Requests">
                        <SentDocumentRequests />
                    </Tab>
                    <Tab eventKey="receivedDocuments" title="Received Document Request">
                        <ReceivedDocumentRequests />
                    </Tab>
                    {/* Templates */}
                    <Tab eventKey="templates" title="">

                    </Tab>
                    {/* Download History */}
                    <Tab eventKey="downloadHistory" title="">

                    </Tab>
                </Tabs >
            </Col >
        </>
    )
};

export default Documents