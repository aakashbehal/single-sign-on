import { useRef, useEffect } from 'react'

const useDocumentTitle = (title: any, prefix = true, prevailOnUnmount = false) => {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        if (prefix) {
            document.title = `${title}`;
        } else {
            document.title = `EQ Collect - ${title}`;
        }
    }, [title]);

    useEffect(() => () => {
        if (!prevailOnUnmount) {
            document.title = defaultTitle.current;
        }
    }, [])
}

export default useDocumentTitle