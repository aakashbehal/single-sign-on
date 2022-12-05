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
        'scrubbing',
        'actionItems',
        'myRequest',
        'pendingForApproval',
        'allRequest',
        'pendingForApproval',
        'search',
        'accountSearch',
        'consumerSearch',
        'inventory',
        'admin',
        'report',
        'alerts',
        'scheduler',
        'processDashboard',
        'configurationManagement'
    ],
    "Client": [
        'scrubbing',
        'actionItems',
        'myRequest',
        'pendingForApproval',
        'allRequest',
        'pendingForApproval',
        'search',
        'accountSearch',
        'consumerSearch',
        'inventory',
        'admin',
        'report',
        'configurationManagement'
    ],
    "Partner": [
        'search',
        'actionItems',
        'accountSearch',
        'consumerSearch',
        'admin',
        'report',
        'configurationManagement'
    ]
}

const BottomNavigation = () => {
    const dispatch = useDispatch()
    const history = useHistory();
    const [activeRoute, setActiveRoute] = useState<string>('account_search')
    const [role, setRole] = useState<any>(null)

    useEffect(() => {
        return history.listen((location: any) => {
            if (!location.pathname.includes('report')) {
                const locationArr: any = location.pathname.split('/')
                setActiveRoute(locationArr[locationArr.length - 1])
            }
        })
    }, [history])

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

    let { dashboards } = useSelector((state: any) => ({
        dashboards: state.report.data
    }))

    const handleSelect = (eventKey: any) => {
        setActiveRoute(eventKey)
    }

    const Routes = () => {
        return (
            <ul>
                <li className={Styles.link}>
                    <NavLink to="/dashboard" activeClassName={Styles.link_active} >
                        <MdDashboard /> &nbsp;
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                {
                    role && rolesMapping[role].includes('actionItems')
                    && <li className={Styles.dropdown_link}>
                        <NavDropdown title={
                            <>
                                <FaTasks /> &nbsp;
                                <span>Action Items</span>
                            </>
                        }
                            active={
                                activeRoute === 'my_requests'
                                || activeRoute === "all_pending_approval"
                                || activeRoute === "all_requests"
                                || activeRoute === "pending_my_approval"
                                || activeRoute === 'downloads'
                            }
                            id="collasible-nav-dropdown"
                            onSelect={handleSelect}
                            className={Styles.dropdown_nav}>
                            {
                                role && rolesMapping[role].includes('pendingForApproval')
                                && <NavDropdown.Item
                                    eventKey={"pending_my_approval"}
                                    as={Link}
                                    active={"pending_my_approval" === activeRoute}
                                    to="/action_items/pending_my_approval">Pending my Approval</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('myRequest')
                                && <NavDropdown.Item
                                    eventKey={"my_requests"}
                                    as={Link}
                                    active={"my_requests" === activeRoute}
                                    to="/action_items/my_requests">My Requests</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('pendingForApproval')
                                && <NavDropdown.Item
                                    eventKey={"all_pending_approval"}
                                    as={Link}
                                    active={"all_pending_approval" === activeRoute}
                                    to="/action_items/all_pending_approval">All Pending Approval</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('allRequest')
                                && <NavDropdown.Item
                                    eventKey={"all_requests"}
                                    as={Link}
                                    active={"all_requests" === activeRoute}
                                    to="/action_items/all_requests">All Requests</NavDropdown.Item>
                            }

                            <NavDropdown.Item
                                eventKey={"downloads"}
                                as={Link}
                                active={"downloads" === activeRoute}
                                to="/action_items/downloads">Downloads</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                }
                {
                    role && rolesMapping[role].includes('search')
                    && <li className={Styles.dropdown_link}>
                        <NavDropdown title={
                            <>
                                <FaSearch /> &nbsp;
                                <span>Search</span>
                            </>
                        }
                            active={
                                activeRoute === 'account_search'
                                || activeRoute === "consumer_search"
                            }
                            id="collasible-nav-dropdown"
                            onSelect={handleSelect}
                            className={Styles.dropdown_nav}>
                            {
                                role && rolesMapping[role].includes('accountSearch')
                                && <NavDropdown.Item
                                    eventKey={"account_search"}
                                    as={Link}
                                    active={"account_search" === activeRoute}
                                    to="/search/account_search"
                                >Account Search</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('consumerSearch')
                                && <NavDropdown.Item
                                    eventKey={"consumer_search"}
                                    as={Link}
                                    active={"consumer_search" === activeRoute}
                                    to="/search/consumer_search">Consumer Search</NavDropdown.Item>
                            }
                        </NavDropdown>
                    </li>
                }
                {
                    window.location.host !== 'stage.equabli.net'
                    && window.location.host !== 'www.equabli.net'
                    && <li className={Styles.link}>
                        <NavLink to="/partner_manager" activeClassName={Styles.link_active} >
                            <MdOutlineManageAccounts size={20} /> &nbsp;
                            <span>Partner Manager</span>
                        </NavLink>
                    </li>
                }
                {
                    role && rolesMapping[role].includes('scrubbing')
                    && <li className={Styles.dropdown_link}>
                        <NavDropdown title={
                            <>
                                <FaTasks /> &nbsp;
                                <span>Inventory Management</span>
                            </>
                        }
                            active={
                                activeRoute === 'data_scrubbing'
                                || activeRoute === "inventory"
                                || activeRoute === "sol_management"
                                || activeRoute === 'placement_reconciliation'
                            }
                            id="collasible-nav-dropdown"
                            onSelect={handleSelect}
                            className={Styles.dropdown_nav}>
                            <NavDropdown.Item
                                eventKey={"inventory"}
                                as={Link}
                                active={"inventory" === activeRoute}
                                to="/inventory">Inventory Search</NavDropdown.Item>
                            <NavDropdown.Item
                                eventKey={"data_scrubbing"}
                                as={Link}
                                active={"data_scrubbing" === activeRoute}
                                to="/data_scrubbing">Data Scrubbing</NavDropdown.Item>
                            <NavDropdown.Item
                                eventKey={"sol_management"}
                                as={Link}
                                active={"sol_management" === activeRoute}
                                to="/sol_management">SOL Management</NavDropdown.Item>
                            <NavDropdown.Item
                                eventKey={"placement_reconciliation"}
                                as={Link}
                                active={"placement_reconciliation" === activeRoute}
                                to="/placement_reconciliation">Placement Reconciliation</NavDropdown.Item>
                        </NavDropdown>

                    </li>
                }
                <li className={Styles.dropdown_link}>
                    <NavDropdown title={
                        <>
                            <FaTasks /> &nbsp;
                            <span>Compliance</span>
                        </>
                    }
                        active={
                            activeRoute === 'create_compliance'
                            || activeRoute === 'compliance_my_requests'
                            || activeRoute === "compliance_all_requests"
                        }
                        id="collasible-nav-dropdown"
                        onSelect={handleSelect}
                        className={Styles.dropdown_nav}>
                        <NavDropdown.Item
                            eventKey={"create_compliance"}
                            as={Link}
                            active={"create_compliance" === activeRoute}
                            to="/create_compliance">Create Compliance</NavDropdown.Item>
                        <NavDropdown.Item
                            eventKey={"compliance_all_requests"}
                            as={Link}
                            active={"compliance_all_requests" === activeRoute}
                            to="/compliance_requests/compliance_all_requests">All Requests</NavDropdown.Item>
                        <NavDropdown.Item
                            eventKey={"compliance_my_requests"}
                            as={Link}
                            active={"compliance_my_requests" === activeRoute}
                            to="/compliance_requests/compliance_my_requests">My Requests</NavDropdown.Item>

                    </NavDropdown>
                </li>
                {
                    role && rolesMapping[role].includes('report')
                    && <li className={Styles.dropdown_link}>
                        <NavDropdown title={
                            <>
                                <HiOutlineDocument /> &nbsp;
                                <span>Report</span>
                            </>
                        }
                            active={
                                activeRoute.includes('report')
                            }
                            id="collasible-nav-dropdown"
                            onSelect={handleSelect}
                            className={Styles.dropdown_nav}>
                            {
                                dashboards && dashboards.map((d: any, index: number) => {
                                    // if (d.disabled) {
                                    return (
                                        <NavDropdown.Item
                                            eventKey={`/report?dName=${d.reportName.replace(/ /g, "_")}`}
                                            as={Link}
                                            key={`report_${index}`}
                                            active={(decodeURI(activeRoute)).split('=')[1] === d.reportName.replace(/ /g, "_")}
                                            to={`/report?dName=${d.reportName.replace(/ /g, "_")}`}
                                        >{d.reportName}</NavDropdown.Item>
                                    )
                                    // }
                                })
                            }
                        </NavDropdown>
                    </li>
                }
                {
                    role && rolesMapping[role].includes('admin')
                    && <li className={Styles.dropdown_link}>
                        <NavDropdown title={
                            <>
                                <FaUserCog /> &nbsp;
                                <span>Admin</span>
                            </>
                        }
                            active={
                                activeRoute === 'alerts'
                                || activeRoute === 'batch_scheduler'
                                || activeRoute === 'process_dashboard'
                                || activeRoute === 'configure_management'
                            }
                            id="collasible-nav-dropdown"
                            onSelect={handleSelect}
                            className={Styles.dropdown_nav}>
                            {
                                role && rolesMapping[role].includes('alerts')
                                && <NavDropdown.Item
                                    eventKey={"alerts"}
                                    as={Link}
                                    active={"alerts" === activeRoute}
                                    to="/admin/alerts"
                                >Alert</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('scheduler')
                                && < NavDropdown.Item
                                    eventKey={"batch_scheduler"}
                                    as={Link}
                                    active={"batch_scheduler" === activeRoute}
                                    to="/admin/batch_scheduler"
                                >Batch Scheduler</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('processDashboard')
                                && < NavDropdown.Item
                                    eventKey={"process_dashboard"}
                                    as={Link}
                                    active={"process_dashboard" === activeRoute}
                                    to="/admin/process_dashboard"
                                >Process Dashboard</NavDropdown.Item>
                            }
                            {
                                role && rolesMapping[role].includes('configurationManagement')
                                && < NavDropdown.Item
                                    eventKey={"configure_management"}
                                    as={Link}
                                    active={"configure_management" === activeRoute}
                                    to="/admin/configure_management"
                                >Configuration Management</NavDropdown.Item>
                            }
                        </NavDropdown>
                    </li >
                }
                <li className={Styles.dropdown_link}>
                    <NavDropdown title={
                        <>
                            <HiOutlineDocument /> &nbsp;
                            <span>Help</span>
                        </>
                    }
                        active={
                            activeRoute === 'release_notes'
                            || activeRoute === 'contact_equabli'
                        }
                        id="collasible-nav-dropdown"
                        onSelect={handleSelect}
                        className={Styles.dropdown_nav}>
                        <NavDropdown.Item
                            eventKey={"release_notes"}
                            as={Link}
                            active={"release_notes" === activeRoute}
                            to={"/help/release_notes"}
                        >Release Notes</NavDropdown.Item>
                        <NavDropdown.Item
                            eventKey={"contact_equabli"}
                            as={Link}
                            active={"contact_equabli" === activeRoute}
                            to={"/help/contact_equabli"}
                        >Contact Equabli</NavDropdown.Item>
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