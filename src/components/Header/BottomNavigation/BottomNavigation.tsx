import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { FaTasks, FaSearch, FaArchive, FaUserCog } from "react-icons/fa"
import { MdDashboard, MdOutlineManageAccounts } from "react-icons/md"
import { HiOutlineDocument } from "react-icons/hi"
import { NavLink, Link, useHistory } from 'react-router-dom';
import { NavDropdown } from "react-bootstrap"

import Styles from "./BottomNavigation.module.sass"
import { userService } from "../../../services";

const rolesMapping = {
    "Equabli": [
        'documents',
        'my_documents',
        "sent_document_requests",
        "received_document_requests",
        "templates"
    ],
    "Client": [
        'documents',
        'my_documents',
        "sent_document_requests",
        "received_document_requests",
        "templates"
    ],
    "Partner": [
        'documents',
        'my_documents',
        "sent_document_requests",
        "received_document_requests",
        "templates"
    ]
}

const BottomNavigation = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const [activeRoute, setActiveRoute] = useState<string>('documents')
    const [role, setRole] = useState<any>(null)

    useEffect(() => {
        const user = userService.getUser()
        if (user === null) {
            history.push('/login')
        } else {
            setRole(user.role)
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
                                role && rolesMapping[role].includes('templates')
                                && <NavDropdown.Item
                                    eventKey={"templates"}
                                    as={Link}
                                    active={"templates" === activeRoute}
                                    to="/documents/templates">Templates</NavDropdown.Item>
                            }
                        </NavDropdown>
                    </li>
                }
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