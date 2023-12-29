import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApprovalActionCreator } from "../../store/actions/approval.actions";
import { Col, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { CgSpinnerAlt } from "react-icons/cg";
import NoRecord from "../../components/Common/NoResult";

import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";
import TableComponent from "../../components/Table/Table";


const Approval = () => {
    const { addToast } = useToasts()
    const dispatch = useDispatch()
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1);
    const [isResend, setIsResend] = useState<boolean>(false)
    const {
        users,
        totalCount,
        error,
        loading,
        approving,
        approvingSuccess,
        approvingError
    } = useSelector((state: any) => ({
        users: state.approval.data,
        totalCount: state.approval.totalCount,
        error: state.approval.error,
        loading: state.approval.loading,
        approving: state.approval.approving,
        approvingSuccess: state.approval.approvingSuccess,
        approvingError: state.approval.approvingError
    }))

    useEffect(() => {
        search(pageSize, pageNumber)
    }, [])

    useEffect(() => {
        if (approvingSuccess) {
            if (isResend) {
                addToast(createMessage('success', `approved`, 'User'), { appearance: 'success', autoDismiss: true });
            } else {
                addToast(createMessage('success', `approval email resent`, 'User'), { appearance: 'success', autoDismiss: true });
            }
            search(pageSize, pageNumber)
        }
        if (approvingError) {
            addToast(createMessage('success', `approving`, 'User'), { appearance: 'error', autoDismiss: true });
        }
        setIsResend(false)
    }, [approving,
        approvingSuccess,
        approvingError])

    const search = (
        pageSize: any,
        pageNumber: any
    ) => {
        dispatch(ApprovalActionCreator.getAllUsers({ pageSize, pageNumber }))
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

    const approveHandler = (data: any) => {
        if (data.recordStatusCode === 'InProgress') {
            setIsResend(true)
        }
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
            <TableComponent
                data={users}
                isLoading={loading}
                map={{
                    "principleId": "Principle",
                    "orgTypeFormatted": "Organization Type",
                    "orgName": "Organization",
                    "emailAddress": "Email",
                    "userName": "Name",
                }}
                totalCount={totalCount}
                actionArray={[]}
                handleNavigate={(data: any) => { }}
                currencyColumns={[]}
                sortElement={(header: any) => { }}
                sortType={(type: any) => { }}
                currentPage={pageNumber}
                setCurrentPage={setPageNumber}
                parentComponent={'approval'}
                searchCriteria={{}}
                hideShareArray={[
                    "principleId",
                    "orgTypeFormatted",
                    "orgName",
                    "emailAddress",
                    "userName",
                ]}
                addEditArray={
                    {
                        approve: (data: any) => approveHandler(data)
                    }
                }
                onPaginationChange={(
                    pageSize: number, pageNumber: number
                ) => handlePagination(pageSize, pageNumber)}></TableComponent >
        </Col>
    </>
}

export default Approval;