import { Injectable } from '@angular/core';
import { DailyRecordsWService } from '../../service/daily-records-w.service';
import { CalendrierService } from '../../service/calendrier.service';
@Injectable({
  providedIn: 'root'
})
export class CalendrierPoidsService{

  constructor(private dailyRec : DailyRecordsWService) { 
  }

  option = {
    //backgroundColor: 'white',
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
        orient : 'horizontal',
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
        top: 100,
        bottom:10,
        left: '1%',
        right: '4%',
        height:'200',
        //height:'auto',
        cellSize: ['20','20'],
        range: null,
        orient: 'horizontal',
        /*cellSize: 'auto',
        height:'200',*/
        //  width:'95%',
       // top:70,
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
            show:false,
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
    convertDate(date : Date){
        var jour = ''+date.getDate();
        var mois = ''+(date.getMonth()+1);
        var anee = date.getFullYear();
        if(parseInt(jour) < 10 ){ jour = '0'+jour; }
        if(parseInt(mois) < 10 ){ mois = '0'+mois; }
    
        return anee + '-' +mois+'-'+ jour;
      }
}
