const DIV_LAYOUT = (index: number) => {
    return <div style={{ marginBottom: '1rem' }} key={`div_${index}`}>
        <div className="skeleton-box"></div>
        <div className="skeleton-box-small"></div>
    </div>
}

const TABLE_ROW_LAYOUT = (index: number) => {
    return <div key={`skeleton_${index}`}>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
        <div className="skeleton-box"></div>
    </div>
}

const SkeletonLoading = ({ repeats = 2, isTable = false }) => {
    const times = () => {
        let output: any = []
        if (isTable) {
            const innerOutput: any = []
            for (let i = 0; i < repeats; i++) {
                innerOutput.push(TABLE_ROW_LAYOUT(i))
            }
            output.push(
                <div key={`sk_${Math.random() * 10}`}>
                    <div className="table_header_skeleton">
                        {TABLE_ROW_LAYOUT(1)}
                    </div>
                    <div className="table_body_skeleton">
                        {innerOutput}
                    </div>
                </div>
            )
        } else {
            for (let i = 0; i < repeats; i++) {
                output.push(DIV_LAYOUT(i))
            }
        }
        return output
    }

    return (
        <>{times()}</>
    )
}

export default SkeletonLoading