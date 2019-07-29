import { CALENDAR } from "./CALENDAR";

export const BASE_OPTIONS = {
    baseOptionHourly: {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            },
            formatter: null
        },
        legend: {
            orient: 'horizontal',
            data: [],
        },
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        toolbox: {
            orient: 'horizontal',
            itemSize: 20,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none',
                },
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                bottom: 0,
            },
            {
                type: 'inside',
                filterMode: 'empty',
                realtime: true,
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty',
                left: 'left'
            },
        ],
        grid: [{
            containLabel: true,
            height: '80%',
            left: 'center',
            width: '95%'
        }],
        
        yAxis: [{
            name: '',
            nameLocation: 'middle',
            type: 'value',
            nameGap: 30,
            scale: true
            
        }],

        xAxis: [
            {
                type: 'time',
                boundaryGap: false,
                axisLine: { onZero: true },
                position: 'bottom',
                splitLine: {
                    show: true
                },
                splitArea: {
                    show: true,
                },
                axisLabel:{}
            },
        ],
        series: []
      
    },
    baseOptionDaily: {
       // visualMap: {},
        legend: {},
        axisPointer: {
            link: { xAxisIndex: 'all' }
        },
        toolbox: {
            orient: 'horizontal',
            itemSize: 20,
            feature: {
                dataView: { readOnly: false },
                saveAsImage: {}
            }
        },
        calendar: CALENDAR.calendar
    },

    yAxis: {
        name: '',
        nameLocation: 'middle',
        type: 'value',
    },
    tooltip: {
        trigger: 'item',
        formatter: {}
    },
    legend: {
        orient: 'horizontal',
        data: [],
        selectedMode: 'multiple'
    },

}