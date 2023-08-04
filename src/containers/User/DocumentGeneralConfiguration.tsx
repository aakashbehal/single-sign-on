import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Col, Row, Form, Button, OverlayTrigger, Tooltip, Table, Modal } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi"

import Styles from "./User.module.sass"
import { FileNameConfigActionCreator } from "../../store/actions/fileNameConfig.actions";
import { fileNameConfigService, userService } from "../../services";
import UseDocumentTitle from "../../helpers/useDocumentTitle"
import { useToasts } from "react-toast-notifications"
import { createMessage } from "../../helpers/messages"
import { CgSpinnerAlt } from "react-icons/cg"
import { BsFillQuestionCircleFill } from "react-icons/bs"
import { TypesActionCreator } from "../../store/actions/common/types.actions"
import xlsx from "json-as-xlsx"
import { FiEdit2 } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"
import NoRecord from "../../components/Common/NoResult"
import DeleteConfirm from "../../components/modal/DeleteConfirm"
import { history } from "../../helpers"

export interface IDocConfig {
    docMgrConfigSelectedCode: string,
    domainAttributeMappingSelectedCode: string,
    isDocumentGroupIdentifier: boolean,
    isDocumentUniqueIdentifier: boolean
    attributeName: string,
    isMandatory: boolean,
    regex: string | null
}
export interface IConfiguration {
    namingConfigGroupCode: string
    namingConfigGroupName: string
    separatorCode: string
    userDocConfig: IDocConfig[]
}

const DocumentGeneralConfiguration = () => {
    UseDocumentTitle('Document General Configuration')
    const ref = useRef<any>();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [userType, setUserType] = useState(null)
    const [showConfig, setShowConfig] = useState(false)
    const [configurationDetails, setConfigurationDetails] = useState(null)
    useEffect(() => {
        const user = userService.getUser();
        setUserType(user.recordSource);
    }, [])

    return <>
        {<ListOfUserFileNamingConfiguration ref={ref} dispatch={dispatch} setConfigurationDetails={setConfigurationDetails} setShowConfig={setShowConfig} />}
        <br />
        {
            (userType === 'Client' || userType === 'Equabli')
            && <Row>
                <Col sm={6}>
                    <RetentionPolicy dispatch={dispatch} />
                </Col>
                <Col sm={6}>
                    <DocumentPolicy dispatch={dispatch} />
                </Col>
            </Row>
        }
    </>
}

