import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from 'react-icons/cg';
import { useSelector, useDispatch } from 'react-redux';

import Styles from "./Common.module.sass"
import { userService } from "../../services";
import { DomainActionCreator } from '../../store/actions/domain.actions';

const Domains = ({ selectedValue = '' }: { selectedValue?: string }) => {
    const dispatch = useDispatch()
    const { domains, error, loading }: any = useSelector((state: any) => ({
        domains: state.domain.data,
        error: state.domain.error,
        loading: state.domain.loading
    }))

    const [value, setValue] = useState(selectedValue)

    useEffect(() => {
        dispatch(DomainActionCreator.getAllDomains())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // useEffect(() => {
    //     for (let domain of domains) {
    //         if (domain.domainId === selectedValue) {
    //             setValue(domain.code)
    //         }
    //     }
    // }, [domains, selectedValue])

    useEffect(() => {
        setValue(selectedValue)
    }, [selectedValue])

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
                name="domain"
                value={value}
                className="select_custom"
                onChange={(e) => { setValue(e.target.value) }}
            >
                <option></option>
                {
                    domains && domains.map((domain: any, index: number) => {
                        return (
                            <option
                                key={`client${index}`}
                                value={domain.code}
                            >
                                {domain.name}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
}

export default Domains