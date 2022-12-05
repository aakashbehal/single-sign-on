import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from 'react-icons/cg';
import { useSelector, useDispatch } from "react-redux"
import { MiscActionCreator } from "../../store/actions/common/misc.actions";

import Styles from "./Common.module.sass"

const Timezones = forwardRef(({ selectedValue = '', isDisabled = false, type = 'phone' }: { selectedValue?: string, isDisabled?: boolean, type: string }, ref) => {
    const dispatch = useDispatch()
    const { Timezones, TimezonesError, TimezonesLoading }: any = useSelector((state: any) => ({
        Timezones: state.misc.Timezones.data,
        TimezonesError: state.misc.Timezones.error,
        TimezonesLoading: state.misc.Timezones.loading,
    }))

    const [value, setValue] = useState(selectedValue)

    useImperativeHandle(ref, () => ({
        reset() {
            setValue("");
        }
    }));

    useEffect(() => {
        if (Timezones && Timezones.length === 0 && !Timezones) {
            dispatch(MiscActionCreator.getCountryTimeZone())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Timezones])

    useEffect(() => {
        setValue(selectedValue)
    }, [selectedValue])


    return (
        <>
            {
                TimezonesError
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
                !TimezonesError && TimezonesLoading &&
                <CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} />
            }
            <Form.Control
                as="select"
                name="timezone"
                value={value}
                onChange={(e) => { setValue(e.target.value) }}>
                <option></option>
                {
                    Timezones && Timezones.map((email: any, index: number) => {
                        return (
                            <option
                                key={`agency_${index}`}
                                value={email.timeZoneCode}
                            >
                                {email.fullName}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
})

export default Timezones