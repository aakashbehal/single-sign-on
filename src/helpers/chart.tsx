

import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { merge } from "./util";


const COLOR_PALETTE = {
    GREY: 'rgba(0,0,0,.8)',
    BITTER_SWEET: 'rgba(255, 119, 101, 0.8)',
    BLUE: 'rgba(10, 87, 250, 0.8)',
    PCNK: 'rgba(255, 209, 255, 1)',
    GREEN: 'rgba(0, 235, 168, 0.8)',
    YELLOW: 'rgba(255, 181, 0, 0.8)',
    PURPLE: 'rgba(168, 112, 252, 0.8)',
}

const SECONDARY_COLOR = {
    GREY: 'rgba(0,0,0, 0.5)',
    BITTER_SWEET: 'rgba(255, 144, 129, 0.9)',
    BLUE_TINT: 'rgba(148, 222, 252, 0.9)',
    PCNK_TINT: 'rgba(255, 237, 255, 1)',
    GREEN_TINT: 'rgba(153, 247, 219, 0.9)',
    YELLOW_TINT: 'rgba(255, 224, 153, 0.9)',
    PURPLE_TINT: 'rgba(219, 199, 255, 0.9)'
}

export const numberFormatter_number_chart = (value, prefix) => {
    // if (value >= 1000000) {
    //     return `${prefix} ${(value / 1000000) % 1 !== 0 ? (value / 1000000).toFixed(2) : (value / 1000000)}Mil`
    // } else if (value >= 1000) {
    //     return `${prefix} ${(value / 1000) % 1 !== 0 ? (value / 1000).toFixed(2) : (value / 1000)}k`;
    // } else {
    //     return `${prefix} ${(value) % 1 !== 0 ? (value).toFixed(2) : (value)}`
    // }
    return prefix + ' ' + value.toLocaleString("en-US")
}

export const numberFormatter_number_chart_without_prefix = (value) => {
    return '$' + value.toLocaleString("en-US")
}

export const numberFormatter = (value) => {
    if (value >= 1000000) {
        return ` ${(value / 1000000) % 1 != 0 ? (value / 1000000) : (value / 1000000)}Mil`
    } else if (value >= 1000) {
        return ` ${(value / 1000)}k`;
    } else {
        return ` ${value}`
    }
    // return "$ " + value.toLocaleString("en-US")
}


const primary_colors: string[] = []
for (let key in COLOR_PALETTE) {
    primary_colors.push(COLOR_PALETTE[key])
}
const secondary_colors: string[] = []
for (let key in SECONDARY_COLOR) {
    secondary_colors.push(SECONDARY_COLOR[key])
}

export const createBackgroundColor = (dataSet, chartType) => {
    if (chartType === 'SIMPLE_STACKED_BAR' || chartType === 'SIMPLE_BAR') {
        dataSet = dataSet.map((w, index) => {
            return {
                label: w.label,
                data: w.data,
                backgroundColor: secondary_colors[index],
            }
        })
    } else if (chartType === 'SIMPLE_PCE' || chartType === 'Doughnut') {
        dataSet = dataSet.map((w, index) => {
            return {
                label: w.label,
                data: w.data,
                backgroundColor: secondary_colors,
                borderColor: secondary_colors,
                borderWidth: 1
            }
        })
    } else if (chartType === 'COMPLEX_BAR_LINE_CHART') {
        dataSet[1] = {
            ...dataSet[1],
            backgroundColor: [secondary_colors[0]],
            yAxisID: 'y',
            label: dataSet[1].label || '$',
        }
        dataSet[0] = {
            ...dataSet[0],
            borderColor: ['rgba(255, 119, 101, 1)'],
            borderWidth: 2,
            fill: false,
            label: dataSet[0].label || '# of Accounts',
            yAxisID: 'y1'
        }
    } else if (chartType === 'SIMPLE_BAR_HORIZONTAL') {
        dataSet = dataSet.map((w, index) => {
            return {
                label: w.label,
                data: w.data,
                backgroundColor: secondary_colors[0],
                borderColor: secondary_colors[0],
                borderWidth: 1
            }
        })
    } else if (chartType === 'Bar_Double') {
        dataSet = dataSet.map((w, index) => {
            return {
                label: w.label,
                data: w.data,
                backgroundColor: [secondary_colors[index], secondary_colors[index], secondary_colors[index]],
            }
        })
    } else if (chartType === 'Line_fill') {
        dataSet = dataSet.map((w, index) => {
            return {
                label: w.label,
                data: w.data,
                fill: true,
                borderColor: [secondary_colors[index], secondary_colors[index], secondary_colors[index]],
                backgroundColor: [secondary_colors[index], secondary_colors[index], secondary_colors[index]],
            }
        })
    } else if (chartType === 'Line_stacked' || chartType === 'Line') {
        dataSet = dataSet.map((w, index) => {
            return {
                label: w.label,
                data: w.data,
                borderColor: [secondary_colors[index], secondary_colors[index], secondary_colors[index]],
                backgroundColor: [secondary_colors[index], secondary_colors[index], secondary_colors[index]],
            }
        })
    }
    return dataSet
}


