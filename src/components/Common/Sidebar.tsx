import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa"
import { Link, NavLink, useHistory } from 'react-router-dom';
import { NavDropdown } from "react-bootstrap"
import { MdInventory2, MdOutlinePendingActions, MdOutlineDashboardCustomize, MdOutlineAdminPanelSettings, MdLiveHelp, MdOutlinePhonelinkSetup } from "react-icons/md";

import Styles from "./Common.module.sass"
import { userService } from "../../services";
import LogoSmall from '../../assets/img/logo_small.png'
import Logo from '../../assets/img/logo.png'
import { BsSearch, BsUiChecks } from "react-icons/bs";
import { HiOutlinePresentationChartLine } from "react-icons/hi";
import { GrHelp } from "react-icons/gr";

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
                action: false,
                search: false,
                inventory: false,
                compliance: false,
                report: false,
                admin: false,
                help: false,
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
                <li className={`${menuDrop.documents ? 'showMenu' : ''}`} onClick={() => {
                    setMenuDrop((state: any) => {
                        return { ...state, documents: !state.documents }
                    })
                }}>
                    <div className={`icon-link ${(activeRoute === 'my_documents' || activeRoute === 'sent_document_requests' || activeRoute === 'received_document_requests' || activeRoute === 'download_history') ? 'active' : ''}`}>
                        <NavLink to="/documents/my_documents">
                            <MdOutlinePendingActions size={30} />
                            <span className="link_name">Documents</span>
                        </NavLink>
                        <i className='bx bxs-chevron-down arrow'></i>
                    </div>
                    <ul className="sub-menu">
                        <li><a className="link_name" onClick={(e) => void e}>Documents</a></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/documents/my_documents">My Documents</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/documents/sent_document_requests">Sent Document Requests</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/documents/received_document_requests">Received Document Requests</NavLink></li>
                        <li><NavLink onClick={(e) => e.stopPropagation()} to="/documents/download_history">Download History</NavLink></li>
                    </ul>
                </li>
                <li className={`${menuDrop.documents ? 'showMenu' : ''}`} onClick={() => {
                    setMenuDrop((state: any) => {
                        return { ...state, documents: !state.documents }
                    })
                }}>
                    <div className={`icon-link ${(activeRoute === 'client' || activeRoute === 'partner') ? 'active' : ''}`}>
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
                    </ul>
                </li>
            </ul>
        </div >
    );
};

export default Sidebar;