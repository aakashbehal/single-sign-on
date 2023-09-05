import React, { useEffect, useRef, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useDispatch } from "react-redux"

import { userService } from "../../services";
import UseDocumentTitle from "../../helpers/useDocumentTitle"

import { IAdditionSettingsJson } from "../../components/modal/NamingAdditionalFields";
import RetentionPolicy from "./RetentionPolicy";
import DocumentPolicy from "./DocumentPolicy";
import ListOfUserFileNamingConfiguration from "./ListOfFileNamingConfiguration";

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
}

const DocumentGeneralConfiguration = () => {
    UseDocumentTitle('Document General Configuration')
    const ref = useRef<any>();
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

export default DocumentGeneralConfiguration