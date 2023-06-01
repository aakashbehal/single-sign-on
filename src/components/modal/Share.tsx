import React, { useEffect, useRef, useState } from 'react'
import { Modal, Row, Col, Button, Form, OverlayTrigger, Tooltip } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { Typeahead } from "react-bootstrap-typeahead"
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { CgTrash } from 'react-icons/cg';
import { CgSpinnerAlt } from 'react-icons/cg';

import Styles from "./Modal.module.sass";
import { UserActionCreator } from '../../store/actions/user.actions';
import { ShareActionCreator } from '../../store/actions/share.actions';
import { AiFillWarning } from 'react-icons/ai';

const Share = ({ show, onHide, parentComponent, searchHandler }: any) => {
    const [details, setDetails] = useState<any>(show)
    const dispatch = useDispatch()
    const ref = useRef<any>();
    const [formError, setFormError] = useState({
        shareDetail: false,
    })
    const [isEnable, setIsEnable] = useState<boolean>(false)
    const [toSentList, setToSentList] = useState<any>([])
    const [emailToRemove, setEmailToRemove] = useState<any>(null)
    const [usersUpdates, setUsersUpdated] = useState<any>([])
    const { users, loading, error } = useSelector((state: any) => ({
        users: state.users.data,
        loading: state.users.loading,
        error: state.users.error,
    }));

    useEffect(() => {
        filterUserList(details)
    }, [details, users])

    const {
        shareFolderLoading,
        shareFolderSuccess,
        shareFolderError,
        shareFileLoading,
        shareFileSuccess,
        shareFileError,
        revokeFolderLoading,
        revokeFolderSuccess,
        revokeFolderError,
        revokeFileLoading,
        revokeFileSuccess,
        revokeFileError
    } = useSelector((state: any) => ({
        shareFolderLoading: state.share.shareFolderLoading,
        shareFolderSuccess: state.share.shareFolderSuccess,
        shareFolderError: state.share.shareFolderError,
        shareFileLoading: state.share.shareFileLoading,
        shareFileSuccess: state.share.shareFileSuccess,
        shareFileError: state.share.shareFileError,
        revokeFolderLoading: state.share.revokeFolderLoading,
        revokeFolderSuccess: state.share.revokeFolderSuccess,
        revokeFolderError: state.share.revokeFolderError,
        revokeFileLoading: state.share.revokeFileLoading,
        revokeFileSuccess: state.share.revokeFileSuccess,
        revokeFileError: state.share.revokeFileError
    }))

    /**
     * Share Folder 
     */
    useEffect(() => {
        if (shareFolderSuccess || shareFileSuccess) {
            const detailTemp: any = Object.assign({}, details)
            detailTemp.sharedWith.push(...toSentList)
            ref.current.clear()
            setIsEnable(false)
            setDetails(detailTemp)
            searchHandler()
        }
    }, [
        shareFolderLoading,
        shareFolderSuccess,
        shareFolderError,
        shareFileLoading,
        shareFileSuccess,
        shareFileError
    ])

    /**
    * Revoke 
    */
    useEffect(() => {
        if (revokeFolderSuccess || revokeFileSuccess) {
            const detailTemp: any = Object.assign({}, details)
            detailTemp.sharedWith = detailTemp.sharedWith.filter((dT: any) => {
                if (dT.email !== emailToRemove) {
                    return dT
                }
            })
            setIsEnable(false)
            setDetails(detailTemp)
            setEmailToRemove(null)
            searchHandler()
        }
    }, [revokeFolderLoading,
        revokeFolderSuccess,
        revokeFolderError,
        revokeFileLoading,
        revokeFileSuccess,
        revokeFileError])

    useEffect(() => {
        dispatch(UserActionCreator.getConnectedUsers())
    }, [])

    const filterUserList = (details: any) => {
        let tempUsers: any = []
        let sharedWithTemp = Object.assign({}, details)
        let sharedArray = sharedWithTemp.sharedWith.map((shared: any) => shared.email)
        users.map((user: any) => {
            if (sharedArray.indexOf(user.loginKey) === -1) {
                tempUsers.push(user)
            }
            return true
        })
        setUsersUpdated(tempUsers)
    }

    const validate = (formObj: any) => {
        let formIsValid = true;
        const error: any = {
            shareDetail: false,
        }
        for (let key in formObj) {
            if (!formObj[key] || formObj[key] === "") {
                error[key] = true
            }
            if (formObj["shareDetail"].length === 0) {
                error["shareDetail"] = true
            }
        }
        for (let k in error) {
            if (error[k]) {
                formIsValid = false
            }
        }
        setFormError(error)
        return formIsValid
    }

    const onSubmitHandler = () => {
        let formObj: any = {}
        formObj["shareDetail"] = toSentList
        if (validate(formObj)) {
            if (parentComponent === 'documents') {
                formObj["documentId"] = details.id
                dispatch(ShareActionCreator.shareDocument(formObj))
            } else {
                formObj["clientAccountNo"] = details.folderName
                dispatch(ShareActionCreator.shareFolder(formObj))
            }
        }
    }

    const revokeHandler = (data: any) => {
        let formObj: any = {}
        formObj["email"] = data.email
        setEmailToRemove(data.email)
        if (parentComponent === 'documents') {
            dispatch(ShareActionCreator.revokeShareDocument(formObj))
        } else {
            dispatch(ShareActionCreator.revokeShareDocument(formObj))
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            animation={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Share "<b>{parentComponent === 'myDocument' ? `${details.folderName}` : `${details.documentName}`}</b>"
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="show-grid">
                <Form>
                    <Row>
                        <Col lg={12} md={6} className="no_padding">
                            <Form.Group as={Col} className="mb-1 mt-4">
                                <Col md={12} sm={12}>
                                    <Typeahead
                                        isLoading={loading}
                                        id="public-methods-example"
                                        labelKey="modifiedFirstName"
                                        multiple
                                        ref={ref}
                                        allowNew={true}
                                        newSelectionPrefix='Not a Platform User: '
                                        onChange={(selected) => {
                                            setIsEnable(true)
                                            let selectedUpdated = selected.map((s: any) => {
                                                let temp = {
                                                    "name": s.firstName,
                                                    "email": s.loginKey || s.firstName,
                                                    "isRegisterUser": !s.customOption,
                                                    "principleId": s.principleId,
                                                    "orgType": s.orgType,
                                                    "userOrgCode": s.orgCode,
                                                }
                                                return temp
                                            })
                                            setToSentList(selectedUpdated)
                                        }}
                                        options={usersUpdates}
                                    />
                                </Col>
                                <span style={{ color: 'red', paddingLeft: '1rem' }}><small>{formError["shareDetail"] ? 'At least one recipient is required ' : ''}</small></span>
                                <Form.Label className="label_custom white">Add People</Form.Label>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Col sm={12}>
                    <p className={Styles.people_share_with}>People with Access</p>
                    {
                        (shareFolderError || shareFileError)
                        && <OverlayTrigger
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
                    {
                        (!shareFolderError || !shareFileError)
                        && (shareFolderLoading || shareFileLoading)
                        && <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
                    }
                    {
                        details.sharedWith && details.sharedWith.length > 0 && <ul className={Styles.share_with_ul}>
                            {
                                details.sharedWith.map((sW: any, index: any) => {
                                    return <li className={Styles.share_with_li} key={`li_${index}`}>
                                        <div className={Styles.share_with_div}>
                                            <div className='share_With_parent' style={{ marginRight: '1rem' }}>
                                                {
                                                    sW.profilePicture && <img src={sW.profilePicture} className='profile_pic_account' alt="" />
                                                }
                                                {
                                                    !sW.profilePicture
                                                    && <span className={`shared_with ${Styles.share_with_span_pic}`}>
                                                        <span>{sW.name.charAt(0)}</span>
                                                    </span>
                                                }
                                            </div>
                                            <div>
                                                <p className={Styles.share_with_p}>{sW.userOrgCode || sW.orgCode} - {sW.name}</p>
                                                <p className={Styles.share_with_p}>{sW.email}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Button
                                                className={Styles.share_with_button}
                                                variant="dark"
                                                onClick={() => revokeHandler(sW)}
                                            >
                                                <CgTrash
                                                    size={20}
                                                    style={{ margin: '0 .5rem', cursor: 'pointer' }}
                                                />
                                                Revoke Access
                                            </Button>
                                        </div>
                                    </li>
                                })
                            }
                        </ul>
                    }
                    {
                        details.sharedWith && details.sharedWith.length === 0 &&
                        <p style={{ textAlign: 'center' }}>No record Found</p>
                    }
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" style={{ width: '100%' }} disabled={!isEnable} onClick={onSubmitHandler}>Share</Button>
            </Modal.Footer>
        </Modal >
    )
}

export default Share
