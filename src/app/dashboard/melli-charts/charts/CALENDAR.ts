export const CALENDAR = {
    calendar: {
        left: '3    %',
        width: '90%',
        height: '45%',
        cellSize: ['20', '20'],
        range: [],
        orient: 'horizontal',
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        dayLabel: {
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
}