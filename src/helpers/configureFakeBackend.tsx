import { axiosCustom } from "./util"
const MockAdapter = require("axios-mock-adapter");

export const configureFakeBackend = () => {

    const mock = new MockAdapter(axiosCustom);

    // authentication api
    mock.onPost("/authenticate").reply((opts) => {
        const body = opts.data && JSON.parse(opts.data)
        const { loginKey, loginSecret } = body;
        let role = 'Client'
        console.log(loginKey, loginKey === 'abehal@equabli.com')
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

    // Conjunction API
    mock.onGet("/conjunctionType").reply(() => {
        return [200, {
            "statusResponse": "SUCCESS",
            "message": "OK",
            validation: true,
            "response": [
                {
                    "isActive": null,
                    "isDelete": null,
                    "createdAt": null,
                    "updatedAt": null,
                    "deletedAt": null,
                    "id": "988d5605-f21c-4b89-801e-8169f91c8f0c",
                    "type": "Underscore [_]",
                    "shortCode": "_"
                },
                {
                    "isActive": null,
                    "isDelete": null,
                    "createdAt": null,
                    "updatedAt": null,
                    "deletedAt": null,
                    "id": "115e16e2-faeb-40c2-87d5-d5c17749f92f",
                    "type": "Hyphen [-]",
                    "shortCode": "-"
                }
            ]
        }]
    })

    // Field options API
    mock.onGet("/concatVal").reply((opts) => {
        const params = opts.params
        if (params === 'Client') {
            return [200, {
                "statusResponse": "SUCCESS",
                "message": "OK",
                validation: true,
                response: [
                    {
                        "id": "eae9cce3-5415-42f7-98d8-4b0946ebc440",
                        "fieldName": "Client Account Number",
                        "shortCode": "CAN"
                    },
                    {
                        "id": "09c12d1e-9ce8-4156-a631-feffaa917828",
                        "fieldName": "Document Type Id",
                        "shortCode": "DTI"
                    },
                    {
                        "id": "e68e24e6-1924-499f-8e7a-12064c217cc1",
                        "fieldName": "Orignal Account Number",
                        "shortCode": "OAN"
                    },
                    {
                        "id": "d42e6d3e-3b0e-4ea5-b83f-c3eddbf2fd85",
                        "fieldName": "Document Generation Date",
                        "shortCode": "DGD"
                    },
                    {
                        "id": "9b0a9866-382b-4712-a5ec-044e7411a55e",
                        "fieldName": "Document Name",
                        "shortCode": "DN"
                    }
                ]
            }]
        } else {
            return [200, {
                validation: true,
                response: [
                    {
                        "uuid": "44792b5a-5d1c-4df8-b22a-b774a4e8765d",
                        "docConcatVal": "Client ID or Client Short Code",
                        "shortCode": "CID"
                    },
                    {
                        "uuid": "2351bbf1-cae9-4887-82a9-bef46b2cd904",
                        "docConcatVal": "Client Account Number",
                        "shortCode": "CAN"
                    },
                    {
                        "uuid": "2786dc6e-4e3c-4c5f-997b-54afc8c6c190",
                        "docConcatVal": "Document Type Id",
                        "shortCode": "DTI"
                    },
                    {
                        "uuid": "cf656af1-1b6f-4f1d-b15e-37339a60b399",
                        "docConcatVal": "Orignal Account Number",
                        "shortCode": "OAN"
                    },
                    {
                        "uuid": "1f98b713-23af-49fd-82d6-2dcdb85afaf4",
                        "docConcatVal": "Document Generation Date",
                        "shortCode": "DGD"
                    },
                    {
                        "uuid": "44792b5a-5d1c-4df8-b22a-b774a4e8765d",
                        "docConcatVal": "Document Name",
                        "shortCode": "DN"
                    }
                ]
            }]
        }

    })


    /**
     * Get user File config
     */
    mock.onGet("/configuration").reply((opts) => {
        const params = opts.params
        return [200, {
            validation: true,
            message: null,
            response: {
                "uuid": "af071772-7407-4669-9276-0ff460b81932",
                "userId": "3d868c75-6ee8-4d58-b59c-3e43c6187757",
                "documentKeepPolicy": "CREATE_NEW",
                "fileConjunction": "_",
                "retentionPolicyInDay": 90,
                "fileConfiguration": [
                    {
                        "id": "2351bbf1-cae9-4887-82a9-bef46b2cd904",
                        "sequence": 1,
                        "shortCode": "CAN",
                        "fieldName": "Client Account Number"
                    },
                    {
                        "id": "cf656af1-1b6f-4f1d-b15e-37339a60b399",
                        "sequence": 2,
                        "shortCode": "OAN",
                        "fieldName": "Orignal Account Number"
                    },
                    {
                        "id": "44792b5a-5d1c-4df8-b22a-b774a4e8765d",
                        "sequence": 3,
                        "shortCode": "DON",
                        "fieldName": "Document Name"
                    },

                    {
                        "id": "1f98b713-23af-49fd-82d6-2dcdb85afaf4",
                        "sequence": 4,
                        "shortCode": "DGD",
                        "fieldName": "Document Generation Date"
                    }
                ]
            }
        }]
    })


}