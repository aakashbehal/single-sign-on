import { axiosCustom } from "./util"
const MockAdapter = require("axios-mock-adapter");

export const configureFakeBackend = () => {

    const mock = new MockAdapter(axiosCustom);
    // authentication api
    mock.restore();

    mock.onPost("/authenticate").reply((opts: any) => {
        const body = opts.data && JSON.parse(opts.data)
        const { loginKey, loginSecret } = body;
        let role = 'Client'
        if (loginKey === 'abehal@equabli.com') {
            role = 'Partner'
        }
        return [200, {
            isResetRequired: false,
            validation: true,
            response: {
                userUuid: '3d868c75-6ee8-4d58-b59c-3e43c6187757',
                username: loginKey,
                token: 'fake-jwt-token',
                email: 'abehal@equabli.com',
                role: role,
                firstName: "First Name",
            }
        }]
    });

    // Field options APC
    mock.onGet("/fileNamesConfig").reply((opts: any) => {
        const params = opts.params
        if (params.fileNameConfig === 'SEPARATOR') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": {
                    "docMgrConfigs": [
                        {
                            "id": 15,
                            "shortCode": "SEPARATOR",
                            "description": "file seperator",
                            "defaultValue": "Underscore[_]",
                            "docMgrConfigVals": [
                                {
                                    "id": 68,
                                    "shortCode": "-",
                                    "description": "Hyphne[-]",
                                    "fieldValue": "Hyphne[-]"
                                },
                                {
                                    "id": 69,
                                    "shortCode": "_",
                                    "description": "Underscore[_]",
                                    "fieldValue": "Underscore[_]"
                                }
                            ]
                        }
                    ],
                    "userTypeId": 2
                },
                "validation": true
            }]
        } else if (params.fileNameConfig === 'RETENTION_POLICY') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": {
                    "docMgrConfigs": [
                        {
                            "id": 7,
                            "shortCode": "RP",
                            "description": "retention policy in day",
                            "defaultValue": "60",
                            "docMgrConfigVals": [
                                {
                                    "id": 28,
                                    "shortCode": "60",
                                    "description": "retention policy in 60 days",
                                    "fieldValue": "60"
                                },
                                {
                                    "id": 29,
                                    "shortCode": "90",
                                    "description": "retention policy in 90 days",
                                    "fieldValue": "90"
                                }
                            ]
                        }
                    ],
                    "userTypeId": 1
                },
                "validation": true
            }]
        } else if (params.fileNameConfig === 'DOCUMENT_POLICY') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": {
                    "docMgrConfigs": [
                        {
                            "id": 8,
                            "shortCode": "DP",
                            "description": "Specify document policy like allow create new document or replace",
                            "defaultValue": "Keep Both File",
                            "docMgrConfigVals": [
                                {
                                    "id": 30,
                                    "shortCode": "KBF",
                                    "description": "Keep Both File",
                                    "fieldValue": "Keep Both File"
                                },
                                {
                                    "id": 31,
                                    "shortCode": "RE",
                                    "description": "Replace  Existing",
                                    "fieldValue": "Replace Existing"
                                }
                            ]
                        }
                    ],
                    "userTypeId": 1
                },
                "validation": true
            }]
        } else if (!params.fileNameConfig && params.userType === 'Client') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": {
                    "docMgrConfigs": [
                        {
                            "id": 1,
                            "shortCode": "field1",
                            "description": "",
                            "defaultValue": "Client Account Number",
                            "docMgrConfigVals": [
                                {
                                    "id": 1,
                                    "shortCode": "CAN",
                                    "description": "client account number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 2,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 3,
                                    "shortCode": "OAN",
                                    "description": "Original account number",
                                    "fieldValue": "Orignal Account Number"
                                },
                                {
                                    "id": 4,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 5,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                },
                                {
                                    "id": 6,
                                    "shortCode": "PCD",
                                    "description": "Product Code",
                                    "fieldValue": "Product Code"
                                }
                            ]
                        },
                        {
                            "id": 2,
                            "shortCode": "field2",
                            "description": "",
                            "defaultValue": "Document Type ID",
                            "docMgrConfigVals": [
                                {
                                    "id": 6,
                                    "shortCode": "CAN",
                                    "description": "client account number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 7,
                                    "shortCode": "DT",
                                    "description": "Document Type",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 8,
                                    "shortCode": "OAN",
                                    "description": "Original account number",
                                    "fieldValue": "Orignal Account Number"
                                },
                                {
                                    "id": 9,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 10,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "shortCode": "field3",
                            "description": "",
                            "defaultValue": "Original Account Number",
                            "docMgrConfigVals": [
                                {
                                    "id": 11,
                                    "shortCode": "CAN",
                                    "description": "client account number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 12,
                                    "shortCode": "DT",
                                    "description": "Document Type",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 13,
                                    "shortCode": "OAN",
                                    "description": "Original account number",
                                    "fieldValue": "Orignal Account Number"
                                },
                                {
                                    "id": 14,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 15,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 4,
                            "shortCode": "field4",
                            "description": "",
                            "defaultValue": "Document Generation Date",
                            "docMgrConfigVals": [
                                {
                                    "id": 16,
                                    "shortCode": "CAN",
                                    "description": "client account number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 17,
                                    "shortCode": "DT",
                                    "description": "Document Type",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 18,
                                    "shortCode": "OAN",
                                    "description": "Original account number",
                                    "fieldValue": "Orignal Account Number"
                                },
                                {
                                    "id": 19,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 20,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 5,
                            "shortCode": "field5",
                            "description": "",
                            "defaultValue": "Document Name",
                            "docMgrConfigVals": [
                                {
                                    "id": 24,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 25,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                },
                                {
                                    "id": 21,
                                    "shortCode": "CAN",
                                    "description": "client account number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 22,
                                    "shortCode": "DT",
                                    "description": "Document Type",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 23,
                                    "shortCode": "OAN",
                                    "description": "Original account number",
                                    "fieldValue": "Orignal Account Number"
                                }
                            ]
                        },
                        {
                            "id": 15,
                            "shortCode": "field6",
                            "description": "",
                            "defaultValue": "Product Code",
                            "docMgrConfigVals": [
                                {
                                    "id": 62,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 63,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 64,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 65,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 66,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 67,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        }
                    ],
                    "userTypeId": 1
                },
                "validation": true
            }]
        } else if (!params.fileNameConfig && params.userType === 'Partner') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": {
                    "docMgrConfigs": [
                        {
                            "id": 9,
                            "shortCode": "field1",
                            "description": "",
                            "defaultValue": "Client ID or Client Short Code",
                            "docMgrConfigVals": [
                                {
                                    "id": 32,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 33,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 34,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 35,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 36,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 37,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                },
                                {
                                    "id": 38,
                                    "shortCode": "PCD",
                                    "description": "Product Code",
                                    "fieldValue": "Product Code"
                                }
                            ]
                        },
                        {
                            "id": 10,
                            "shortCode": "field2",
                            "description": "",
                            "defaultValue": "Document Type ID",
                            "docMgrConfigVals": [
                                {
                                    "id": 38,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 39,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 40,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 41,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 42,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 43,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 11,
                            "shortCode": "field3",
                            "description": "",
                            "defaultValue": "Client Account Number",
                            "docMgrConfigVals": [
                                {
                                    "id": 44,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 45,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 46,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 47,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 48,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 49,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 12,
                            "shortCode": "field4",
                            "description": "",
                            "defaultValue": "Original Account Number",
                            "docMgrConfigVals": [
                                {
                                    "id": 50,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 51,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 52,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 53,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 54,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 55,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 13,
                            "shortCode": "field5",
                            "description": "",
                            "defaultValue": "Document Generation Date",
                            "docMgrConfigVals": [
                                {
                                    "id": 56,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 57,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 58,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 59,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 60,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 61,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 14,
                            "shortCode": "field6",
                            "description": "",
                            "defaultValue": "Document Name",
                            "docMgrConfigVals": [
                                {
                                    "id": 62,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 63,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 64,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 65,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 66,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 67,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        },
                        {
                            "id": 15,
                            "shortCode": "field7",
                            "description": "",
                            "defaultValue": "Product Code",
                            "docMgrConfigVals": [
                                {
                                    "id": 62,
                                    "shortCode": "CIDSC",
                                    "description": "Client ID or Client Short Code",
                                    "fieldValue": "Client ID or Client Short Code"
                                },
                                {
                                    "id": 63,
                                    "shortCode": "DT",
                                    "description": "Document Type Id",
                                    "fieldValue": "Document Type Id"
                                },
                                {
                                    "id": 64,
                                    "shortCode": "CAN",
                                    "description": "Client Account Number",
                                    "fieldValue": "Client Account Number"
                                },
                                {
                                    "id": 65,
                                    "shortCode": "OAN",
                                    "description": "Original Account Number",
                                    "fieldValue": "Original Account Number"
                                },
                                {
                                    "id": 66,
                                    "shortCode": "DGD",
                                    "description": "Document Generation Date",
                                    "fieldValue": "Document Generation Date"
                                },
                                {
                                    "id": 67,
                                    "shortCode": "DN",
                                    "description": "Document Name",
                                    "fieldValue": "Document Name"
                                }
                            ]
                        }
                    ],
                    "userTypeId": 2
                },
                "validation": true
            }]
        }
    })

    /**
     * Get user File config
     */
    mock.onGet("/user/file/configuration").reply((opts: any) => {
        const params = opts.params
        if (params.fileNameConfig === 'FIELD') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": [
                    {
                        "id": 33,
                        "docMgrConfig": {
                            "id": 1,
                            "shortCode": "field1",
                            "description": "",
                            "defaultValue": "Client Account Number"
                        },
                        "docMgrConfigVal": {
                            "id": 1,
                            "shortCode": "CAN",
                            "description": "client account number",
                            "fieldValue": "Client Account Number"
                        },
                        "userTypeId": 1,
                        "docMgrConfigSelectedCode": "field1",
                        "docMgrConfigValSelectedCode": "CAN"
                    },
                    {
                        "id": 34,
                        "docMgrConfig": {
                            "id": 2,
                            "shortCode": "field2",
                            "description": "",
                            "defaultValue": "Document Type ID"
                        },
                        "docMgrConfigVal": {
                            "id": 8,
                            "shortCode": "OAN",
                            "description": "Original account number",
                            "fieldValue": "Orignal Account Number"
                        },
                        "userTypeId": 1,
                        "docMgrConfigSelectedCode": "field2",
                        "docMgrConfigValSelectedCode": "OAN"
                    },
                    {
                        "id": 34,
                        "docMgrConfig": {
                            "id": 2,
                            "shortCode": "field2",
                            "description": "",
                            "defaultValue": "Document Type ID"
                        },
                        "docMgrConfigVal": {
                            "id": 8,
                            "shortCode": "OAN",
                            "description": "Original account number",
                            "fieldValue": "Orignal Account Number"
                        },
                        "userTypeId": 1,
                        "docMgrConfigSelectedCode": "field3",
                        "docMgrConfigValSelectedCode": "PCD"
                    },
                    {
                        "id": 34,
                        "docMgrConfig": {
                            "id": 2,
                            "shortCode": "field2",
                            "description": "",
                            "defaultValue": "Document Type ID"
                        },
                        "docMgrConfigVal": {
                            "id": 8,
                            "shortCode": "OAN",
                            "description": "Original account number",
                            "fieldValue": "Orignal Account Number"
                        },
                        "userTypeId": 1,
                        "docMgrConfigSelectedCode": "field4",
                        "docMgrConfigValSelectedCode": "DT"
                    }
                ],
                "validation": true
            }]
        } else if (params.fileNameConfig === 'RETENTION_POLICY') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": [
                    {
                        "id": 4,
                        "docMgrConfig": {
                            "id": 8,
                            "shortCode": "RP",
                            "description": "retention policy in day",
                            "defaultValue": "60"
                        },
                        "docMgrConfigVal": {
                            "id": 40,
                            "shortCode": "60",
                            "description": "retention policy in 60 days",
                            "fieldValue": "60"
                        },
                        "orgTypeCode": "CT",
                        "docMgrConfigSelectedCode": "RP",
                        "docMgrConfigValSelectedCode": "60"
                    }
                ],
                "validation": true
            }]
        } else if (params.fileNameConfig === 'SEPARATOR') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": [
                    {
                        "id": 6,
                        "docMgrConfig": {
                            "id": 7,
                            "shortCode": "SEPARATOR",
                            "description": "file seperator",
                            "defaultValue": "Underscore[_]"
                        },
                        "docMgrConfigVal": {
                            "id": 38,
                            "shortCode": "-",
                            "description": "Hyphne[-]",
                            "fieldValue": "Hyphne[-]"
                        },
                        "orgTypeCode": "CT",
                        "docMgrConfigSelectedCode": "SEPARATOR",
                        "docMgrConfigValSelectedCode": "-"
                    }
                ],
                "validation": true
            }]
        } else if (params.fileNameConfig === 'DOCUMENT_POLICY') {
            return [200, {
                "message": "Global config with  fetched successfully",
                "status": "SUCCESS",
                "response": [
                    {
                        "id": 5,
                        "docMgrConfig": {
                            "id": 9,
                            "shortCode": "DP",
                            "description": "Specify document policy like allow create new document or replace",
                            "defaultValue": "Keep Both File"
                        },
                        "docMgrConfigVal": {
                            "id": 43,
                            "shortCode": "RE",
                            "description": "Replace  Existing",
                            "fieldValue": "Replace Existing"
                        },
                        "orgTypeCode": "CT",
                        "docMgrConfigSelectedCode": "DP",
                        "docMgrConfigValSelectedCode": "RE"
                    }
                ],
                "validation": true
            }]
        }
    });

    /**
     * Save Retention Policy
     */
    mock.onPost("/retantionPolicy").reply((opts: any) => {
        return [200, {
            "message": "Global config with 14 id is created successfully",
            "status": "SUCCESS",
            "response": "14",
            "validation": true
        }]
    })

    /**
    * Save Duplicate 
    */
    mock.onPost("/documentConfiguration").reply((opts: any) => {
        return [200, {
            "message": "Global config with 14 id is created successfully",
            "status": "SUCCESS",
            "response": "14",
            "validation": true
        }]
    })

    /**
     * Get Folder Structure
     */
    mock.onGet("/document/folders").reply((opts: any) => {
        return [200, {
            "status": "SUCCESS",
            "response": {
                "metadata": {
                    "pageSize": 10,
                    "pageNumber": 0,
                    "recordCount": 2,
                    "pageCount": 0,
                    "startRecord": 1
                },
                "datas": [
                    {
                        "folderName": "123456",
                        "fileSize": 29572,
                        "modifiedDate": "01/12/2023",
                        "shareDate": null,
                        "receiveDate": null,
                        "shareBy": null,
                        "sharedWith": null
                    },
                    {
                        "folderName": "7890",
                        "fileSize": 29572,
                        "modifiedDate": "01/12/2023",
                        "shareDate": null,
                        "receiveDate": null,
                        "shareBy": null,
                        "sharedWith": null
                    }
                ]
            },
            "validation": true,
            "limit": 0,
            "total": 0,
            "lastPage": false
        }]
    })

    /**
     * Get Documents
     */
    mock.onGet("/document/documents").reply((opts: any) => {
        return [200, {
            "status": "SUCCESS",
            "response": {
                "metadata": {
                    "pageSize": 10,
                    "pageNumber": 0,
                    "recordCount": 2,
                    "pageCount": 1
                },
                "datas": [
                    {
                        "id": 7,
                        "documentName": "Application",
                        "documentType": "Application",
                        "originalAccountNo": "7890",
                        "equabliAccountNo": null,
                        "clientAccountNo": "123456",
                        "generateDate": null,
                        "uploadDate": null,
                        "shareDate": null,
                        "fileSize": 14786,
                        "sharedBy": null,
                        "sharedWith": null,
                        "fileName": "123456-Application-7890.png",
                        "objectKey": "https://eqb-dev-ui-dm.s3.amazonaws.com/default/CT/123456-456789-7890.png",
                        "orgTypeCode": "CT",
                        "filePath": "https://eqb-dev-ui-dm.s3.amazonaws.com/default/CT/123456-456789-7890.png"
                    },
                    {
                        "id": 8,
                        "documentName": "Application",
                        "documentType": "Application",
                        "originalAccountNo": "7890",
                        "equabliAccountNo": null,
                        "clientAccountNo": "123456",
                        "generateDate": null,
                        "uploadDate": null,
                        "shareDate": null,
                        "fileSize": 14786,
                        "sharedBy": null,
                        "sharedWith": null,
                        "fileName": "123456-Application-7890.pdf",
                        "objectKey": "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf",
                        "orgTypeCode": "CT",
                        "filePath": "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf"
                    }
                ]
            },
            "validation": true,
            "limit": 0,
            "total": 0,
            "lastPage": false
        }]
    })

    /**
     * Document Type List
     */
    mock.onGet("/document/documentType").reply((opts: any) => {
        return [200, {
            "message": "Document type fetch successfully",
            "status": "SUCCESS",
            "response": [
                {
                    "documentName": "Application",
                    "shortCode": "AP",
                    "description": "Application"
                },
                {
                    "documentName": "Bill of Sale",
                    "shortCode": "BS",
                    "description": "Bill of Sale"
                },
                {
                    "documentName": "Business Record Affidavit",
                    "shortCode": "BRS",
                    "description": "Business Record Affidavit"
                },
                {
                    "documentName": "Military Affidavit",
                    "shortCode": "MA",
                    "description": "Military Affidavit"
                },
                {
                    "documentName": "Transaction History",
                    "shortCode": "TH",
                    "description": "Transaction History"
                }
            ],
            "validation": true
        }]
    })

    /**
     * Document Cost list
     */
    mock.onGet("/document/costs").reply((opts: any) => {
        return [200, {
            "status": "SUCCESS",
            "validation": true,
            "response": [
                {
                    "documentType": "Business Record Affidavit",
                    "docTypeCode": "BRA",
                    "clientName": null,
                    "cost": 112
                },
                {
                    "documentType": "Transaction History",
                    "docTypeCode": "TH",
                    "clientName": null,
                    "cost": 10
                }
            ]
        }]
    })

    /**
     * Product Type list
     */
    mock.onGet("/document/productType").reply((opts: any) => {
        return [200, {
            "message": "Product config with  is created successfully",
            "status": "SUCCESS",
            "response": [
                {
                    "name": "Credit Card",
                    "productCode": "CC",
                    "description": "Credit Card"
                },
                {
                    "name": "Consumer Loan",
                    "productCode": "CL",
                    "description": "Consumer Loan"
                },
                {
                    "name": "Student Loan",
                    "productCode": "SL",
                    "description": "Student Loan"
                },
                {
                    "name": "Utility Debt",
                    "productCode": "UD",
                    "description": "Utility Debt"
                },
                {
                    "name": "Telecom",
                    "productCode": "TC",
                    "description": "Telecom"
                },
                {
                    "name": "Medical",
                    "productCode": "ML",
                    "description": "Medical"
                },
                {
                    "name": "Healthcare",
                    "productCode": "HC",
                    "description": "Healthcare"
                },
                {
                    "name": "Municipal Debt",
                    "productCode": "MD",
                    "description": "Municipal Debt"
                },
                {
                    "name": "Auto Loan",
                    "productCode": "AL",
                    "description": "Auto Loan"
                },
                {
                    "name": "Debit Card",
                    "productCode": "DC",
                    "description": "Debit Card"
                }
            ],
            "validation": true
        }]
    })

    /**
     * Product Type list
     */
    mock.onGet("/document/requiredDocuments").reply((opts: any) => {
        return [200, {
            "message": "Document type fetch successfully",
            "status": "SUCCESS",
            "response": [
                {
                    "productCode": "CC",
                    "productName": 'Credit Card',
                    "documentList": [
                        {
                            "documentName": "Application",
                            "shortCode": "AP",
                            "description": "Application"
                        },
                        {
                            "documentName": "Bill of Sale",
                            "shortCode": "BS",
                            "description": "Bill of Sale"
                        },
                        {
                            "documentName": "Business Record Affidavit",
                            "shortCode": "BRS",
                            "description": "Business Record Affidavit"
                        },
                        {
                            "documentName": "Military Affidavit",
                            "shortCode": "MA",
                            "description": "Military Affidavit"
                        },
                        {
                            "documentName": "Transaction History",
                            "shortCode": "TH",
                            "description": "Transaction History"
                        }
                    ]
                },
                {
                    "productCode": "AL",
                    "productName": 'Auto Loan',
                    "documentList": [
                        {
                            "documentName": "Application",
                            "shortCode": "AP",
                            "description": "Application"
                        },
                        {
                            "documentName": "Bill of Sale",
                            "shortCode": "BS",
                            "description": "Bill of Sale"
                        }
                    ]
                },
            ],
            "validation": true
        }]
    })

    /**
    * Product Type list
    */
    mock.onGet("/requestReceive/sentDocuments").reply((opts: any) => {
        return [200, {
            "status": "SUCCESS",
            "response": {
                "metadata": {
                    "pageSize": 10,
                    "pageNumber": 0,
                    "recordCount": 3,
                    "pageCount": 0,
                    "startRecord": 1
                },
                "datas": [
                    {
                        "requestedDocuments": "Business Record Affidavit",
                        "originalAccountNo": "7890",
                        "equabliAccountNo": null,
                        "clientAccountNo": "123456",
                        "requestedDate": "01/12/2023",
                        "dueDate": "03/01/2023",
                        "fulfillment": null,
                        "fileName": null,
                        "filePath": null,
                        "requestedFrom": "Zo Financial"
                    },
                    {
                        "requestedDocuments": "Application",
                        "originalAccountNo": "7890",
                        "equabliAccountNo": null,
                        "clientAccountNo": "123456",
                        "requestedDate": "01/12/2023",
                        "dueDate": "01/18/2023",
                        "fulfillment": null,
                        "fileName": null,
                        "filePath": null,
                        "requestedFrom": "Zo Financial"
                    },
                    {
                        "requestedDocuments": "Transaction History",
                        "originalAccountNo": "7890",
                        "equabliAccountNo": null,
                        "clientAccountNo": "123456",
                        "requestedDate": "01/12/2023",
                        "dueDate": "01/18/2023",
                        "fulfillment": "01/18/2023",
                        "fileName": "123456-Application-7890.pdf",
                        "filePath": "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210101201653/PDF.pdf",
                        "requestedFrom": "Zo Financial"
                    },
                ]
            },
            "validation": true,
            "limit": 0,
            "total": 0,
            "lastPage": false
        }]
    })
}