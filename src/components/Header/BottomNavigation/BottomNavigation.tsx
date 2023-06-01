import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa"
import { MdOutlinePhonelinkSetup } from "react-icons/md"
import { Link, useHistory } from 'react-router-dom';
import { NavDropdown } from "react-bootstrap"

import Styles from "./BottomNavigation.module.sass"
import { userService } from "../../../services";

const rolesMapping: any = {
    "Equabli": [
        'documents',
        'my_documents',
        "sent_document_requests",
        "received_document_requests",
        "download_history",
        "templates"
    ],
    "Client": [
        'documents',
        'my_documents',
        "sent_document_requests",
        "received_document_requests",
        "download_history",
        "templates",
        "client",
        "partner"
    ],
    "Partner": [
        'documents',
        'my_documents',
        "sent_document_requests",
        "received_document_requests",
        "download_history",
        "templates"
    ]
}

const BottomNavigation = () => {
    const history = useHistory();
    const [activeRoute, setActiveRoute] = useState<string>('documents')
    const [role, setRole] = useState<any>(null)

    useEffect(() => {
        const user = userService.getUser()
        if (user === null) {
            history.push('/login')
        } else {
            setRole(user.recordSource)
            const locationArr: any = window.location.hash.split('/')
            setActiveRoute(locationArr[locationArr.length - 1])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSelect = (eventKey: any) => {
        setActiveRoute(eventKey)
    }

    const Routes = () => {
        return (
            <ul>
                {
                    role && rolesMapping[role].includes('documents')
                    && <li className={Styles.dropdown_link}>
                        <NavDropdown title={
                            <>
                                <FaTasks /> &nbsp;
                                <span>Documents</span>
                            </>
                        }
                            active={
                                activeRoute === 'my_documents'
                                || activeRoute === "sent_document_requests"
                                || activeRoute === "received_document_requests"
                                || activeRoute === "download_history"
                                || activeRoute === "templates"
                            }
                            id="collasible-nav-dropdown"
                            onSelect={handleSelect}
                            className={Styles.dropdown_nav}>
                            {
                                role && rolesMapping[role].includes('my_documents')
                                && <NavDropdown.Item
                                    eventKey={"my_documents"}
                                    as={Link}
                                    active={"my_documents" === activeRoute}
                                    to="/documents/my_documents">My Documents</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('sent_document_requests')
                                && <NavDropdown.Item
                                    eventKey={"sent_document_requests"}
                                    as={Link}
                                    active={"sent_document_requests" === activeRoute}
                                    to="/documents/sent_document_requests">Sent Document Requests</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('received_document_requests')
                                && <NavDropdown.Item
                                    eventKey={"received_document_requests"}
                                    as={Link}
                                    active={"received_document_requests" === activeRoute}
                                    to="/documents/received_document_requests">Received Document Requests</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('download_history')
                                && <NavDropdown.Item
                                    eventKey={"download_history"}
                                    as={Link}
                                    active={"download_history" === activeRoute}
                                    to="/documents/download_history">Download History</NavDropdown.Item>
                            }
                            {/* {
                                role && rolesMapping[role].includes('templates')
                                && <NavDropdown.Item
                                    eventKey={"templates"}
                                    as={Link}
                                    active={"templates" === activeRoute}
                                    to="/documents/templates">Templates</NavDropdown.Item>
                            } */}
                        </NavDropdown>
                    </li>
                }
                <li className={Styles.dropdown_link}>
                    <NavDropdown title={
                        <>
                            <MdOutlinePhonelinkSetup /> &nbsp;
                            <span>Setup</span>
                        </>
                    }
                        active={
                            activeRoute === 'client'
                            || activeRoute === "partner"
                        }
                        id="collasible-nav-dropdown"
                        onSelect={handleSelect}
                        className={Styles.dropdown_nav}>
                        {
                            role && rolesMapping[role].includes('client')
                            && <NavDropdown.Item
                                eventKey={"client"}
                                as={Link}
                                active={"client" === activeRoute}
                                to="/setup/client">Clients</NavDropdown.Item>
                        }
                        {
                            role && rolesMapping[role].includes('partner')
                            && <NavDropdown.Item
                                eventKey={"partner"}
                                as={Link}
                                active={"partner" === activeRoute}
                                to="/setup/partner">Partners</NavDropdown.Item>
                        }
                    </NavDropdown>
                </li>
            </ul >
        )
    }

    return (
        <nav className={Styles.nav}>
            {
                Routes()
            }

        </nav >
    )
}

export default BottomNavigation