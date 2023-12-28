import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApprovalActionCreator } from "../../store/actions/approval.actions";
import { Col, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { CgSpinnerAlt } from "react-icons/cg";
import NoRecord from "../../components/Common/NoResult";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { SiMinutemailer } from "react-icons/si";
import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";

const ORG_TYPE_MAPPER: any = {
    CL: "Client",
    PT: "Partner",
    EQ: "Equabli"
}

const Approval = () => {
    const { addToast } = useToasts()
    const dispatch = useDispatch()
    const [isResend, setIsResend] = useState<number | null>(null)
    const {
        users,
        error,
        loading,
        approving,
        approvingSuccess,
        approvingError
    } = useSelector((state: any) => ({
        users: state.approval.data,
        error: state.approval.error,
        loading: state.approval.loading,
        approving: state.approval.approving,
        approvingSuccess: state.approval.approvingSuccess,
        approvingError: state.approval.approvingError
    }))

    useEffect(() => {
        search()
    }, [])

    useEffect(() => {
        if (approvingSuccess) {
            if (isResend) {
                addToast(createMessage('success', `approved`, 'User'), { appearance: 'success', autoDismiss: true });
            } else {
                addToast(createMessage('success', `approval email resent`, 'User'), { appearance: 'success', autoDismiss: true });
            }
        }
        if (approvingError) {
            addToast(createMessage('success', `approving`, 'User'), { appearance: 'error', autoDismiss: true });
        }
        setIsResend(null)
    }, [approving,
        approvingSuccess,
        approvingError])

    const search = () => {
        dispatch(ApprovalActionCreator.getAllUsers())
    }

    const nameHandler = (data: any) => {
        return `${data.firstName} ${data.middleName} ${data.lastName}`
    }

    const chooseOrgType = (data: any) => {
        let orgName
        if (data.orgType === 'CL') orgName = data.clientName
        if (data.orgType === 'PT') orgName = data.partnerName
        return orgName
    }

    const approveHandler = (data: any) => {
        dispatch(ApprovalActionCreator.approveUser({
            "uid": data.uid,
            "loginKey": data.loginKey
        }))
    }

    return <>
        <Col>
            {
                loading &&
                <div className={`table_loading`} >
                    <CgSpinnerAlt className="spinner" size={50} />
                </div >
            }
            <Table striped bordered hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                {
                    !loading && users?.length === 0
                    && <thead>
                        <tr className='no_records' style={{ lineHeight: '35px', backgroundColor: '#e9ecef', textAlign: 'center' }}>
                            <NoRecord />
                        </tr>
                    </thead>
                }
                {
                    !loading && users?.length > 0
                    && <>
                        <thead>
                            <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                <th>Principle Id</th>
                                <th>Organization Type</th>
                                <th>Organization</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th style={{ width: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users && users?.map((cT: any, index: any) => {
                                    return (<tr key={`rD_${index}`}>
                                        <td>{cT.principleId}</td>
                                        <td>{ORG_TYPE_MAPPER[cT.orgType]}</td>
                                        <td>{chooseOrgType(cT)}</td>
                                        <td>{cT.emailAddress}</td>
                                        <td>{nameHandler(cT)}</td>
                                        <td className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>
                                            {
                                                !isResend && <>
                                                    {
                                                        cT.recordStatusCode === 'RAW' &&
                                                        <span>
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={
                                                                    <Tooltip id={`tooltip-error`}>
                                                                        Approve User
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <HiOutlineBadgeCheck onClick={() => {
                                                                    setIsResend(null)
                                                                    approveHandler(cT)
                                                                }} size={25} style={{ cursor: 'pointer' }} />
                                                            </OverlayTrigger>
                                                        </span>
                                                    }
                                                    {
                                                        cT.recordStatusCode === 'InProgress' &&
                                                        <span>
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                delay={{ show: 250, hide: 400 }}
                                                                overlay={
                                                                    <Tooltip id={`tooltip-error`}>
                                                                        Resent Email
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <SiMinutemailer onClick={() => {
                                                                    setIsResend(index)
                                                                    approveHandler(cT)
                                                                }} size={25} style={{ cursor: 'pointer' }} />
                                                            </OverlayTrigger>
                                                        </span>
                                                    }
                                                </>
                                            }
                                            {
                                                approving && isResend === index && <CgSpinnerAlt className="spinner" size={25} />
                                            }
                                        </td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </>
                }
            </Table>
        </Col>
    </>
}

export default Approval;