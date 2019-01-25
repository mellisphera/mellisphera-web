import { Injectable } from '@angular/core';
import { DailyRecordsWService } from '../../service/daily-records-w.service';
import { CalendrierService } from '../../service/calendrier.service';
@Injectable({
  providedIn: 'root'
})
export class CalendrierPoidsService extends CalendrierService{

  constructor(private dailyRec : DailyRecordsWService) { 
      super();
  }

  option = {
    backgroundColor: 'white',
    title: {
        top: 5,
        text: 'Daily weight incomes',
        left: 'center',
    },
    tooltip : {
        trigger: 'item',
        formatter: (params)=>{
            return params.data[0]+'<br/>'+params.seriesName+ ' : '+params.data[1];
        }    
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'line']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        top: 30,
        data:['gain','loss'],
        textStyle: {
            color: 'black'
        }
    },
   calendar: [{
        left: 60,
        range: this.rangeCalendar,
        orient: 'horizontal',
        cellSize: 'auto',
        height:'200',
        width:'95%',
        top:70,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        dayLabel: {
            nameMap: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            firstDay: 1, // start on Monday
          },
          yearLabel: {
            formatter: '{start}-{end}',
            show:true,
            margin : 40,
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
            name: 'loss',
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