const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 0
    },
    plugins: {
        beginAtZero: true,
        datalabels: {
            display: false
        },
        legend: {
            position: 'bottom' as const,
        },
    },
    indexAxis: 'x',
    scales: {
        x: {
            beginAtZero: true,
            grid: {
                drawOnChartArea: false
            },
            ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 0
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                borderDash: [5, 5]
            },
            suggestedMax: 10000,
            ticks: {
                stepSize: 1000
            }
        }
    }
}

export const chartBar = () => {

    const data = {
        labels: ['Digital', 'DCA Primary', 'DCA Secondary', 'DCA Tertiary', 'Legal', 'BK', 'Debt Sale'],
        datasets: [
            {
                type: 'line' as const,
                label: '# of Accounts',
                borderColor: ['rgba(255, 119, 101, 1)'],
                borderWidth: 2,
                fill: false,
                data: [4000, 3000, 2000, 500, 3000, 500, 1000],
                yAxisID: 'y1'
            },
            {
                type: 'bar' as const,
                label: '$',
                data: [40000000, 30000000, 20000000, 5000000, 30000000, 5000000, 10000000],
                backgroundColor: [secondary_colors[0]],
                yAxisID: 'y'
            },
        ],
    }

    let options = {
        scales: {
            y: {
                grid: {
                    borderDash: [5, 5]
                },
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                suggestedMax: 80000000,
                ticks: {
                    stepSize: 10000000,
                    callback: numberFormatter
                },
                title: {
                    text: '$ Value',
                    display: true
                }
            },
            y1: {
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 1000,
                },
                suggestedMax: 8000,
                title: {
                    text: '# of Accounts',
                    display: true
                }
            },
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

// export const chartBarStacked = () => {

//     const data = {
//         labels: ['Digital', 'DCA Primary', 'DCA Secondary', 'DCA Tertiary', 'Legal', 'BK', 'Debt Sale'],
//         datasets: [
//             {
//                 type: 'line' as const,
//                 label: '# of Accounts',
//                 borderColor: ['rgba(255, 119, 101, 1)'],
//                 borderWidth: 2,
//                 fill: false,
//                 data: [4000, 3000, 2000, 500, 3000, 500, 1000],
//                 yAxisID: 'y1'
//             },
//             {
//                 type: 'bar' as const,
//                 label: '$',
//                 data: [40000000, 30000000, 20000000, 5000000, 30000000, 5000000, 10000000],
//                 backgroundColor: [secondary_colors[0]],
//                 yAxisID: 'y'
//             },
//         ],
//     }

//     let options = {
//         scales: {
//             x: {
//                 stacked: true,
//             },
//             y: {
//                 stacked: true,
//                 grid: {
//                     borderDash: [5, 5]
//                 },
//                 beginAtZero: true,
//                 type: 'linear' as const,
//                 display: true,
//                 position: 'left' as const,
//                 suggestedMax: 80000000,
//                 ticks: {
//                     stepSize: 10000000,
//                     callback: numberFormatter
//                 },
//                 title: {
//                     text: '$ Value',
//                     display: true
//                 }
//             },
//             y1: {
//                 beginAtZero: true,
//                 type: 'linear' as const,
//                 display: true,
//                 position: 'right' as const,
//                 grid: {
//                     drawOnChartArea: false,
//                 },
//                 ticks: {
//                     stepSize: 1000,
//                 },
//                 suggestedMax: 8000,
//                 title: {
//                     text: '# of Accounts',
//                     display: true
//                 }
//             },
//         }
//     };

//     const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
//     const mergedOptions = merge(defaultCopy, options)

//     return {
//         data,
//         options: mergedOptions
//     }
// }

export const chartPie = () => {
    const data = {
        labels: ['Low Value', 'Compliance', 'BK', 'Pending Data', 'New'],
        datasets: [
            {
                type: 'line' as const,
                label: '# of Accounts',
                borderColor: ['rgba(255, 119, 101, 1)'],
                borderWidth: 2,
                fill: false,
                data: [500, 250, 100, 500, 1000],
                yAxisID: 'y1'
            },
            {
                type: 'bar' as const,
                label: '$',
                data: [500000, 250000, 100000, 500000, 1000000],
                backgroundColor: [secondary_colors[0]],
                yAxisID: 'y'
            },
        ],
    }

    let options = {
        scales: {
            y: {
                grid: {
                    borderDash: [5, 5]
                },
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                suggestedMax: 1500000,
                ticks: {
                    stepSize: 250000,
                    callback: numberFormatter
                },
                title: {
                    text: '$ Value',
                    display: true
                }
            },
            y1: {
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 200,
                },
                suggestedMax: 1500,
                title: {
                    text: '# of Accounts',
                    display: true
                }
            },
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const chartDoughnut = () => {
    const data = {
        labels: ['OB', 'SMS', 'Email', 'Letter', 'VM Drop', 'Attempts'],
        datasets: [
            {
                label: '# of attempts',
                data: [75000, 30000, 60000, 7500, 3000, 0],
                backgroundColor: secondary_colors[0],
                borderColor: secondary_colors[0],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        plugins: {
            legend: {
                display: false,
            }
        },
        indexAxis: 'y',
        scales: {
            x: {
                suggestedMax: 80000,
                ticks: {
                    stepSize: 10000
                }
            }
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const chartBarStacked = () => {

    const data = {
        labels: ['Digital', 'DCA Primary', 'DCA Secondary', 'DCA Tertiary', 'Legal', 'BK', 'Debt Sale'],
        datasets: [
            {
                type: 'line' as const,
                label: '# of Accounts',
                borderColor: ['rgba(255, 119, 101, 1)'],
                borderWidth: 2,
                fill: false,
                data: [4000, 3000, 2000, 500, 3000, 500, 1000],
                yAxisID: 'y1'
            },
            {
                type: 'bar' as const,
                label: '$',
                data: [40000000, 30000000, 20000000, 5000000, 30000000, 5000000, 10000000],
                backgroundColor: [secondary_colors[0]],
                yAxisID: 'y'
            },
        ],
    }

    let options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
                grid: {
                    borderDash: [5, 5]
                },
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                suggestedMax: 80000000,
                ticks: {
                    stepSize: 10000000,
                    callback: numberFormatter
                },
                title: {
                    text: '$ Value',
                    display: true
                }
            },
            y1: {
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 1000,
                },
                suggestedMax: 8000,
                title: {
                    text: '# of Accounts',
                    display: true
                }
            },
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const chartScatter = () => {
    const data = {
        labels: ['CC', 'PL', 'LTO', 'Auto', 'Telco'],
        datasets: [
            {
                label: '# of attempts',
                data: [3000000, 5350000, 4000000, 2000000, 2000000],
                backgroundColor: secondary_colors,
                borderColor: secondary_colors,
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: false,
                // text: 'Placed by Channel',
            },
            labels: {
                position: 'outside'
            },
            datalabels: {
                color: 'black',
                display: 'auto',
                formatter: numberFormatter,
                align: 'center',
                anchor: 'center'
            }
        }
    };

    return {
        data,
        options
    }
}

export const chartScatter1 = () => {
    const data = {
        labels: ['CC', 'PL', 'LTO', 'Auto', 'Telco'],
        datasets: [
            {
                label: '# of attempts',
                data: [3000, 5350, 4000, 2000, 2000],
                backgroundColor: secondary_colors,
                borderColor: secondary_colors,
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: false,
                // text: 'Placed by Channel',
            },
            datalabels: {
                color: 'black',
                display: true,
                formatter: numberFormatter,
                align: 'center'
            }
        }
    };

    return {
        data,
        options
    }
}

export const chartRadar = () => {
    const data = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
            {
                type: 'line' as const,
                label: '# of Accounts',
                borderColor: ['rgba(255, 119, 101, 1)'],
                borderWidth: 2,
                fill: false,
                data: [2000, 2000, 1500, 1000, 1000, 1200, 1000, 1400, 2273, 3000],
                yAxisID: 'y1'
            },
            {
                type: 'bar' as const,
                label: '$',
                data: [5000000, 4000000, 3000000, 1500000, 1000000, 600000, 500000, 350000, 250000, 150000],
                backgroundColor: [secondary_colors[0]],
                yAxisID: 'y'
            },
        ],
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                suggestedMax: 6000000,
                ticks: {
                    stepSize: 1000000,
                    callback: numberFormatter
                },
                title: {
                    text: '$ Value',
                    display: true
                }
            },
            y1: {
                beginAtZero: true,
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 500,
                },
                suggestedMax: 3500,
                title: {
                    text: '# of Accounts',
                    display: true
                }
            },
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const chartBubble = () => {
    const data = {
        labels: ['Dispute Resolved', 'Dispute Pending', 'Compliance Resolved', 'Compliance Pending'],
        datasets: [
            {
                label: '# of attempts',
                data: [150, 50, 50, 25],
                backgroundColor: secondary_colors[0],
                borderColor: secondary_colors[0],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        plugins: {
            legend: {
                display: false,
            },
        },
        indexAxis: 'y'
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const chartLine = () => {
    const data = {
        labels: ['OB', 'IB', 'Digital', 'Direct pay', 'Legal'],
        datasets: [
            {
                label: 'Collection',
                data: [250000, 500000, 750000, 10000, 40000],
                backgroundColor: secondary_colors[0]
            }
        ]
    }

    const options = {
        scales: {
            y: {
                suggestedMax: 1000000,
                ticks: {
                    callback: numberFormatter,
                    stepSize: 250000
                }
            }
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const chartLineStacked = () => {

    const data = {
        labels: ['Digital', 'DCA Primary', 'DCA Secondary', 'DCA Tertiary', 'Legal', 'BK', 'Debt Sale'],
        datasets: [
            {
                type: 'line' as const,
                label: '# of Accounts',
                borderColor: ['rgba(255, 119, 101, 1)'],
            }
        ],
    }

    let options = {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                grid: {
                    borderDash: [5, 5]
                }
            }
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const rpcYtc = () => {
    const data = {
        labels: ['OB', 'SMS', 'Email', 'Letter', 'VM Drop', 'Attempts'],
        datasets: [
            {
                label: '# of attempts',
                data: [750000, 500000, 1000000, 250000, 100000, 0],
                backgroundColor: secondary_colors[0],
                borderColor: secondary_colors[0],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        plugins: {
            legend: {
                display: false,
            }
        },
        indexAxis: 'y',
        scales: {
            x: {
                suggestedMax: 1200000,
                ticks: {
                    stepSize: 200000
                }
            }
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const commissionsDefault = () => {
    const data = {
        labels: ['DCA', 'TRAK ', 'Equabli '],
        datasets: [{
            label: 'MTD',
            data: [20000, 16000, 35000],
            backgroundColor: [secondary_colors[0], secondary_colors[0], secondary_colors[0]],
        },
        {
            label: 'YTD',
            data: [65000, 59000, 80000],
            backgroundColor: [secondary_colors[1], secondary_colors[1], secondary_colors[1]],
        }]
    }

    const options = {
        scales: {
            y: {
                suggestedMax: 100000,
                ticks: {
                    stepSize: 20000,
                    callback: numberFormatter
                }
            }
        }
    };

    const defaultCopy = JSON.parse(JSON.stringify(defaultOptions))
    const mergedOptions = merge(defaultCopy, options)

    return {
        data,
        options: mergedOptions
    }
}

export const dataSet = (key1, key2, value1, value2, Styles) => {
    return (
        <div className={Styles.numberWidget}>
            <div className={Styles.mtd}>
                <p style={{ marginBottom: '0px' }}>{key1}</p>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id={`tooltip-error`}>
                            $ {value1 ? value1.toLocaleString("en-US") : 0}
                        </Tooltip>
                    }
                >
                    <h4>{numberFormatter_number_chart(value1, key1 === 'MTD' ? '$' : '')}</h4>
                </OverlayTrigger>
            </div>
            <div style={{ borderRight: '3px dotted #ff7765' }}></div>
            <div className={Styles.ytd}>
                <p style={{ marginBottom: '0px' }}>{key2}</p>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip id={`tooltip-error`}>
                            $ {value2 ? value2.toLocaleString("en-US") : 0}
                        </Tooltip>
                    }
                >
                    <h4>{numberFormatter_number_chart(value2, "$")}</h4>
                </OverlayTrigger>
            </div>
        </div>
    )
}