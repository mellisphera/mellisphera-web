import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { CapteurInterface } from '../../../_model/capteur';
import * as echarts from 'echarts';
import { User } from '../../../_model/user';

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
        this.optionsUserChart.baseOption.series[0].data = this.adminService.allUsers.filter(_filter => _filter.username !== 'LPO').map((res: User) => {
          return { name: res.username, value: res.connexions };
        })
        this.optionsUserChart.baseOption.legend.data = this.adminService.allUsers.filter(_filter => _filter.username !== 'LPO').map((res: User) => res.username);
        this.echartsInstace.setOption(this.optionsUserChart);
        console.log(this.echartsInstace.getOption());
      }
    )
    this.adminService.getAllSensor().subscribe(
      sensors => {
        this.adminService.allSensors = sensors;
        this.optionsSensorChart.baseOption.series[0].name = 'Sensors';
        this.optionsSensorChart.baseOption.series[0].data = new Array();
        this.optionsSensorChart.baseOption.series[0].data.push({name: 'T2', value: this.getT2Sensor().length});
        this.optionsSensorChart.baseOption.series[0].data.push({name: 'TH_R', value: this.getTHRSensor().length});
        this.optionsSensorChart.baseOption.series[0].data.push({name: 'WEIGHT', value: this.getWeightSensor().length});
        this.optionsUserChart.baseOption.legend.data = ['T2', 'TH_R', 'WEIGHT'];
        console.log(this.optionsSensorChart);
        this.echartsSensorInstace.setOption(this.optionsSensorChart);
        console.log(this.echartsSensorInstace.getOption());
      }
    )
  }
  ngAfterViewInit(): void {

  }

  getT2Sensor(): Array<CapteurInterface> {
    return this.adminService.allSensors.filter(sensor => sensor.sensorRef.startsWith('41') || sensor.sensorRef.startsWith('39') || sensor.sensorRef.startsWith('B5'));
  }
  getTHRSensor(): Array<CapteurInterface> {
    return this.adminService.allSensors.filter(sensor => sensor.sensorRef.startsWith('42'));
  }
  getWeightSensor(): Array<CapteurInterface> {
    return this.adminService.allSensors.filter(sensor => sensor.sensorRef.startsWith('43'));
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
