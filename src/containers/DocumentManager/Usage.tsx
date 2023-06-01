import { Button, Col, ProgressBar } from "react-bootstrap"
import { useEffect, useState } from "react"

import SkeletonLoading from "../../helpers/skeleton-loading"
import Subscription from "./Subscription"
import Styles from "./DocumentManager.module.sass";
import { useDispatch, useSelector } from "react-redux"
import { UsageActionCreator } from "../../store/actions/usage.actions";

const Usage = ({ collapse }: any) => {
    const dispatch = useDispatch()
    const [showSubscription, setShowSubscription] = useState(false);

    const {
        used,
        percentage,
        total,
        totalDocument,
        loading,
        error
    } = useSelector((state: any) => ({
        used: state.usage.used,
        percentage: state.usage.percentage,
        total: state.usage.total,
        totalDocument: state.usage.totalDocument,
        loading: state.usage.loading,
        error: state.usage.error
    }))

    useEffect(() => {
        dispatch(UsageActionCreator.getUsage())
    }, [])

    return (
        <>
            <Col className={Styles.inner_document_summary}
                style={{
                    borderWidth: collapse ? '0' : '1px',
                    background: collapse ? '#e9ecef' : 'white'
                }}>
                <h5>Usage</h5>
                <br />
                {
                    !error && loading &&
                    <SkeletonLoading repeats={1} />
                }
                {
                    !error && !loading &&
                    <Col sm={12} className="no_padding">
                        <div className={Styles.progress_container}>
                            <ProgressBar striped={false} className={`${Styles.progressbar} ${Number(percentage) < 30 ? 'is_low' : ''} `} now={percentage} label={`${percentage}%`} />
                            <br />
                            <p><b>{(used).toUpperCase()} used out of {total}</b></p>
                            <p><b>Total {totalDocument} document{totalDocument > 1 ? "s" : ""}</b></p>
                            <Button variant="dark" onClick={() => setShowSubscription(true)}>Upgrade Your Plan</Button>
                        </div>
                    </Col>
                }
            </Col>
            <Subscription onHide={setShowSubscription} show={showSubscription} />
        </>
    )
}

export default Usage