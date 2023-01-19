import { MyDocumentsFolder, MyDocumentsList } from "../types.d"
import { myDocumentsService } from "../../services"

export const MyDocumentsActionCreator = {
    getMyDocumentFolders: (payload) => (dispatch: any) => {
        const request = () => ({ type: MyDocumentsFolder.MY_DOCUMENTS_FOLDER_REQUEST })
        const success = (user: any) => ({ type: MyDocumentsFolder.MY_DOCUMENTS_FOLDER_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: MyDocumentsFolder.MY_DOCUMENTS_FOLDER_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.getMyDocumentFolders(payload)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            )
    },
    getMyDocumentList: (payload) => (dispatch: any) => {
        const request = () => ({ type: MyDocumentsList.MY_DOCUMENTS_LIST_REQUEST })
        const success = (user: any) => ({ type: MyDocumentsList.MY_DOCUMENTS_LIST_SUCCESS, payload: user })
        const failure = (error: any) => ({ type: MyDocumentsList.MY_DOCUMENTS_LIST_FAILURE, payload: error })

        dispatch(request())

        myDocumentsService.getMyDocumentList(payload)
            .then(
                user => {
                    dispatch(success(user))
                },
                error => {
                    dispatch(failure(error))
                }
            ).finally(() => dispatch({ type: MyDocumentsList.MY_DOCUMENTS_LIST_RESET }))
    }
}