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

import { Component, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { Observable } from 'rxjs';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { SERIES } from '../charts/SERIES';
import { RucheService } from '../../service/api/ruche.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { AdminService } from '../../admin/service/admin.service';

@Component({
  selector: 'app-vitality',
  templateUrl: './vitality.component.html',
  styleUrls: ['./vitality.component.css']
})
export class VitalityComponent implements OnInit, OnDestroy {


  private option: {
    baseOption: any,
    media: any[]
  };
  constructor(private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private dailyThService: DailyRecordService,
    private tokenService: AtokenStorageService,
    private adminService: AdminService,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private unitService: UnitService) {
    this.option = {
      baseOption : JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionHourly)),
      media: [
        {
          option: {
            grid:{
              width: '92%'
            },
            toolbox: {
              show: true,
              right: 2,
            }
          }
        },
        {
          query: {// 这里写规则
            maxWidth: 1100,
          },
          option: {// 这里写此规则满足下的option
/*             toolbox: {
              show: true,
              right: -20,
            } */
          }
        },
        {
          query: {// 这里写规则
            maxWidth: 400,
          },
          option: {// 这里写此规则满足下的option
            grid:[{
              width: '97%'
            }],
            toolbox: {
              show: false
            }
          }
        },
      ]
    };
  }

  ngOnInit() {

    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-hive')) {
      elt.classList.remove('apiary-group-hive');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-weight');
    }
    elt.classList.add('apiary-group-brood');
    this.stackService.setBroodChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-brood')));
    this.option.baseOption.series = [];
    this.setOptionForStackChart();
    if (this.stackService.getHiveSelect().length >= 1) {
      this.loadAllHiveAfterRangeChange((options: any) => {
        this.stackService.getBroodChartInstance().setOption(options, true);
        this.stackService.getBroodChartInstance().hideLoading();
      });
    }
  }
  setOptionForStackChart(): void {
    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis[0]);
    yAxis.name = this.graphGlobal.brood.name;
    yAxis.min = 0;
    yAxis.max = 100;
    this.option.baseOption.yAxis.push(yAxis);

    let serieMarkBrood = JSON.parse(JSON.stringify(SERIES.serieMarkPourcent));
    serieMarkBrood.markArea.data[0][0].name = this.graphGlobal.getNameZoneByGraph('BROOD');
    serieMarkBrood.markArea.data[0][0].yAxis = 80;
    serieMarkBrood.markArea.data[0][1].yAxis = 100;
    this.option.baseOption.series.push(serieMarkBrood);

    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.option.baseOption.tooltip.formatter = (params) => {
      return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data.name), new Array(
        {
          name: params.seriesName,
          value: this.unitService.getValRound(params.data.value[1]),
          unit: this.graphGlobal.getUnitBySerieName('Brood')
        }
      ));
    }
    this.option.baseOption.xAxis.push(xAxis);
    this.stackService.getBroodChartInstance().setOption(this.option);
  }

  onResize(event: any) {
    this.stackService.getBroodChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  getSerieByData(data: Array<any>, nameSerie: string, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach(_data => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, SERIES.line);
        serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, _map.value, _map.sensorRef] };
        });
        next(serieTmp);
      }
    });
  }

  removeHiveSerie(hive: RucheInterface): void {
    let option = this.stackService.getBroodChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getBroodChartInstance().setOption(option, true);
  }


  loadAllHiveAfterRangeChange(next: Function): void {
    const obs = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.dailyThService.getBroodOldMethod(_hive._id, this.melliDateService.getRangeForReqest())}
    });
    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _broods => {
        _broods.forEach((_elt, index) => {
          this.getSerieByData(_elt, obs[index].name, (serieComplete: any) => {
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
            };
            serieComplete.showSymbol = true;
            serieComplete.symbol = 'emptyCircle';
            serieComplete.type = 'line';
            const indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            if (indexSerie !== -1) {
              this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
            } else {
              this.option.baseOption.series.push(Object.assign({}, serieComplete));
            }
          });
        })
      },
      () => {},
      () => {
        next(this.option);
      }
    )
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof VitalityComponent
   */
  loadDataByHive(hive: RucheInterface): void {
    this.stackService.getBroodChartInstance().showLoading();
    this.dailyThService.getBroodOldMethod(hive._id, this.melliDateService.getRangeForReqest()).subscribe(
      _brood => {
        this.getSerieByData(_brood, hive.name, (serieComplete: any) => {
          serieComplete.itemStyle = {
            color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
          };
          serieComplete.showSymbol = true;
          serieComplete.symbol = 'emptyCircle';
          serieComplete.type = 'line';
          this.option.baseOption.series.push(serieComplete);
          this.stackService.getBroodChartInstance().setOption(this.option);
        })
      },
      () => {},
      () => {
        this.stackService.getBroodChartInstance().hideLoading();
      }
    )
  }

  /**
   *
   * @param markerSerie
   * @param date
   * @param series
   */
  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '<B>{D}</B> <br/>';
    let templateValue = '{*} {n}: <B>{v} {u}</B> {R}';
    let tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
    }).join('');

    return tooltipGlobal;
  }

  ngOnDestroy(): void {
   //this.stackService.cleanSlectedHives();
   //this.stackService.getBroodChartInstance().dispose();
  }
}
