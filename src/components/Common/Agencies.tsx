import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from 'react-icons/cg';
import { useSelector, useDispatch } from "react-redux"

import Styles from "./Common.module.sass"
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import { userService } from "../../services";

const Agencies = forwardRef(({ selectedValue = '', isDisabled = false }: { selectedValue?: string, isDisabled?: boolean }, ref) => {
    const dispatch = useDispatch()
    const { agencies, error, loading }: any = useSelector((state: any) => ({
        agencies: state.misc.agency.data,
        error: state.misc.agency.error,
        loading: state.misc.agency.loading
    }))

    const [userData, setUserData] = useState<any>(null)
    const [disabled, setDisabled] = useState<boolean>(isDisabled)
    const [value, setValue] = useState(selectedValue)

    useImperativeHandle(ref, () => ({
        reset() {
            if (userData && userData.recordSource !== 'Partner') {
                setValue("");
            }
        }
    }));

    useEffect(() => {
        const user = userService.getUser();
        setUserData(user)
    }, [])

    useEffect(() => {
        if (agencies && agencies.length === 0 && !error) {
            dispatch(MiscActionCreator.getAgencies())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [agencies])

    useEffect(() => {
        if (userData && userData.recordSource === 'Partner') {
            setValue(userData.partnerId)
        } else {
            setValue(selectedValue)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedValue, userData])

    useEffect(() => {
        if (userData && userData.recordSource === 'Partner') {
            setDisabled(true)
        } else {
            setValue(selectedValue)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDisabled, userData])

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
                name="partnerId"
                value={value}
                disabled={disabled}
                className="select_custom"
                onChange={(e) => { setValue(e.target.value) }}>
                <option></option>
                {
                    agencies && agencies.sort(function (a: any, b: any) {
                        if (a.partnerName < b.partnerName) { return -1; }
                        if (a.partnerName > b.partnerName) { return 1; }
                        return 0;

                    }).map((agency: any, index: number) => {
                        return (
                            <option
                                key={`agency_${index}`}
                                value={agency.partnerId}
                            >
                                {agency.shortName} - {agency.partnerName}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
})

export default Agencies