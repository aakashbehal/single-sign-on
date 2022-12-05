import React, { useEffect, useState, useMemo } from "react"
import { Col, Row, Pagination } from "react-bootstrap"


const PaginationComponent = ({ total = 0, itemsPerPage = 1, currentPage = 1, onPageChange }: any) => {
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        if (total > 0 && itemsPerPage > 0) {
            setTotalPages(Math.ceil(total / itemsPerPage))
        } else {
            setTotalPages(0)
        }
    }, [total, itemsPerPage, totalPages])

    const paginationItems = useMemo(() => {
        const pages: any = [];
        for (let i = Math.max(0, currentPage - 6); i < Math.min(currentPage + 5, totalPages); i++) {
            pages.push(
                <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => onPageChange(i + 1)}>
                    {i + 1}
                </Pagination.Item>
            )
        }
        return pages
    }, [totalPages, currentPage, onPageChange])

    const showing = () => {
        return (
            <p>Showing {((currentPage - 1) * itemsPerPage) + 1} to {(currentPage * itemsPerPage) > total ? total : currentPage * itemsPerPage} of {total} records</p>
        )
    }

    if (totalPages === 0) return null

    return (
        <div style={{ marginTop: '1rem' }}>
            <Row>
                <Col md={6} xs={12}>
                    {showing()}
                </Col>
                <Col md={6} xs={12} >
                    <Pagination className="justify-content-end">
                        <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {paginationItems}
                        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </Col>
            </Row>
        </div>

    )
};

export default PaginationComponent