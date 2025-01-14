// import { useEffect, useMemo, useState } from "react";
import { userService, commonServices } from "../services";
import axios from "axios";
import { saveAs } from 'file-saver';
import { history } from "./history";

export const axiosCustom: any = axios.create(); // export this and use it in all your components
axiosCustom.isCancel = axios.isCancel

/**
 * Method is used to format date
 * @param date 
 * @returns Date: YYYY-MM-DD
 */
export const dateFormatterForRequest = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    // return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
    return `${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}-${year}`;
};

/**
 * Method is used to format date [DOCUMENT MANAGER]
 * @param date 
 * @returns Date: YYYY-MM-DD
 */
export const dateFormatterForRequestDocManager = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    // return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
    return `${month > 9 ? month : `0${month}`}/${day > 9 ? day : `0${day}`}/${year}`;
};

/**
 * Method used for file upload
 * @param date 
 * @returns YYYYMMDD
 */
export const dateFormatterForRequestFileUpload = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}${month > 9 ? month : `0${month}`}${day > 9 ? day : `0${day}`}`;
};

/**
 * Method is used to format date in date time format
 * @param date 
 * @returns Date: YYYY-MM-DD HH:MM:SS
 */
export const dateTimeFormat = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
    // const d1 = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
    const d1 = `${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}-${year}`;
    return `${d1} ${time}`;
};

/**
 * Method is used to check type of data provided
 * @param str 
 * @returns 
 */
export const checkType = (str: any, header: any) => {
    if (header === 'originalAccountNumber' || header === 'clientAccountNumber') {
        return false
    }
    if (typeof str !== 'string') {
        return true;
    }
    return !isNaN(str as any) && !isNaN(parseFloat(str));
};

export const encryptPassword: any = (password: any) => {
    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(password, salt);
    // return hash
    return password
}

export const handleResponse = (response: any) => {
    if (!response.data.validation) {
        if (response.data.message === 'Token Expired!') {
            userService.logoutAuthExpired()
        }
        throw response.data.errors || response.data.message
    }
    return response.data;
}

export const httpInterceptor = () => {
    const noAuthRequired = [
        "login",
        // "allClients",
        "getAllStates",
        "getallstates",
        "state",
        // "getAllPartners",
        "getAllAccountStatuses",
        "getAllRecordStatus",
        "getRecordStatusById",
        "getRecordStatusByShortName",
        "authenticate",
        "logout",
        "activateme",
        "record_source",
        "secret_question",
        "resetPasswordByUserDetails",
        "getSecurityQuesByUserDetails",
        "validateSecurityQuesByUserDetails",
        "resetPasswordByUserDetails",
        "setPasswordAndSecurityQues",
        "changePasswordByUserDetails",
        "registration",
        "insertIntoAppErrorLog",
        "clientOrPartnerByCode",
        "recordStatus",
        "recordSource",
        "app",
        "lookup"
    ]

    axiosCustom.interceptors.request.use(
        (request: any) => {
            try {
                let user = userService.getUser();
                if (request.url.includes('changePasswordByUserDetails')) {
                    user = userService.getTempUser()
                }
                const url = request.url.split('/')
                if (!url.includes('public')) {
                    let token = userService.getAccessToken()
                    if (token === null) {
                        localStorage.removeItem('user');
                        history.push('/login')
                    }
                    request.headers['Authorization'] = `Bearer ${token}`;
                }
                request.headers['X-API-KEY'] = process.env.REACT_APP_API_KEY
                request.headers['rqsOrigin'] = 'web';
                // request.headers['Content-Type'] = 'application/json';
                return request
            } catch (err) {
                return Promise.reject(err)
            }
        },
        (error: any) => {
            if (axiosCustom.isCancel(error)) {
                return console.log(error);
            }
            return Promise.reject(error.response)
        }
    )
}

function getRange(start: any, end: any) {
    let startN = +(start.split(":")[0])
    let endN = +(end.split(":")[0])
    let range: any = []
    if (startN === 8) {
        range.push(8)
    }
    while (startN < endN - 1) {
        startN++
        range.push(startN)
    }
    if (endN === 21) {
        range.push(endN)
    }
    return range
}

export const convertInclusionToExclusion = (result: any) => {
    const days = [
        { weekDay: 1, "key": "Sunday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 2, "key": "Monday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 3, "key": "Tuesday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 4, "key": "Wednesday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 5, "key": "Thursday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 6, "key": "Friday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 7, "key": "Saturday", "value": true, "excludedTime": [{ timeFrom: '08:00', timeTo: "21:00" }] }
    ]
    let includedWeekDays = result.includedWeekDays
    for (let i = 0; i < includedWeekDays.length; i++) {
        days[i].value = includedWeekDays[i].value
    }
    let includedTimes: any = {}
    for (let i = 0; i < includedWeekDays.length; i++) {
        includedTimes[includedWeekDays[i].weekDay] = []
        if (
            JSON.stringify(includedWeekDays[i].excludedTime) !== "[{}]"
            && JSON.stringify(includedWeekDays[i].excludedTime) !== "[]"
        ) {
            for (let j = 0; j < includedWeekDays[i].time.length; j++) {
                let range = getRange(includedWeekDays[i].time[j].timeFrom, includedWeekDays[i].time[j].timeTo)
                includedTimes[includedWeekDays[i].weekDay] = [...includedTimes[includedWeekDays[i].weekDay], ...range]
            }
        }

    }
    let includedArr: any = []
    for (let key in includedTimes) {
        let timeArray = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
        let includedTime = includedTimes[key];

        let newArray: any = [];
        let currArray: any = [];
        if (includedTime.length !== 0) {
            for (let i = 0; i < timeArray.length; i++) {
                // Item exists in array2. Add to newArray and reset currArray
                if (!includedTime.includes(timeArray[i])) {
                    currArray.push(timeArray[i]);
                } else {
                    if (currArray.length > 0) {
                        newArray.push(currArray);
                    }
                    currArray = [];
                }
            }
            if (currArray.length > 0) {
                newArray.push(currArray); // Add final currArray to newArray
            }
        }

        let inclusionWeekDay: any = []

        for (let i = 0; i < newArray.length; i++) {
            let timeTo = `${newArray[i][newArray[i].length - 1] < 10 ? `0${newArray[i][newArray[i].length - 1]}` : newArray[i][newArray[i].length - 1]}:00`
            let timeFrom = `${newArray[i][0] < 10 ? `0${newArray[i][0]}` : newArray[i][0]}:00`
            inclusionWeekDay.push(
                {
                    timeFrom,
                    timeTo
                }
            )
        }
        includedArr.push({ weekday: key, excludedTime: inclusionWeekDay })
        for (let k = 0; k < days.length; k++) {
            if (days[k].weekDay === +key) {
                days[k].excludedTime = inclusionWeekDay
            }
        }
    }
    result.excludedWeekDay = days
    return result
}

export const getBrowserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const convertExclusionToInclusion = (result: any) => {
    const days = [
        { weekDay: 1, "key": "Sunday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 2, "key": "Monday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 3, "key": "Tuesday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 4, "key": "Wednesday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 5, "key": "Thursday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 6, "key": "Friday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 7, "key": "Saturday", "value": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] }
    ]
    let excludedWeekDay = result.excludedWeekDay
    let exclusionTimes: any = {}
    for (let i = 0; i < excludedWeekDay.length; i++) {
        exclusionTimes[excludedWeekDay[i].weekDay] = [];
        if (
            JSON.stringify(excludedWeekDay[i].excludedTime) !== "[{}]"
            && JSON.stringify(excludedWeekDay[i].excludedTime) !== "[]"
            && JSON.stringify(excludedWeekDay[i].excludedTime) !== "[{},{}]"
        ) {
            for (let j = 0; j < excludedWeekDay[i].excludedTime.length; j++) {
                let range = getRange(excludedWeekDay[i].excludedTime[j].timeFrom, excludedWeekDay[i].excludedTime[j].timeTo)
                exclusionTimes[excludedWeekDay[i].weekDay] = [...exclusionTimes[excludedWeekDay[i].weekDay], ...range]
            }
        }
    }
    let includedArr: any = []
    for (let key in exclusionTimes) {
        let timeArray = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
        let excludedTime = exclusionTimes[key];
        let newArray: any = [];
        let currArray: any = [];
        if (excludedTime.length !== 0) {
            for (let i = 0; i < timeArray.length; i++) {
                // Item exists in array2. Add to newArray and reset currArray
                if (!excludedTime.includes(timeArray[i])) {
                    currArray.push(timeArray[i]);
                } else {
                    if (currArray.length > 0) {
                        newArray.push(currArray);
                    }
                    currArray = [];
                }
            }
            if (currArray.length > 0) {
                newArray.push(currArray); // Add final currArray to newArray
            }
        }

        let inclusionWeekDay: any = []

        for (let i = 0; i < newArray.length; i++) {
            let timeTo = `${newArray[i][newArray[i].length - 1]}:00`
            let timeFrom = `${newArray[i][0]}:00`
            inclusionWeekDay.push(
                {
                    timeFrom,
                    timeTo
                }
            )
        }
        includedArr.push({ weekday: key, time: inclusionWeekDay })
        for (let k = 0; k < days.length; k++) {
            if (days[k].weekDay === +key) {

                if (inclusionWeekDay.length === 0) {
                    days[k].value = false
                }
                days[k].default = false
                days[k].time = inclusionWeekDay
            }
        }
    }
    result.inclusionWeekDay = days
    return result
}

export const merge = (a: any, b: any) => {
    return Object.entries(b).reduce((o, [k, v]) => {
        o[k] = v && typeof v === 'object'
            ? merge(o[k] = o[k] || (Array.isArray(v) ? [] : {}), v)
            : v;
        return o;
    }, a);
}


export const passwordRegexCheck = (password: any) => {
    const passRegex = /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[a-z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[A-Z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]))(?=.{14,})/
    return passRegex.test(password)
}

/**
 * Method is used to format amount to 2 decimals
 * @param x 
 * @returns 
 */
export const financial = (x: any) => {
    let valueToReturn
    if (x) {
        if (typeof x === 'number') {
            x = x.toFixed(2)
        }
        valueToReturn = x.toString().replace("$", '')
    } else {
        valueToReturn = x || 0
    }
    return valueToReturn ? valueToReturn.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : valueToReturn
}

export const decimalToFixed = (x: any) => {
    let valueToReturn
    if (x) {
        let number = x.toString().replace("$", '')
        valueToReturn = Number.parseFloat(number).toFixed(2);
    } else {
        valueToReturn = x
    }
    return valueToReturn
}

export const formatBytes = (bytes: any, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


export const getSignedURL = async (ObjectKey: any, fileSize: any) => {
    // const region = "us-east-1"
    // const credentials: any = {
    //     accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.REACT_APP_AWS_ACCESS_KEY_SECRET
    // }
    // const s3ObjectUrl = parseUrl(`https://eq-dev-dm.s3.${region}.amazonaws.com/${fileKey}`);
    // const presigner = new S3RequestPresigner({
    //     credentials,
    //     region,
    //     sha256: Sha256 // In browsers
    // });
    // // Create a GET request from S3 url.
    // const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
    // return formatUrl(url);
    const presignedURL: any = await commonServices.getSignedURL(ObjectKey, fileSize)
    return presignedURL
}

