import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionsMapService {

  data : [
    { name:'a',   value : [31.2883,-0.3869]},
    { name:'b',   value : [43.2883,-0.3869]},
    { name:'c',   value : [51.2883,-0.39]},
    { name:'d',   value : [40.2883,-0.38129]},
    { name:'e',   value : [13.2883,-0.3869]}
  ];

  option =   {
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
    tooltip: {
        trigger: 'item'
    },
    bmap: {
        center: [104.114129, 37.550339],
        zoom: 5,
        roam: true,
        mapStyle: {
            styleJson: [
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": {
                            "color": "#044161"
                        }
                    }
            ]
        }
    },
    series : [
        {
            name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.data,
            //symbolSize: n
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            }
        }
    ]
  };
  
  constructor() { }
}
