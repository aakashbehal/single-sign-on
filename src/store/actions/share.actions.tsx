import {
    ShareFolder,
    ShareFile,
    RevokeFolder,
    RevokeFile
} from "../types.d";
import { shareService } from "../../services"

export const ShareActionCreator = {
    shareFolder: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: ShareFolder.SHARE_FOLDER_REQUEST, payload: [] })
        const success = (data: any) => ({ type: ShareFolder.SHARE_FOLDER_SUCCESS, payload: data })
        const failure = () => ({ type: ShareFolder.SHARE_FOLDER_FAILURE, payload: [] })

        dispatch(request())

        shareService.shareFolder(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    },
    shareDocument: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: ShareFile.SHARE_FILE_REQUEST, payload: [] })
        const success = (data: any) => ({ type: ShareFile.SHARE_FILE_SUCCESS, payload: data })
        const failure = () => ({ type: ShareFile.SHARE_FILE_FAILURE, payload: [] })

        dispatch(request())

        shareService.shareDocument(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
            .finally(() => {
                dispatch({ type: ShareFile.SHARE_FILE_RESET })
            })
    },
    revokeShareFolder: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: RevokeFolder.REVOKE_FOLDER_REQUEST, payload: [] })
        const success = (data: any) => ({ type: RevokeFolder.REVOKE_FOLDER_SUCCESS, payload: data })
        const failure = () => ({ type: RevokeFolder.REVOKE_FOLDER_FAILURE, payload: [] })

        dispatch(request())

        shareService.revokeShareFolder(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )

    },
    revokeShareDocument: (payload: any) => (dispatch: any) => {
        const request = () => ({ type: RevokeFile.REVOKE_FILE_REQUEST, payload: [] })
        const success = (data: any) => ({ type: RevokeFile.REVOKE_FILE_SUCCESS, payload: data })
        const failure = () => ({ type: RevokeFile.REVOKE_FILE_FAILURE, payload: [] })

        dispatch(request())

        shareService.revokeShareDocument(payload)
            .then(
                data => {
                    dispatch(success(data))
                },
                error => {
                    dispatch(failure())
                }
            )
    }
}