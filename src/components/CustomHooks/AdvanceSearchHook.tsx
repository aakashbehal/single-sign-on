import { useState } from "react"

const AdvanceSearchHook = () => {
    const [state, setState] = useState<any>(null)

    const setInitObj = (searchObj) => {
        setState(searchObj)
    }

    const textSearch: any = async (text) => {
        setState((state) => {
            return { ...state, textSearch: text }
        })
    }

    const advanceSearch: any = async (searchParams) => {
        setState((state) => {
            return { ...state, ...searchParams, textSearch: null }
        })
    }

    const resetHandler: any = async () => {
        setState((state) => {
            return {
                pageSize: state.pageSize,
                pageNumber: state.pageNumber,
                textSearch: null,
                sortOrder: state.sortOrder,
                sortParam: state.sortParam
            }
        })
    }

    return [
        state,
        {
            setInitObj,
            textSearch,
            advanceSearch,
            resetHandler
        }
    ];
}

export default AdvanceSearchHook