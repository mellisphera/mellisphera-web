import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as echarts from 'echarts';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';
import { DailyRecordsWService } from '../../service/api/daily-records-w.service';
import { RucheService } from '../../service/api/ruche.service';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import { SERIES } from '../charts/SERIES';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css'],
  providers:[DatePipe]
})
export class WeightComponent implements OnInit {

  private option: {
    baseOption: any,
    media: any[]
  };

  public ref_Date: Date;
  public ref_Values: Number[];
  public rawWeightDisplay: boolean = false;
  public normWeightDisplay: boolean = false;
  public gainWeightDisplay: boolean = false;

  constructor(
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal,
    private dailyWService: DailyRecordsWService,
    private melliDateService: MelliChartsDateService,
    private rucheService: RucheService,
    private unitService: UnitService,
    private translateService: TranslateService,
    private renderer: Renderer2,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.option = {
      // Base Option for ECharts
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
    this.changeRawWeight(true);
    this.initGraph();
  }

  initGraph(){
    this.stackService.setWeightChartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-weight')));
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

  disposeGraph(){
    this.stackService.getWeightChartInstance().clear();
  }

  setOptionForStackChart(): void {
    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }
    // Y-Axis Options
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxis.name = this.graphGlobal.weight.name;
    // ADAPT Y AXIS TO WEIGHT DISPLAY
    if(this.rawWeightDisplay){
      yAxis.min = 0;
      yAxis.max = 100;
    }
    else if(this.normWeightDisplay){
      yAxis.min = 0;
      yAxis.max = 5;
    }
    else if(this.gainWeightDisplay){
      yAxis.min = -70;
      yAxis.max = 70;
    }
    this.option.baseOption.yAxis.push(yAxis);

    // X-Axis Options
    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.option.baseOption.tooltip.formatter = (params) => {
      return params.map((_elt, index) => {
        return this.getTooltipFormater(_elt.marker, (index === 0 ? this.unitService.getDailyDate(_elt.data.name) : ''), new Array(
          {
            name: _elt.seriesName,
            value: this.unitService.getValRound(_elt.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName('Weight')
          }
        ));
      }).join('');
   }
    this.option.baseOption.xAxis.push(xAxis);
    // Add Options to EChart graph
    this.stackService.getWeightChartInstance().setOption(this.option);
  }

  onResize(event: any) {
    this.stackService.getWeightChartInstance().resize({
      width: 'auto',
      height: 'auto'
    });
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
      // ADAPT GRAPH POPUP TO WEIGHT TYPE DISPLAY
      if(this.normWeightDisplay){
        return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, 'x'+_serie.value).replace(/{u}/g, '').replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
      }
      else if(this.gainWeightDisplay){
        if(_serie.value >= 0){
          return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, '+'+_serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
        }
        else{
          return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
        }
      }
      else{
        return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, _serie.name.split('|')[0]).replace(/{v}/g, _serie.value).replace(/{u}/g, _serie.unit).replace(/{R}/g, ' - ' +  _serie.name.split('|')[1]);
      }
    }).join('');

    return tooltipGlobal;
  }

  loadAllHiveAfterRangeChange(next: Function): void {

    let obs;

    // GET WEIGHT FROM GIVEN DATE
    if(this.ref_Date != undefined){ // IF REF DATE IS NOT UNDEFINED, FIND REF_WEIGHT
      this.melliDateService.setRefDayRangeForRequest( [this.ref_Date, this.ref_Date] );
      obs = this.stackService.getHiveSelect().map(_hive => {
        return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightByHive(_hive._id, this.melliDateService.getRefDayRangeForRequest()) }
      });
      Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
        _ref_weight => {
          this.ref_Values = [];
          _ref_weight.forEach((_elt, index) => { // ITERATE THROUGH REF WEIGHT ARRAY
            if(_elt[0].value != undefined){
              this.ref_Values.push(_elt[0].value);
            }
            else{
              console.log('No ref Value for' + obs[index].hive.name + ' at date ' + this.ref_Date);
            }
          })
        },
        () => {},
        () => {}
      );
    }

    // GET DAILY WEIGHT BETWEEN DATES IN NAVBAR
    obs = this.stackService.getHiveSelect().map(_hive => {
      return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
    });
    Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
      _weight => {
        if(this.ref_Date != undefined){ // TEST DATE IS NOT UNDEFINED
          this.ref_Values.forEach((e,i) => {
            if(e != null){ // TEST IF HIVE HAS REF_VALUE FOR GIVEN DATE
              console.log("Date = "+ this.ref_Date + "\nHive name = " + obs[i].hive.name + "\nref_Value = " + e);
            }
            else{
              console.log('No ref Value for' + obs[i].hive.name + ' at date ' + this.ref_Date);
            }
          });
        }
        else{
          if(this.normWeightDisplay || this.gainWeightDisplay){ // CONSOLE THING FOR NORMALIZED AND GAIN DISPLAY
            console.log('Please enter a reference Date');
          }
        }
        _weight.forEach((w_array: any[],index) => {
          if(this.normWeightDisplay){ // NEW VALUES FOR NORMALIZED DISPLAY
            w_array.forEach((_elt) => {
              if(this.ref_Values != undefined){
                if(this.ref_Values[index] != undefined){ // TEST IF HIVE HAS REF_VALUE
                  let value: any = this.ref_Values[index];
                  _elt.value = (_elt.value / value).toFixed(2);
                }
                else{ // DEFAULT VALUE IF NO REF VALUE
                  _elt.value = 0.0;
                }
              }
              else{ // DEFAULT VALUE IF NO REF DATE
                _elt.value = 0.0;
              }

            });
          }
          if(this.gainWeightDisplay){ // NEW VALUES FOR GAINED DISPLAY
            w_array.forEach((_elt) => {
              if(this.ref_Values != undefined){
                if(this.ref_Values[index] != undefined){
                  let value: any = this.ref_Values[index];
                  _elt.value = (_elt.value - value).toFixed(2);
                }
                else{ // DEFAULT VALUE IF NO REF VALUE
                  _elt.value = 0.0;
                }
              }
              else{ // DEFAULT VALUE IF NO REF DATE
                _elt.value = 0.0;
              }
            });
          }
        })
        _weight.forEach((_elt, index) => { // ITERATE THROUGH WEIGHT ARRAY
          this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
            serieComplete.itemStyle = {
              color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
            };
            // ADD DATA TO GRAPH
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
        serieTmp.name = nameSerie + ' | ' + _data.sensorRef;
        serieTmp.data = data.filter(_filter => _filter.sensorRef === _data.sensorRef).map(_map => {
          return { name: _map.date, value: [_map.date, _map.value, _map.sensorRef] };
        });
        next(serieTmp);
      }
    });
  }

  removeHiveSerie(hive: RucheInterface): void {
    let option = this.stackService.getWeightChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getWeightChartInstance().setOption(option, true);
  }

  // RELOAD GRAPH WHEN ADDING NEW HIVE
  loadDataByHive(hive: RucheInterface): void {
    this.disposeGraph();
    this.initGraph();
  }

  // SET DISPLAY RAW WEIGHT DATA
  changeRawWeight(bool :boolean){
    if(bool){
      this.rawWeightDisplay = true;
      document.getElementById("raw-weight-title").style.display = "block";
      (<HTMLInputElement> document.getElementById("raw-check")).disabled = true;
      (<HTMLInputElement> document.getElementById("raw-check")).checked = true;
      document.getElementById("ref_date").style.display = "none";
    }
    else{
      this.rawWeightDisplay = false;
      document.getElementById("raw-weight-title").style.display = "none";
      (<HTMLInputElement> document.getElementById("raw-check")).disabled = false;
      (<HTMLInputElement> document.getElementById("raw-check")).checked = false;
    }
  }

  // SET DISPLAY NORMALIZED WEIGHT DATA
  changeNormWeight(bool :boolean){
    if(bool){
      this.normWeightDisplay = true;
      document.getElementById("norm-weight-title").style.display = "block";
      (<HTMLInputElement> document.getElementById("norm-check")).disabled = true;
      (<HTMLInputElement> document.getElementById("norm-check")).checked = true;
      document.getElementById("ref_date").style.display = "flex";
    }
    else{
      this.normWeightDisplay = false;
      document.getElementById("norm-weight-title").style.display = "none";
      (<HTMLInputElement> document.getElementById("norm-check")).disabled = false;
      (<HTMLInputElement> document.getElementById("norm-check")).checked = false;
    }
  }

  // SET DISPLAY GAIN WEIGHT DATA
  changeGainWeight(bool :boolean){
    if(bool){
      this.gainWeightDisplay = true;
      document.getElementById("gain-weight-title").style.display = "block";
      (<HTMLInputElement> document.getElementById("gain-check")).disabled = true;
      (<HTMLInputElement> document.getElementById("gain-check")).checked = true;
      document.getElementById("ref_date").style.display = "flex";
    }
    else{
      this.gainWeightDisplay = false;
      document.getElementById("gain-weight-title").style.display = "none";
      (<HTMLInputElement> document.getElementById("gain-check")).disabled = false;
      (<HTMLInputElement> document.getElementById("gain-check")).checked = false;
    }
  }

  showGraph(name:string){ // CHANGE GRAPH ON BUTTON CLICK
    switch(name){
      case 'raw-weight':
        this.changeRawWeight(true);
        this.changeNormWeight(false);
        this.changeGainWeight(false);
        this.disposeGraph();
        this.initGraph();
        break;
      case 'norm-weight':
        this.changeRawWeight(false);
        this.changeNormWeight(true);
        this.changeGainWeight(false);
        this.disposeGraph();
        this.initGraph();
        break;
      case 'gain-weight':
        this.changeRawWeight(false);
        this.changeNormWeight(false);
        this.changeGainWeight(true);
        this.disposeGraph();
        this.initGraph();
        break;
      default:
        break;
    }
  }

  // FUNCTION TRIGGERED WHEN REF DATE IS CHOSEN
  refDate(){
    (<HTMLInputElement>document.getElementsByClassName('weight_ref_date')[0]).value = this.datePipe.transform(this.ref_Date, 'dd/MM/yyyy');
    this.disposeGraph();
    this.initGraph();
  }

  ngOnDestroy(): void {
  }

}
