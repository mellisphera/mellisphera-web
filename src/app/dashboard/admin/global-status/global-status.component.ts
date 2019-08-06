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

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { CapteurInterface } from '../../../_model/capteur';
import * as echarts from 'echarts';
import { User } from '../../../_model/user';


const USER_EXCLU = ['lpo', 'admin', 'mickael', 'demo'];
const WEIGHT= { type: 'WEIGHT', ref: 43};
const T2 = { type: 'T2', ref: 41};
const TH_R = { type: 'TH_R', ref: 42};
const T2_39 = { type: 'T2', ref: 39};
const T2_B5 = { type: 'T2', ref: 'B5'};

@Component({
  selector: 'app-global-status',
  templateUrl: './global-status.component.html',
  styleUrls: ['./global-status.component.css']
})
export class GlobalStatusComponent implements OnInit, AfterViewInit {

  public optionsUserChart: any;
  public optionsSensorChart: any;
  private echartsInstace: any;
  private echartsSensorInstace: any;
      constructor(public adminService: AdminService) {
    this.optionsUserChart = {
      baseOption: {
        /*       title : {
        text: 'Utilsateur',
    }, */
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: 'scroll',
          show: true,
          orient: 'vertical',
          textStyle: {
            color: 'white'
          },
          left: 'left',
          data: [],
        },
        series: [
          {
            name: 'connection',
            type: 'pie',
            //radius: '55%',
            //center: ['50%', '60%'],
            //rayon: '70%',
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
          }
        ]
      },
    };
    this.optionsSensorChart = Object.assign({}, this.optionsUserChart);
  }

  ngOnInit() {
    this.adminService.getAllUsers().subscribe(
      users => {
        this.adminService.allUsers = users;
        this.optionsUserChart.baseOption.series[0].data = this.adminService.allUsers.filter(_filter => USER_EXCLU.indexOf(_filter.username) === -1).map((res: User) => {
          return { name: res.username, value: res.connexions };
        })
        this.optionsUserChart.baseOption.legend.data = this.adminService.allUsers.filter(_filter => USER_EXCLU.indexOf(_filter.username) === -1)  .map((res: User) => res.username);
        this.echartsInstace.setOption(this.optionsUserChart);
        console.log(this.echartsInstace.getOption());
      }
    )
    this.adminService.getAllSensor().subscribe(
      sensors => {
        this.adminService.allSensors = sensors;
        this.optionsSensorChart.baseOption.series[0].name = 'Sensors';
        this.optionsSensorChart.baseOption.series[0].data = new Array();
        this.optionsSensorChart.baseOption.series[0].data.push({name: T2.type, value: this.getT2Sensor().length});
        this.optionsSensorChart.baseOption.series[0].data.push({name: TH_R.type, value: this.getTHRSensor().length});
        this.optionsSensorChart.baseOption.series[0].data.push({name: WEIGHT.type, value: this.getWeightSensor().length});
        this.optionsUserChart.baseOption.legend.data = [T2.type, TH_R.type, WEIGHT.type];
        console.log(this.optionsUserChart.baseOption.legend.data);
        console.log(this.optionsSensorChart);
        this.echartsSensorInstace.setOption(this.optionsSensorChart);
        console.log(this.echartsSensorInstace.getOption());
      }
    )
  }
  ngAfterViewInit(): void {

  }

  getT2Sensor(): Array<CapteurInterface> {
    return this.adminService.allSensors.filter(sensor => sensor.sensorRef.startsWith(String(TH_R.ref)) || sensor.sensorRef.startsWith(String(T2_39.ref)) || sensor.sensorRef.startsWith(String(T2_B5.ref)));
  }
  getTHRSensor(): Array<CapteurInterface> {
    return this.adminService.allSensors.filter(sensor => sensor.sensorRef.startsWith(String(T2.ref)));
  }
  getWeightSensor(): Array<CapteurInterface> {
    return this.adminService.allSensors.filter(sensor => sensor.sensorRef.startsWith(String(WEIGHT.ref)));
  }
  onChartInit(e: any) {
    console.log(e);
    this.echartsInstace = e;
  }
  onChartInitSensor(e: any) {
    console.log(e);
    this.echartsSensorInstace = e;
  }



}
