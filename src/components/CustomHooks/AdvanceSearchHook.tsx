import React, { useEffect, useState } from "react"

const AdvanceSearchHook = () => {
    const [state, setState] = useState<any>(null)
    const [text, setText] = useState<any>(null)
    const [isAdvanceSearch, setIsAdvanceSearch] = useState<any>(null)

    const setInitObj = (searchObj: any) => {
        setState(searchObj)
        setText(null)
    }

    const textSearch: any = async (text: any) => {
        setText(text)
    }

    const advanceSearch: any = async (searchParams: any) => {
        setIsAdvanceSearch(true)
        setState((state: any) => {
            return { ...state, ...searchParams }
        })
    }

    const resetHandler: any = async () => {
        setIsAdvanceSearch(false)
        setState((state: any) => {
            return {
                pageSize: state.pageSize,
                pageNumber: state.pageNumber,
                sortOrder: state.sortOrder,
                sortParam: state.sortParam
            }
        })
    }

    return [
        state,
        text,
        isAdvanceSearch,
        {
            setInitObj,
            textSearch,
            advanceSearch,
            resetHandler
        }
    ];
}

export default AdvanceSearchHook