export const createZipForFolderDownload = (filePaths: any, folderName: any, isSave = true) => {
    return new Promise((resolve, reject) => {
        const zip = require('jszip')();
        var promises = filePaths.map(async (fP: any, index: any) => {
            let folders = zip.folder(fP.folderName)
            let signedPath = await getSignedURL(fP.filePath, fP.fileSizeOriginal)
            let filePathSplit = fP.filePath.split('/')
            const type = (filePathSplit[filePathSplit.length - 1]).split(".")
            await axios({
                url: signedPath,
                method: 'GET',
                responseType: 'blob', // Important
            }).then((response) => {
                const file = new File(
                    [response.data],
                    `${filePathSplit[filePathSplit.length - 1]}`,
                    { type: type[type.length - 1] === 'png' ? 'application/png' : 'application/pdf' }
                );
                return folders.file(`${filePathSplit[filePathSplit.length - 1]}`, file);
            });
        })
        Promise.allSettled(promises).then(function (results) {
            zip.generateAsync({ type: "blob" })
                .then((content: any) => {
                    return new File([content], `${folderName}.zip`, { type: 'application/x-zip-compressed' })
                })
                .then((file: any) => {
                    if (isSave) {
                        saveAs(file, `${folderName}.zip`);
                    } else {
                        return true
                    }
                }).finally(() => {
                    resolve(true)
                })
        })
    })
}

