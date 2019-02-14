import { MyDate } from '../../class/MyDate';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendrierFSTLervice {

  option: any;

  constructor() { 
    this.option = {
      title: {
          top: 5,
          text: 'Daily weight incomes',
          left: 'center',
      },
      tooltip : {
          trigger: 'item',
          formatter: (params) => {
              return new MyDate(params.data[0]).getIso() + '<br/>' + params.seriesName + ' : ' + params.data[1];
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
          left: '3%',
          right: '2%',
          width : '92%',
          //right: '4%',
          height:'200',
          //height:'auto',
          cellSize: ['20','20'],
          range: ['2019-02-01','2019-02-28'],
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
  }

}
