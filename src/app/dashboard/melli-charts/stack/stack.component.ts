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

import { Component, OnInit } from '@angular/core';
import { UnitService } from '../../service/unit.service';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import * as echarts from 'echarts';
import { StackMelliChartsService } from './service/stack-melli-charts.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { RucheInterface } from '../../../_model/ruche';
import { RecordService } from '../../service/api/record.service';
import { Observable, Subscriber, BehaviorSubject } from 'rxjs';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { SERIES } from '../charts/SERIES';
import { RucheService } from '../../service/api/ruche.service';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { AtokenStorageService } from '../../../auth/Service/atoken-storage.service';
import { AdminService } from '../../admin/service/admin.service';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.css']
})
export class StackComponent implements OnInit {

  public options: any;
  private valueSubjectComplete: number;
  private gridIndex: Array<number>;
  constructor(private unitService: UnitService,
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private tokenService: AtokenStorageService,
    private userPrefService: UserParamsService,
    private recordService: RecordService,
    private adminService: AdminService,
    private rucheService: RucheService,
    private melliDate: MelliChartsDateService) { }

  ngOnInit() {

    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-brood')) {
      elt.classList.remove('apiary-group-brood');
    } else if (elt.classList.contains('apiary-group-hive')) {
      elt.classList.remove('apiary-group-hive');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-weight');
    }
    elt.classList.add('apiary-group-stack');
    this.options = Object.assign({}, BASE_OPTIONS.baseOptionStack);
    this.options.series = [];
    this.options.yAxis = [];
    this.valueSubjectComplete = 0;
    this.options.xAxis = [];
    this.gridIndex = [1, 1, 0, 2];
    //log(this.options);
    /*     if (this.stackService.getEchartInstance() === null) {
          this.stackService.setEchartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-stack')));
          this.setOptionForStackChart();
        } */

