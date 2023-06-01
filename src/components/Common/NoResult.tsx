import { BsFolder2Open } from "react-icons/bs";

const NoRecord = ({ size = 30 }: any) => {
    return (
        <div className="no_result">
            <div>
                <BsFolder2Open size={size} />
                <p><b>No Result</b></p>
            </div>
        </div>
    )
}

export default NoRecord