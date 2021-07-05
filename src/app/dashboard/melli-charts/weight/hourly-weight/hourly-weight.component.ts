import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RucheInterface } from '../../../../_model/ruche';
import { GraphGlobal } from '../../../graph-echarts/GlobalGraph';
import { UserParamsService } from '../../../preference-config/service/user-params.service';
import { RucheService } from '../../../service/api/ruche.service';
import { UnitService } from '../../../service/unit.service';
import { MelliChartsDateService } from '../../service/melli-charts-date.service';
import { MelliChartsHiveService } from '../../service/melli-charts-hive.service';
import { StackMelliChartsService } from '../../stack/service/stack-melli-charts.service';
import { SERIES } from '../../charts/SERIES';
import { BASE_OPTIONS } from '../../charts/BASE_OPTIONS';
import { RecordService } from '../../../service/api/record.service';
import { Observable } from 'rxjs/Observable';
import * as echarts from 'echarts';

@Component({
  selector: 'app-hourly-weight',
  templateUrl: './hourly-weight.component.html',
  styleUrls: ['./hourly-weight.component.css']
})
export class HourlyWeightComponent implements OnInit {

  private option: {
    baseOption: any,
    media: any[]
  };

  public test: boolean;

  constructor(
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private unitService: UnitService,
    private userPrefService: UserParamsService,
    public datepipe: DatePipe,
    private translateService: TranslateService,
    private melliHive: MelliChartsHiveService,
    private recordService: RecordService,
  ) {
    this.option = {
      // Base Option for ECharts
      baseOption : JSON.parse(JSON.stringify(BASE_OPTIONS.baseOptionHourly)),
      media: [
        {
          option: {
            grid:{
              width: '85%'
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
              width: '90%'
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
  }

  onResize(event: any) {
    this.stackService.getWeightChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  initGraph(){
    (<HTMLElement>document.getElementById('ref_date')).style.visibility = "hidden";

    this.stackService.setWeightChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-hour-weight')));
    this.option.baseOption.series = [];
    this.setOptionForStackChart();
    if (this.stackService.getHiveSelect().length >= 1) {
      // Load Data
      this.loadAllHiveAfterRangeChange((options: any) => {
          this.stackService.getWeightChartInstance().setOption(options, true);
          this.stackService.getWeightChartInstance().hideLoading();
      });
    }
  }

  setOptionForStackChart(): void {
    // Add legend to chart
    this.option.baseOption.legend.data = [];

    this.rucheService.ruchesAllApiary.forEach(r => {
      this.option.baseOption.legend.data.push(r.name);
    });

    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }

    // X-Axis Options
    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.option.baseOption.tooltip.trigger = 'axis';
    this.option.baseOption.tooltip.formatter = (params) => {
      return params.map((_elt,i) => {
        return this.getTooltipFormater(_elt.marker, (i === 0 ? this.unitService.getHourlyDate(_elt.data.name) : ''), new Array(
          {
            name: _elt.seriesName,
            value: this.unitService.getValRound(_elt.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName('Weight')
          }
        ));
      });
    }
    this.option.baseOption.xAxis.push(xAxis);

    // Y-Axis Options
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis[1]);

    yAxis.name = this.graphGlobal.weight.name;
    //yAxis.interval = 5;

    yAxis.min = function (value: any) {
      if(value.min < -2){
        let nb = Math.ceil(Math.abs(value.min)) / 2;
        return Math.round(nb) * -2;
      }
      else{
        return 0;
      }
    };
    yAxis.max = function (value: any) {
      if(value.max > 5){
        let nb = Math.ceil(value.max) / 5;
        return Math.ceil(nb) * 5;
      }
      else{
        return 40;
      }
    };

    this.option.baseOption.yAxis.push(yAxis);

    // Add Options to EChart graph
    this.stackService.getWeightChartInstance().setOption(this.option);
  }

  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '<B>{D}</B> <br/>';
    let templateValue = '{*} {n}: <B>{v} {u}</B>';
    let tooltipGlobal = '<B>' + date + '</B> <br/>'
    tooltipGlobal += series.map(_serie => {
      return markerSerie + ' ' + _serie.name.split('|')[0] + ': <B>' + _serie.value + ' ' + _serie.unit + '</B>';
    }).join('');

    return tooltipGlobal;
  }

  loadAllHiveAfterRangeChange(next: Function): void {
    let obs;
    obs = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.recordService.getWeightByHive(_hive._id, this.melliDateService.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem) }
    });
    this.stackService.getWeightChartInstance().showLoading();
    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _records => {
        _records.forEach((_elt: any[], index) => {
          this.getSerieByData(_elt, obs[index].name, (serieComplete: any) => {
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
            };
            let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            serieComplete.showSymbol = false;
            //serieComplete.symbol = 'emptyCircle';
            serieComplete.type = 'line';
            serieComplete.lineStyle = {
              width: 2,
              shadowColor: 'rgba(255,255,255,1.0)',
              shadowBlur: 10,
              shadowOffsetY: 0
            }
            if (indexSerie !== -1) {
              this.option.baseOption.series.splice(indexSerie+1,0,Object.assign({}, serieComplete));
            }
            else {
              this.option.baseOption.series.push(Object.assign({}, serieComplete));
            }
          });
        });
      },
      () => {},
      () => {
        next(this.option);
        this.stackService.getWeightChartInstance().hideLoading();
      }
    );
  }

  loadDataByHive(hive: RucheInterface): void{
    this.stackService.getWeightChartInstance().showLoading();
    this.recordService.getWeightByHive(hive._id, this.melliDateService.getRangeForReqest(), this.userPrefService.getUserPref().unitSystem).subscribe(
      _records => {
        this.getSerieByData(_records, hive.name, (serieComplete: any) => {
          serieComplete.itemStyle = {
            color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
          };
          let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
          serieComplete.showSymbol = false;
          //serieComplete.symbol = 'emptyCircle';
          serieComplete.type = 'line';
          serieComplete.lineStyle = {
            width: 2,
            shadowColor: 'rgba(255,255,255,1.0)',
            shadowBlur: 10,
            shadowOffsetY: 0
          }
          if (indexSerie !== -1) {
            this.option.baseOption.series.splice(indexSerie+1,0,Object.assign({}, serieComplete));
          }
          else {
            this.option.baseOption.series.push(Object.assign({}, serieComplete));
          }
        });
      },
      () => {},
      () => {
        this.stackService.getWeightChartInstance().setOption(this.option);
        this.stackService.getWeightChartInstance().hideLoading();
      }
    )
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
        serieTmp.name = nameSerie
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          let newDate = new Date(_map.date);
          if(newDate > this.melliDateService.start && newDate < this.melliDateService.end){
            return { name: newDate.toISOString(), value: [newDate.toISOString(), _map.value.replace(/,/ ,'.'), _map.sensorRef], position: _data.position };
          }
        });
        next(serieTmp);
      }
    });
  }

  removeHiveSerie(hive: RucheInterface): void {
    const series = this.option.baseOption.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    let indexSerie;
    let nb = series.length;
    if (series.length > 0) {
      series.forEach(element => {
        indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getWeightChartInstance().setOption(this.option, true);
  }

  addDataToTable(_weight: any[], ref_val: number | null, name: string): void {}

  updateTableData(weight_income_array: any[], obs: any){}

}
