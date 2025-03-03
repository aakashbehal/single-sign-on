import React from 'react';
import {
    ChangeEvent,
    FC,
    useCallback,
    useEffect,
    useState,
    useRef
} from "react";
import "./MultiRangeSlider.sass";
import classnames from "classnames";
import { Col } from "react-bootstrap";

interface MultiRangeSliderProps {
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: Function;
    type?: String;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
    min,
    max,
    minValue,
    maxValue,
    onChange,
    type = 'time'
}) => {
    const [minVal, setMinVal] = useState(+minValue);
    const [maxVal, setMaxVal] = useState(+maxValue);
    const minValRef = useRef<HTMLInputElement>(null);
    const maxValRef = useRef<HTMLInputElement>(null);
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minVal, maxVal]);

    return (
        <Col sm={9} className={classnames("container_multi")} style={{ "marginTop": type !== 'time' ? '2rem' : '' }}>
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                ref={minValRef}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = Math.min(+event.target.value, maxVal - 1);
                    setMinVal(value);
                    event.target.value = value.toString();
                }}
                className={classnames("thumb thumb--zindex-3", {
                    "thumb--zindex-5": minVal > max - 100
                })}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                ref={maxValRef}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const value = Math.max(+event.target.value, minVal + 1);
                    setMaxVal(value);
                    event.target.value = value.toString();
                }}
                className="thumb thumb--zindex-4"
            />

            <div className="slider">
                <div className="slider__track"></div>
                <div ref={range} className="slider__range"></div>
                <div className="slider__left-value"
                    style={{
                        left: `${getPercent(minVal) - 3}%`,
                        top: `${(getPercent(maxVal) - getPercent(minVal)) < 31 ? '-40px' : '0'}`
                    }}
                >
                    {type === 'time' && `${minVal}:00`}
                    {type === 'number' && `${minVal}`}
                    {type === 'percentage' && `${minVal}%`}
                    {type === 'finance' && `$${minVal}`}

                </div>
                <div
                    className="slider__right-value"
                    style={{ right: `${100 - (getPercent(maxVal) + 3)}%` }}>
                    {type === 'time' && `${maxVal}:00`}
                    {type === 'number' && `${maxVal}`}
                    {type === 'percentage' && `${maxVal}%`}
                    {type === 'finance' && `$${maxVal}`}
                </div>
            </div>
        </Col>
    )
};

export default MultiRangeSlider;
