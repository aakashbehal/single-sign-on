import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux"

import Styles from "./Common.module.sass"
import { MiscActionCreator } from "../../store/actions/common/misc.actions";

const States = forwardRef(({ selectedValue = '' }: { selectedValue?: string }, ref) => {
    const dispatch = useDispatch()
    const { statuses, error, loading }: any = useSelector((state: any) => ({
        statuses: state.misc.status.data,
        error: state.misc.status.error,
        loading: state.misc.status.loading
    }))

    const [value, setValue] = useState<any>(selectedValue)

    useImperativeHandle(ref, () => ({
        reset() {
            setValue("");
        }
    }));

    useEffect(() => {
        if (statuses && statuses.length === 0) {
            dispatch(MiscActionCreator.getStatus())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                <CgSpinnerAlt className={`spinner ${Styles.details_warning}`} size={20} />
            }
            <Form.Control
                as="select"
                name="statusId"
                value={value}
                className="select_custom"
                onChange={(e) => { setValue(e.target.value) }}>
                <option></option>
                {
                    statuses && statuses.map((status: any, index: number) => {
                        return (
                            <option
                                key={`state_${index}`}
                                value={status.queueStatusId}
                            >
                                {status.shortName} - {status.fullName}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
})

export default States