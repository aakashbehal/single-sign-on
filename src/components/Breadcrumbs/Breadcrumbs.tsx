import React from 'react';
import { Route } from "react-router-dom"
import { Breadcrumb } from "react-bootstrap"

import Styles from "./Breadcrumbs.module.sass"
import { history } from '../../helpers';

const Breadcrumbs = () => <Route path="*" render={props => {
    const hash = window.location.hash;
    let pattern = /^documents\/\d+\/document_list$/
    let withoutSearch = hash.replace('#/', '').split("?")[0]
    let isInsideFolder = pattern.test(withoutSearch)
    let parts = hash.split('/').filter(part => part.indexOf('#') === -1) // Removes first # part
    if (new RegExp(/^report/).test(parts[0])) {
        parts = parts[0].split('?dName=')
    }
    return <Breadcrumb className={Styles.bread_crumbs}>{
        parts.map((part, index) => {
            part = part.split("?")[0]
            let partFormatted = decodeURIComponent(part.replace(/_/g, " ").replace(/\b(\w)/g, (char: string) => char.toUpperCase()))
            if (partFormatted === 'Sol Management') {
                partFormatted = 'SOL Management '
            }
            let isActive = false
            if (index === parts.length - 1) {
                isActive = true
            }
            switch (part) {
                case 'requests':
                    part = `requests/all_requests`
                    break;
                case 'consumer_search':
                    part = `search/consumer_search`
                    break;
                case 'account_search':
                case 'search':
                    part = `search/account_search`
                    break
                case 'action_items':
                    part = `action_items/my_requests`
                    break
                case 'process_dashboard':
                    part = `admin/process_dashboard`
                    break
                case 'compliance_requests':
                    part = `compliance_requests/compliance_my_requests`
                    break
                case 'admin':
                    part = `admin/alerts`
                    break
                case 'profile':
                    part = `profile/user_account`
                    break
                case 'documents':
                    part = `documents/my_documents`
                    break
                case 'setup':
                    part = `setup/document_general_configuration`
            }

            const gotoPage = (part: any) => {
                if (isInsideFolder) {
                    history.goBack()
                }
                if (!isActive) {
                    if (part === 'account_details' || part === 'details' || part === 'compliance_all_requests' || part === 'compliance_my_requests' || part === 'document_general_configuration') {
                        history.goBack()
                    } else if (part === 'report') {
                        // do nothing
                    }
                    else {
                        history.push({
                            pathname: `/${part}`,
                        })
                    }
                }
            }
            //  = `#${part}`

            return (
                <Breadcrumb.Item
                    key={`bread_${index}`}
                    className={Styles.bread_crumb_items}
                    onClick={() => gotoPage(part)}
                    active={isActive}>
                    {partFormatted}
                </Breadcrumb.Item>
            )
        })
    }
    </Breadcrumb>
}} />;


export default Breadcrumbs