const ListOfUserFileNamingConfiguration = forwardRef(({ dispatch, setConfigurationDetails, setShowConfig }: any, ref) => {
    const { addToast } = useToasts();
    const [showConfirmDelete, setShowConfirmDelete] = useState<Boolean>(false)
    const [toDelete, setToDelete] = useState<string>('')
    const {
        confListLoading,
        confListError,
        confList,
        deleteRequest,
        deleteSuccess,
        deleteError
    } = useSelector((state: any) => ({
        confListLoading: state.fileNameConfig.fileNamingConfigList.loading,
        confListError: state.fileNameConfig.fileNamingConfigList.error,
        confList: state.fileNameConfig.fileNamingConfigList.data,
        deleteRequest: state.fileNameConfig.fileNamingConfigList.deleteRequest,
        deleteSuccess: state.fileNameConfig.fileNamingConfigList.deleteSuccess,
        deleteError: state.fileNameConfig.fileNamingConfigList.deleteError,
    }))

    useEffect(() => {
        getListOfUserConfig()
    }, [])

    useEffect(() => {
        if (deleteSuccess) {
            addToast(createMessage('success', 'user configuration', 'delete'), { appearance: 'success', autoDismiss: true });
            getListOfUserConfig()
            setConfigurationDetails(null)
            setShowConfig(false)
        }
        if (deleteError) {
            addToast(createMessage('error', `User Configuration`, 'Delete'), { appearance: 'error', autoDismiss: false });
        }
    }, [deleteRequest,
        deleteSuccess,
        deleteError])

    useImperativeHandle(ref, () => ({
        refreshData() {
            getListOfUserConfig()
        }
    }));

    const getListOfUserConfig = () => {
        dispatch(FileNameConfigActionCreator.getListOfUserConfig())
    }

    const formatConfiguration = (confArr: IDocConfig[], separatorCode: string, type: string): string => {
        let confString = ``
        for (let index = 0; index < confArr.length; index++) {
            let text = type === 'short' ? (confArr[index].domainAttributeMappingSelectedCode) : `<${confArr[index].attributeName}>`
            confString += (text).trim() + ((index < confArr.length - 1) ? separatorCode : '')
        }
        return confString
    }

    const handleEdit = (config: IConfiguration) => {
        // setConfigurationDetails(config)
        localStorage.setItem('naming_config', JSON.stringify(config))
        history.push(`/profile/document_general_configuration/${config.namingConfigGroupName}`)
        // setShowConfig(true)
    }

    const addNewHandler = () => {
        history.push(`/profile/document_general_configuration/_NEW_CONFIGURATION`)
        // setShowConfig(true)
    }

    const deleteConfiguration = (conf: IConfiguration) => {
        setToDelete(conf.namingConfigGroupCode)
        setShowConfirmDelete(true)
    }

    const approveHandler = () => {
        dispatch(FileNameConfigActionCreator.deleteUserConfiguration(toDelete))
        setShowConfirmDelete(false)
    }

    return (
        <Row className="form_container" style={{ margin: 0 }}>
            <Col sm={12} className="no_padding" style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => addNewHandler()}>+ Add New</Button>
            </Col>
            {
                confListLoading
                && <CgSpinnerAlt style={{ textAlign: 'center', width: '100%' }} className="spinner" size={50} />
            }
            {
                !confListLoading && confList.length === 0
                && <NoRecord />
            }
            {
                !confListLoading && <Table striped hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                    <thead>
                        <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                            <th>#</th>
                            <th style={{ width: "15%" }}>Name</th>
                            <th style={{ width: "25%" }}>File Name</th>
                            <th style={{ width: "60%" }}>File Name Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            confList && confList.map((conf: IConfiguration, index: number) => {
                                return <tr key={`confList_${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{conf.namingConfigGroupName}</td>
                                    <td>{formatConfiguration(conf.userDocConfig, conf.separatorCode, 'short')}</td>
                                    <td>{formatConfiguration(conf.userDocConfig, conf.separatorCode, 'long')}</td>
                                    <td className='span1' style={{ minWidth: '130px', textAlign: 'center' }}>
                                        <span>
                                            <OverlayTrigger
                                                placement="bottom"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={
                                                    <Tooltip id={`tooltip-error`}>
                                                        Edit
                                                    </Tooltip>
                                                }
                                            >
                                                <FiEdit2 onClick={() => handleEdit(conf)} size={20} style={{ cursor: 'pointer' }} />
                                            </OverlayTrigger>
                                        </span> &nbsp;
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
                                                {/* onClick={() => handleDetails(cT)} */}
                                                <AiOutlineDelete onClick={() => deleteConfiguration(conf)} size={20} style={{ cursor: 'pointer' }} />
                                            </OverlayTrigger>
                                        </span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
            }
            {
                showConfirmDelete
                &&
                <DeleteConfirm
                    show={showConfirmDelete}
                    onHide={() => setShowConfirmDelete(false)}
                    confirmDelete={approveHandler}
                    details={toDelete}
                    type="configuration"
                />
            }
        </Row>

    )
})


const RetentionPolicy = ({ dispatch }: any) => {
    const retentionSaveRef = useRef<any>();
    const retentionRef = useRef<any>();
    const [retention, setRetention] = useState<any>(60)
    const [minMaxError, setMinMaxError] = useState<any>(false)

    const {
        isLoadingRetention,
        dataUserRetentionPolicy,
        dataRetentionPolicy,
    } = useSelector((state: any) => ({
        isLoadingRetention: state.fileNameConfig.userRetentionPolicy.loading,
        dataUserRetentionPolicy: state.fileNameConfig.userRetentionPolicy.data,
        dataRetentionPolicy: state.fileNameConfig.retentionPolicy.data
    }))

    useEffect(() => {
        dispatch(FileNameConfigActionCreator.getRetentionPolicy())
        dispatch(FileNameConfigActionCreator.getUserRetentionPolicy())
    }, [])

    useEffect(() => {
        if (dataUserRetentionPolicy) {
            setRetention(dataUserRetentionPolicy ? dataUserRetentionPolicy.configValSelectedCode : dataRetentionPolicy.defaultValue)
        }
    }, [dataUserRetentionPolicy])

    const handleSave = () => {
        if (Number(retention) < 60 || Number(retention) > 365) {
            setMinMaxError(true)
            return
        } else {
            setMinMaxError(false)
            let configRequest = [{
                "configShortCode": "RP",
                "configValShortCode": retention,
                "orgTypeCode": "CT"
            }]
            dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
        }
    }

    const resetHandler = () => {
        setRetention(60)
        setTimeout(() => {
            retentionSaveRef.current.click()
        }, 0)
    }

    return (
        <>
            {
                !isLoadingRetention && <Row style={{ margin: 0 }} className="form_container">
                    <Col lg={12} sm={12}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Document Retention Policy</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form ref={retentionRef} onSubmit={(e) => handleSave()}>
                            <Row>
                                <Col lg={12} md={12}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={11} sm={11}>
                                                <Form.Control
                                                    className="select_custom"
                                                    type="number"
                                                    name="retention_policy"
                                                    onChange={(e) => {
                                                        setRetention(e.target.value)
                                                    }}
                                                    value={retention} />
                                            </Col>
                                            <Col md={1} style={{ display: 'flex', alignItems: 'center' }}><p style={{ margin: 0 }}>Days</p></Col>
                                            <span style={{ color: 'red', marginLeft: "1rem" }}><small>{minMaxError ? 'Retention Policy Should be between 60 to 365 days' : ''}</small></span>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Retain document after closure of account till</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} ref={retentionSaveRef} type="submit">Save</Button>{" "}
                                    <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler()}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            }
        </>

    )
}

const DocumentPolicy = ({ dispatch }: any) => {
    const otherSaveRef = useRef<any>()
    const [modeSelected, setModeSelected] = useState('KBF');
    const [mode, setMode] = useState([
        {
            keycode: 'KBF',
            keyvalue: 'Keep Both Files'
        },
        {
            keycode: 'RE',
            keyvalue: 'Replace Existing'
        }
    ])

    const {
        isLoadingDocumentPolicy,
        dataDocumentPolicy,
        dataUserDocumentPolicy,
    } = useSelector((state: any) => ({
        isLoadingDocumentPolicy: state.fileNameConfig.userDocumentPolicy.loading,
        dataUserDocumentPolicy: state.fileNameConfig.userDocumentPolicy.data,
        dataDocumentPolicy: state.fileNameConfig.documentPolicy.data,
    }))

    useEffect(() => {
        if (dataUserDocumentPolicy) {
            setModeSelected((dataUserDocumentPolicy ? dataUserDocumentPolicy.configValSelectedCode : "KBF"))
        }
    }, [dataUserDocumentPolicy])

    useEffect(() => {
        dispatch(FileNameConfigActionCreator.getDocumentPolicy())
        dispatch(FileNameConfigActionCreator.getUserDocumentPolicy())
    }, [])

    const resetHandler = () => {
        setModeSelected('KBF')
        setTimeout(() => {
            otherSaveRef.current.click()
        }, 0)
    }
    const handleSave = () => {
        let configRequest = [{
            "configShortCode": "DP",
            "configValShortCode": modeSelected,
            "orgTypeCode": "CT"
        }]
        dispatch(FileNameConfigActionCreator.saveUserConfiguration(configRequest))
    }
    return (
        <>
            {
                !isLoadingDocumentPolicy && <Row style={{ margin: 0 }} className="form_container">
                    <Col lg={12} sm={12}>
                        <Row>
                            <Col sm={12}><h5 style={{ marginLeft: '1rem' }}>Other Configuration</h5></Col>
                        </Row>
                        <br />
                        <br />
                        <Form onSubmit={(e) => handleSave()}>
                            <Row>
                                <Col lg={12} md={6}>
                                    <Form.Group as={Col} className="mb-4">
                                        <Row>
                                            <Col md={12} sm={12}>
                                                {
                                                    mode && mode.map((m: any, index: number) => (
                                                        <Form.Check
                                                            key={`default-${index}`}
                                                            inline
                                                            type="radio"
                                                            onChange={(e: any) => {
                                                                setModeSelected(e.target.value)
                                                            }}
                                                            checked={m.keycode == modeSelected}
                                                            value={m.keycode}
                                                            name='mode'
                                                            label={m.keyvalue}
                                                        />
                                                    ))
                                                }
                                            </Col>
                                            <span style={{ color: 'red', marginLeft: "1rem" }}><small></small></span>
                                        </Row>
                                        <Form.Label className="label_custom" style={{ left: '10px' }}>Incase of Document Duplication</Form.Label>
                                    </Form.Group>
                                </Col>
                                <Col sm={12} className="mt-4" style={{ marginLeft: '1rem' }}>
                                    <Button variant="dark" style={{ width: "140px" }} ref={otherSaveRef} type="submit">Save</Button>{" "}
                                    <Button variant="dark" style={{ width: "140px" }} onClick={(e) => resetHandler()}>Reset to Default</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            }
        </>
    )
}

export default DocumentGeneralConfiguration