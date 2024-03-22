import React, { useEffect, useState } from "react";
import { FaWrench } from "react-icons/fa"
import { Link, NavLink, useHistory } from 'react-router-dom';
import { NavDropdown } from "react-bootstrap"
import { MdInventory2, MdOutlinePendingActions, MdOutlineDashboardCustomize, MdOutlineAdminPanelSettings, MdLiveHelp, MdOutlinePhonelinkSetup } from "react-icons/md";

import Styles from "./Common.module.sass"
import { userService } from "../../services";
import LogoSmall from '../../assets/img/logo_small.png'
import Logo from '../../assets/img/logo.png'
import { BsRobot, BsSearch, BsUiChecks } from "react-icons/bs";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import { GrHelp } from "react-icons/gr";
import { FiSettings } from "react-icons/fi";

const rolesMapping = {
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
        "templates"
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


const Sidebar = ({ isClosed }: { isClosed: boolean }) => {
    const history = useHistory();
    const [activeRoute, setActiveRoute] = useState<string>('documents')
    const [role, setRole] = useState<any>(null)
    const [menuDrop, setMenuDrop] = useState<any>({
        action: false,
        search: false,
        inventory: false,
        compliance: false,
        report: false,
        admin: false,
        help: false,
        documents: false
    })

    useEffect(() => {
        const user = userService.getUser()
        if (user === null) {
            history.push('/login')
        } else {
            setRole(user.recordSource)
            const locationArr: any = window.location.hash.split('/')
            setActiveRoute(locationArr[locationArr.length - 1])
        }
        return () => {
            setActiveRoute('documents')
            setRole('null')
            setMenuDrop({
                setup: false,
                console: false,
                documents: false
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        history.listen((a) => {
            const locationArr: any = a?.pathname.split('/')
            setActiveRoute(locationArr[locationArr.length - 1])
        })
    }, [history])

    const gotToMyDocuments = () => {
        history.push({
            pathname: "/documents/my_documents",
        })
    }

    return (
        <div className={`sidebar ${!isClosed ? 'close_sidebar' : ''}`}>
            <div className="logo-details">
                <img onClick={gotToMyDocuments} src={LogoSmall} alt="Equabli" height="100%" width="50px" style={{ cursor: 'pointer' }} />
                {isClosed && <span className="logo_name">Equabli</span>}
            </div>
            <ul className="nav-links">
                {role === 'Equabli' && <li className={`${menuDrop.setup ? 'showMenu' : ''}`} onClick={() => {
                    setMenuDrop((state: any) => {
                        return { ...state, setup: !state.setup }
                    })
                }}>
                    <div className={`icon-link ${(
                        activeRoute === 'client'
                        || activeRoute === 'partner'
                        || activeRoute === 'user_approval'
                        || activeRoute === 'domain'
                    ) ? 'active' : ''}`}>
                        <NavLink to="/documents/my_documents">
                            <MdOutlinePhonelinkSetup size={30} />
                            <span className="link_name">Setup</span>
                        </NavLink>
                        <i className='bx bxs-chevron-down arrow'></i>
                    </div>
                    <ul className="sub-menu">
                        <li><a className="link_name" onClick={(e) => void e}>Setup</a></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/setup/client">Client</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/setup/partner">Partner</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/configure/user_approval">User Approval</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/setup/domain">Domain</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/setup/client_onboarding">Client Onboarding</NavLink></li>
                    </ul>
                </li>}
            </ul>
        </div >
    );
};

export default Sidebar;