import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useDispatch, useSelector } from "react-redux";

import Styles from "./DocumentManager.module.sass";
import { SummaryActionCreator } from "../../store/actions/summary.actions";
import SummaryFilters from "../../components/Common/SummaryFilters";
import { userService } from "../../services";
import { CgSpinnerAlt } from "react-icons/cg";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const options: any = {
    responsive: true,
    // maintainAspectRatio: false,
    cutout: 50,
    layout: {
        padding: 20
    },
    plugins: {
        datalabels: {
            color: 'white',
            padding: 6,
            font: {
                weight: 'bold',
                size: '12px',
                family: `'VisbyCF-Regular', Arial, Helvetica, sans-serif`
            }
        },
        legend: {
            position: 'bottom' as const,
        },
    },
}


export const DATA_REQUESTED = {
    labels: ['Fulfilled', 'Open', 'Overdue'],
    datasets: [
        {
            label: 'Total',
            data: [],
            backgroundColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#FF7765'
            ],
            borderColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#FF7765',
            ],
            borderWidth: 1,
        },
    ],
};

export const DATA_SENT = {
    labels: ['Fulfilled', 'Open', 'Overdue'],
    datasets: [
        {
            label: 'Total',
            data: [],
            backgroundColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#FF7765'
            ],
            borderColor: [
                '#53d591',
                'rgba(255, 206, 86, 1)',
                '#FF7765',
            ],
            borderWidth: 1,
        },
    ],
};

const DocumentRequirement = ({ collapse, clientAccountNumbers }: any) => {
    const dispatch = useDispatch();
    const [userType, setUserType] = useState<any>(null)
    const [searchObj, setSearchObj] = useState({
        duration: null,
        product: null,
        portfolio: null,
        userId: null
    })
    const [dataRequested, setDataRequested] = useState<any>({
        labels: ['Fulfilled', 'Open', 'Overdue'],
        datasets: [
            {
                label: 'Total',
                data: [],
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
    })
    const [dataSent, setDataSent] = useState<any>({
        labels: ['Fulfilled', 'Open', 'Overdue'],
        datasets: [
            {
                label: 'Total',
                data: [],
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
    })

    const {
        requestedSummary,
        sentSummary,
        errorSent,
        loadingSent,
        loadingRequest,
        errorRequest,
        reRender,
    } = useSelector((state: any) => ({
        requestedSummary: state.summary.requestedSummary,
        sentSummary: state.summary.sentSummary,
        errorSent: state.summary.errorSent,
        loadingSent: state.summary.loadingSent,
        loadingRequest: state.summary.loadingRequest,
        errorRequest: state.summary.errorRequest,
        reRender: state.summary.reRender
    }))

    useEffect(() => {
        if (JSON.stringify(requestedSummary) !== "{}") {
            delete requestedSummary.total
            let labels = ['Fulfilled', 'Open', 'Overdue']
            let values = Object.values(requestedSummary)
            const dataRequestedTemp: any = Object.assign({}, DATA_REQUESTED)
            dataRequestedTemp.labels = labels
            dataRequestedTemp.datasets[0].data = values
            setDataRequested(dataRequestedTemp)
        }
        if (JSON.stringify(sentSummary) !== "{}") {
            delete sentSummary.total
            let labels = ['Fulfilled', 'Open', 'Overdue']
            let values = Object.values(sentSummary)
            const dataSentTemp: any = Object.assign({}, DATA_SENT)
            dataSentTemp.labels = labels
            dataSentTemp.datasets[0].data = values
            setDataSent(dataSentTemp)
        }
    }, [requestedSummary, sentSummary])

    useEffect(() => {
        setUserType(userService.getUserType())
    }, [])

    useEffect(() => {
        dispatch(SummaryActionCreator.getSentSummary(searchObj))
    }, [searchObj])

    useEffect(() => {
        if (reRender) {
            setDataSent({
                labels: ['Fulfilled', 'Open', 'Overdue'],
                datasets: [
                    {
                        label: 'Total',
                        data: [],
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
            })
            setDataRequested({
                labels: ['Fulfilled', 'Open', 'Overdue'],
                datasets: [
                    {
                        label: 'Total',
                        data: [],
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
            })
            dispatch(SummaryActionCreator.getSentSummary({}))
        }
    }, [reRender])

    const memoRequested = useMemo(() => {
        return <Doughnut data={dataRequested} options={userType === 'Client' ? options : { ...options, cutout: 100 }} redraw />
    }, [dataRequested])

    const memoSent = useMemo(() => {
        return <Doughnut data={dataSent} options={userType === 'Client' ? { ...options, cutout: 100 } : options} redraw />
    }, [dataSent])

    return (
        <Col sm={12} className={Styles.inner_document_summary}
            style={{
                borderWidth: collapse ? '0' : '1px',
                background: collapse ? '#e9ecef' : 'white'
            }}>
            <h5>Document Requirement</h5>
            <br />
            <SummaryFilters searchObj={searchObj} setSearchObj={setSearchObj} />
            <hr />
            <Row style={{ maxHeight: '395px', minHeight: '395px' }}>
                <Col sm={7} className={Styles.chart_container}>
                    <h5>{userType === 'Client' ? "Sent Requests" : "Received Requests"}</h5>
                    {
                        (!errorRequest && loadingRequest) && (!errorSent && loadingSent) &&
                        <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                    }
                    <div style={{
                        display: "flex",
                        alignItems: 'end',
                        height: "90%"
                    }}>
                        {
                            userType !== 'Client' ?
                                <>
                                    {
                                        !loadingRequest &&
                                        memoRequested
                                    }
                                </>
                                :
                                <>
                                    {
                                        !loadingSent &&
                                        memoSent
                                    }
                                </>
                        }
                    </div>
                </Col>
                <Col sm={5} className={Styles.chart_container}>
                    <h5>{userType === 'Client' ? "Received Requests" : "Sent Requests"}</h5>
                    {
                        (!errorRequest && loadingRequest) && (!errorSent && loadingSent) &&
                        <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                    }
                    <div style={{
                        display: "flex",
                        alignItems: 'end',
                        height: "90%"
                    }}>
                        {
                            userType !== 'Client' ?
                                <>
                                    {
                                        !loadingSent &&
                                        memoSent
                                    }
                                </>
                                :
                                <>
                                    {
                                        !loadingRequest &&
                                        memoRequested
                                    }
                                </>
                        }
                    </div>
                </Col>
            </Row >
        </Col >
    )
}

export default DocumentRequirement