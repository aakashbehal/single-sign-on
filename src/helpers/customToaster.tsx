import { DefaultToast } from 'react-toast-notifications';
import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { AiFillQuestionCircle } from "react-icons/ai";
import store from '../store';
import { MiscActionCreator } from '../store/actions/common/misc.actions';

export const MyCustomToast = ({ children, ...props }: any) => (
    <DefaultToast {...props}>
        {children}
        {
            props.appearance === 'error'
            && <>
                <br />
                <br />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant='dark' style={{ marginRight: '1rem' }} onClick={() => {
                        const state: any = store.getState()
                        console.log(state)
                    }}>Report Issue</Button>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                            <Tooltip id={`tooltip-error`}>
                                <div style={{ textAlign: 'left' }}>
                                    Request parameters for this call will be shared, which will help narrowing the issue.
                                </div>
                            </Tooltip>
                        }
                    >
                        <AiFillQuestionCircle size={20} color="black" cursor={'pointer'} />
                    </OverlayTrigger>
                </div>
            </>
        }
    </DefaultToast >
);