export const configureFakeBackend = () => {
    let realFetch = window.fetch;
    window.fetch = (url: any, opts: any) => {
        const { method } = opts;
        const body = opts.body && JSON.parse(opts.body);
        const param = opts.param
        return new Promise((resolve: any, reject: any) => {
            setTimeout(handleRoute, 500);
            function handleRoute() {
                switch (true) {
                    case url.endsWith('/authenticate') && method === 'POST':
                        return authenticate(body);
                    case url.endsWith('/fetchAllTypes') && method === 'GET':
                        return fetchAllTypes();
                    case url.endsWith('/getConflicts') && method === 'GET':
                        return getConflicts()
                    case url.endsWith('/demoDashboard') && method === 'GET':
                        return demoDashboard()
                    case url.endsWith('/serviceOffered') && method === 'GET':
                        return getServiceOffered()
                    case url.endsWith('/partnerStatus') && method === 'GET':
                        return getPartnerStatus()
                    case url.endsWith('/getEligiblePartners') && method === 'GET':
                        return getEligiblePartners()
                    case url.endsWith('/dummyReports') && method === 'GET':
                        console.log(param.type)
                        if (param.type === 'Inventory_Management_Dashboard') {
                            return inventoryManagementDashboard()
                        } else if (param.type === 'Portfolio_Performance_Dashboard') {
                            return portfolioPerformanceDashboard()
                        } else if (param.type === 'Partner_Performance_Dashboard') {
                            return partnerPerformanceDashboard()
                        } else if (param.type === 'Compliance_Dashboard') {
                            return complianceDashboard()
                        } else if (param.type === 'Compliance_Dashboard_alfa') {
                            return complianceDashboardAlfa()
                        }
                        else {
                            return ''
                        }
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }
            function ok(body: any) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function authenticate(body: any) {
                const { username, email } = body;
                console.log(body)
                return ok({
                    username: username,
                    token: 'fake-jwt-token',
                    email: 'abehal@equabli.com',
                    role: 'client'
                });
            }

            function getServiceOffered() {
                return ok({
                    "validation": {
                        "validation": true,
                        // "errorCode": "",
                        // "errorMessage": ""
                    },
                    "response": {
                        services: [
                            {
                                statusCode: "all",
                                status: 'All'
                            },
                            {
                                statusCode: "credit_card",
                                status: 'Credit Card'
                            },
                            {
                                statusCode: "auto_loan",
                                status: 'Auto Loan'
                            },
                            {
                                statusCode: "lease_to_own",
                                status: 'Lease to Own'
                            },
                            {
                                statusCode: "rent_to_own",
                                status: 'rent to Own'
                            }
                        ]
                    }
                })
            }

            function getEligiblePartners() {
                return ok({
                    "validation": {
                        "validation": true,
                        // "errorCode": "",
                        // "errorMessage": ""
                    },
                    "response": {
                        metadata: { pageSize: 10, pageNumber: 1, recordCount: 2, pageCount: 2 },
                        partners: [
                            {
                                "companyInformation": "Atradius Collections",
                                "keyContacts": [
                                    {
                                        "name": "Darrell Steward",
                                        "phone": 2295550109
                                    },
                                    {
                                        "name": "Jane Cooper",
                                        "phone": 4805550103
                                    }
                                ],
                                "accountTypeServiced": ["Pre-ChargeOff", "Post-ChargeOff", "Bankruptcy"],
                                "servicesOffered": ["Credit Card", "Auto Loan", "Lease to Own", "Rent to Own"],
                                "partnerStatus": "Equabli Recommended",
                                "RFILink": "www.google.com",
                                "auditLink": "www.google.com",
                                "commissionRate": [
                                    { "type": "Credit Card", 'percentage': 10 },
                                    { "type": "Auto Loan", 'percentage': 8 },
                                    { "type": "Lease to Own", 'percentage': 20 },
                                    { "type": "Rent to Own", 'percentage': 25 }
                                ],
                                "companyLicenses": "2348958-87",
                                "agents": "50 Agents",
                                "capacity": [
                                    { "type": "Credit Card", 'count': 120 },
                                    { "type": "Auto Loan", 'count': 120 },
                                    { "type": "Lease to Own", 'count': 120 },
                                    { "type": "Rent to Own", 'count': 120 }
                                ],
                                "compliance": 10,
                                "collections": [
                                    { "type": "Credit Card", 'amount': 20000 },
                                    { "type": "Auto Loan", 'amount': 20000 },
                                    { "type": "Lease to Own", 'amount': 20000 },
                                    { "type": "Rent to Own", 'amount': 20000 }
                                ]
                            },
                            {
                                "companyInformation": "Atradius Collections",
                                "keyContacts": [
                                    {
                                        "name": "Darrell Steward",
                                        "phone": 2295550109
                                    },
                                    {
                                        "name": "Jane Cooper",
                                        "phone": 4805550103
                                    }
                                ],
                                "accountTypeServiced": ["Pre-ChargeOff", "Post-ChargeOff", "Bankruptcy"],
                                "servicesOffered": ["Credit Card", "Auto Loan", "Lease to Own", "Rent to Own"],
                                "partnerStatus": "Equabli Approved",
                                "RFILink": "www.google.com",
                                "auditLink": "www.google.com",
                                "commissionRate": [
                                    { "type": "Credit Card", 'percentage': 10 },
                                    { "type": "Auto Loan", 'percentage': 8 },
                                    { "type": "Lease to Own", 'percentage': 20 },
                                    { "type": "Rent to Own", 'percentage': 25 }
                                ],
                                "companyLicenses": "2348958-87",
                                "agents": "50 Agents",
                                "capacity": [
                                    { "type": "Credit Card", 'count': 120 },
                                    { "type": "Auto Loan", 'count': 120 },
                                    { "type": "Lease to Own", 'count': 120 },
                                    { "type": "Rent to Own", 'count': 120 }
                                ],
                                "compliance": 10,
                                "collections": [
                                    { "type": "Credit Card", 'amount': 20000 },
                                    { "type": "Auto Loan", 'amount': 20000 },
                                    { "type": "Lease to Own", 'amount': 20000 },
                                    { "type": "Rent to Own", 'amount': 20000 }
                                ]
                            },
                            {
                                "companyInformation": "Atradius Collections",
                                "keyContacts": [
                                    {
                                        "name": "Darrell Steward",
                                        "phone": 2295550109
                                    },
                                    {
                                        "name": "Jane Cooper",
                                        "phone": 4805550103
                                    }
                                ],
                                "accountTypeServiced": ["Pre-ChargeOff", "Post-ChargeOff", "Bankruptcy"],
                                "servicesOffered": ["Credit Card", "Auto Loan", "Lease to Own", "Rent to Own"],
                                "partnerStatus": "Equabli Onboarded",
                                "RFILink": "www.google.com",
                                "auditLink": "www.google.com",
                                "commissionRate": [
                                    { "type": "Credit Card", 'percentage': 10 },
                                    { "type": "Auto Loan", 'percentage': 8 },
                                    { "type": "Lease to Own", 'percentage': 20 },
                                    { "type": "Rent to Own", 'percentage': 25 }
                                ],
                                "companyLicenses": "2348958-87",
                                "agents": "50 Agents",
                                "capacity": [
                                    { "type": "Credit Card", 'count': 120 },
                                    { "type": "Auto Loan", 'count': 120 },
                                    { "type": "Lease to Own", 'count': 120 },
                                    { "type": "Rent to Own", 'count': 120 }
                                ],
                                "compliance": 10,
                                "collections": [
                                    { "type": "Credit Card", 'amount': 20000 },
                                    { "type": "Auto Loan", 'amount': 20000 },
                                    { "type": "Lease to Own", 'amount': 20000 },
                                    { "type": "Rent to Own", 'amount': 20000 }
                                ]
                            }
                        ]
                    }
                })
            }


            function getPartnerStatus() {
                return ok({
                    "validation": {
                        "validation": true,
                        // "errorCode": "",
                        // "errorMessage": ""
                    },
                    "response": {
                        status: [
                            {
                                statusCode: "all",
                                status: 'All'
                            },
                            {
                                statusCode: "equable_recommended",
                                status: 'Equabli Recommended'
                            },
                            {
                                statusCode: "equable_approved",
                                status: 'Equabli Approved'
                            },
                            {
                                statusCode: "equable_onboarded",
                                status: 'Equabli Onboarded'
                            }
                        ]
                    }
                })
            }

            function getConflicts() {
                return ok({
                    "validation": {
                        "validation": true,
                        // "errorCode": "",
                        // "errorMessage": ""
                    },
                    "response": {
                        "conflicts": [
                            {
                                clientName: 'abc',
                                clientAccountNumber: '123',
                                clientSOLDate: '2022/01/22',
                                equabliSOLDate: '2022/01/22',
                                PortfolioId: '123',
                            },
                            {
                                clientName: 'xyz',
                                clientAccountNumber: '123',
                                clientSOLDate: '2022/01/22',
                                equabliSOLDate: '2022/01/22',
                                PortfolioId: '123',
                            }
                        ]
                    }
                })
            }

            function fetchAllTypes() {
                return ok({
                    "validation": {
                        "validation": true,
                        // "errorCode": "",
                        // "errorMessage": ""
                    },
                    "response": {
                        "recordSource": {
                            'ECP-CL': {
                                "recordSourceId": 1,
                                "description": 'Data prepared by Equabli Client'
                            },
                            'ECP-AN': {
                                "recordSourceId": 2,
                                "description": 'Data Prepared by Equabli Analytics Team'
                            },
                            'ECP-SW': {
                                "recordSourceId": 3,
                                "description": 'Data Prepared by Equabli Software Team'
                            },
                            'ECP-EA': {
                                "recordSourceId": 4,
                                "description": 'Data prepared by Equabli Partner'
                            },
                            'ECP-EV': {
                                "recordSourceId": 5,
                                "description": 'Data prepared by Equabli Vendor'
                            },
                            'ECP-CA': {
                                "recordSourceId": 6,
                                "description": 'Data prepared by Client Partner'
                            },
                            'ECP-CV': {
                                "recordSourceId": 7,
                                "description": 'Data prepared by Client Vendor'
                            },
                        },
                        "app": {
                            "ECP-SQL": {
                                "appId": 1,
                                "description": 'Any SQL Editor PGAdmin, PSQL etc..'
                            },
                            "ECP-VI": {
                                "appId": 2,
                                "description": 'Equabli Collection Platform Vendor Integration ETL Service'
                            },
                            'ECP-PY': {
                                "appId": 3,
                                "description": 'Equabli Collection Platform Python Script'
                            },
                            'ECP-UI': {
                                "appId": 4,
                                "description": 'Equabli Collection Platform User Interface'
                            },
                            'ECP-EXS': {
                                "appId": 5,
                                "description": 'Equabli Collection Platform External Service'
                            },
                            'ECP-TRG': {
                                "appId": 6,
                                "description": 'SQL Trigger Event'
                            },
                            'ECP-WEB': {
                                "appId": 7,
                                "description": 'Web Application'
                            },
                        },
                        "recordStatus": {
                            'RAW': 1,
                            'Cleaning': 2,
                            'Suspected': 3,
                            'Orphaned': 4,
                            'Enabled': 5,
                            'Disabled': 6,
                            'Deleted': 7,
                            'Started': 8,
                            'InProgress': 9,
                            'Completed': 10,
                            'Include': 11,
                            'Exclude': 12
                        },
                    }
                })
            }

            function demoDashboard() {
                return ok({
                    "validation": true,
                    "error": [],
                    "response": {
                        "preference": [
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "Bar_Double",
                                "widgetCode": "DW0017",
                                "fullName": "Commissions",
                                "description": "Total commissions paid MTD and YTD to partner and Equabli.",
                                datasets: [{
                                    label: 'MTD',
                                    data: [20000, 16000, 35000],
                                },
                                {
                                    label: 'YTD',
                                    data: [65000, 59000, 80000],
                                }],
                                labels: ['DCA', 'TRAK ', 'Equabli '],
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW0016",
                                "fullName": "Collections by Channel YTD",
                                "description": "Total collections received YTD by channel.",
                                "datasets": [
                                    {
                                        "label": "Collection",
                                        "data": [250000, 500000, 750000, 10000, 40000]
                                    }
                                ],
                                labels: ['OB', 'IB', 'Digital', 'Direct pay', 'Legal'],
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_BAR_HORIZONTAL",
                                "widgetCode": "DW0015",
                                "fullName": "Attempts (YTD)",
                                "description": "Total number of attempts to reach consumer YTD by outreach method.",
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [75000, 30000, 60000, 7500, 3000, 0]
                                    }
                                ],
                                labels: ['OB', 'SMS', 'Email', 'Letter', 'VM Drop', 'Attempts'],
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_BAR_HORIZONTAL",
                                "widgetCode": "DW0014",
                                "fullName": "RPC (YTD)",
                                "description": "Total number of Right Party Contacts YTD by outreach method.",
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [750000, 500000, 1000000, 250000, 100000, 0]
                                    }
                                ],
                                labels: ['OB', 'SMS', 'Email', 'Letter', 'VM Drop', 'Attempts'],
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_BAR_HORIZONTAL",
                                "widgetCode": "DW0013",
                                "fullName": "Disputes, Complaints, and Compliance Items (YTD)",
                                "description": "Total number of disputes, complaints, and other compliance items received YTD, and total number resolved YTD.",
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [150, 50, 50, 25, 10, 5]
                                    }
                                ],
                                labels: ['Dispute Resolved', 'Dispute Pending', 'Complaint Resolved', 'Complaint Pending', 'Compliance Resolved', 'Compliance Pending']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "COMPLEX_BAR_LINE_CHART",
                                "widgetCode": "DW0012",
                                "fullName": "EQV Score (YTD)",
                                "description": "Placed portfolio ranked by Equabli's expected collectibility value (10 = High; 1 = Low).",
                                "datasets": [

                                    {
                                        type: 'line' as const,
                                        label: '# of Accounts',
                                        data: [2000, 2000, 1500, 1000, 1000, 1200, 1000, 1400, 2273, 3000]
                                    },
                                    {
                                        type: 'bar' as const,
                                        "label": "$",
                                        "data": [5000000, 4000000, 3000000, 1500000, 1000000, 600000, 500000, 350000, 250000, 150000]
                                    },
                                ],
                                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_PIE",
                                "widgetCode": "DW0011",
                                "fullName": "Face Value ($) (YTD)",
                                "description": "Composition of overall portfolio's Face Value by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [3000000, 5350000, 4000000, 2000000, 2000000]
                                    }
                                ],
                                labels: ['CC', 'PL', 'LTO', 'Auto', 'Telco']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_PIE",
                                "widgetCode": "DW0010",
                                "fullName": "Accounts (#) (YTD)",
                                "description": "Composition of overall portfolio's Account Volume by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [3000, 5350, 4000, 2000, 2000]
                                    }
                                ],
                                labels: ['CC', 'PL', 'LTO', 'Auto', 'Telco']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "COMPLEX_BAR_LINE_CHART",
                                "widgetCode": "DW0009",
                                "fullName": "Partner Placement (YTD)",
                                "description": "Allocation and placement of accounts and face value to each partner YTD.",
                                "datasets": [
                                    {
                                        type: 'line' as const,
                                        label: '# of Accounts',
                                        data: [3000, 2000, 500, 3000, 500],
                                    },
                                    {
                                        type: 'bar' as const,
                                        "label": "Face Value ($)",
                                        "data": [3000000, 2000000, 500000, 3000000, 500000]
                                    },
                                ],
                                labels: ['Alpha', 'Beta', 'Gama', 'Trak', 'AIS']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "COMPLEX_BAR_LINE_CHART",
                                "widgetCode": "DW0008",
                                "fullName": "Not Placed by Reason (YTD)",
                                "description": "Allocation of accounts and face value not placed to an active collections channel YTD by reason.",
                                "datasets": [
                                    {
                                        type: 'line' as const,
                                        label: '# of Accounts',
                                        data: [500, 250, 100, 500, 1000],
                                    },
                                    {
                                        type: 'bar' as const,
                                        "label": "Face Value ($)",
                                        "data": [500000, 250000, 100000, 500000, 1000000]
                                    },

                                ],
                                labels: ['Low Value', 'Compliance', 'BK', 'Pending Data', 'New']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "COMPLEX_BAR_LINE_CHART",
                                "widgetCode": "DW0007",
                                "fullName": "Placed by Channel YTD",
                                "description": "Allocation of accounts and dollar value YTD across collections channels.",
                                "datasets": [
                                    {
                                        type: 'line' as const,
                                        label: '# of Accounts',
                                        data: [4000, 3000, 2000, 500, 3000, 500, 1000],
                                    },
                                    {
                                        type: 'bar' as const,
                                        "label": "$",
                                        "data": [40000000, 30000000, 20000000, 5000000, 30000000, 5000000, 10000000]
                                    },

                                ],
                                labels: ['Digital', 'DCA Primary', 'DCA Secondary', 'DCA Tertiary', 'Legal', 'BK', 'Debt Sale']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 6,
                                "chartType": "SIMPLE_NUMBER_TENURE",
                                "widgetCode": "DW0006",
                                "fullName": "Average Payment Plan",
                                "description": "Average Payment Plan",
                                "datasets": [
                                    {
                                        "data": 6,
                                        "label": "MONTH"
                                    }
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 10,
                                "chartType": "SIMPLE_NUMBER_PERCENTAGE",
                                "widgetCode": "DW0005",
                                "fullName": "Average Settlement (%)",
                                "description": "Current Year vs Previous Year Average Settlement  (%)",
                                "datasets": [
                                    {
                                        "data": 85,
                                        "label": "%"
                                    },
                                    {
                                        "data": 2,
                                        "label": "%"
                                    }
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 3,
                                "chartType": "SIMPLE_NUMBER",
                                "widgetCode": "DW0002",
                                "fullName": "Promises (MTD)",
                                "description": "Total promises-to-pay (count and value), established month-to-date.",
                                "datasets": [
                                    {
                                        "data": 5000,
                                        "label": "#"
                                    },
                                    {
                                        "data": 500000,
                                        "label": "$"
                                    }
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 4,
                                "chartType": "SIMPLE_NUMBER",
                                "widgetCode": "DW0001",
                                "fullName": "Collections",
                                "description": "Total collections received MTD and YTD",
                                "datasets": [
                                    {
                                        "data": 1000000,
                                        "label": "MTD"
                                    },
                                    {
                                        "data": 2000000,
                                        "label": "YTD"
                                    }
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 7,
                                "chartType": "SIMPLE_NUMBER",
                                "widgetCode": "DW0004",
                                "fullName": "Broken Payment (MTD)",
                                "description": "Total promises-to-pay (count and face value) month-to-date that were broken/ not received by the scheduled payment date.",
                                "datasets": [
                                    {
                                        "data": 2000,
                                        "label": "#"
                                    },
                                    {
                                        "data": 150000,
                                        "label": "$"
                                    }
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 8,
                                "chartType": "SIMPLE_NUMBER",
                                "widgetCode": "DW0003",
                                "fullName": "Kept (MTD)",
                                "description": "Total promises that paid by the scheduled payment date within the month.",
                                "datasets": [
                                    {
                                        "data": 3000,
                                        "label": "#"
                                    },
                                    {
                                        "data": 350000,
                                        "label": "$"
                                    }
                                ]
                            },
                            // {
                            //     "isTrendLine": false,
                            //     "widgetId": 8,
                            //     "chartType": "Number",
                            //     "widgetCode": "DW00018",
                            //     "fullName": "Kept MTD+",
                            //     "description": "Total promises that paid by the scheduled payment date within the month.",
                            //     "datasets": [
                            //         {
                            //             "data": 3000,
                            //             "label": "#"
                            //         },
                            //         {
                            //             "data": 350000,
                            //             "label": "$"
                            //         }
                            //     ]
                            // }
                        ],
                        "theme": "default"
                    },
                    "message": ""
                })
            }

            function inventoryManagementDashboard() {
                return ok({
                    "validation": true,
                    "error": [],
                    "response": {
                        "preference": [
                            {
                                "isTrendLine": false,
                                "widgetId": 1,
                                "chartType": "Doughnut",
                                "widgetCode": "DW001",
                                "fullName": "Queue Report - Accounts",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 0,
                                "top": 0,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [10000, 500, 500, 15000]
                                    }
                                ],
                                labels: ['New - New Placement', 'RTC- Returned to Client', 'DNP - Do Not Place', 'PLA - Placed']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 4,
                                "chartType": "Doughnut",
                                "widgetCode": "DW004",
                                "fullName": "Queue Report - Face Value",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 0,
                                "top": 9,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "# of attempts",
                                        "data": [25000000, 1250000, 1250000, 37500000]
                                    }
                                ],
                                labels: ['New - New Placement', 'RTC- Returned to Client', 'DNP - Do Not Place', 'PLA - Placed']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 2,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW002",
                                "fullName": "Partner and Product Type - Accounts",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 4,
                                "top": 0,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "Credit Card",
                                        "data": [4000, 2000, 1000]
                                    },
                                    {
                                        "label": "Auto",
                                        "data": [2000, 1000, 50]
                                    },
                                    {
                                        "label": "Consumer Loan",
                                        "data": [2500, 500, 2000]
                                    }
                                ],
                                labels: ['Alpha', 'Beta', 'Gama']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 5,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW005",
                                "fullName": "Partner and Product Type - Face Value",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 4,
                                "top": 9,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "Credit Card",
                                        "data": [10000000, 6250000, 5000000]
                                    },
                                    {
                                        "label": "Auto",
                                        "data": [15000000, 30000000, 750000]
                                    },
                                    {
                                        "label": "Consumer Loan",
                                        "data": [16000000, 4000000, 8000000]
                                    }
                                ],
                                labels: ['Alpha', 'Beta', 'Gama']
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 3,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW003",
                                "fullName": "Compliance Checks - Returned to Client",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 8,
                                "top": 0,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "",
                                        "data": [10, 10, 20, 50, 50, 5, 5, 45, 5]
                                    }
                                ],
                                labels: ["Deceased",
                                    "Litigious",
                                    "SCRA",
                                    "Missing Information",
                                    "BK",
                                    "Unresolved Complaint",
                                    "Unresolved Dispute",
                                    "CND",
                                    "SOL",]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 6,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW006",
                                "fullName": "Compliance Checks - Do Not Place",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 8,
                                "top": 9,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "",
                                        "data": [20, 5, 30, 50, 75, 0, 0, 20, 0]
                                    }
                                ],
                                labels: ["Deceased",
                                    "Litigious",
                                    "SCRA",
                                    "Missing Information",
                                    "BK",
                                    "Unresolved Complaint",
                                    "Unresolved Dispute",
                                    "CND",
                                    "SOL",]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 7,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW007",
                                "fullName": "Compliance Checks - Recalled",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 8,
                                "top": 18,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "",
                                        "data": [5, 5, 10, 24, 24, 3, 3, 23, 3]
                                    }
                                ],
                                labels: ["Deceased",
                                    "Litigious",
                                    "SCRA",
                                    "Missing Information",
                                    "BK",
                                    "Unresolved Complaint",
                                    "Unresolved Dispute",
                                    "CND",
                                    "SOL",]
                            }
                        ],
                        "theme": "default"
                    },
                    "message": ""
                })
            }

            function portfolioPerformanceDashboard() {
                return ok({
                    "validation": true,
                    "error": [],
                    "response": {
                        "preference": [
                            {
                                "isTrendLine": false,
                                "widgetId": 1,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW001",
                                "fullName": "Gross Collections by Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Gross Collection",
                                        "data": [
                                            92562,
                                            74443,
                                            64380,
                                            84953,
                                            44348,
                                            82126,
                                            50825,
                                            85065,
                                            97202,
                                            75682,
                                            82899,
                                            81186]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 2,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW002",
                                "fullName": "Costs by Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Commission",
                                        "data": [
                                            23141,
                                            18611,
                                            16095,
                                            21238,
                                            11087,
                                            20532,
                                            12706,
                                            21266,
                                            24301,
                                            18921,
                                            20725,
                                            20297,]
                                    },
                                    {
                                        "label": "Court Cost",
                                        "data": [
                                            8830,
                                            1550,
                                            294,
                                            9679,
                                            4499,
                                            7834,
                                            492,
                                            1133,
                                            5794,
                                            5110,
                                            5230,
                                            5560]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 4,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW004",
                                "fullName": "Gross Collections by Channel",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "DCA",
                                        "data": [
                                            56493,
                                            1205,
                                            17564,
                                            28711,
                                            31956,
                                            51400,
                                            34572,
                                            16130,
                                            50467,
                                            55259,
                                            27437,
                                            44653]
                                    },
                                    {
                                        "label": "Legal",
                                        "data": [
                                            24826,
                                            49241,
                                            35646,
                                            34028,
                                            8823,
                                            20503,
                                            10513,
                                            45043,
                                            40734,
                                            3491,
                                            36059,
                                            23886]
                                    },
                                    {
                                        "label": "DSC",
                                        "data": [
                                            7445,
                                            10512,
                                            1580,
                                            16929,
                                            2781,
                                            1033,
                                            5027,
                                            15381,
                                            3594,
                                            15168,
                                            15038,
                                            10362]
                                    },
                                    {
                                        "label": "BK",
                                        "data": [
                                            3799,
                                            13486,
                                            9590,
                                            5285,
                                            787,
                                            9190,
                                            713,
                                            8511,
                                            2407,
                                            1764,
                                            4366,
                                            2285]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 5,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW005",
                                "fullName": "Costs by Channel",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "DCA",
                                        "data": [
                                            14123,
                                            301,
                                            4391,
                                            7178,
                                            7989,
                                            12850,
                                            8643,
                                            4033,
                                            12617,
                                            13815,
                                            6859,
                                            11163]
                                    },
                                    {
                                        "label": "Legal",
                                        "data": [
                                            8689,
                                            17234,
                                            12476,
                                            11910,
                                            3088,
                                            7176,
                                            3679,
                                            15765,
                                            14257,
                                            1222,
                                            12621,
                                            8360]
                                    },
                                    {
                                        "label": "DSC",
                                        "data": [
                                            149,
                                            210,
                                            32,
                                            339,
                                            56,
                                            21,
                                            101,
                                            308,
                                            72,
                                            303,
                                            301,
                                            207]
                                    },
                                    {
                                        "label": "BK",
                                        "data": [
                                            190,
                                            674,
                                            480,
                                            264,
                                            39,
                                            460,
                                            36,
                                            426,
                                            120,
                                            88,
                                            218,
                                            114]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 3,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW003",
                                "fullName": "Cumulative Gross Liquidation by Placement Quarter",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [3.5, 3.2, 2.9, 3.6]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [8.0, 9.1, 7.9, 8.2]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [12.0, 13.5, 11.2, 11.9]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [14.5, 16.8, 15.5, 15.2]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [18.8, 19.2, 18.2, 19.7]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 6,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW006",
                                "fullName": "Cumulative Net Liquidation by Placement Quarter",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [2.63, 2.46, 2.25, 2.63]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [6.00, 7.01, 6.24, 5.99]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [9.00, 10.40, 8.85, 8.65]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [10.88, 12.94, 12.25, 11.10]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [14.06, 14.78, 14.38, 14.38]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 7,
                                "chartType": "Line_fill",
                                "widgetCode": "DW007",
                                "fullName": "Future Payments Set Up by Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "",
                                        "data": [12888,
                                            14880,
                                            16597,
                                            18406,
                                            19812,
                                            21987,
                                            23902,
                                            25905,
                                            29284,
                                            30677,
                                            28493,
                                            26075,
                                            24754,
                                            23225,
                                            22049,
                                            20697,
                                            19749,
                                            17802,
                                            16046,
                                            14381,
                                            13207,
                                            12422,
                                            11922,
                                            11212,
                                            10481,
                                            9956,
                                            9107,
                                            8197,
                                            7456,
                                            6832]
                                    }
                                ],
                                labels: [
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                    "Jan-23",
                                    "Feb-23",
                                    "Mar-23",
                                    "Apr-23",
                                    "May-23",
                                    "Jun-23",
                                    "Jul-23",
                                    "Aug-23",
                                    "Sep-23",
                                    "Oct-23",
                                    "Nov-23",
                                    "Dec-23",
                                    "Jan-24",
                                    "Feb-24",
                                    "Mar-24",
                                    "Apr-24",
                                    "May-24",
                                    "Jun-24",
                                    "Jul-24",
                                    "Aug-24",
                                    "Sep-24",
                                    "Oct-24",
                                    "Nov-24",
                                    "Dec-24"
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 8,
                                "chartType": "Line",
                                "widgetCode": "DW008",
                                "fullName": "90 Day Payer Rate by Placement Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "",
                                        "data": [
                                            7.10,
                                            7.15,
                                            7.80,
                                            7.30,
                                            6.80,
                                            7.00,
                                            6.20,
                                            5.10,
                                            6.70,
                                            7.30,
                                            8.40,
                                            9.10]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "Line",
                                "widgetCode": "DW009",
                                "fullName": "180 Day Payer Rate by Placement Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "",
                                        "data": [
                                            9.59,
                                            9.65,
                                            10.53,
                                            9.86,
                                            9.18,
                                            9.45,
                                            8.37,
                                            6.89,
                                            9.05,
                                            9.86,
                                            11.34,
                                            12.29]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 10,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW010",
                                "fullName": "Average Attempts per Day",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Avg Dials Per Day",
                                        "data": [
                                            3,
                                            4,
                                            5,
                                            4,
                                            4,
                                            3,
                                            4,
                                            5,
                                            4,
                                            3,
                                            3,
                                            3]
                                    },
                                    {
                                        "label": "Avg Emails Per Day",
                                        "data": [5,
                                            5,
                                            5,
                                            5,
                                            5,
                                            6,
                                            6,
                                            3,
                                            6,
                                            7,
                                            7,
                                            7]
                                    },
                                    {
                                        "label": "Avg SMS Per Day",
                                        "data": [2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2]
                                    },
                                    {
                                        "label": "Avg Letters Per Day",
                                        "data": [0.75,
                                            1,
                                            2,
                                            1,
                                            0.5,
                                            0.5,
                                            0.5,
                                            0.5,
                                            0.5,
                                            0.75,
                                            0.75,
                                            0.75]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 11,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW011",
                                "fullName": "Average Coverage Rate",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Dial coverage rate",
                                        "data": [
                                            57,
                                            57,
                                            62,
                                            52,
                                            42,
                                            52,
                                            37,
                                            62,
                                            47,
                                            57,
                                            52,
                                            62]
                                    },
                                    {
                                        "label": "Email coverage rate",
                                        "data": [
                                            77,
                                            77,
                                            82,
                                            72,
                                            62,
                                            72,
                                            57,
                                            82,
                                            67,
                                            77,
                                            72,
                                            82]
                                    },
                                    {
                                        "label": "SMS Coverage rate",
                                        "data": [
                                            72,
                                            72,
                                            77,
                                            67,
                                            57,
                                            67,
                                            52,
                                            77,
                                            62,
                                            72,
                                            67,
                                            77,]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 12,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW012",
                                "fullName": "Average RPC and Conversion Rate",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "RPC Rate",
                                        "data": [
                                            60,
                                            65,
                                            70,
                                            55,
                                            60,
                                            65,
                                            80,
                                            70,
                                            60,
                                            60,
                                            50,
                                            60,]
                                    },
                                    {
                                        "label": "Conversion Rate",
                                        "data": [
                                            30,
                                            30,
                                            20,
                                            23,
                                            35,
                                            25,
                                            30,
                                            32,
                                            33,
                                            35,
                                            37,
                                            30,]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            }
                        ],
                        "theme": "default"
                    },
                    "message": ""
                })
            }

            function partnerPerformanceDashboard() {
                return ok({
                    "validation": true,
                    "error": [],
                    "response": {
                        "preference": [
                            {
                                "isTrendLine": false,
                                "widgetId": 1,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW001",
                                "fullName": "Gross Collections by Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 0,
                                "top": 0,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            92562,
                                            74443,
                                            64380,
                                            84953,
                                            44348,
                                            82126,
                                            50825,
                                            85065,
                                            97202,
                                            75682,
                                            82899,
                                            81186]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            87562,
                                            69443,
                                            59380,
                                            79953,
                                            39348,
                                            77126,
                                            45825,
                                            80065,
                                            92202,
                                            70682,
                                            77899,
                                            76186]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            97562,
                                            79443,
                                            69380,
                                            89953,
                                            49348,
                                            87126,
                                            55825,
                                            90065,
                                            102202,
                                            80682,
                                            87899,
                                            86186]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 2,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW002",
                                "fullName": "Commissions/Costs by Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "left": 4,
                                "top": 0,
                                "height": 9,
                                "width": 4,
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            23141,
                                            18611,
                                            16095,
                                            21238,
                                            11087,
                                            20532,
                                            12706,
                                            21266,
                                            24301,
                                            18921,
                                            20725,
                                            20297,]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            18512,
                                            14889,
                                            12876,
                                            16991,
                                            8870,
                                            16425,
                                            10165,
                                            17013,
                                            19440,
                                            15136,
                                            16580,
                                            16237]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            24298,
                                            19541,
                                            16900,
                                            22300,
                                            11641,
                                            21558,
                                            13342,
                                            22330,
                                            25516,
                                            19867,
                                            21761,
                                            21311]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 4,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW004",
                                "left": 0,
                                "top": 9,
                                "height": 9,
                                "width": 4,
                                "fullName": "Cumulative Gross Liquidation by Placement Quarter (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [3.5, 3.2, 2.9, 3.6]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [8.0, 9.1, 7.9, 8.2]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [12.0, 13.5, 11.2, 11.9]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [14.5, 16.8, 15.5, 15.2]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [18.8, 19.2, 18.2, 19.7]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 7,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW007",
                                "left": 0,
                                "top": 18,
                                "height": 9,
                                "width": 4,
                                "fullName": "Cumulative Net Liquidation by Placement Quarter (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [2.63, 2.46, 2.25, 2.63]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [6.00, 7.01, 6.24, 5.99]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [9.00, 10.40, 8.85, 8.65]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [10.88, 12.94, 12.25, 11.10]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [14.06, 14.78, 14.38, 14.38]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 5,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW005",
                                "left": 4,
                                "top": 9,
                                "height": 9,
                                "width": 4,
                                "fullName": "Cumulative Gross Liquidation by Placement Quarter (Beta)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [2.5, 2.2, 1.9, 2.6]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [7.0, 8.1, 6.9, 7.2]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [11.0, 12.5, 10.2, 10.9]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [13.5, 15.8, 14.5, 14.2]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [17.8, 18.2, 17.2, 18.7]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 8,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW008",
                                "left": 4,
                                "top": 18,
                                "height": 9,
                                "width": 4,
                                "fullName": "Cumulative Net Liquidation by Placement Quarter (Beta)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [1.63, 1.46, 1.25, 1.63]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [5.00, 6.01, 5.24, 4.99]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [8.00, 9.40, 7.85, 7.65]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [9.88, 11.94, 11.25, 10.10]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [13.06, 13.78, 13.38, 13.38]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 6,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW006",
                                "left": 8,
                                "top": 9,
                                "height": 9,
                                "width": 4,
                                "fullName": "Cumulative Gross Liquidation by Placement Quarter (Gama)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [4, 3.7, 3.4, 4.1]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [8.5, 9.6, 8.4, 8.7]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [12.5, 14.0, 11.7, 12.4]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [15.0, 17.3, 16.0, 15.7]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [19.3, 19.7, 18.7, 20.2]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 9,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW009",
                                "left": 8,
                                "top": 18,
                                "height": 9,
                                "width": 4,
                                "fullName": "Cumulative Net Liquidation by Placement Quarter (Gama)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "3-month",
                                        "data": [2.63, 2.46, 2.25, 2.63]
                                    },
                                    {
                                        "label": "6-month",
                                        "data": [6.00, 7.01, 6.24, 5.99]
                                    },
                                    {
                                        "label": "12-month",
                                        "data": [9.00, 10.40, 8.85, 8.65]
                                    },
                                    {
                                        "label": "18-month",
                                        "data": [10.88, 12.94, 12.25, 11.10]
                                    },
                                    {
                                        "label": "24-month",
                                        "data": [14.06, 14.78, 14.38, 14.38]
                                    }
                                ],
                                labels: [
                                    "2022 Q1",
                                    "2022 Q2",
                                    "2022 Q3",
                                    "2022 Q4",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 3,
                                "chartType": "Line_fill",
                                "widgetCode": "DW003",
                                "left": 8,
                                "top": 0,
                                "height": 9,
                                "width": 4,
                                "fullName": "Future Payments Set Up by Month by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            3260,
                                            3685,
                                            4205,
                                            4344,
                                            4919,
                                            5796,
                                            5885,
                                            6573,
                                            7779,
                                            8182,
                                            7929,
                                            6903,
                                            6613,
                                            6222,
                                            6078,
                                            5587,
                                            5494,
                                            4700,
                                            4374,
                                            4157,
                                            4013,
                                            3474,
                                            3392,
                                            3232,
                                            2966,
                                            2644,
                                            2309,
                                            2184,
                                            2009,
                                            1820]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            3780,
                                            4195,
                                            5035,
                                            5331,
                                            5489,
                                            6775,
                                            7914,
                                            8790,
                                            8873,
                                            9506,
                                            8546,
                                            7492,
                                            6652,
                                            6143,
                                            6064,
                                            5629,
                                            5531,
                                            5271,
                                            4487,
                                            3953,
                                            3391,
                                            3274,
                                            3264,
                                            2954,
                                            2573,
                                            2488,
                                            2325,
                                            2136,
                                            1830,
                                            1748]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            5848,
                                            7000,
                                            7356,
                                            8731,
                                            9405,
                                            9416,
                                            10103,
                                            10542,
                                            12632,
                                            12989,
                                            12018,
                                            11679,
                                            11489,
                                            10860,
                                            9908,
                                            9481,
                                            8723,
                                            7831,
                                            7184,
                                            6271,
                                            5803,
                                            5675,
                                            5267,
                                            5026,
                                            4942,
                                            4824,
                                            4473,
                                            3877,
                                            3617,
                                            3264]
                                    }
                                ],
                                labels: [
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                    "Jan-23",
                                    "Feb-23",
                                    "Mar-23",
                                    "Apr-23",
                                    "May-23",
                                    "Jun-23",
                                    "Jul-23",
                                    "Aug-23",
                                    "Sep-23",
                                    "Oct-23",
                                    "Nov-23",
                                    "Dec-23",
                                    "Jan-24",
                                    "Feb-24",
                                    "Mar-24",
                                    "Apr-24",
                                    "May-24",
                                    "Jun-24",
                                    "Jul-24",
                                    "Aug-24",
                                    "Sep-24",
                                    "Oct-24",
                                    "Nov-24",
                                    "Dec-24"
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 16,
                                "chartType": "Line",
                                "widgetCode": "DW016",
                                "left": 0,
                                "top": 45,
                                "height": 9,
                                "width": 4,
                                "fullName": "90 Day Payer Rate by Placement Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            7.10,
                                            7.15,
                                            7.80,
                                            7.30,
                                            6.80,
                                            7.00,
                                            6.20,
                                            5.10,
                                            6.70,
                                            7.30,
                                            8.40,
                                            9.10]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            4.74,
                                            4.77,
                                            5.20,
                                            4.87,
                                            4.54,
                                            3.40,
                                            4.14,
                                            4.67,
                                            4.47,
                                            4.87,
                                            5.60,
                                            5.90]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            6.28,
                                            6.33,
                                            6.90,
                                            6.46,
                                            6.02,
                                            6.20,
                                            5.49,
                                            5.40,
                                            5.93,
                                            6.46,
                                            7.43,
                                            6.80]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 17,
                                "chartType": "Line",
                                "widgetCode": "DW017",
                                "left": 4,
                                "top": 45,
                                "height": 9,
                                "width": 4,
                                "fullName": "180 Day Payer Rate by Placement Month",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            9.59,
                                            9.65,
                                            10.53,
                                            9.86,
                                            9.18,
                                            9.45,
                                            8.37,
                                            6.89,
                                            9.05,
                                            9.86,
                                            11.34,
                                            12.29]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            6.34,
                                            5.98,
                                            6.21,
                                            5.25,
                                            5.70,
                                            4.13,
                                            4.35,
                                            4.97,
                                            4.51,
                                            5.66,
                                            5.77,
                                            7.84]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            6.50,
                                            7.13,
                                            10.12,
                                            7.98,
                                            6.79,
                                            8.55,
                                            6.37,
                                            7.26,
                                            8.04,
                                            9.00,
                                            11.22,
                                            10.30]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 10,
                                "chartType": "Line",
                                "widgetCode": "DW010",
                                "left": 0,
                                "top": 27,
                                "height": 9,
                                "width": 4,
                                "fullName": "Average Dials per Day by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            3,
                                            4,
                                            5,
                                            4,
                                            4,
                                            3,
                                            4,
                                            5,
                                            4,
                                            3,
                                            3,
                                            3]
                                    }, {
                                        "label": "Beta",
                                        "data": [
                                            2,
                                            3,
                                            4,
                                            3,
                                            3,
                                            2,
                                            3,
                                            4,
                                            3,
                                            2,
                                            2,
                                            2]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            4,
                                            5,
                                            6,
                                            5,
                                            5,
                                            4,
                                            5,
                                            6,
                                            5,
                                            4,
                                            4,
                                            4]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 12,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW012",
                                "left": 8,
                                "top": 27,
                                "height": 9,
                                "width": 4,
                                "fullName": "Average SMS per Day by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2,
                                            2]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1,
                                            1]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3,
                                            3]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 11,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW011",
                                "left": 4,
                                "top": 27,
                                "height": 9,
                                "width": 4,
                                "fullName": "Average Emails per Day by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            5,
                                            5,
                                            5,
                                            5,
                                            5,
                                            6,
                                            6,
                                            3,
                                            6,
                                            7,
                                            7,
                                            7]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            4,
                                            4,
                                            4,
                                            4,
                                            4,
                                            5,
                                            5,
                                            2,
                                            5,
                                            6,
                                            6,
                                            6]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            6,
                                            6,
                                            6,
                                            6,
                                            6,
                                            7,
                                            7,
                                            4,
                                            7,
                                            8,
                                            8,
                                            8]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 13,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW013",
                                "left": 0,
                                "top": 36,
                                "height": 9,
                                "width": 4,
                                "fullName": "Average Letters per Day by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            0.75,
                                            1,
                                            2,
                                            1,
                                            0.5,
                                            0.5,
                                            0.5,
                                            0.5,
                                            0.5,
                                            0.75,
                                            0.75,
                                            0.75]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            0.5,
                                            0.75,
                                            1.75,
                                            0.75,
                                            0.25,
                                            0.25,
                                            0.25,
                                            0.25,
                                            0.25,
                                            0.5,
                                            0.5,
                                            0.5]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            1,
                                            1.25,
                                            2.25,
                                            1.25,
                                            0.75,
                                            0.75,
                                            0.75,
                                            0.75,
                                            0.75,
                                            1,
                                            1,
                                            1]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 14,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW014",
                                "left": 4,
                                "top": 36,
                                "height": 9,
                                "width": 4,
                                "fullName": "Average RPC Rate by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            60,
                                            65,
                                            70,
                                            55,
                                            60,
                                            65,
                                            80,
                                            70,
                                            60,
                                            60,
                                            50,
                                            60]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            58,
                                            63,
                                            68,
                                            53,
                                            58,
                                            63,
                                            78,
                                            68,
                                            58,
                                            58,
                                            48,
                                            58]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            62,
                                            67,
                                            72,
                                            57,
                                            62,
                                            67,
                                            82,
                                            72,
                                            62,
                                            62,
                                            52,
                                            62]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 15,
                                "chartType": "Line_stacked",
                                "widgetCode": "DW015",
                                "left": 8,
                                "top": 36,
                                "height": 9,
                                "width": 4,
                                "fullName": "Average Conversion Rate by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            30,
                                            30,
                                            20,
                                            23,
                                            35,
                                            25,
                                            30,
                                            32,
                                            33,
                                            35,
                                            37,
                                            30]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            28,
                                            28,
                                            18,
                                            21,
                                            33,
                                            23,
                                            28,
                                            30,
                                            31,
                                            33,
                                            35,
                                            28]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            32,
                                            32,
                                            22,
                                            25,
                                            37,
                                            27,
                                            32,
                                            34,
                                            35,
                                            37,
                                            39,
                                            32]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 18,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW018",
                                "left": 0,
                                "top": 54,
                                "height": 9,
                                "width": 4,
                                "fullName": "Disputes by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            5,
                                            8,
                                            3,
                                            7,
                                            4,
                                            8,
                                            6,
                                            8,
                                            9,
                                            7,
                                            6,
                                            7]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            10,
                                            10,
                                            7,
                                            7,
                                            5,
                                            5,
                                            7,
                                            8,
                                            12,
                                            6,
                                            8,
                                            5]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            7,
                                            8,
                                            5,
                                            7,
                                            5,
                                            5,
                                            6,
                                            8,
                                            11,
                                            5,
                                            9,
                                            5]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 19,
                                "chartType": "SIMPLE_BAR",
                                "widgetCode": "DW019",
                                "left": 4,
                                "top": 54,
                                "height": 9,
                                "width": 4,
                                "fullName": "Complaints by Partner",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Alpha",
                                        "data": [
                                            5,
                                            8,
                                            9,
                                            7,
                                            5,
                                            6,
                                            8,
                                            8,
                                            10,
                                            5,
                                            7,
                                            7]
                                    },
                                    {
                                        "label": "Beta",
                                        "data": [
                                            6,
                                            8,
                                            7,
                                            7,
                                            5,
                                            6,
                                            6,
                                            8,
                                            10,
                                            5,
                                            7,
                                            7]
                                    },
                                    {
                                        "label": "Gama",
                                        "data": [
                                            5,
                                            8,
                                            3,
                                            7,
                                            4,
                                            8,
                                            6,
                                            8,
                                            9,
                                            7,
                                            6,
                                            7]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22",
                                ]
                            }
                        ],
                        "theme": "default"
                    },
                    "message": ""
                })
            }

            function complianceDashboard() {
                return ok({
                    "validation": true,
                    "error": [],
                    "response": {
                        "preference": [
                            {
                                "isTrendLine": false,
                                "widgetId": 1,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW001",
                                "fullName": "Disputes by Type - last 12 months",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Balance Incorrect",
                                        "data": [
                                            5,
                                            8,
                                            5,
                                            8,
                                            4,
                                            1,
                                            9,
                                            6,
                                            7,
                                            4,
                                            2,
                                            10]
                                    },
                                    {
                                        "label": "Paid Prior",
                                        "data": [
                                            6,
                                            4,
                                            6,
                                            8,
                                            6,
                                            1,
                                            5,
                                            10,
                                            10,
                                            9,
                                            8,
                                            3]
                                    },
                                    {
                                        "label": "Fraud",
                                        "data": [
                                            6,
                                            10,
                                            5,
                                            3,
                                            4,
                                            4,
                                            5,
                                            4,
                                            9,
                                            2,
                                            7,
                                            6]
                                    },
                                    {
                                        "label": "Other",
                                        "data": [
                                            8,
                                            6,
                                            3,
                                            2,
                                            1,
                                            9,
                                            1,
                                            4,
                                            9,
                                            2,
                                            8,
                                            1]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 3,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW003",
                                "fullName": "Complaints by Source - last 12 months",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "CFPB",
                                        "data": [
                                            8,
                                            11,
                                            8,
                                            8,
                                            5,
                                            10,
                                            6,
                                            9,
                                            7,
                                            4,
                                            7,
                                            5]
                                    },
                                    {
                                        "label": "State Regulatory Body",
                                        "data": [
                                            3,
                                            4,
                                            4,
                                            4,
                                            1,
                                            1,
                                            3,
                                            5,
                                            3,
                                            3,
                                            2,
                                            1]
                                    },
                                    {
                                        "label": "BBB",
                                        "data": [2,
                                            2,
                                            3,
                                            5,
                                            1,
                                            1,
                                            2,
                                            5,
                                            5,
                                            3,
                                            4,
                                            5,]
                                    },
                                    {
                                        "label": "Direct",
                                        "data": [
                                            2,
                                            2,
                                            2,
                                            3,
                                            5,
                                            7,
                                            8,
                                            5,
                                            6,
                                            6,
                                            5,
                                            6]
                                    },
                                    {
                                        "label": "Other",
                                        "data": [
                                            1,
                                            5,
                                            2,
                                            1,
                                            2,
                                            1,
                                            1,
                                            0,
                                            8,
                                            1,
                                            2,
                                            4]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 2,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW002",
                                "fullName": "Complaints by Reason - last 12 months",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Agency Servicing Tactics",
                                        "data": [
                                            5,
                                            2,
                                            0,
                                            6,
                                            1,
                                            7,
                                            3,
                                            9,
                                            9,
                                            4,
                                            2,
                                            10]
                                    },
                                    {
                                        "label": "Credit Reporting",
                                        "data": [
                                            8,
                                            0,
                                            3,
                                            8,
                                            3,
                                            7,
                                            9,
                                            3,
                                            4,
                                            4,
                                            10,
                                            5]
                                    },
                                    {
                                        "label": "Debt Not Owed",
                                        "data": [
                                            2,
                                            6,
                                            9,
                                            8,
                                            10,
                                            4,
                                            9,
                                            8,
                                            1,
                                            0,
                                            3,
                                            9,]
                                    },
                                    {
                                        "label": "Firm/Legal Process",
                                        "data": [
                                            6,
                                            4,
                                            7,
                                            2,
                                            2,
                                            1,
                                            9,
                                            3,
                                            3,
                                            1,
                                            0,
                                            5]
                                    },
                                    {
                                        "label": "Issue Prior to Placement",
                                        "data": [
                                            3,
                                            6,
                                            10,
                                            7,
                                            1,
                                            7,
                                            4,
                                            9,
                                            9,
                                            8,
                                            2,
                                            3]
                                    },
                                    {
                                        "label": "Payment/Billing Process",
                                        "data": [
                                            5,
                                            5,
                                            4,
                                            10,
                                            4,
                                            3,
                                            6,
                                            7,
                                            1,
                                            4,
                                            5,
                                            7]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 5,
                                "chartType": "COMPLEX_BAR_LINE_CHART",
                                "widgetCode": "DW005",
                                "fullName": "Complaint Substantiation - last 12 months",
                                "description": "Placed portfolio YTD by ranked by expected value decile (1 = high; 10 = low).",
                                "datasets": [
                                    {
                                        type: 'line' as const,
                                        "label": "Percent Substantiated",
                                        "data": [
                                            10.00,
                                            15.00,
                                            10.00,
                                            5.00,
                                            5.00,
                                            7.00,
                                            8.00,
                                            9.00,
                                            10.00,
                                            11.00,
                                            5.00,
                                            7.00]

                                    },
                                    {
                                        type: 'bar' as const,
                                        label: 'Total Complaints',
                                        data: [
                                            30,
                                            11,
                                            33,
                                            21,
                                            33,
                                            23,
                                            31,
                                            35,
                                            16,
                                            23,
                                            18,
                                            31]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 6,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW006",
                                "fullName": "Outstanding - Complaints",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Past SLA",
                                        "data": [
                                            1,
                                            5,
                                            4,
                                            3,
                                            1,
                                            4,
                                            3,
                                            2,
                                            2,
                                            4,
                                            3,
                                            5]
                                    },
                                    {
                                        "label": "Within SLA",
                                        "data": [
                                            3,
                                            5,
                                            2,
                                            5,
                                            3,
                                            5,
                                            1,
                                            3,
                                            1,
                                            3,
                                            2,
                                            4]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 7,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW007",
                                "fullName": "Outstanding - Disputes",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Past SLA",
                                        "data": [
                                            1,
                                            2,
                                            5,
                                            4,
                                            4,
                                            1,
                                            4,
                                            2,
                                            2,
                                            5,
                                            4,
                                            3]
                                    },
                                    {
                                        "label": "Within SLA",
                                        "data": [
                                            2,
                                            4,
                                            1,
                                            3,
                                            1,
                                            1,
                                            4,
                                            5,
                                            3,
                                            2,
                                            4,
                                            3]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 4,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW004",
                                "fullName": "Compliance Exceptions",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Unconsented Call",
                                        "data": [
                                            5,
                                            7,
                                            10,
                                            20,
                                            5,
                                            7,
                                            8,
                                            15,
                                            12,
                                            7,
                                            8,
                                            10]
                                    },
                                    {
                                        "label": "Unconsented SMS",
                                        "data": [
                                            4,
                                            6,
                                            9,
                                            19,
                                            4,
                                            6,
                                            7,
                                            14,
                                            11,
                                            6,
                                            7,
                                            9]
                                    },
                                    {
                                        "label": "7-in-7",
                                        "data": [
                                            10,
                                            15,
                                            13,
                                            20,
                                            25,
                                            22,
                                            18,
                                            17,
                                            15,
                                            19,
                                            22,
                                            20]
                                    },
                                    {
                                        "label": "Attorney Comm",
                                        "data": [
                                            8,
                                            13,
                                            11,
                                            18,
                                            23,
                                            20,
                                            16,
                                            15,
                                            13,
                                            17,
                                            20,
                                            18]
                                    },
                                    {
                                        "label": "Attempt prior to Validation",
                                        "data": [
                                            6,
                                            11,
                                            9,
                                            16,
                                            21,
                                            18,
                                            14,
                                            13,
                                            11,
                                            15,
                                            18,
                                            16]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            }
                        ],
                        "theme": "default"
                    },
                    "message": ""
                })
            }

            function complianceDashboardAlfa() {
                return ok({
                    "validation": true,
                    "error": [],
                    "response": {
                        "preference": [
                            {
                                "isTrendLine": false,
                                "widgetId": 1,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW001",
                                "fullName": "Disputes by Type - last 12 months (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Balance Incorrect",
                                        "data": [
                                            3,
                                            6,
                                            3,
                                            6,
                                            2,
                                            0,
                                            7,
                                            4,
                                            5,
                                            2,
                                            0,
                                            8]
                                    },
                                    {
                                        "label": "Paid Prior",
                                        "data": [
                                            4,
                                            2,
                                            4,
                                            6,
                                            4,
                                            0,
                                            3,
                                            8,
                                            8,
                                            7,
                                            6,
                                            1]
                                    },
                                    {
                                        "label": "Fraud",
                                        "data": [
                                            4,
                                            8,
                                            3,
                                            1,
                                            2,
                                            2,
                                            3,
                                            2,
                                            7,
                                            0,
                                            5,
                                            4]
                                    },
                                    {
                                        "label": "Other",
                                        "data": [
                                            6,
                                            4,
                                            1,
                                            0,
                                            0,
                                            7,
                                            0,
                                            2,
                                            7,
                                            0,
                                            6,
                                            0]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },

                            {
                                "isTrendLine": false,
                                "widgetId": 2,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW002",
                                "fullName": "Complaints by Reason - last 12 months (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Agency Servicing Tactics",
                                        "data": [
                                            2,
                                            0,
                                            1,
                                            3,
                                            1,
                                            4,
                                            0,
                                            6,
                                            6,
                                            1,
                                            1,
                                            7]
                                    },
                                    {
                                        "label": "Credit Reporting",
                                        "data": [
                                            5,
                                            1,
                                            0,
                                            5,
                                            0,
                                            4,
                                            6,
                                            0,
                                            1,
                                            1,
                                            7,
                                            2]
                                    },
                                    {
                                        "label": "Debt Not Owed",
                                        "data": [
                                            1,
                                            3,
                                            6,
                                            5,
                                            7,
                                            1,
                                            6,
                                            5,
                                            1,
                                            1,
                                            0,
                                            6,]
                                    },
                                    {
                                        "label": "Firm/Legal Process",
                                        "data": [
                                            3,
                                            1,
                                            4,
                                            1,
                                            1,
                                            1,
                                            6,
                                            0,
                                            0,
                                            2,
                                            2,
                                            2]
                                    },
                                    {
                                        "label": "Issue Prior to Placement",
                                        "data": [
                                            0,
                                            3,
                                            7,
                                            4,
                                            2,
                                            4,
                                            1,
                                            6,
                                            6,
                                            5,
                                            1,
                                            0]
                                    },
                                    {
                                        "label": "Payment/Billing Process",
                                        "data": [
                                            2,
                                            2,
                                            1,
                                            7,
                                            1,
                                            0,
                                            3,
                                            4,
                                            2,
                                            1,
                                            2,
                                            4]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 3,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW003",
                                "fullName": "Complaints by Source - last 12 months (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "CFPB",
                                        "data": [
                                            7,
                                            10,
                                            7,
                                            7,
                                            4,
                                            9,
                                            0,
                                            8,
                                            6,
                                            3,
                                            6,
                                            4]
                                    },
                                    {
                                        "label": "State Regulatory Body",
                                        "data": [
                                            2,
                                            3,
                                            3,
                                            3,
                                            0,
                                            0,
                                            2,
                                            4,
                                            2,
                                            2,
                                            1,
                                            0]
                                    },
                                    {
                                        "label": "BBB",
                                        "data": [
                                            2,
                                            3,
                                            3,
                                            3,
                                            0,
                                            0,
                                            2,
                                            4,
                                            2,
                                            2,
                                            1,
                                            0,]
                                    },
                                    {
                                        "label": "Direct",
                                        "data": [
                                            1,
                                            0,
                                            1,
                                            2,
                                            0,
                                            0,
                                            7,
                                            0,
                                            5,
                                            5,
                                            4,
                                            5]
                                    },
                                    {
                                        "label": "Other",
                                        "data": [
                                            0,
                                            4,
                                            1,
                                            0,
                                            1,
                                            0,
                                            0,
                                            0,
                                            7,
                                            0,
                                            1,
                                            3]
                                    }
                                ],
                                labels: ["Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 4,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW004",
                                "fullName": "Compliance Exceptions (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Unconsented Call",
                                        "data": [
                                            1,
                                            3,
                                            6,
                                            16,
                                            1,
                                            3,
                                            4,
                                            11,
                                            8,
                                            3,
                                            4,
                                            6]
                                    },
                                    {
                                        "label": "Unconsented SMS",
                                        "data": [
                                            0,
                                            2,
                                            5,
                                            15,
                                            0,
                                            2,
                                            3,
                                            10,
                                            7,
                                            2,
                                            3,
                                            5]
                                    },
                                    {
                                        "label": "7-in-7",
                                        "data": [
                                            6,
                                            11,
                                            9,
                                            16,
                                            21,
                                            18,
                                            14,
                                            13,
                                            11,
                                            15,
                                            18,
                                            16]
                                    },
                                    {
                                        "label": "Attorney Comm",
                                        "data": [
                                            4,
                                            9,
                                            7,
                                            14,
                                            19,
                                            16,
                                            12,
                                            11,
                                            9,
                                            13,
                                            16,
                                            14]
                                    },
                                    {
                                        "label": "Attempt prior to Validation",
                                        "data": [
                                            2,
                                            7,
                                            5,
                                            12,
                                            17,
                                            14,
                                            10,
                                            9,
                                            7,
                                            11,
                                            14,
                                            12]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 5,
                                "chartType": "COMPLEX_BAR_LINE_CHART",
                                "widgetCode": "DW005",
                                "fullName": "Complaint Substantiation - last 12 months (Alpha)",
                                "description": "Placed portfolio YTD by ranked by expected value decile (1 = high; 10 = low).",
                                "datasets": [
                                    {
                                        type: 'line' as const,
                                        "label": "Percent Substantiated",
                                        "data": [
                                            8.00,
                                            13.00,
                                            8.00,
                                            3.00,
                                            3.00,
                                            5.00,
                                            6.00,
                                            7.00,
                                            8.00,
                                            9.00,
                                            3.00,
                                            5.00]
                                    },
                                    {
                                        type: 'bar' as const,
                                        label: 'Total Complaints',
                                        data: [
                                            20,
                                            1,
                                            23,
                                            11,
                                            23,
                                            13,
                                            21,
                                            25,
                                            6,
                                            13,
                                            8,
                                            21]

                                    },
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 6,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW006",
                                "fullName": "Outstanding - Complaints (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Past SLA",
                                        "data": [
                                            0,
                                            4,
                                            3,
                                            2,
                                            0,
                                            3,
                                            2,
                                            1,
                                            1,
                                            3,
                                            2,
                                            4]
                                    },
                                    {
                                        "label": "Within SLA",
                                        "data": [
                                            2,
                                            4,
                                            1,
                                            4,
                                            2,
                                            4,
                                            0,
                                            2,
                                            0,
                                            2,
                                            1,
                                            3]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },
                            {
                                "isTrendLine": false,
                                "widgetId": 7,
                                "chartType": "SIMPLE_STACKED_BAR",
                                "widgetCode": "DW007",
                                "fullName": "Outstanding - Disputes (Alpha)",
                                "description": "Composition of overall portfolio by product type YTD.",
                                "datasets": [
                                    {
                                        "label": "Past SLA",
                                        "data": [
                                            0,
                                            1,
                                            4,
                                            3,
                                            3,
                                            0,
                                            3,
                                            1,
                                            1,
                                            4,
                                            3,
                                            2]
                                    },
                                    {
                                        "label": "Within SLA",
                                        "data": [
                                            1,
                                            3,
                                            0,
                                            2,
                                            0,
                                            0,
                                            3,
                                            4,
                                            2,
                                            1,
                                            3,
                                            2]
                                    }
                                ],
                                labels: [
                                    "Jan-22",
                                    "Feb-22",
                                    "Mar-22",
                                    "Apr-22",
                                    "May-22",
                                    "Jun-22",
                                    "Jul-22",
                                    "Aug-22",
                                    "Sep-22",
                                    "Oct-22",
                                    "Nov-22",
                                    "Dec-22"]
                            },

                        ],
                        "theme": "default"
                    },
                    "message": ""
                })
            }
        })
    }
}