        this.stackService.setEchartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-stack')));
        if (!this.checkIfChartIsUpdate()) {
          this.setOptionForStackChart();
          this.loadAfterRangeChanged((options: any) => {
            this.stackService.getEchartInstance().setOption(options, true);
            this.stackService.getEchartInstance().hideLoading();
          });
        } else {
          this.setOptionForStackChart();
        }


  }


  /**
   *
   *
   * @memberof StackComponent
   */
  setOptionForStackChart(): void {
    let yAxisWeight = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisWeight.name = this.graphGlobal.weight.name;
    yAxisWeight.min = 0;
    yAxisWeight.max = function (value) {
      if(value.max > 5){
        let nb = Math.ceil(value.max) / 5;
        return Math.ceil(nb) * 5;
      }
      else{
        return 40;
      }
    };
    yAxisWeight.gridIndex = 1;
    this.options.yAxis.push(yAxisWeight);

    let xAxis = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxis.gridIndex = 1;
    xAxis.max = this.melliDate.getRangeForReqest()[1];
    xAxis.min = this.melliDate.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.options.xAxis.push(xAxis);


    let yAxisTemp = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisTemp.name = this.graphGlobal.temp.name;
    yAxisTemp.min = this.graphGlobal.temp.min;
    yAxisTemp.max = this.graphGlobal.temp.max;
    yAxisTemp.gridIndex = 0;
    this.options.yAxis.push(yAxisTemp);

    let xAxisTemp = JSON.parse(JSON.stringify(BASE_OPTIONS.xAxis));
    xAxisTemp.gridIndex = 0;
    xAxis.max = this.melliDate.getRangeForReqest()[1];
    xAxis.min = this.melliDate.getRangeForReqest()[0];

    xAxisTemp.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.options.xAxis.push(xAxisTemp);


    let yAxisHum = JSON.parse(JSON.stringify(BASE_OPTIONS.yAxis[0]));
    yAxisHum.name = this.graphGlobal.humidity.name;
    yAxisHum.min = this.graphGlobal.humidity.min;
    yAxisHum.gridIndex = 2;
    yAxisHum.max = this.graphGlobal.humidity.max;
    yAxisHum.interval = 10;
    this.options.yAxis.push(yAxisHum);

    let xAxisHum = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxisHum.gridIndex = 2;
    xAxis.max = this.melliDate.getRangeForReqest()[1];
    xAxis.min = this.melliDate.getRangeForReqest()[0];

    xAxisHum.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.options.xAxis.push(xAxisHum);

    let serieMarkTemp = JSON.parse(JSON.stringify(SERIES.serieMarkTemp));
    console.log(serieMarkTemp);
    serieMarkTemp.yAxisIndex = 1;
    serieMarkTemp.xAxisIndex = 1;
    serieMarkTemp.markArea.data[0][0].yAxis = this.userPrefService.getUserPref().unitSystem === 'METRIC' ? 32 : 90;
    serieMarkTemp.markArea.data[0][1].yAxis = this.userPrefService.getUserPref().unitSystem === 'METRIC' ? 37 : 99;
    serieMarkTemp.markArea.data[0][0].name = this.graphGlobal.getNameZoneByGraph('TEMP');
    console.log(serieMarkTemp);
    this.options.series.push(serieMarkTemp);


    let serieMarkHum = JSON.parse(JSON.stringify(SERIES.serieMarkHint));
    serieMarkHum.yAxisIndex = 2;
    serieMarkHum.xAxisIndex = 2;
    serieMarkHum.markArea.data[0][0].yAxis = 50;
    serieMarkHum.markArea.data[0][1].yAxis = 75;
    serieMarkHum.markArea.data[0][0].name = this.graphGlobal.getNameZoneByGraph('HUM');
    this.options.series.push(serieMarkHum);

    this.options.tooltip.formatter = (params) => {
      return params.map((_elt, index) => {
        return this.getTooltipFormater(_elt.marker, (index === 0 ? this.unitService.getHourlyDate(_elt.data.name) : ''), new Array(
          {
            name: _elt.seriesName,
            value: this.unitService.getValRound(_elt.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName(_elt.seriesName)
          }
        ));
      }).join('');
    }
    console.log(this.options);
    this.stackService.getEchartInstance().setOption(this.options);
  }




  /**
   *
   *
   * @param {RucheInterface} hive
   * @returns {number}
   * @memberof StackComponent
   */
  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  loadAfterRangeChanged(next: Function) {
    this.stackService.getEchartInstance().showLoading()
    this.options.xAxis.forEach(_x => {
      _x.max = this.melliDate.getRangeForReqest()[1];
      _x.min = this.melliDate.getRangeForReqest()[0];
    });
    let obsArray = [];
    obsArray = this.stackService.getHiveSelect().map(_hive => {
      return [
        { hive: _hive,
          name: _hive.name + ' / TempExt',
          obs: this.recordService.getTempExtByHive(_hive._id, this.melliDate.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) },
        { hive: _hive,
          name: _hive.name + ' / TempInt',
          obs: this.recordService.getTempIntByHive(_hive._id, this.melliDate.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) },
        { hive: _hive,
          name: _hive.name + ' / Weight',
          obs: this.recordService.getWeightByHive(_hive._id, this.melliDate.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) },
        { hive: _hive,
          name: _hive.name + ' / Hint',
          obs: this.recordService.getHintIntByHive(_hive._id, this.melliDate.getRangeForReqest()) }
      ];
    }).flat();
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _records => {
        _records.forEach((_elt: any[], index) => {
          this.getSerieByData(_elt, obsArray[index].name, (serieComplete: any) => {
            serieComplete.yAxisIndex = this.getIndexGridByIndex(obsArray[index].name);
            serieComplete.xAxisIndex = this.getIndexGridByIndex(obsArray[index].name);
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obsArray[index].hive), obsArray[index].hive)
            };
            this.options.xAxis.forEach(_xAxe => {
              _xAxe.max = this.melliDate.getRangeForReqest()[1];
            });
            const indexSerie = this.options.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            if (indexSerie !== -1) {
              this.options.series[indexSerie] = Object.assign({}, serieComplete);
            } else {
              this.options.series.push(Object.assign({}, serieComplete));
            }
          });
        });
      },
      () => { },
      () => {
        next(this.options);
      }
    );
  }

  onResize(event: any) {
    this.stackService.getEchartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  loadDataByHive(hive: RucheInterface) {
    this.stackService.getEchartInstance().showLoading();
    const obsArray: Array<any> = [
      { name: hive.name + ' / TempExt',
      obs: this.recordService.getTempExtByHive(hive._id, this.melliDate.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) },
      { name: hive.name + ' / TempInt',
      obs: this.recordService.getTempIntByHive(hive._id, this.melliDate.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) },
      { name: hive.name + ' / Weight',
      obs: this.recordService.getWeightByHive(hive._id, this.melliDate.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) },
      { name: hive.name + ' / Hint',
      obs: this.recordService.getHintIntByHive(hive._id, this.melliDate.getRangeForReqest()) }
    ];
    Observable.forkJoin(obsArray.map(_elt => _elt.obs)).subscribe(
      _record => {
        _record.forEach((_elt, index) => {
          this.getSerieByData(_elt, obsArray[index].name, (serieComplete) => {
            serieComplete.yAxisIndex = this.getIndexGridByIndex(obsArray[index].name);
            serieComplete.xAxisIndex = this.getIndexGridByIndex(obsArray[index].name);
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
            };
            this.options.series.push(serieComplete);
          });
        });
      },
      () => { },
      () => {
        this.options.xAxis.forEach(_x => {
          _x.max = this.melliDate.getRangeForReqest()[1];
          _x.min = this.melliDate.getRangeForReqest()[0];
        });
        this.stackService.getEchartInstance().setOption(this.options);
        this.stackService.getEchartInstance().hideLoading();
      }
    )

  }

  /**
   *
   *
   * @param {number} index
   * @returns {number}
   * @memberof StackComponent
   */
  getIndexGridByIndex(name: string): number {
    if (/TempInt/g.test(name) || /TempExt/g.test(name)) {
      return 1;
    } else if (/Weight/g.test(name)) {
      return 0;
    } else {
      return 2;
    }
  }

  /**
   *
   *
   * @param {RucheInterface} hive
   * @memberof StackComponent
   */
  removeHiveSerie(hive: RucheInterface): void {
    let option = this.stackService.getEchartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.options.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getEchartInstance().setOption(option, true);
  }

  getSerieByData(data: any, nameSerie: string, next: Function): void {
    let sensorRef: Array<string> = [];
    data.forEach(_data => {
      if (sensorRef.indexOf(_data.sensorRef) === -1) {
        sensorRef.push(_data.sensorRef);
        let serieTmp = Object.assign({}, SERIES.line);
        serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
        if (nameSerie.indexOf('ext') !== -1 || nameSerie.indexOf('Ext') !== -1) {
          serieTmp.lineStyle = {
            normal: {
                type: 'dashed'
            }
          };
        }
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, _map.value, _map.sensorRef] };
        });
        next(serieTmp);
      }
    });
  }

  /**
   *
   *
   * @param {string} markerSerie
   * @param {string} date
   * @param {Array<any>} series
   * @returns {string}
   * @memberof StackComponent
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

  /**
   *
   *
   * @returns {boolean}
   * @memberof StackComponent
   */
  checkIfChartIsUpdate(): boolean {
    let nbSerie = 0;
    try{
      this.stackService.getHiveSelect().forEach(_hive => {
        if (this.stackService.getEchartInstance().getOption().series.findIndex(_serie => _serie.name.indexOf(_hive.name) !== -1)) {
          nbSerie++;
        }
      });
      return nbSerie === this.stackService.getHiveSelect().length;
    }catch{
      return false;
    }
  }


  ngOnDestroy() {
    /*     this.stackService.cleanSlectedHives();
        this.options.series = [];
        this.stackService.cleanSerieFromEchartInstance(this.stackService.getEchartInstance()); */
  }

}
