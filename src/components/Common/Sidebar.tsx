import React, { useEffect, useState } from "react";
import { FaTasks } from "react-icons/fa"
import { Link, useHistory } from 'react-router-dom';
import { NavDropdown } from "react-bootstrap"

import Styles from "./Common.module.sass"
import { userService } from "../../services";
import LogoSmall from '../../assets/img/logo_small.png'

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


const Sidebar = ({ isClosed }) => {
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

    return (
        <div className={`sidebar ${!isClosed ? 'close' : ''}`}>
            <div className="logo-details">
                <img src={LogoSmall} alt="Equabli" height="100%" width="50px" style={{ cursor: 'pointer' }} />
                <span className="logo_name">Equabli</span>
            </div>
            <ul className="nav-links">
                <li>
                    <a href="#">
                        <i className='bx bx-grid-alt' ></i>
                        <span className="link_name">Dashboard</span>
                    </a>
                    <ul className="sub-menu blank">
                        <li><a className="link_name" href="#">Category</a></li>
                    </ul>
                </li>
                <li>
                    <div className="iocn-link">
                        <a href="#">
                            <i className='bx bx-collection' ></i>
                            <span className="link_name">Category</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                        <li><a className="link_name" href="#">Category</a></li>
                        <li><a href="#">HTML & CSS</a></li>
                        <li><a href="#">JavaScript</a></li>
                        <li><a href="#">PHP & MySQL</a></li>
                    </ul>
                </li>
                <li>
                    <div className="iocn-link">
                        <a href="#">
                            <i className='bx bx-book-alt' ></i>
                            <span className="link_name">Posts</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                        <li><a className="link_name" href="#">Posts</a></li>
                        <li><a href="#">Web Design</a></li>
                        <li><a href="#">Login Form</a></li>
                        <li><a href="#">Card Design</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i className='bx bx-pie-chart-alt-2' ></i>
                        <span className="link_name">Analytics</span>
                    </a>
                    <ul className="sub-menu blank">
                        <li><a className="link_name" href="#">Analytics</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i className='bx bx-line-chart' ></i>
                        <span className="link_name">Chart</span>
                    </a>
                    <ul className="sub-menu blank">
                        <li><a className="link_name" href="#">Chart</a></li>
                    </ul>
                </li>
                <li>
                    <div className="iocn-link">
                        <a href="#">
                            <i className='bx bx-plug' ></i>
                            <span className="link_name">Plugins</span>
                        </a>
                        <i className='bx bxs-chevron-down arrow' ></i>
                    </div>
                    <ul className="sub-menu">
                        <li><a className="link_name" href="#">Plugins</a></li>
                        <li><a href="#">UI Face</a></li>
                        <li><a href="#">Pigments</a></li>
                        <li><a href="#">Box Icons</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i className='bx bx-compass' ></i>
                        <span className="link_name">Explore</span>
                    </a>
                    <ul className="sub-menu blank">
                        <li><a className="link_name" href="#">Explore</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i className='bx bx-history'></i>
                        <span className="link_name">History</span>
                    </a>
                    <ul className="sub-menu blank">
                        <li><a className="link_name" href="#">History</a></li>
                    </ul>
                </li>
                <li>
                    <a href="#">
                        <i className='bx bx-cog' ></i>
                        <span className="link_name">Setting</span>
                    </a>
                    <ul className="sub-menu blank">
                        <li><a className="link_name" href="#">Setting</a></li>
                    </ul>
                </li>
                {/* <li>
                    <div className="profile-details">
                        <div className="profile-content">
                            <img src="image/profile.jpg" alt="profileImg">
                        </div>
                        <div className="name-job">
                            <div className="profile_name">Prem Shahi</div>
                            <div className="job">Web Desginer</div>
                        </div>
                        <i className='bx bx-log-out' ></i>
                    </div>
                </li> */}
            </ul>
        </div>
    );
};

export default Sidebar;