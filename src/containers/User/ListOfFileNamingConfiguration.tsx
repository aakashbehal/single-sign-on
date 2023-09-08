import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { CgSpinnerAlt } from "react-icons/cg"
import { FiEdit2 } from "react-icons/fi"
import { AiOutlineDelete } from "react-icons/ai"

import { createMessage } from "../../helpers/messages";
import { FileNameConfigActionCreator } from "../../store/actions/fileNameConfig.actions";
import { IConfiguration, IDocConfig } from "./DocumentGeneralConfiguration";
import { history } from "../../helpers"
import NoRecord from "../../components/Common/NoResult"
import DeleteConfirm from "../../components/modal/DeleteConfirm"
import { Button, Col, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";

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
        localStorage.removeItem('naming_config')
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
            let text = type === 'short' ? (confArr[index].attributeCode) : `<${confArr[index].attributeName}>`
            confString += (text).trim() + ((index < confArr.length - 1) ? separatorCode : '')
        }
        return confString
    }

    const handleEdit = (config: IConfiguration) => {
        // setConfigurationDetails(config)
        localStorage.setItem('naming_config', JSON.stringify(config))
        history.push(`/setup/document_general_configuration/${config.namingConfigGroupName}`)
        // setShowConfig(true)
    }

    const addNewHandler = () => {
        history.push(`/setup/document_general_configuration/_NEW_CONFIGURATION`)
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
        <React.Fragment>
            <Col sm={12} className="no_padding" style={{ textAlign: 'right', marginBottom: '1rem' }}>
                <Button variant="dark" className="pull-right" onClick={() => addNewHandler()}>Add New Naming Configuration</Button>
            </Col>
            <Row style={{ margin: 0 }}>
                {
                    confListLoading
                    && <CgSpinnerAlt style={{ textAlign: 'center', width: '100%' }} className="spinner" size={50} />
                }
                {
                    !confListLoading && confList.length === 0
                    && <NoRecord />
                }
                {
                    !confListLoading && confList.length > 0 && <Table striped hover responsive size="sm" className="tableHeight" style={{ marginBottom: 0 }}>
                        <thead>
                            <tr style={{ lineHeight: '35px', backgroundColor: '#000', color: 'white' }}>
                                <th>#</th>
                                <th style={{ width: "15%" }}>Name</th>
                                <th style={{ width: "10%" }}>Transformed</th>
                                <th style={{ width: "15%" }}>File Name</th>
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
                                        <td>{conf.sample ? 'Yes' : 'No'}</td>
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
        </React.Fragment>
    )
})

export default ListOfUserFileNamingConfiguration