import React, { useState } from 'react'

import Styles from "./Common.module.sass"

const MultipleEmails = ({ emails, setEmails }) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(null)

    const isEmail = (email) => {
        return /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/.test(email);
    }

    const isInList = (email) => {
        return emails.includes(email)
    }

    const isValidElement = (email) => {
        let error: any = null;

        if (!isEmail(email)) {
            error = `${email} is not a valid email address.`
        }

        if (isInList(email)) {
            error = `${email} has already been added.`
        }

        if (error) {
            setError(error)
            return false;
        }
        return true
    }

    const handleChange = (evt) => {
        setError(null)
        setValue(evt.target.value)
    }

    const handleKeyDown = (evt) => {
        if (['Enter', 'Tab', ','].includes(evt.key)) {
            evt.preventDefault();

            let email = value.trim()

            if (email && isValidElement(email)) {
                setEmails([...emails, email])
                setValue('')
            }
        }
    }

    const handleDelete = (toBeRemoved) => {
        setEmails((emails) => {
            return emails.filter(email => email !== toBeRemoved)
        })
    }

    return (
        <>
            {emails.map(email => (
                <div key={email} className={Styles.tag_item}>
                    {email}
                    <button className={Styles.tag_item_button} type="button" onClick={() => handleDelete(email)}>&times;</button>
                </div>)
            )}
            <input
                className={Styles.form_multiple}
                placeholder="Type or paste email address and press `Enter`"
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

export default MultipleEmails