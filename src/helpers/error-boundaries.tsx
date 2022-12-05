import React from 'react';
import { Button } from 'react-bootstrap';
import { VscDebugDisconnect } from "react-icons/vsc"
import { history } from './history';

interface State {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<{}, State> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        console.log(error)
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.log(error, errorInfo)
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError === true) {
            // You can render any custom fallback UI
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div >
                        <Button onClick={() => window.location.reload()} style={{ display: 'flex', alignItems: 'center' }}><VscDebugDisconnect size={30} />Go Back</Button>
                    </div>
                </div >
            )

        }

        return this.props.children;
    }
}