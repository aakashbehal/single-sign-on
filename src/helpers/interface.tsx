export interface Account {
    "id": number;
    "Client Name": string;
    "Consumer Name": string;
    "Consumer SSN": number;
    "Equabli account number": number;
    "Client account number": number;
    "Queue": string;
    "Status": string;
    "Type of asset": string;
    "Charge-Off Date": string;
    "Agency": string;
    "EQV": number;
    "SOL Date": string;
    "Charge-off Balance": string;
    "Current balance": string;
    "State": string;
}

export interface accountRequest {
    "pageSize": number;
    "pageNumber": number;
    "sortColumn": string;
    "sortOrder": string;
    "totalCount": number;
    "originalAccountNumber": number
    "equabliAccountNumber": number
    "clientAccountNumber": number
    "eqvScoreFrom": string
    "eqbScoreTo": string
    "partnerId": number
    "clientId": number
    "accountAddressState": string
    "queueStatusId": string
    "queueId": string
    "queueReasonId": string
    "SOLDateFrom": string
    "SOLDateTo": string
    "chargeOffDateFrom": string
    "chargeOffDateTo": string
    "chargeOffBalanceFrom": string
    "chargeOffBalanceTo": string
}

export interface inventoryRequest {
    "pageSize": number;
    "pageNumber": number;
    "sortColumn": string;
    "sortDirection": string;
    "totalCount": number;
    "clientId": number | null;
    "placementId": number;
    "portfolioId": number;
    "clientPortfolioId": number;
    "queueId": number | null;
    "queueStatusId": number;
    "queueReasonId": number;
    "originalAccountNumber": number;
    "equabliAccountNumber": string;
    "partnerId": number | null;
    "accountQueueStatus": string;
}

export interface widgetLayoutSave {
    "widgetId": number,
    "leftPoint": number,
    "topPoint": number,
    "height": number,
    "width": number
}