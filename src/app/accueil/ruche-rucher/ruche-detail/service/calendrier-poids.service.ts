import { Injectable } from '@angular/core';

import { DailyRecordsWService } from './daily-records-w.service';
@Injectable({
  providedIn: 'root'
})
export class CalendrierPoidsService {
/*
    data  = [
        ["2018-10-09",100, "5bbb00cceba03f1985daceef", 0, 0, 1.025, 6.577, -4.343, 5.552, 0, 0, 0],
        ["2018-10-10",100, "5bbb00cceba03f1985daceef", 0, 0, 1.025, 6.577, -4.343, 5.552, 0, 0, 0],
        ["2018-10-11",100, "5bbb00cceba03f1985daceef", 0, 0, 1.025, 6.577, -4.343, 5.552, 0, 0, 0],
        ["2018-10-12",100, "5bbb00cceba03f1985daceef", 0, 0, 1.025, 6.577, -4.343, 5.552, 0, 0, 0]
    ]*/
  constructor(private dailyRec : DailyRecordsWService) { 
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
        range: ['2018-2-01', '2018-4-30'],
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
            nameMap:'fr',
            firstDay: 1, // start on Monday
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
        {
            name: 'gain',
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            data: '',
            symbolSize: function (val) {
                   if(val[1]>=0){return 0.5*Math.sqrt(1000*val[1]);}
                   else{ return 0;} 
            },
            showEffectOn: 'emphasis',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            itemStyle: {
                normal: {
                    color: '#00FE0C'
                }
            }
        },
        {
            name: 'perte',
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            data: '',
            symbolSize: function (val) {
               if(val[1]<0){return 0.5*Math.sqrt(Math.abs(1000*val[1]));}
           else{ return 0;} 
            },
            showEffectOn: 'emphasis',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            
            itemStyle: {
                normal: {
                    color: '#FE0000'
        
                }
            }
        },

      ]


    };
}
