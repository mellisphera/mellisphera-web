export const CALENDAR = {
    calendar: {
        // height: '80%',
        // width: '80%',
        left: 'center',
        cellSize: [40 , 40],
        range: [new Date().getFullYear() + '-' +( new Date().getMonth() - 1) + '-' + '01', new Date()],
        orient: 'vertical',
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        dayLabel: {
            margin: 5,
            nameMap: [],
            firstDay: 1, // start on Monday
        },
        monthLabel: {
            nameMap: []
        },
        yearLabel: {
            formatter: '{start}-{end}',
            show: false,
            margin: 40,
            textStyle: {
                color: 'black'
            }
        },
        itemStyle: {
            normal: {
                color: '#EBEBEB',
                borderWidth: 1,
                borderColor: '#111'
            }
        }
    },
    visualMap: {
        type: '',
        min: 0,
        max: 10000,
        top: 5,
        pieces: [],
        calculable: true,
        inRange: {
            color: []
        },
        orient: 'horizontal',
        left: 'center',
        textStyle: {
            color: '#000'
        }
    },
}