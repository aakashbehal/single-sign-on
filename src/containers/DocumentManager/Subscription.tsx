import React, { useEffect, useRef, useState } from 'react'
import { Modal } from "react-bootstrap"

const Subscription = ({ show, onHide }: { show: any, onHide: any }) => {
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
            <Modal.Body className="show-grid" style={{ width: '50vw' }}>
                <div className="background" >
                    <div className="container">
                        <div className="panel pricing-table">

                            <div className="pricing-plan">
                                <img src="https://s22.postimg.cc/8mv5gn7w1/paper-plane.png" alt="" className="pricing-img" />
                                <h2 className="pricing-header">Basic</h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">15 GB</li>
                                    <li className="pricing-features-item">2 Users</li>
                                </ul>
                                {/* <span className="pricing-price">Free</span> */}
                                <a href="#/" className="pricing-button is-featured">Subscribed</a>
                            </div>

                            <div className="pricing-plan">
                                <img src="https://s28.postimg.cc/ju5bnc3x9/plane.png" alt="" className="pricing-img" />
                                <h2 className="pricing-header">Standard</h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">50 GB</li>
                                    <li className="pricing-features-item">4 Users</li>
                                </ul>
                                {/* <span className="pricing-price">$150</span> */}
                                <a href="#/" className="pricing-button ">Subscribe</a>
                            </div>

                            <div className="pricing-plan">
                                <img src="https://s21.postimg.cc/tpm0cge4n/space-ship.png" alt="" className="pricing-img" />
                                <h2 className="pricing-header">Premium</h2>
                                <ul className="pricing-features">
                                    <li className="pricing-features-item">100 GB</li>
                                    <li className="pricing-features-item">unlimited Users</li>
                                </ul>
                                {/* <span className="pricing-price">$400</span> */}
                                <a href="#/" className="pricing-button">Subscribe</a>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>

    )
}

export default Subscription