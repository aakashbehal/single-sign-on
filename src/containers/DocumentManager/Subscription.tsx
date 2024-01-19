import React, { useEffect, useRef, useState } from 'react'
import { Modal } from "react-bootstrap"
import { useDispatch, useSelector } from 'react-redux'
import { CgSpinnerAlt } from 'react-icons/cg'

import Styles from "./DocumentManager.module.sass";
import { SubscriptionActionCreator } from '../../store/actions/subscription.actions'
import { UsageActionCreator } from '../../store/actions/usage.actions';

const IMAGES = [
    "https://s22.postimg.cc/8mv5gn7w1/paper-plane.png",
    "https://s28.postimg.cc/ju5bnc3x9/plane.png",
    "https://s21.postimg.cc/tpm0cge4n/space-ship.png"
]

const Subscription = ({ show, onHide }: { show: any, onHide: any }) => {
    const dispatch = useDispatch()
    const [imgLoaded, setImgLoaded] = useState(false)

    const {
        subscriptions,
        error,
        loading,
        userSubscription,
        userError,
        userLoading,
        addSubscriptionSuccess,
        addError,
        addLoading
    } = useSelector((state: any) => ({
        subscriptions: state.subscription.subscriptions.data,
        error: state.subscription.subscriptions.error,
        loading: state.subscription.subscriptions.loading,
        userSubscription: state.subscription.userSubscription.data,
        userError: state.subscription.userSubscription.error,
        userLoading: state.subscription.userSubscription.loading,
        addSubscriptionSuccess: state.subscription.addSubscription.success,
        addError: state.subscription.addSubscription.error,
        addLoading: state.subscription.addSubscription.loading
    }))

    useEffect(() => {
        if (addSubscriptionSuccess) {
            getSubscriptionsAndUserSubscription()
            dispatch(UsageActionCreator.getUsage())
        }
    }, [addSubscriptionSuccess])

    useEffect(() => {
        getSubscriptionsAndUserSubscription()
        const loadImage = (image: string) => {
            return new Promise((resolve, reject) => {
                const loadImg = new Image()
                loadImg.src = image
                // wait 2 seconds to simulate loading time
                loadImg.onload = () =>
                    setTimeout(() => {
                        resolve(image)
                    }, 2000)

                loadImg.onerror = err => reject(err)
            })
        }

        Promise.all(IMAGES.map(image => loadImage(image)))
            .then(() => setImgLoaded(true))
            .catch(err => console.log("Failed to load images", err))
    }, [])

    const getSubscriptionsAndUserSubscription = () => {
        dispatch(SubscriptionActionCreator.GetUserSubscriptions())
        dispatch(SubscriptionActionCreator.GetSubscriptions())
    }

    const selectSubscription = (code: string) => {
        dispatch(SubscriptionActionCreator.AddSubscription(code))
    }


    return (
        <Modal
            show={show}
            onHide={onHide}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            size="lg"
            className='subscription_modal'
            animation={true}
        >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body className="show-grid" style={{ width: '50vw' }}>
                <div className="background" >
                    <div className="container">
                        <div className="panel pricing-table">
                            {
                                subscriptions && subscriptions.length > 0 && subscriptions.map((subscription: any, index: number) => {
                                    return (
                                        <div className="pricing-plan" key={`sub_${index}`}>
                                            <img src={IMAGES[index]} id={`sub_${index}`} alt="" className="pricing-img" />
                                            <h2 className="pricing-header">{subscription?.description.replace('Tier', '')}</h2>
                                            <ul className="pricing-features">
                                                <li className="pricing-features-item">{subscription.keyValue}</li>
                                            </ul>
                                            {
                                                !addError && addLoading &&
                                                <a className="pricing-button"><CgSpinnerAlt size={20} className={`spinner ${Styles.details_warning}`} /></a>
                                            }
                                            {
                                                !addLoading && userSubscription.subscriptionCode === subscription.keyCode
                                                && <a className="pricing-button is-featured">Subscribed</a>
                                            }
                                            {
                                                !addLoading && userSubscription.subscriptionCode !== subscription.keyCode
                                                && <a className="pricing-button" onClick={() => selectSubscription(subscription.keyCode)}>Subscribe</a>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default Subscription