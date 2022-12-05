import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { AiFillWarning } from "react-icons/ai"
import { CgSpinnerAlt } from 'react-icons/cg';
import { useSelector, useDispatch } from 'react-redux';

import Styles from "./Common.module.sass"
import { MiscActionCreator } from "../../store/actions/common/misc.actions";
import { userService } from "../../services";

const Clients = forwardRef(({ selectedValue = '', isDisabled = false }: { selectedValue?: string, isDisabled?: boolean }, ref) => {
    const dispatch = useDispatch()
    const { clients, error, loading }: any = useSelector((state: any) => ({
        clients: state.misc.client.data,
        error: state.misc.client.error,
        loading: state.misc.client.loading
    }))

    const [userData, setUserData] = useState<any>(null)
    const [disabled, setDisabled] = useState<boolean>(isDisabled)
    const [value, setValue] = useState(selectedValue)

    useImperativeHandle(ref, () => ({
        reset() {
            if (userData && userData.recordSource !== 'Client') {
                setValue("");
            }
        }
    }));

    useEffect(() => {
        const user = userService.getUser();
        setUserData(user)
    }, [])

    useEffect(() => {
        if (clients && clients.length === 0 && !error) {
            dispatch(MiscActionCreator.getClients())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clients])

    useEffect(() => {
        setValue(selectedValue)
    }, [selectedValue])


    useEffect(() => {
        if (userData && userData.recordSource === 'Client') {
            setValue(userData.clientId)
        } else {
            setValue(selectedValue)
        }
    }, [selectedValue, userData])

    useEffect(() => {
        if (userData && userData.recordSource === 'Client') {
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
                name="clientId"
                value={value}
                disabled={disabled}
                className="select_custom"
                onChange={(e) => { setValue(e.target.value) }}
            >
                <option></option>
                {
                    clients && clients.map((client: any, index: number) => {
                        return (
                            <option
                                key={`client${index}`}
                                value={client.clientId}
                            >
                                {client.clientName}
                            </option>
                        )
                    })
                }
            </Form.Control>
        </>
    )
})

export default Clients