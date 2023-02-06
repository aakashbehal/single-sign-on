import React, { useEffect, useRef, useState } from 'react';
import {
    Table, Col, Form, Row, OverlayTrigger, Tooltip, Button, Dropdown
} from 'react-bootstrap';
import { CgSpinnerAlt } from 'react-icons/cg';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { BsCheck, BsX, BsUnlockFill, BsLockFill, BsEye, BsFileEarmarkText } from 'react-icons/bs';
import { GiSandsOfTime } from 'react-icons/gi';
import { BiPencil } from "react-icons/bi";
import { CgTrash } from "react-icons/cg"
import { VscRunAll } from "react-icons/vsc"
import { AiOutlineCloudDownload, AiOutlineCloudUpload, AiFillFolder, AiFillQuestionCircle, AiOutlineDelete, AiOutlineEye, AiFillFileExclamation } from "react-icons/ai"
import {
    FcHighPriority, FcLowPriority, FcMediumPriority, FcCancel,
} from 'react-icons/fc';
import { FiShare2 } from "react-icons/fi"

import { checkType } from '../../helpers/util';
import PaginationComponent from './pagination';
import { useHistory } from 'react-router-dom';

const TableComponent = ({
    data,
    isLoading,
    map,
    onPaginationChange,
    totalCount,
    isPagination = true,
    actionArray = [],
    currentPage,
    setCurrentPage,
    handleNavigate,
    colorArray = [],
    currencyColumns = [],
    sorting = true,
    sortElement,
    sortType,
    addEditArray = {},
    tableAction = [],
    parentComponent = '',
    loadingHeight = true,
    searchCriteria
}: any) => {
    const history = useHistory();
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState<any>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [pageSize, setPageSize] = useState(10);
    const pageSizes = [10, 50, 100];
    useEffect(() => {
        if (isPagination) {
            if (data && data.length > 0) {
                onPaginationChange(pageSize, currentPage);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (data.length > 0) {
            // var allHeaders: any = []
            // for (let i in data) {
            //     allHeaders = [...allHeaders, ...(Object.keys(data[i]))]
            // }
            // var uniqueHeaders: any = Array.from(new Set(allHeaders))
            setHeaders(Object.keys(map));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const pageChangeHandler = (value: number) => {
        setCurrentPage(value);
    };

    const sizeChangeHandler = (event: any) => {
        setPageSize(event.target.value);
        setCurrentPage(1);
    };

    const sizeHandler = () => (
        <Row className='table_top_section'>
            {
                !isLoading
                && (parentComponent === 'account'
                    || parentComponent === 'consumer'
                    || parentComponent === 'inventory'
                    || parentComponent === 'sol')
                &&
                <Button variant='dark' style={{ marginRight: '1rem' }} onClick={() => setShow(true)}>Download</Button>
            }
            {
                !isLoading
                && (parentComponent === 'myDocuments' || parentComponent === 'sentDocumentRequest')
                && <>
                    <Button variant="dark" style={{ marginRight: '1rem' }}>Export</Button>
                    <Button variant="dark" style={{ marginRight: '1rem' }}>Show/Hide Columns</Button>
                </>
            }
            <Form.Group as={Row}>
                <Form.Label
                    column
                    md={3}
                    sm={12}
                    style={{ textAlign: 'right' }}>Size</Form.Label>
                <Col md={9} sm={12}>
                    <Form.Control
                        as="select"
                        name="status"
                        onChange={(e) => sizeChangeHandler(e)}
                        defaultValue={pageSize}>
                        {
                            pageSizes
                            && pageSizes.map((size, index) => {
                                return (<option key={`size_${index}`} value={size}>{size}</option>)
                            })
                        }
                    </Form.Control>
                </Col>
            </Form.Group>
        </Row >
    );

    const servicingRequestIndicator = (header: any, d: any) => (
        <>
            <span style={{ position: 'absolute', left: '10px' }}>
                {
                    header === 'servicingRequestId'
                    && d.requestStatus === 'Approved'
                    && (
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(
                                <Tooltip id="tooltip-error">
                                    Approved
                                </Tooltip>
                            )}
                        >
                            <BsCheck size={30} style={{ color: '#68c803' }} />
                        </OverlayTrigger>
                    )
                }
                {
                    header === 'servicingRequestId'
                    && d.requestStatus === 'Rejected'
                    && (
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(
                                <Tooltip id="tooltip-error">
                                    Rejected
                                </Tooltip>
                            )}
                        >
                            <BsX size={30} style={{ color: 'red' }} />
                        </OverlayTrigger>
                    )
                }
                {
                    header === 'servicingRequestId'
                    && d.requestStatus === 'Requested'
                    && (
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(
                                <Tooltip id="tooltip-error">
                                    Requested
                                </Tooltip>
                            )}
                        >
                            <GiSandsOfTime size={30} style={{ color: d.ragStatus }} />
                        </OverlayTrigger>
                    )
                }
                {
                    header === 'servicingRequestId'
                    && d.requestStatus === 'Cancelled'
                    && (
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 250, hide: 400 }}
                            overlay={(
                                <Tooltip id="tooltip-error">
                                    Cancelled
                                </Tooltip>
                            )}
                        >
                            <FcCancel size={30} style={{ color: d.ragStatus }} />
                        </OverlayTrigger>
                    )
                }
            </span>
        </>
    );

    const priorityIndicator = (header: any, d: any) => (
        <>
            {
                d.requestStatus === 'Requested'
                && (
                    <span style={{ position: 'absolute', left: '50px' }}>
                        {
                            header === 'servicingRequestId'
                            && d.priorityExecution === 'High'
                            && (
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(
                                        <Tooltip id="tooltip-error">
                                            Priority - High
                                        </Tooltip>
                                    )}
                                >
                                    <FcHighPriority size={30} style={{ color: '#68c803' }} />
                                </OverlayTrigger>
                            )
                        }
                        {
                            header === 'servicingRequestId'
                            && d.priorityExecution === 'Medium'
                            && (
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(
                                        <Tooltip id="tooltip-error">
                                            Priority - Medium
                                        </Tooltip>
                                    )}
                                >
                                    <FcMediumPriority size={30} style={{ color: 'red' }} />
                                </OverlayTrigger>
                            )
                        }
                        {
                            header === 'servicingRequestId'
                            && d.priorityExecution === 'Low'
                            && (
                                <OverlayTrigger
                                    placement="right"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={(
                                        <Tooltip id="tooltip-error">
                                            Priority - Low
                                        </Tooltip>
                                    )}
                                >
                                    <FcLowPriority size={30} style={{ color: d.ragStatus }} />
                                </OverlayTrigger>
                            )
                        }
                    </span>
                )
            }

        </>
    );

    const sortBy = (header: any, type: any) => {
        const descElements: any = document.querySelectorAll('.header_desc');
        const ascElements: any = document.querySelectorAll('.header_asc');
        Array.from(descElements).map((descElem: any) => descElem.classList.remove('active'));
        Array.from(ascElements).map((ascElem: any) => ascElem.classList.remove('active'));
        sortElement(header);
        sortType(type);
        const element: any = document.querySelector(`.${header}_${type}`);
        element.classList.add('active');
    };

    const goToCompliance = (complianceId, data) => {
        history.push({
            pathname: `/search/${parentComponent === 'inventory' ? 'inventory' : 'account_search'}/compliance_details`,
            search: `cId=${complianceId}&clientId=${data.clientId}&cAn=${data.clientAccountNumber}&aId=${data.equabliAccountNumber}`,
        })
    }

    const complianceSplitter = (complianceIds, data) => {
        if (!complianceIds) return ''
        let split = complianceIds.split(',')
        split = split.map((complianceId, index) => {
            return <span id='index' key={`compliance_${index}`} onClick={() => goToCompliance(complianceId, data)} className="clickable_td_emp">{complianceId}{index < split.length - 1 ? ', ' : ''} </span>
        })
        return split
    }

    /**======================================= */
    /**Eligible partner handlers */
    /**======================================= */
    const keyContactsHandler = (contacts) => {
        return (
            contacts && contacts.map((contact, index) => {
                return <p style={{ textAlign: 'left', paddingLeft: '1rem' }} key={`contact_${index}`}>
                    <span>{contact.name}</span> <br />
                    <span>{contact.phone}</span>
                </p>
            })
        )
    }

    const serviceOfferedHandler = (services) => {
        return (
            <div style={{
                "display": "flex",
                "flexDirection": "row",
                "flexWrap": "wrap"
            }}>
                {
                    services && services.map((service, index) => {
                        return <p key={`service_${index}`} style={{ background: '#ff7765', color: 'white', borderRadius: '.3rem', padding: '.1rem .5rem', marginRight: '1rem' }}>{service}</p>
                    })
                }
            </div>
        )
    }

    const capacityHandler = (data) => {
        return (
            data && data.map((d, index) => {
                return <p style={{ textAlign: 'left', marginBottom: '0', paddingLeft: '1rem' }} key={`capacity_${index}`}>
                    <span><b>{d.type}</b>: {`${d.count} Accounts/Week`}</span>
                </p>
            })
        )
    }
    const commissionRateHandler = (data) => {
        return (
            data && data.map((d, index) => {
                return <p style={{ textAlign: 'left', marginBottom: '0', paddingLeft: '1rem' }} key={`commission_${index}`}>
                    <span><b>{d.type}</b>: {`${d.percentage}%`}</span>
                </p>
            })
        )
    }
    const complianceHandler = (data) => {
        return (<p style={{ textAlign: 'left', marginBottom: '0', paddingLeft: '1rem' }}>
            <span><b>{data}%</b> of accounts receive disputes of complaints</span>
        </p>
        )
    }
    const collectionsHandler = (data) => {
        return (
            data && data.map((d, index) => {
                return <p style={{ textAlign: 'left', marginBottom: '0', paddingLeft: '1rem' }} key={`collection_${index}`}>
                    <span><b>{d.type}</b>: {`$${d.amount}`}</span>
                </p>
            })
        )
    }

    const handleAllSelect = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(data.map(li => li.folderName));
        if (isCheckAll) {
            setIsCheck([]);
        }
    }

    const handleClick = e => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    };

    const dueDateHandler = (data) => {
        if (parentComponent === 'sentDocumentRequest') {
            if (!data.fulfillment && new Date(data.dueDate) >= new Date()) {
                return '#fbbdc3'
            } else if (!data.fulfillment && new Date(data.dueDate) < new Date()) {
                return '#b2e7d0'
            } else {
                return 'white'
            }
        }
    }

    /**
     * My Documents
     * =============================================
     */
    const handleSharedWith = (sharedWith) => {
        if (!sharedWith) {
            return "-"
        } else {
            return (
                <div className='share_With_parent'>
                    {
                        sharedWith && sharedWith.map((sW, index) => {
                            return <OverlayTrigger
                                key={`sw_${index}`}
                                placement="bottom"
                                delay={{ show: 250, hide: 400 }}
                                overlay={(
                                    <Tooltip id="tooltip-error">
                                        {sW.name} - {sW.email}
                                    </Tooltip>
                                )}
                            >
                                <span className='shared_with' style={{ marginLeft: index !== 0 ? '-.5rem' : '', marginBottom: '0' }}>{sW.name.charAt(0)}</span>
                            </OverlayTrigger>
                        })
                    }
                </div>
            )
        }
    }

    const tableHeaderHandler = () => {
        return <thead>
            <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                {/* {isPagination && <th className="span1">#</th>} */}
                {(parentComponent === 'myRequests'
                    || parentComponent === 'pendingForApproval'
                    || parentComponent === 'pendingMyApproval'
                ) && <th>#</th>}
                {
                    (parentComponent === 'myDocuments' || parentComponent === 'documents')
                    && <th className="span1">
                        <div
                            className="table_header_container"
                            style={
                                {
                                    'minWidth': '20px',
                                    'height': '30px',
                                    'alignItems': 'center'
                                }
                            }>
                            <Form.Control type='Checkbox' onChange={() => handleAllSelect()} style={{ cursor: 'pointer' }}></Form.Control>
                        </div>
                    </th>
                }
                {
                    // eslint-disable-next-line array-callback-return
                    headers && headers.map((header, index) => {
                        if (header !== 'clientId'
                            && header !== 'recordStatusVal'
                            && header !== 'batchSchedulerGroupId'
                            && header !== 'logDescription'
                            && header !== 'queueId'
                            && header !== 'slaStatus'
                            && header !== 'alertDefinition'
                            && header !== 'RFILink'
                            && header !== 'auditLink'
                        ) {
                            return (
                                <th
                                    className="span1"
                                    key={`header_${index}`}
                                >
                                    <div
                                        className="table_header_container"
                                        style={
                                            {
                                                'minWidth': ["servicesOffered", "capacity", "commissionRate", "accountTypeServiced", "compliance", "collections"].indexOf(header) !== -1
                                                    ? '300px'
                                                    : ["preview", "upload", "download", "autoRenew"].indexOf(header) !== -1 ? '110px' : '220px'
                                            }
                                        }>
                                        <div>
                                            {map[header] ? map[header] : header}
                                        </div>
                                        {
                                            sorting
                                            && (
                                                <div className="sorting">
                                                    <TiArrowSortedUp size={12} className={`header_asc ${header}_asc`} onClick={() => sortBy(header, 'asc')} />
                                                    <TiArrowSortedDown size={12} className={`header_desc ${header}_desc`} onClick={() => sortBy(header, 'desc')} />
                                                </div>
                                            )
                                        }
                                    </div>
                                </th>
                            );
                        }

                    })
                }
                {
                    ((typeof addEditArray.edit !== 'undefined')
                        || (typeof addEditArray.view !== 'undefined' && headers.indexOf('alertDefinition') !== -1))
                    && <th className="span1" style={{ minWidth: '130px' }}>Action Items</th>
                }
                {
                    ((typeof tableAction.openSolModal !== 'undefined') && headers.indexOf('dtClientStatute') !== -1)
                    && <th className="span1" style={{ minWidth: '130px', 'textAlign': 'center' }}>Action</th>
                }
                {
                    (
                        parentComponent === 'myDocuments'
                        || parentComponent === 'documents'
                        || parentComponent === 'sentDocumentRequest'
                    )
                    && <th className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>Actions</th>
                }
            </tr>
        </thead>
    }

    const tableBodyHandler = () => {
        return <tbody>
            {
                data && data.map((d: any, index: number) => (
                    <tr
                        key={`data_${index}`} style={{
                            lineHeight: '30px',
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 9,
                            backgroundColor: dueDateHandler(d)
                        }}

                    >
                        {/* {isPagination && <td>{index + (currentPage !== 1 ? ((currentPage - 1) * 10) : 0) + 1}</td>} */}
                        {(parentComponent === 'myRequests'
                            || parentComponent === 'pendingForApproval'
                            || parentComponent === 'pendingMyApproval'
                        ) && <th>{index + 1}</th>}
                        {
                            (parentComponent === 'myDocuments' || parentComponent === 'documents')
                            && <th className="span1">
                                <div
                                    className="table_header_container"
                                    style={
                                        {
                                            'minWidth': '20px',
                                            'height': '30px',
                                            'alignItems': 'center'
                                        }
                                    }>
                                    <Form.Control type='Checkbox' id={d.folderName} checked={isCheck.includes(d.folderName)} style={{ cursor: 'pointer' }} onChange={handleClick} ></Form.Control>
                                </div>
                            </th>
                        }
                        {
                            // eslint-disable-next-line array-callback-return
                            headers.map((header: any, index2) => {
                                if (header !== 'clientId'
                                    && header !== 'recordStatusVal'
                                    && header !== 'batchSchedulerGroupId'
                                    && header !== 'logDescription'
                                    && header !== 'slaStatus'
                                    && header !== 'queueId'
                                    && header !== 'alertDefinition'
                                    && header !== 'RFILink'
                                    && header !== 'auditLink'
                                ) {
                                    if (actionArray.includes(header)) {
                                        return (
                                            <td
                                                style={
                                                    {
                                                        background: header === 'complianceId' ? d.slaStatus : '',
                                                        color: header === 'complianceId' && d.slaStatus ? 'white' : ''
                                                    }
                                                }
                                                key={`data_2${index2}`}
                                                className={`clickable_td ${checkType(d[header], header) ? 'td_number' : 'td_string'}`}
                                            >
                                                {
                                                    servicingRequestIndicator(header, d)
                                                }
                                                {
                                                    priorityIndicator(header, d)
                                                }
                                                {
                                                    header === "folderName" && parentComponent === 'myDocuments' &&
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <AiFillFolder size={20} />
                                                        <span
                                                            style={{ paddingLeft: '.7rem' }}
                                                            onClick={() => handleNavigate(d, header)}
                                                            className="clickable_td_emp"
                                                        >
                                                            {d[header]}
                                                        </span>
                                                    </div>
                                                }
                                                {
                                                    header !== "folderName" && parentComponent !== 'myDocuments' &&
                                                    <span onClick={() => handleNavigate(d, header)} className="clickable_td_emp">
                                                        {d[header]}
                                                    </span>
                                                }

                                            </td>
                                        );
                                    }
                                    if (header === 'isValidationRequired') {
                                        return <td key={`data_2${index2}`}>{d[header] ? 'Yes' : 'No'}</td>;
                                    }
                                    if (header === 'isExcluded') {
                                        return <td key={`data_2${index2}`}>{d[header] ? 'Y' : 'N'}</td>;
                                    }
                                    if (header === 'isAdditionalTimeRequired') {
                                        return <td key={`data_2${index2}`}>{d[header] ? 'Yes' : 'No'}</td>;
                                    }
                                    if (header === 'keyContacts') {
                                        return <td key={`data_2${index2}`}>{keyContactsHandler(d[header])}</td>
                                    }
                                    if (header === 'servicesOffered'
                                        || header === "accountTypeServiced"
                                    ) {
                                        return <td key={`data_2${index2}`}>{serviceOfferedHandler(d[header])}</td>
                                    }
                                    if (parentComponent === 'partnerSearch' && (header === 'accountType'
                                        || header === 'productType')) {
                                        return <td key={`data_2${index2}`}>{serviceOfferedHandler(d[header])}</td>
                                    }
                                    if (header === "capacity") {
                                        return <td key={`data_2${index2}`}>{capacityHandler(d[header])}</td>
                                    }
                                    if (header === "commissionRate") {
                                        return <td key={`data_2${index2}`}>{commissionRateHandler(d[header])}</td>
                                    }
                                    if (header === "compliance") {
                                        return <td key={`data_2${index2}`}>{complianceHandler(d[header])}</td>
                                    }
                                    if (parentComponent !== 'partnerSearch' && header === "collections") {
                                        return <td key={`data_2${index2}`}>{collectionsHandler(d[header])}</td>
                                    }
                                    if (header === "sharedWith") {
                                        return <td key={`data_2${index2}`}>{handleSharedWith(d[header])}</td>
                                    }
                                    if (header === "preview") {
                                        return <td key={`data_2${index2}`}><BsFileEarmarkText size={24} /></td>
                                    }
                                    if (header === 'upload') {
                                        return <td key={`data_2${index2}`}><AiOutlineCloudUpload size={24} /></td>
                                    }
                                    if (header === 'download') {
                                        return <td key={`data_2${index2}`}><AiOutlineCloudDownload size={24} /></td>
                                    }
                                    if (parentComponent === 'sentDocumentRequest' && header === 'fileName') {
                                        return <td key={`data_2${index2}`} className='center_align_td'><AiFillFileExclamation size={24} /> Pending</td>
                                    }
                                    if (!d[header]) {
                                        return <td key={`data_2${index2}`}><b>-</b></td>
                                    }
                                    if (header === "partnerStatus") {
                                        return <td key={`data_2${index2}`} style={{ textAlign: 'left' }}>
                                            <span style={{
                                                backgroundColor: d['partnerStatus'] === 'Equabli Recommended' ? '#ff7765' : d['partnerStatus'] === 'Equabli Approved' ? "rgb(0, 235, 165)" : '#00b5fc',
                                                color: 'white',
                                                padding: '.3rem 1rem',
                                                borderRadius: '.3rem'
                                            }}>{d[header]}</span><br />
                                            {
                                                (d['partnerStatus'] === 'Equabli Recommended' || d['partnerStatus'] === 'Equabli Approved')
                                                && <>
                                                    <b><a href={d['RFILink']}>Review RFI</a></b><br />
                                                    <b><a href={d['auditLink']}>Review Audit</a></b>
                                                </>
                                            }
                                        </td>
                                    }
                                    if (header === 'executionStatusVal') {
                                        return (<td >
                                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {d[header]}
                                                <OverlayTrigger
                                                    placement="right"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            {d['logDescription']}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <AiFillQuestionCircle size={20} style={{ marginLeft: '1rem' }} />
                                                </OverlayTrigger>
                                            </span>
                                        </td>)
                                    }
                                    if (header === 'complianceIds') {
                                        return (
                                            <td className={`clickable_td ${checkType(d[header], header) ? 'td_number' : 'td_string'}`}>
                                                {complianceSplitter(d[header], d)}
                                            </td>
                                        )
                                    }
                                    if (colorArray.includes(header)) {
                                        return (
                                            <td
                                                style={{ backgroundColor: `${d[header]}` }}
                                                key={`data_2${index2}`}
                                            >{''}
                                            </td>
                                        );
                                    }
                                    return (
                                        <td
                                            className={`${checkType(d[header], header) ? 'td_number' : 'td_string'}`}
                                            key={`data_2${index2}`}
                                        >
                                            {currencyColumns.indexOf(header) !== -1 ? '$' : ''}
                                            {' '}
                                            {d[header]}
                                        </td>
                                    );
                                }

                            })
                        }
                        {
                            ((typeof tableAction.openSolModal !== 'undefined') && headers.indexOf('dtClientStatute') !== -1)
                            && <td key={`data_${index}`} className="span1" >
                                <Button variant="dark" onClick={() => tableAction.openSolModal(d)}>Set SOL</Button>
                            </td>
                        }
                        {
                            typeof addEditArray.edit !== 'undefined'
                            && (
                                <>
                                    <td key={`data_${index}`} className="span1" >
                                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {
                                                d.recordStatusVal !== "Deleted"
                                                && <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Edit
                                                        </Tooltip>
                                                    }
                                                >
                                                    <BiPencil onClick={() => addEditArray.edit(index)} size={20} style={{ margin: '0 .5rem', cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            }
                                            {
                                                d.recordStatusVal === "Deleted"
                                                && <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            View
                                                        </Tooltip>
                                                    }
                                                >
                                                    <BsEye onClick={() => addEditArray.edit(index)} size={20} style={{ margin: '0 .5rem', cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            }
                                            {
                                                d.recordStatusVal !== "Deleted"
                                                &&
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Delete
                                                        </Tooltip>
                                                    }
                                                >
                                                    <CgTrash onClick={() => addEditArray.delete(index)} size={20} style={{ margin: '0 .5rem', cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            }
                                            {
                                                d.recordStatusVal === "Disabled"
                                                &&
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Click to unlock
                                                        </Tooltip>
                                                    }
                                                >
                                                    <BsLockFill onClick={() => addEditArray.update(index)} size={18} style={{ margin: '0 .5rem', color: 'red', cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            }
                                            {
                                                d.recordStatusVal === "Enabled"
                                                &&
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Click to lock
                                                        </Tooltip>
                                                    }
                                                >
                                                    <BsUnlockFill onClick={() => addEditArray.update(index)} size={18} style={{ margin: '0 .5rem', color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            }
                                            {
                                                (
                                                    d.recordStatusVal === "Enabled"
                                                    || d.recordStatusVal === "Disabled"
                                                )
                                                && (typeof addEditArray.execute !== 'undefined')
                                                &&
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Execute
                                                        </Tooltip>
                                                    }
                                                >
                                                    <VscRunAll onClick={() => addEditArray.execute(index)} size={18} style={{ margin: '0 .5rem', color: 'rgb(76, 175, 80)', cursor: 'pointer' }} />
                                                </OverlayTrigger>
                                            }
                                            {
                                                d.recordStatusVal === "Deleted"
                                                &&
                                                <OverlayTrigger
                                                    placement="bottom"
                                                    delay={{ show: 250, hide: 400 }}
                                                    overlay={
                                                        <Tooltip id={`tooltip-error`}>
                                                            Deleted
                                                        </Tooltip>
                                                    }
                                                >
                                                    <FcCancel size={20} style={{ color: d.ragStatus, margin: '0 .5rem' }} />
                                                </OverlayTrigger>
                                            }
                                        </span>
                                    </td>
                                </>
                            )
                        }
                        {
                            typeof addEditArray.view !== 'undefined'
                            && d['alertDefinition'] !== undefined
                            && (
                                <>
                                    <td key={`data_${index}`} className="span1" >
                                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            {<p onClick={() => addEditArray.view(d['alertDefinition'])} style={{ margin: '0 .5rem', cursor: 'pointer', color: '#FF7765' }} >View Email</p>}
                                        </span>
                                    </td>
                                </>
                            )
                        }
                        {
                            (
                                parentComponent === 'myDocuments'
                                || parentComponent === 'documents'
                                || parentComponent === 'sentDocumentRequest'
                            )
                            && <td key={`data_${index}`} className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>
                                {
                                    typeof addEditArray.view !== 'undefined'
                                    && <span>
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={
                                                <Tooltip id={`tooltip-error`}>
                                                    View
                                                </Tooltip>
                                            }
                                        >
                                            <AiOutlineEye onClick={() => addEditArray.view(d)} size={20} style={{ cursor: 'pointer' }} />
                                        </OverlayTrigger>
                                    </span>
                                } &nbsp;
                                {
                                    typeof addEditArray.download !== 'undefined'
                                    && <span>
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={
                                                <Tooltip id={`tooltip-error`}>
                                                    Download
                                                </Tooltip>
                                            }
                                        >
                                            <AiOutlineCloudDownload onClick={() => addEditArray.download(d)} size={20} style={{ cursor: 'pointer' }} />
                                        </OverlayTrigger>
                                    </span>
                                } &nbsp;
                                {
                                    typeof addEditArray.share !== 'undefined'
                                    && <span>
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={
                                                <Tooltip id={`tooltip-error`}>
                                                    Share
                                                </Tooltip>
                                            }
                                        >
                                            <FiShare2 size={20} onClick={() => addEditArray.share(d)} style={{ cursor: 'pointer' }} />
                                        </OverlayTrigger>
                                    </span>
                                } &nbsp;
                                {
                                    typeof addEditArray.delete !== 'undefined'
                                    &&
                                    <span>
                                        <OverlayTrigger
                                            placement="bottom"
                                            delay={{ show: 250, hide: 400 }}
                                            overlay={
                                                <Tooltip id={`tooltip-error`}>
                                                    Delete
                                                </Tooltip>
                                            }
                                        >
                                            <AiOutlineDelete onClick={() => addEditArray.delete(d)} size={20} style={{ cursor: 'pointer' }} />
                                        </OverlayTrigger>
                                    </span>
                                }
                            </td>
                        }
                    </tr>
                ))
            }
        </tbody>
    }

    const tableHandler = () => (
        <>
            {
                tableHeaderHandler()
            }
            {
                tableBodyHandler()
            }
        </>
    );

    const emptyTable = () => (
        <thead>
            <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                <th>No Records</th>
            </tr>
        </thead>
    );

    const loadingData = () => (
        <div className={`table_loading ${loadingHeight ? null : 'no_min_height'}`} >
            <CgSpinnerAlt className="spinner" size={50} />
        </div >
    );

    const [show, setShow] = useState(false)

    return (
        <div className="table_container">
            {isPagination && totalCount > 0 ? sizeHandler() : null}
            <Table striped bordered hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                {totalCount > 0 ? tableHandler() : emptyTable()}
            </Table>
            {isLoading && loadingData()}
            {isPagination && (
                <PaginationComponent
                    total={totalCount}
                    itemsPerPage={pageSize}
                    currentPage={currentPage}
                    onPageChange={(page: number) => pageChangeHandler(page)}
                />
            )}
        </div>
    );
};

export default TableComponent;
