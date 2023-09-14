import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from 'react-icons/cg';
import { useSelector, useDispatch } from "react-redux"

import Styles from "./Common.module.sass"
import { TypesActionCreator } from "../../store/actions/common/types.actions";

const DocumentTypes = forwardRef(({ selectedValue = '', isDisabled = false }: { selectedValue?: string, isDisabled?: boolean }, ref) => {
    const dispatch = useDispatch()
    const {
        documentTypes,
        loading,
        error
    }: any = useSelector((state: any) => ({
        documentTypes: state.types.documentType.data,
        loading: state.types.documentType.loading,
        error: state.types.documentType.error,
    }))

    const [value, setValue] = useState(selectedValue)

    useImperativeHandle(ref, () => ({
        reset() {
            setValue("");
        }
    }));

    useEffect(() => {
        if (documentTypes && documentTypes.length === 0 && !error) {
            dispatch(TypesActionCreator.getDocumentTypes())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentTypes])

    return (
        <>
            {error &&
                <OverlayTrigger
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
                !error && loading &&
                <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
            }
            <Form.Control
                as="select"
                name="document_type"
                value={value}
                className="select_custom"
                onChange={(e) => { setValue(e.target.value) }}>
                <option disabled value="">Select Document Type...</option>
                {
                    documentTypes && documentTypes.sort(function (a: any, b: any) {
                        if (a.partnerName < b.partnerName) { return -1; }
                        if (a.partnerName > b.partnerName) { return 1; }
                        return 0;

                    }).map((agency: any, index: number) => {
                        return (
                            <option
                                key={`agency_${index}`}
                                value={agency.keyCode}
                            >
                                {agency.keyValue}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
})

export default DocumentTypes