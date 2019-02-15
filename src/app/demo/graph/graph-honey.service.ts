import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphHoneyService {

  option: any;
  constructor() {
    this.option = {
      title: {
          text: 'Stock de miel',
          left: 'center',
          top:'-5'
      },
      tooltip : {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              label: {
                  backgroundColor: '#6a7985'
              }
          }
      },
      legend : {
          top:40
      },
      series : [],
      dataZoom: [
          /*{   
              show: true,
              realtime: true,
              start: 0,
              end: 100
          },*/
          {
              type: 'inside',
              show: true,
              realtime: true,
              start: 0,
              end: 100
          }
      ],
      grid: {
          left: '3%',
          right: '6%',
          width:'95%',
          top:70,
          bottom:0,
          containLabel: true,
          borderWidth:1,
          show: true
      },
      xAxis : [
          {
              type : 'time',
              splitLine: {
                  show: false
              },
              min : '2019-01-01',
              max : '2019-02-28'
          }
      ],
      yAxis :
          {
              name : 'Poids (kg)',
              type : 'value'
          }
  };
  }
}
