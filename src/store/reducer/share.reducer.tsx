import {
    ShareFolder,
    ShareFile,
    RevokeFolder,
    RevokeFile
} from "../types.d";

const initialState = {
    shareFolderLoading: false,
    shareFolderSuccess: false,
    shareFolderError: false,
    shareFileLoading: false,
    shareFileSuccess: false,
    shareFileError: false,
    revokeFolderLoading: false,
    revokeFolderSuccess: false,
    revokeFolderError: false,
    revokeFileLoading: false,
    revokeFileSuccess: false,
    revokeFileError: false,
}

const shareReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        case ShareFolder.SHARE_FOLDER_REQUEST:
            return {
                ...state,
                shareFolderLoading: true,
                shareFolderError: false
            }
        case ShareFolder.SHARE_FOLDER_SUCCESS:
            return {
                ...state,
                shareFolderLoading: false,
                shareFolderSuccess: true
            }
        case ShareFolder.SHARE_FOLDER_FAILURE:
            return {
                ...state,
                shareFolderLoading: false,
                shareFolderError: true
            }
        case ShareFolder.SHARE_FOLDER_RESET:
            return {
                ...state,
                shareFolderLoading: false,
                shareFolderSuccess: false,
                shareFolderError: false,
            }
        case ShareFile.SHARE_FILE_REQUEST:
            return {
                ...state,
                shareFileLoading: true,
                shareFileError: false
            }
        case ShareFile.SHARE_FILE_SUCCESS:
            return {
                ...state,
                shareFileLoading: false,
                shareFileSuccess: true
            }
        case ShareFile.SHARE_FILE_FAILURE:
            return {
                ...state,
                shareFileLoading: false,
                shareFileError: true
            }
        case ShareFile.SHARE_FILE_RESET:
            return {
                ...state,
                shareFileLoading: false,
                shareFileSuccess: false,
                shareFileError: false,
            }
        case RevokeFolder.REVOKE_FOLDER_REQUEST:
            return {
                ...state,
                revokeFolderLoading: true,
                revokeFolderError: false
            }
        case RevokeFolder.REVOKE_FOLDER_SUCCESS:
            return {
                ...state,
                revokeFolderLoading: false,
                revokeFolderSuccess: true
            }
        case RevokeFolder.REVOKE_FOLDER_FAILURE:
            return {
                ...state,
                revokeFolderLoading: false,
                revokeFolderError: true
            }
        case RevokeFolder.REVOKE_FOLDER_RESET:
            return {
                ...state,
                revokeFolderLoading: false,
                revokeFolderSuccess: false,
                revokeFolderError: false,
            }
        case RevokeFile.REVOKE_FILE_REQUEST:
            return {
                ...state,
                revokeFileLoading: true,
                revokeFileError: false
            }
        case RevokeFile.REVOKE_FILE_SUCCESS:
            return {
                ...state,
                revokeFileLoading: false,
                revokeFileSuccess: true
            }
        case RevokeFile.REVOKE_FILE_FAILURE:
            return {
                ...state,
                revokeFileLoading: false,
                revokeFileError: true
            }
        case RevokeFile.REVOKE_FILE_RESET:
            return {
                ...state,
                revokeFileLoading: false,
                revokeFileSuccess: false,
                revokeFileError: false,
            }
        default:
            return state
    }
}

export default shareReducer;