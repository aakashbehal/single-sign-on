import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux"

import Styles from "./Common.module.sass"
import { MiscActionCreator } from "../../store/actions/common/misc.actions";

const States = forwardRef(({ selectedValue = '' }: { selectedValue?: string }, ref) => {
    const dispatch = useDispatch()
    const { states, error, loading }: any = useSelector((state: any) => ({
        states: state.misc.state.data,
        error: state.misc.state.error,
        loading: state.misc.state.loading
    }))

    const [value, setValue] = useState(selectedValue)

    useImperativeHandle(ref, () => ({
        reset() {
            setValue("");
        }
    }));

    useEffect(() => {
        if (states && states.length === 0 && !error) {
            dispatch(MiscActionCreator.getStates())
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
                <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
            }
            <Form.Control
                as="select"
                name="state"
                className="select_custom"
                value={value}
                onChange={(e) => { setValue(e.target.value) }}>
                <option></option>
                {
                    states && states.map((state: any, index: number) => {
                        return (
                            <option
                                key={`state_${index}`}
                                value={state.stateCode}
                            >
                                {state.stateCode} - {state.fullName}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
})

export default States