export const downloadSignedFile = (document: any) => {
    return new Promise(async (resolve, reject) => {
        let signedPath = await getSignedURL(document.filePath, document.fileSizeOriginal)
        const type = (document.documentName).split(".")
        await axios({
            url: signedPath,
            method: 'GET',
            responseType: 'blob', // Important
        }).then((response) => {
            const file = new File([response.data], `${document.documentName}`, { type: type[type.length - 1] === 'png' ? 'application/png' : 'application/pdf' });
            saveAs(file, `${document.documentName}`);
            resolve(true)
        });
    })
}

export const checkIfAdvanceSearchIsActive = (formObj: any) => {
    let formIsValid = true;
    for (let key in formObj) {
        if (
            (
                key !== 'pageSize'
                && key !== 'pageNumber'
                && key !== 'textSearch'
                && key !== 'sortOrder'
                && key !== 'sortParam'
                && key !== 'accountNumber'
            ) && formObj[key] !== null) {
            formIsValid = false
            break
        }
    }
    return formIsValid
}


export const downloadFromLink = (link: string) => {
    saveAs(link)
}

export const adjustStartEnd = (original: any) => {
    // return original
    let adjusted: any = [];
    let previousEnd = -1;
    let previousItem: any = -Infinity
    original.forEach((item: any) => {
        const newItem = { ...item };
        newItem.start = newItem.flagForPreviousSelection ? previousItem.start : previousEnd + 1 + newItem.start;
        newItem.end = newItem.start + item.text.length - 1;
        adjusted.push(newItem);
        previousEnd = newItem.end;
        previousItem = newItem
    });
    return adjusted;
}

export const convertToDesiredFormat = (input: any) => {
    // return input
    let converted = [];

    for (let i = 0; i < input.length; i++) {
        const currentItem = input[i];
        const newItem = { ...currentItem };
        let previousItem: any = -Infinity
        if (i > 0) {
            previousItem = input[i - 1];
            let spaceCount
            if (currentItem.start === previousItem.start) {
                spaceCount = 0
            } else {
                spaceCount = currentItem.start - previousItem.end - 1;
            }
            newItem.start = spaceCount
        }
        newItem.end = newItem.start + newItem.text.length;
        if (currentItem.flagForPreviousSelection) {
            newItem.end = currentItem.end - previousItem.end
        }
        converted.push(newItem);
    }
    return converted;
}

interface IError {
    errorCode: number
    errorMessage: string
    type: string
}

export const errorHandler = (addToast: any, errors: IError[]) => {
    for (let error of errors) {
        addToast(error.errorMessage, { appearance: 'error', autoDismiss: false })
    }
}