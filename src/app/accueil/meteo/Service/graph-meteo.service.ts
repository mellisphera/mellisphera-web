import { Injectable } from '@angular/core';
import { MeteoService } from './MeteoService';

@Injectable({
  providedIn: 'root'
})
export class GraphMeteoService {

  constructor() { }

  option = {
    title: {
        left:"10%",
        text: 'Température Moyenne | Humidité'
  },
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
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
        data : ['Temp-Moyenne','Humidité']
    },
    series: [{
        name : 'Temp-Moyenne',
        type: 'line',
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
    },{
        name : 'Humidité',
        type:'line',
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
    }
    ],
    dataZoom: [
      {   
          show: true,
          realtime: true,
          start: 20,
          end: 85
      },
      {
          type: 'inside',
          show: true,
          realtime: true,
          start: 20,
          end: 85
      }
  ],
    
  };

}
