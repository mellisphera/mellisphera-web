/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

export const CALENDAR = {
    calendarMelliUx: {
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
                width: 2,
                type: 'solid'
            }
        },
        dayLabel: {
            margin: 20,
            nameMap: [],
            position: 'start',
            firstDay: 1, // start on Monday
        },
        monthLabel: {
            nameMap: [],
            position: 'start'
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
    calendarMelliChart: {
        // height: '80%',
        // width: '80%',
        left: 'center',
        cellSize: [40 , 40],
        range: ['2019-08-01', '2019-08-31'],
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
            margin: 10,
            nameMap: [],
            position: 'end',
            firstDay: 1, // start on Monday
        },
        monthLabel: {
            nameMap: [],
            position: 'start'
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
        top: 16,
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