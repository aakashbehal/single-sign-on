import React from 'react'
import { CgSpinnerAlt } from "react-icons/cg"

export const LoadingIndicator = () => {
    return (
        <div>
            <CgSpinnerAlt className="spinner" style={{ marginTop: '6.1rem' }} />
        </div>
    )
}
