import React, { useEffect, useRef, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"

import { userService } from "../../services";
import UseDocumentTitle from "../../helpers/useDocumentTitle"

import { IAdditionSettingsJson } from "../../components/modal/NamingAdditionalFields";
import RetentionPolicy from "./RetentionPolicy";
import DocumentPolicy from "./DocumentPolicy";
import ListOfUserFileNamingConfiguration from "./ListOfFileNamingConfiguration";
import { FileNameConfigActionCreator } from "../../store/actions/fileNameConfig.actions";
import { createMessage } from "../../helpers/messages";
import { useToasts } from "react-toast-notifications";

export interface IDocConfig {
    fileFieldCode: string
    attributeCode: string
    isDocumentGroupIdentifier: boolean
    isDocumentUniqueIdentifier: boolean
    attributeName: string
    isMandatory: boolean
    regex: string | null
    validationRule: IAdditionSettingsJson
    isTransformation: boolean
    transformationValue: string
}

export interface fieldsSelected {
    fileFieldCode: string
    start: number
    end: number
}
export interface IConfiguration {
    namingConfigGroupCode: string
    namingConfigGroupName: string
    separatorCode: string
    sample?: string
    fields?: fieldsSelected[]
    userDocConfig: IDocConfig[]
    namingConfigGroupId: number,
    defaultDocTypeCode: string | null,
    defaultDocGroupConfigCode: string | null
}

const DocumentGeneralConfiguration = () => {
    const { addToast } = useToasts();
    UseDocumentTitle('Document General Configuration')
    const ref = useRef<any>();
    const dispatch = useDispatch();
    const [userType, setUserType] = useState(null)
    const [showConfig, setShowConfig] = useState(false)
    const [configurationDetails, setConfigurationDetails] = useState(null)

    const {
        policy,
        loading,
        error,
        retentionPolicySuccess,
        retentionPolicyError,
        retentionPolicyLoading,
        duplicatePolicySuccess,
        duplicatePolicyError,
        duplicatePolicyLoading
    } = useSelector((state: any) => ({
        policy: state.fileNameConfig.policy.data,
        loading: state.fileNameConfig.policy.loading,
        error: state.fileNameConfig.policy.error,
        retentionPolicySuccess: state.fileNameConfig.saveRetentionPolicy.success,
        retentionPolicyError: state.fileNameConfig.saveRetentionPolicy.error,
        retentionPolicyLoading: state.fileNameConfig.saveRetentionPolicy.loading,
        duplicatePolicySuccess: state.fileNameConfig.saveDuplicatePolicy.success,
        duplicatePolicyError: state.fileNameConfig.saveDuplicatePolicy.error,
        duplicatePolicyLoading: state.fileNameConfig.saveDuplicatePolicy.loading
    }))

    useEffect(() => {
        const user = userService.getUser();
        setUserType(user.recordSource);
        getPolicies()
    }, [])

    useEffect(() => {
        if (retentionPolicySuccess) {
            addToast(createMessage('success', 'retention policy', 'update'), { appearance: 'success', autoDismiss: true });
        }
        if (duplicatePolicySuccess) {
            addToast(createMessage('success', 'duplicate policy', 'update'), { appearance: 'success', autoDismiss: true });
        }
        getPolicies()
    }, [retentionPolicySuccess, duplicatePolicySuccess])

    useEffect(() => {
        if (retentionPolicyError) {
            addToast(createMessage('error', 'retention policy', 'updating'), { appearance: 'success', autoDismiss: true });
        }
        if (duplicatePolicyError) {
            addToast(createMessage('error', 'duplicate policy', 'updating'), { appearance: 'success', autoDismiss: true });
        }
    }, [duplicatePolicyError, retentionPolicyError])

    const getPolicies = () => {
        dispatch(FileNameConfigActionCreator.getPolicy())
    }

    return <>
        {<ListOfUserFileNamingConfiguration ref={ref} dispatch={dispatch} setConfigurationDetails={setConfigurationDetails} setShowConfig={setShowConfig} />}
        <br />
        {
            (userType === 'Client' || userType === 'Equabli') && JSON.stringify(policy) !== "{}"
            && <Row>
                <Col sm={6}>
                    <RetentionPolicy dispatch={dispatch} policy={policy} loading={loading} error={error} />
                </Col>
                <Col sm={6}>
                    <DocumentPolicy dispatch={dispatch} policy={policy} loading={loading} error={error} />
                </Col>
            </Row>
        }
    </>
}

export default DocumentGeneralConfiguration