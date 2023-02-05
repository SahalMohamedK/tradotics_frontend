import { hasValue, hexToRgba } from "./utils";

let textColor = '#64748b';
let textFont = {size:10, weight: 700}
let redColor = '#ef4444';
let greenColor = '#22c55e'
let primaryColor = '#6366f1'
let blueColor = '#1c64f2';
let yellowColor = '#eab308'

let greenGradient = [[0, hexToRgba(greenColor, 0)], [1, greenColor]]
let redGradient = [[0, redColor], [1, hexToRgba(redColor, 0)]]
let primaryGradient = [[0, hexToRgba(primaryColor, 0)], [0.2, hexToRgba(primaryColor, 0.1)], [1, hexToRgba(primaryColor, 0.50)]]
let blueLightColor = 'rgba(28, 100, 242, 0.5)';
let opacity0 = 'rgba(0,0,0,0)'

function linearGradient(colorStops = [], orient = 'v'){
    return (context) => {
        let {width, height } = context.chart
        let coords = [0,0,0,0]
        if(orient === 'v'){
            coords = [0,height, 0,0]
        }else if(orient === 'h'){
            coords = [0,0,width,0]
        }
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(...coords);
        colorStops.forEach(([pos, color]) => {
            gradient.addColorStop(pos, color)
        })
        return gradient;
     }        
}

function segmentColors(...segments){
    return context => {
        let {chartArea, scales, ctx} = context.chart
        if(chartArea){
            let {top, bottom} = chartArea
            let height = chartArea.bottom - chartArea.top
            if(height){
                let gradient = ctx.createLinearGradient(0,bottom, 0, top)
                let prevColor = ''
                segments.forEach(([start, end, color]) => {
                    start = 1-(start === null ? height: scales.y.getPixelForValue(start)-top)/height
                    end = 1-(end === null ? 0: scales.y.getPixelForValue(end)-top)/height
                    start = start > 1 ? 1 : start
                    start = start < 0 ? 0 : start
                    end = end > 1 ? 1 : end
                    end = end < 0 ? 0 : end
                    gradient.addColorStop(start, color)
                    gradient.addColorStop(end, color)
                    prevColor = color
                })
                return gradient
            }
        }
    }
}

export function doughnutChartTextPlugin(text, color){
    return {
        beforeDraw: function(chart) {
            var width = chart.chartArea.width, height = chart.chartArea.height, ctx = chart.ctx;
            ctx.restore();
            var fontSize = (height / 100).toFixed(2);
            ctx.font =`bold ${fontSize}em sans-serif`;
            ctx.textBaseline = "top";
            ctx.fillStyle = color;
            var textX = Math.round(chart.chartArea.left+(width - ctx.measureText(text).width) / 2)
            var textY = Math.round(chart.chartArea.top+(height-fontSize*16) / 2);
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    }
}

export const barGraphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
            x: {
                grid: {
                    color: hexToRgba(textColor, 0.1)
                },
                ticks: {
                    color: textColor,
                    font: textFont
                }
            },
            y: {
                grid:{
                    color: hexToRgba(textColor, 0.1)
                },
                ticks: {
                    color: textColor,
                    font: textFont
                }
            }
    },
    plugins: {
        legend: {
            display: false
        }
    },
};

export function barGraphData(labels, data){
    return {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: data.map(i => i>=0?greenColor:redColor),
            
      barPercentage: 0.75,
      categoryPercentage: 1,
            borderRadius: 5,
        },]
    }
}

export const journelGraphOptions = {
    responsive: true,
    aspectRatio: 0,
    elements: {
        line: {
            tension: 0.4
        }
    },
    plugins: {
        legend:{
            display: false
        }
    },
    scales: {
        x: {
            display: false
        },
        y: {
            display: false
        }
    }
}

export function journelGraphData(){
    return {
        labels:['09:24', '', '', '', '10:07'],
        datasets: [{
            fill: true,
            label: 'Dataset 2',
            data: [0,800,600,1600,1400],
            borderColor: primaryColor,
            backgroundColor: hexToRgba(primaryColor, 0.25)
        }]
    }
}

