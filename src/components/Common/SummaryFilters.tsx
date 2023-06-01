import { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import { UserActionCreator } from "../../store/actions/user.actions";
import { TypesActionCreator } from "../../store/actions/common/types.actions";
import { MiscActionCreator } from "../../store/actions/common/misc.actions";

const TENURES = [
    {
        statusCode: 'month',
        status: 'Current Month'
    },
    {
        statusCode: 'year',
        status: 'Current Year'
    },
    {
        statusCode: 'week',
        status: 'Current week'
    }
]


const SummaryFilters = ({ searchObj, setSearchObj }: { searchObj: any, setSearchObj: any }) => {
    const dispatch = useDispatch();
    const formSearchAccount = useRef<any>();
    const [tenures, setTenures] = useState<{ statusCode: string, status: string }[]>([])

    const {
        users,
        // userLoading,
        // userError,
        productTypes,
        // loadingProductTypes,
        // errorProductTypes,
        clientAccountNumbers,
        // loading,
        // error
    } = useSelector((state: any) => ({
        users: state.users.data,
        // userLoading: state.users.loading,
        // userError: state.users.error,
        productTypes: state.types.productType.data,
        // loadingProductTypes: state.types.productType.loading,
        // errorProductTypes: state.types.productType.error,
        clientAccountNumbers: state.misc.clientAccountNumbers.data,
        // loading: state.misc.clientAccountNumbers.loading,
        // error: state.misc.clientAccountNumbers.error
    }))

    useEffect(() => {
        dispatch(MiscActionCreator.getClientAccountNumbers())
        dispatch(UserActionCreator.getConnectedUsers())
        dispatch(TypesActionCreator.getProductTypes())
        setTenures(TENURES)

    }, [])

    const coverageHandler = (type: any, e: any) => {
        const tempCoverage = Object.assign({}, searchObj)
        tempCoverage[type] = e.target.value === "" ? null : e.target.value
        setSearchObj(tempCoverage)
    }

    return (
        <Form ref={formSearchAccount}>
            <Row>
                <Col lg={6} md={12} className="no_padding">
                    <Form.Group as={Col} className="mb-4">
                        <Col md={12} sm={12} className="no_padding">
                            <Form.Control
                                as="select"
                                name="service_offered"
                                className="select_custom white"
                                onChange={(e) => {
                                    coverageHandler("duration", e)
                                }}>
                                {
                                    (tenures && tenures.length > 0) &&
                                    tenures.map((tenure: any, index: number) => {
                                        return <option key={`cr_${index}`} value={tenure.statusCode}>{tenure.status}</option>
                                    })
                                }
                            </Form.Control>
                        </Col>
                        <Form.Label className="label_custom white">Tenure</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-4 ">
                        <Col md={12} sm={12} className="no_padding">
                            <Form.Control
                                as="select"
                                name="service_offered"
                                className="select_custom white"
                                onChange={(e) => {
                                    coverageHandler("portfolio", e)
                                }}
                            >
                                <option value="">All Portfolios</option>
                                {
                                    (clientAccountNumbers && clientAccountNumbers.length > 0) &&
                                    clientAccountNumbers.map((cAn: any, index: number) => {
                                        return <option key={`cr_${index}`} value={cAn}>{cAn}</option>
                                    })
                                }
                            </Form.Control>
                        </Col>
                        <Form.Label className="label_custom white">Portfolio</Form.Label>
                    </Form.Group>
                </Col >
                <Col lg={6} md={12} className="no_padding">
                    <Form.Group as={Col} className="mb-4 ">
                        <Col md={12} sm={12} className="no_padding">
                            <Form.Control
                                as="select"
                                name="service_offered"
                                className="select_custom white"
                                onChange={(e) => {
                                    coverageHandler("product", e)
                                }}>
                                <option value="">All Products</option>
                                {
                                    (productTypes && productTypes.length > 0) &&
                                    productTypes.map((product: any, index: number) => {
                                        return <option key={`cr_${index}`} value={product.shortName}>{product.fullName}</option>
                                    })
                                }
                            </Form.Control>
                        </Col>
                        <Form.Label className="label_custom white">Products</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} className="mb-4 ">
                        <Col md={12} sm={12} className="no_padding">
                            <Form.Control
                                as="select"
                                name="service_offered"
                                className="select_custom white"
                                onChange={(e) => {
                                    coverageHandler("userId", e)
                                }}>
                                <option value="">All Users</option>
                                {
                                    (users && users.length > 0) &&
                                    users.map((user: any, index: number) => {
                                        return <option key={`cr_${index}`} value={user.principleId}>{user.firstName} {user.lastName}</option>
                                    })
                                }
                            </Form.Control>
                        </Col>
                        <Form.Label className="label_custom white">Users</Form.Label>
                    </Form.Group>
                </Col>
            </Row >
        </Form >
    )
}

export default SummaryFilters