import { Component, OnInit } from '@angular/core';
import { KpisynclogService } from '../service/kpisynclog.service';
import { Kpisynclog } from '../../../_model/kpisynclog';
import { optimizeGroupPlayer } from '@angular/animations/browser/src/render/shared';
import { ThrowStmt } from '@angular/compiler';
import * as echarts from 'echarts';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { UnitService } from '../../service/unit.service';
@Component({
  selector: 'app-kpisynclog',
  templateUrl: './kpisynclog.component.html',
  styleUrls: ['./kpisynclog.component.css']
})
export class KpisynclogComponent implements OnInit {

  public option: any;
  private startRequestDate: Date;
  public merge: any;
  private echartsInstance: any;
  private dataKpisynclog: {
    user: Array<String>,
    series: Array<any>,
    timeline: Array<Date>
  };
  constructor(private kpisynclogService: KpisynclogService, private unitService: UnitService) {
    this.startRequestDate = new Date();
    this.startRequestDate.getDate() - 30;
    this.startRequestDate.setDate(this.startRequestDate.getDate() - 30);
    this.option = {
      baseOption: {
        timeline: {
          axisType: 'category',
          autoPlay: true,
          width: '95%',
          left: 'center',
          inverse: false,
          playInterval: 1000,
          label: {
              textStyle: {
                  color: '#4F4F51'
              }
          },
          lineStyle: {
              color: '#4F4F51'
          },
          checkpointStyle: {
              color: '#4F4F51',
              borderColor: '#4F4F51',
              borderWidth: 2
          },
          controlStyle: {
              showNextBtn: true,
              showPrevBtn: true,
              normal: {
                  color: '#4F4F51',
                  borderColor: '#666'
              },
              emphasis: {
                  color: '#4F4F51',
                  borderColor: '#4F4F51'
              }
          },
          data: []
      },
        backgroundColor: 'white',
        visualMap: [
          {
              show: true,
              dimension: 3,
              categories: [],
              calculable: true,
              precision: 0.1,
              top: '5%',
              textGap: 30,
              textStyle: {
                  color: 'black'
              },
               inRange: {
                  color: []
              }
          }
      ],
        legend: {
          data: []
        },
        grid: {
          //top: 100,
          containLabel: true,
          //height: '95%'
          //width: '95%'
          // right: '110'
        },
        xAxis: {
          name: 'last-log',
          type: 'value',
          min: 0,
          max: 60
        },
        yAxis: {
          type: 'value',
          name: 'last-sync',
          max: 60,
          ine: {
            lineStyle: {
              color: '#ccc'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            type: 'scatter',
            data: [5, 5, 'toto', new Date()],
            symbolSize: 10
          },
          {
            type: 'line',
            data: [0, 10, 20, 30, 40 , 50, 60],
            symbol: 'none'
          }
        ],
      },
      options: []
    };
  }
  onChartInit(event) {
    this.echartsInstance = event;
    console.log(this.echartsInstance);
  }
  ngOnInit() {
    var oldDate = [];
    var oldUser = [];
/*     var elt = <HTMLDivElement>document.getElementById('chart-kpisynclog');
    this.echartsInstance = echarts.init(elt); */
    this.kpisynclogService.getKpisnclog(this.startRequestDate).map(res => {
      return {
        user: res.map(elt => {
          if (oldUser.indexOf(elt.user) === -1) {
            oldUser.push(elt.user);
            this.option.baseOption.visualMap[0].inRange.color.push(this.kpisynclogService.getRandomColor())
            return elt.user;
          }

        }).filter(_filter => _filter !== undefined),
        series: res.map(elt => {
          if (oldDate.indexOf(elt.date) === -1) {
            oldDate.push(elt.date);
            return res.filter(_filter => _filter.date === elt.date).sort((a, b) => {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
          }
        }),
        timeline: oldDate,
      }
    }).subscribe(
      data => {
        this.dataKpisynclog = data;
        console.log(this.dataKpisynclog.series.filter(filt => filt !== undefined));
        this.option.baseOption.visualMap[0].categories = this.dataKpisynclog.user;
        this.option.baseOption.timeline.data = this.dataKpisynclog.timeline.sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        }).map(elt => this.unitService.getDailyDate(elt));
        this.dataKpisynclog.series.filter(_filter => _filter !== undefined).map((elt: Kpisynclog[], index) => {
          return {
            tooltip: {
              padding: 5,
              backgroundColor: '#222',
              borderColor: '#777',
              borderWidth: 1,
              formatter: (params) => {
                return '<strong>' + params.marker + params.data[3] + '</strong/><br/>' + 
                'sync : <strong>' + params.data[1] + '</strong><br/>log : <strong/>' + params.data[0] + '</strong>';
              }
            },
            title: {
              show: true,
              'text': this.unitService.getDailyDate(<string>elt[0].date)
            },
            series: {
              name: elt[0].date,
              type: 'scatter',
              data: elt.map(res => {
                return [res.lastLog, res.lastSync,10,res.user, res.date];
              }),
              symbolSize: 30,
            
            }
          };
        }).forEach(opt => {
          this.option.options.push(opt);
        });
        this.echartsInstance.setOption(this.option);
      },
      err => {
        console.log(err);
      }
    )
  }

}
