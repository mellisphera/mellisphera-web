import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsMapService {
  
  option: any;
  constructor() {
    this.option = {
      // backgroundColor: '#404a59',
      title: {
          text: '全国主要城市空气质量',
          subtext: 'data from PM25.in',
          sublink: 'http://www.pm25.in',
          left: 'center',
          textStyle: {
              color: '#fff'
          }
      },
      leaflet: {
        center: [-86.0, 36.44],
        zoom: 6,
        roam: true,
        tiles: [
          {
            label: 'OpenStreetMap',
            urlTemplate:
              'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            options: {
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          }
        ]
      },
      tooltip : {
          trigger: 'item'
      },
      series : [
          {
              name: 'Top 5',
              type: 'effectScatter',
              coordinateSystem: 'leaflet',
              symbolSize: function (val) {
                  return val[2] / 10;
              },
              showEffectOn: 'emphasis',
              rippleEffect: {
                  brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                  normal: {
                      formatter: '{b}',
                      position: 'right',
                      show: true
                  }
              },
              data: [],
              itemStyle: {
                  normal: {
                      color: '#f4e925',
                      shadowBlur: 10,
                      shadowColor: '#333'
                  }
              },
              zlevel: 1
          },
      ]
  };
  }
}
