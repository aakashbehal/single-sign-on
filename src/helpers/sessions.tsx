import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useDispatch } from "react-redux"
import { useToasts } from 'react-toast-notifications';
import { LoginActionCreator } from '../store/actions/auth.actions';

export const sessions = (WrappedComponent: any) => {
    const HOC = forwardRef((props, ref) => {
        // const { addToast, removeAllToasts } = useToasts();
        const dispatch = useDispatch();
        let warningTimeout: any
        let logoutTimeout: any
        const state = {
            warningTime: 1000 * 60 * 59,
            signOutTime: 1000 * 60 * 60
        }

        useEffect(() => {
            const events = [
                'load',
                'mousemove',
                'mousedown',
                'click',
                'scroll',
                'keypress'
            ]
            addListeners(events)
            setTimeoutHandler()
            window.scroll(0, 0)
            return () => {
                clearTimer()
                removeListeners(events)
            }
        }, [])

        const addListeners = (events: any) => {
            for (let i = 0; i < events.length; i++) {
                window.addEventListener(events[i], resetTimeout)
            }
        }

        const removeListeners = (events: any) => {
            for (let i = 0; i < events.length; i++) {
                window.removeEventListener(events[i], resetTimeout)
            }
        }

        const resetTimeout = (e: any) => {
            clearTimer()
            setTimeoutHandler()
        }

        const clearTimer = () => {
            clearTimeout(warningTimeout)
            clearTimeout(logoutTimeout)
        }

        const setTimeoutHandler = () => {
            // removeAllToasts()
            warningTimeout = setTimeout(warn, state.warningTime)
            logoutTimeout = setTimeout(logout, state.signOutTime)
        }

        const warn = () => {
            // addToast(`Session timeout: Your session is timed-out due to inactivity. Please log-in again.`, { appearance: 'warning', autoDismiss: false })
        }

        const logout = () => {
            // removeAllToasts()
            // addToast(`Session timeout, reason: Ideal system`, { appearance: 'error', autoDismiss: false })
            dispatch(LoginActionCreator.logout())
        }

        return <WrappedComponent {...props} ref={ref} />
    })

    return HOC
}
