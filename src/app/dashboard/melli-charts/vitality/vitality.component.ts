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

@Component({
  selector: 'app-vitality',
  templateUrl: './vitality.component.html',
  styleUrls: ['./vitality.component.css']
})
export class VitalityComponent implements OnInit, OnDestroy {


  private option: any;
  constructor(private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private dailyThService: DailyRecordService,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private unitService: UnitService) {
    this.option = Object.assign({}, BASE_OPTIONS.baseOptionHourly);
  }

  ngOnInit() {
    this.stackService.setBroodChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-brood')));
    this.setOptionForStackChart();
  }
  setOptionForStackChart(): void {
    if (this.option.yAxis.length > 0) {
      this.option.yAxis = [];
    }
    if (this.option.xAxis.length > 0) {
      this.option.xAxis = [];
    }
    console.log(this.option);
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxis.name = 'Brood';
    yAxis.min = 0;
    yAxis.max = 100;
    this.option.yAxis.push(yAxis);

    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getHourlyDate(new Date(value));
    };
    this.option.tooltip.formatter = (params) => {
      return params.map(_elt => {
       return this.getTooltipFormater(_elt.marker, this.unitService.getHourlyDate(_elt.data.name),new Array(
         {
           name: _elt.seriesName,
           value: _elt.data.value[1],
           unit: this.graphGlobal.getUnitBySerieName('Brood')
         }
       ));
     }).join('<br/>');
   }
    this.option.xAxis.push(xAxis);
    this.stackService.getBroodChartInstance().setOption(this.option);
  }

  onResize(event: any) {
    this.stackService.getBroodChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt.id === hive.id);
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
        this.option.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getBroodChartInstance().setOption(option, true);
  }


  loadAllHiveAfterRangeChange(next: Function): void{
    const obs = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.dailyThService.getBroodByHive(_hive.id, this.melliDateService.getRangeForReqest())}
    });

    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _broods => {
        _broods.forEach((_elt, index) => {
          this.getSerieByData(_elt, obs[index].name, (serieComplete: any) => {
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
            };
            const indexSerie = this.option.series.map(_serie => _serie.name).indexOf(serieComplete.name);
            this.option.series[indexSerie] = Object.assign({}, serieComplete);
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
    this.dailyThService.getBroodByHive(hive.id, this.melliDateService.getRangeForReqest()).subscribe(
      _brood => {
        this.getSerieByData(_brood, hive.name, (serieComplete: any) => {
          serieComplete.itemStyle = {
            color: this.stackService.getColorByIndex(this.getHiveIndex(hive), hive)
          };
          this.option.series.push(serieComplete);
          this.stackService.getBroodChartInstance().setOption(this.option);
        })
      },
      () => {},
      () => {
        this.stackService.getBroodChartInstance().hideLoading();  
      }
    )
  }

  getTooltipFormater(markerSerie: string, date: string, series: Array<any>): string {
    let templateHeaderTooltip = '{*} {D} </br>';
    let templateValue = '{n} : {v} {u}';
    let tooltipGlobal = templateHeaderTooltip.replace(/{\*}/g, markerSerie).replace(/{D}/g, date);
    tooltipGlobal += series.map(_serie => {
      return templateValue.replace(/{n}/g, _serie.name).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit);
    }).join('</br>');

    return tooltipGlobal;
  }

  ngOnDestroy(): void {
   // this.stackService.cleanSlectedHives();
  }
}
