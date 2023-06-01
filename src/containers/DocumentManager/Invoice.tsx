import { Button, Col } from "react-bootstrap";

import Styles from "./DocumentManager.module.sass";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { InvoiceActionCreator } from "../../store/actions/invoice.actions";
import SkeletonLoading from "../../helpers/skeleton-loading";
import { axiosCustom } from "../../helpers/util";
import saveAs from "file-saver";
import { useToasts } from "react-toast-notifications";
import { createMessage } from "../../helpers/messages";

interface invoice {
    amountPay: string
    partnerName: string
}

const Invoice = ({ collapse }: any) => {
    const { addToast } = useToasts();
    const dispatch = useDispatch()
    const {
        invoicing,
        error,
        loading
    } = useSelector((state: any) => ({
        invoicing: state.invoice.data,
        error: state.invoice.error,
        loading: state.invoice.loading
    }))

    useEffect(() => {
        dispatch(InvoiceActionCreator.getInvoice('month'))
    }, [])

    const downloadSampleFile = () => {
        addToast(createMessage('info', `DOWNLOAD_STARTED`, ''), { appearance: 'info', autoDismiss: true })
        let sampleFile: string = `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DOCUMENT_SERVICE}/user/document/cost/invoice/download`
        axiosCustom.get(sampleFile, { responseType: 'arraybuffer', params: { tenure: 'month' } })
            .then((response) => {
                var blob = new Blob([response.data], { type: 'application/pdf' });
                saveAs(blob, 'invoice.pdf');
            }).finally(() => {
                addToast(createMessage('info', `DOWNLOAD_SUCCESSFUL`, ''), { appearance: 'success', autoDismiss: true })
            })

    }

    return (
        <>
            <Col className={Styles.inner_document_summary}
                style={{
                    borderWidth: collapse ? '0' : '1px',
                    background: collapse ? '#e9ecef' : 'white'
                }}>
                <h5>Invoices</h5>
                <br />
                {
                    !error && loading &&
                    <SkeletonLoading repeats={1} />
                }
                {
                    !error && !loading &&
                    <Col sm={12} className="no_padding">
                        <div className={Styles.progress_container} style={{
                            background: '#ebeaea',
                            padding: '1rem',
                            borderRadius: '6px',
                            margin: 0,
                            marginBottom: '1rem'
                        }}>
                            {
                                invoicing && invoicing.listOfPartner && invoicing.listOfPartner.map((invoice: invoice, index: number) => {
                                    return <p key={`invoice_${index}`} style={{
                                        borderBottom: '2px solid white',
                                        justifyContent: 'space-between',
                                        display: 'flex',
                                        padding: '5px 0',
                                        margin: 0
                                    }}><span>{invoice.partnerName}</span> - <span><b>$ {(Number(invoice.amountPay)).toFixed(2)}</b></span></p>
                                })
                            }
                            <h3 style={{
                                textAlign: 'right',
                                marginTop: '1rem'
                            }}>${(Number(invoicing.costCollectByClient)).toFixed(2)}</h3>
                        </div>
                        <Button variant="dark" onClick={() => downloadSampleFile()}>Download Detailed Report</Button>
                    </Col>
                }
            </Col>
        </>
    )
}

export default Invoice