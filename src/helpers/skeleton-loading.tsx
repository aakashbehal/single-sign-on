const DIV_LAYOUT = <div style={{ marginBottom: '1rem' }}>
    <div className="skeleton-box"></div>
    <div className="skeleton-box-small"></div>
</div>

const TABLE_ROW_LAYOUT = <div>
    <div className="skeleton-box"></div>
    <div className="skeleton-box"></div>
    <div className="skeleton-box"></div>
    <div className="skeleton-box"></div>
    <div className="skeleton-box"></div>
    <div className="skeleton-box"></div>
</div>

const SkeletonLoading = ({ repeats = 2, isTable = false }) => {
    const times = () => {
        let output: any = []
        if (isTable) {
            const innerOutput: any = []
            for (let i = 0; i < repeats; i++) {
                innerOutput.push(TABLE_ROW_LAYOUT)
            }
            output.push(
                <div>
                    <div className="table_header_skeleton">
                        {TABLE_ROW_LAYOUT}
                    </div>
                    <div className="table_body_skeleton">
                        {innerOutput}
                    </div>
                </div>
            )
        } else {
            for (let i = 0; i < repeats; i++) {
                output.push(DIV_LAYOUT)
            }
        }
        return output
    }

    return (
        <>{times()}</>
    )
}

export default SkeletonLoading