import React, { useState } from 'react'

import Styles from "./Common.module.sass"

const MultipleInputs = ({ multipleValues, setMultipleValues }: any) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(null)
    const isInList = (text: any) => {
        return multipleValues?.includes(text)
    }

    const isValidElement = (text: any) => {
        let error: any = null;

        if (isInList(text)) {
            error = `${text} has already been added.`
        }

        if (error) {
            setError(error)
            return false;
        }
        return true
    }

    const handleChange = (evt: any) => {
        setError(null)
        setValue(evt.target.value)
    }

    const handleKeyDown = (evt: any) => {
        if (['Enter', 'Tab', ','].includes(evt.key)) {
            evt.preventDefault();

            let text = value.trim()

            if (text && isValidElement(text)) {
                setMultipleValues([...multipleValues, text])
                setValue('')
            }
        }
    }

    const handleDelete = (toBeRemoved: any) => {
        setMultipleValues((texts: any) => {
            return texts.filter((text: any) => text !== toBeRemoved)
        })
    }

    return (
        <>
            {multipleValues?.map((value: any) => (
                <div key={value} className={Styles.tag_item}>
                    {value}
                    <button className={Styles.tag_item_button} type="button" onClick={() => handleDelete(value)}>&times;</button>
                </div>)
            )}
            <input
                className={Styles.form_multiple}
                placeholder="Type and press `Enter`"
                value={value}
                onChange={(evt) => handleChange(evt)}
                onKeyDown={(evt) => handleKeyDown(evt)}
            ></input>
            {
                error &&
                <p className={Styles.error}>{error}</p>
            }
        </>
    )
}

export default MultipleInputs