export const areaGraphOptions = {
    responsive: true,
    aspectRatio: 0,
    elements: {
        line: {
            tension: 0.4
        }
    },
    plugins: {
        legend:{
            display: false
        },
        zoom: {
            zoom: {
                wheel: {
                    enabled: true,
                },
                drag: {
                    enabled: true
                },
                mode: 'xy',
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: hexToRgba(textColor, 0.1)
            },
            ticks: {
                color: textColor,
                font: textFont
            }
        },
        y: {
            grid:{
                color: hexToRgba(textColor, 0.1)
            },
            ticks: {
                color: textColor,
                font: textFont
            }
        }
    }
}

export function areaGraphData(labels, data){
    return {
        labels: labels,
        datasets: [{
            data: data,
            fill: true,
            backgroundColor: segmentColors([null, 0, hexToRgba(redColor, 0.3)], [0,null, hexToRgba(greenColor, 0.3)]),
            borderColor: segmentColors([null, 0, redColor], [0,null, greenColor]),
            pointHoverRadius: 10,
            pointRadius: 4
        },
            // {
            //     data: [0, 300, -300, -600, -400],
            //     fill: true,
            //     backgroundColor: segmentColors([null, 0, hexToRgba(primaryColor, 0.3)], [0, null, hexToRgba(greenColor, 0.3)]),
            //     borderColor: segmentColors([null, 0, primaryColor], [0, null, greenColor]),
            //     pointHoverRadius: 10,
            //     pointRadius: 4
            // }
        ]
    }
}

export function areaGraphDoubleData(labels, data1, data2) {
    return {
        labels: labels,
        datasets: [{
            data: data1,
            fill: true,
            backgroundColor: segmentColors([null, 0, hexToRgba(redColor, 0.3)], [0, null, hexToRgba(greenColor, 0.3)]),
            borderColor: segmentColors([null, 0, redColor], [0, null, greenColor]),
            pointHoverRadius: 10,
            pointRadius: 4
        },
        {
            data: data2,
            fill: true,
            backgroundColor: segmentColors([null, 0, hexToRgba(yellowColor, 0.3)], [0, null, hexToRgba(blueColor, 0.3)]),
            borderColor: segmentColors([null, 0, yellowColor], [0, null, blueColor]),
            pointHoverRadius: 10,
            pointRadius: 4
        }
        ]
    }
}

export const doughnutChartOptions = {
    responsive:true,
    borderWidth:0,
    cutout: '80%',
    aspectRatio: 0,
    align: 'start',
    plugins: {
        legend: {
            display: true,
            position: 'right',
            labels: {
                color: textColor,
                font: textFont,
                boxWidth: 10,
            },
            onClick: (e) => e.preventDefault()
        }
    },
    layout: {
        padding: 5,
        position: 'right'
    }
}

export function doughnutChartData(labels, data, ){
    return {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: data,
            backgroundColor: [greenColor, redColor],
            hoverOffset: 4
        }]
    }
}

export const lineChartOptions = {
    responsive: true,
    aspectRatio: 0,
    elements: {
        line: {
            tension: 0.4
        }
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
                color: textColor,
                font: textFont,
                boxWidth: 10,
            }
        },
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: textColor,
                font: textFont
            }
        },
        y: {
            grid:{
                display: false
            },
            ticks: {
                color: textColor,
                font: textFont
            }
        }
    }
}

export function lineChartData(){
    return {
        labels: ['01/6/22','','10/6/22','','20/6/22','','30/6/22'],
        datasets: [
            {
                label: 'Current P&L',
                data: [250,300,420,430,370,450,500],
                borderColor: redColor,
                backgroundColor: redColor

            },
            {
                label: 'Improved P&L',
                data: [150,200,320,530,170,350,300],
                borderColor: greenColor,
                backgroundColor: greenColor

            }
        ]
    };
}
