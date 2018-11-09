import { Injectable } from '@angular/core';
import { DailyRecordService } from '../../../../disposition-ruche/Service/dailyRecordService';

@Injectable({
  providedIn: 'root'
})
export class CalendrierHealthService {

  constructor() {
   }


  option = {
    backgroundColor: 'white',
    title: {
        top: 70,
        text: 'Weight_max for each day',
        left: 'center',
        textStyle: {
            color: '#fff'
        }
    },
    tooltip : {
        trigger: 'item',
        formatter: (params)=>{
            return params.data[0]+'<br/>'+params.seriesName+ ' : '+params.data[1];
        }    
    },
    toolbox: {
        feature: {
            /*dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'line']},
            restore: {show: true},*/
            saveAsImage: {show: true}
        }
    },
    legend: {
        top: '30',
        data:['gain','perte'],
        textStyle: {
            color: 'black'
        }
    },
   calendar: [{
        top: 140,
        left: 'center',
        range: ['2018-01-01', '2018-12-30'],
        orient: 'vertical',
        cellSize: '30',
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        dayLabel: {
            nameMap: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
            firstDay: 1, // start on Monday

          },
          monthLabel: {
            margin: 10,
            nameMap: [
                'Janv.', 'Fev.', 'Mars',

                'Avril', 'Mai', 'Juin',

                'Juill.', 'Aout', 'Sept.',

                'Oct.', 'Nov.', 'Dec.'
            ]
        },
        yearLabel: {
            formatter: '{start}',
            textStyle: {
                color: 'black'
            }
        },
        itemStyle: {
            normal: {
                color: 'lightgrey',
                borderWidth: 1,
                borderColor: '#111'
            }
        }
    }],
    series : [


      ]


    };
}
