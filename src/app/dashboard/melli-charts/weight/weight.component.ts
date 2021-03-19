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
              width: '90%'
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

    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-hive')) {
      elt.classList.remove('apiary-group-hive');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-brood');
    }
    elt.classList.add('apiary-group-brood');
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

  getGainWeightDisplay(){
    return this.gainWeightDisplay;
  }

  setOptionForStackChart(): void {
    if (this.option.baseOption.yAxis.length > 0) {
      this.option.baseOption.yAxis = [];
    }
    if (this.option.baseOption.xAxis.length > 0) {
      this.option.baseOption.xAxis = [];
    }
    // Y-Axis Options
    let yAxis = Object.assign({}, BASE_OPTIONS.yAxis[1]);
    if(this.gainWeightDisplay){
      yAxis.name = this.graphGlobal.weight.income_name;
    }
    else{
      yAxis.name = this.graphGlobal.weight.name;
    }
    if(this.gainWeightDisplay || this.normWeightDisplay){
      yAxis.interval = 1;
    }
    else{
      yAxis.interval = 5;
    }

    // ADAPT Y AXIS TO WEIGHT DISPLAY
    yAxis.min = function (value: any) {
      if(value.min < -2){
        let nb = Math.ceil(Math.abs(value.min)) / 2;
        return Math.round(nb) * -2;
      }
      else{
        if(value.min >= 0){
          return 0;
        }
        else{
          return -2;
        }
      }
    };
    yAxis.max = function (value) {
      if(value.max > 5){
        let nb = Math.ceil(value.max) / 5;
        return Math.ceil(nb) * 5;
      }
      else{
        return 5;
      }
    };

    this.option.baseOption.yAxis.push(yAxis);

    // X-Axis Options
    let xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.max = this.melliDateService.getRangeForReqest()[1];
    xAxis.min = this.melliDateService.getRangeForReqest()[0];
    xAxis.axisLabel.formatter = (value: number, index: number) => {
      return this.unitService.getDailyDate(new Date(value));
    };
    this.option.baseOption.tooltip.formatter = (params) => {
      if(params.data.value != undefined){
        return this.getTooltipFormater(params.marker, this.unitService.getDailyDate(params.data.name), new Array(
          {
            name: params.seriesName,
            value: this.unitService.getValRound(params.data.value[1]),
            unit: this.graphGlobal.getUnitBySerieName('Weight')
          }
        ));
      }
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
    let tooltipGlobal;
    if(date === 'Invalid date'){
      tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, this.unitService.getDailyDate(this.ref_Date) );
    }
    else{
      tooltipGlobal = templateHeaderTooltip.replace(/{D}/g, date);
      tooltipGlobal += series.map(_serie => {
        // ADAPT GRAPH POPUP TO WEIGHT TYPE DISPLAY
        if(_serie.name === null){ // MARKLINE TOOLTIP
          return templateValue.replace(/{\*}/g, markerSerie).replace(/{n}/g, '').replace(/{v}/g, '').replace(/{u}/g, '').replace(/{R}/g, '');
        }
        else{ // SERIES TOOLTIP
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
        }
      }).join('');
    }
    return tooltipGlobal;
  }

  loadAllHiveAfterRangeChange(next: Function): void {

    let obs;

    // GET WEIGHT FROM GIVEN DATE
    if(this.ref_Date !== undefined && this.ref_Date !== null){ // IF REF DATE IS NOT UNDEFINED, FIND REF_WEIGHT
      this.melliDateService.setRefDayRangeForRequest( [this.ref_Date, this.ref_Date] );
      if(this.gainWeightDisplay){
        obs = this.stackService.getHiveSelect().map(_hive => {
          return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, this.melliDateService.getRefDayRangeForRequest()) }
        });
      }
      else{
        obs = this.stackService.getHiveSelect().map(_hive => {
          return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightMinByHive(_hive._id, this.melliDateService.getRefDayRangeForRequest()) }
        });
      }
      Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
        _ref_weight => {
          //console.log(_ref_weight);
          this.ref_Values = [];
          //console.log(_ref_weight);
          _ref_weight.forEach((_elt, index) => { // ITERATE THROUGH REF WEIGHT ARRAY
            if(_elt[0] != undefined &&_elt[0].value != undefined){
              this.ref_Values.push(_elt[0].value);
            }
            else{
              console.log('No ref Value for' + obs[index].hive.name + ' at date ' + this.ref_Date);
              this.ref_Values.push(null);
            }
          })
        },
        () => {},
        () => { // WHEN REF_VALUES ARE PUSHED TO ARRAY
            // GET DAILY WEIGHT BETWEEN DATES IN NAVBAR
            if(this.gainWeightDisplay){
              if(this.ref_Date == undefined || this.ref_Date == null){ // IF REF_DATE IS UNDEFINED OR REF_DATE BEFORE START IN CALENDAR RANGE
                obs = this.stackService.getHiveSelect().map(_hive => {
                  return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
                });
              }
              else{ // IF REF_DATE AFTER REF_DATE AFTER START IN CALENDAR RANGE
                obs = this.stackService.getHiveSelect().map(_hive => {
                  return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, [this.ref_Date, this.melliDateService.end]) }
                });
              }

            }
            else{
              obs = this.stackService.getHiveSelect().map(_hive => {
                return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightMinByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
              });
            }
            Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
              _weight => {
                if(this.ref_Date !== undefined && this.ref_Values !== undefined){ // TEST DATE IS NOT UNDEFINED
                  this.ref_Values.forEach((e,i) => {
                    if(e != null){ // TEST IF HIVE HAS REF_VALUE FOR GIVEN DATE
                      //console.log("Date = "+ this.ref_Date + "\nHive name = " + obs[i].hive.name + "\nref_Value = " + e);
                    }
                    else{
                      console.log('No ref Value for' + obs[i].hive.name + ' at date ' + this.ref_Date);
                    }
                  });
                }
                else{
                  if(this.normWeightDisplay){ // CONSOLE THING FOR NORMALIZED AND GAIN DISPLAY
                    console.log('Please enter a reference Date');
                  }
                }
                if(this.normWeightDisplay){ // NEW VALUES FOR NORMALIZED DISPLAY
                  _weight.forEach((w_array: any[],index) => {
                    w_array.forEach((_elt, i) => {
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
                  });
                }
                this.option.baseOption.series = [];
                _weight.forEach((_elt: any[], index) => { // ITERATE THROUGH WEIGHT ARRAY
                  this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
                    serieComplete.itemStyle = {
                      color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
                    };
                    // ADD DATA TO GRAPH
                    let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
                    if(this.gainWeightDisplay){
                      serieComplete.type = 'bar';
                    }
                    else{
                      serieComplete.showSymbol = true;
                      serieComplete.symbol = 'emptyCircle';
                      serieComplete.type = 'line';

                    }
                    if (indexSerie !== -1) {
                      this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
                    } else {
                      this.option.baseOption.series.push(Object.assign({}, serieComplete));
                    }
                  });
                  if(this.gainWeightDisplay){ // IF GAIN WEIGHT DISPLAY THEN TRANSFORM DATA AND ADD ANOTHER DATA SERIES
                    let cumul = 0.0;
                    let lastIndex = _elt.length-1;
                    for(let i=lastIndex; i > -1; i--){
                      if( i !== lastIndex ){ // i > 0
                        cumul += _elt[i].value;
                        _elt[i].value = cumul;
                      }
                      else{ // i = 0
                        _elt[i].value = 0.0;
                      }
                    }
                    this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
                      serieComplete.itemStyle = {
                        color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
                      };
                      // ADD ANOTHER DATA SERIES TO GRAPH
                      let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
                      serieComplete.showSymbol = true;
                      serieComplete.symbol = 'emptyCircle';
                      serieComplete.type = 'line';
                      if (indexSerie !== -1) {
                        this.option.baseOption.series.splice(indexSerie+1,0,Object.assign({}, serieComplete));
                      }
                      else {
                        this.option.baseOption.series.push(Object.assign({}, serieComplete));
                      }
                    });
                  }
                  // ADD MARKLINE
                  if(this.ref_Date !== undefined && this.ref_Date !== null && this.option.baseOption.series[0] !== undefined){
                    this.ref_Date.setHours(1);
                    /*let j7: Date;
                    let j14: Date;
                    if(this.option.baseOption.series[0].data.length > 7){
                      j7 = new Date(this.option.baseOption.series[0].data[6].name);
                    }
                    if(this.option.baseOption.series[0].data.length > 14){
                      j14 = new Date(this.option.baseOption.series[0].data[14].name);
                    }
                    if(this.ref_Date < j14 && j14 !== undefined && j14!== null){
                      this.option.baseOption.series[0].markLine = {data:
                        [
                          [
                            {name: "Ref", xAxis: this.ref_Date, yAxis: this.option.baseOption.yAxis[0].min, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                            {name: "end", xAxis: this.ref_Date, yAxis:this.option.baseOption.yAxis[0].max, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                          ],
                          [
                            {name: "J-7", xAxis: j7, yAxis: this.option.baseOption.yAxis[0].min, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                            {name: "end", xAxis: j7, yAxis:this.option.baseOption.yAxis[0].max, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                          ],
                          [
                            {name: "J-15", xAxis: j14, yAxis: this.option.baseOption.yAxis[0].min, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                            {name: "end", xAxis: j14, yAxis:this.option.baseOption.yAxis[0].max, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                          ]
                        ]
                      }
                    }
                    else if(this.ref_Date < j7 && j7 !== undefined && j7 !== null){
                      this.option.baseOption.series[0].markLine = {data:
                        [
                          [
                            {name: "Ref", xAxis: this.ref_Date, yAxis: this.option.baseOption.yAxis[0].min, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                            {name: "end", xAxis: this.ref_Date, yAxis:this.option.baseOption.yAxis[0].max, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                          ],
                          [
                            {name: "J-7", xAxis: j7, yAxis: this.option.baseOption.yAxis[0].min, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                            {name: "end", xAxis: j7, yAxis:this.option.baseOption.yAxis[0].max, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                          ],
                        ]
                      }
                    }
                    else{*/
                      this.option.baseOption.series[0].markLine = {data:
                        [ {name: "", xAxis: this.ref_Date,lineStyle: {normal: { type:'dashed',color: 'red' } }, label:{normal:{show:false } } } ]
                      }
                    //}
                  }
                  this.updateTableData(_weight, obs);
                })
              },
              () => {},
              () => {
                next(this.option);
                this.stackService.getWeightChartInstance().hideLoading();
              }
            )
        }
      );
    }
    else{ // IF DAILY DATE IS UNDEFINED
      // GET DAILY WEIGHT BETWEEN DATES IN NAVBAR
      if(this.gainWeightDisplay){
        if(this.ref_Date == undefined || this.ref_Date == null){ // IF REF_DATE IS UNDEFINED OR REF_DATE BEFORE START IN CALENDAR RANGE
          obs = this.stackService.getHiveSelect().map(_hive => {
            return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
          });
        }
        else{ // IF REF_DATE AFTER REF_DATE AFTER START IN CALENDAR RANGE
          obs = this.stackService.getHiveSelect().map(_hive => {
            return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightIncomeGainByHive(_hive._id, [this.ref_Date, this.melliDateService.end]) }
          });
        }

      }
      else{
        obs = this.stackService.getHiveSelect().map(_hive => {
          return { hive: _hive, name: _hive.name, obs: this.dailyWService.getWeightMinByHive(_hive._id, this.melliDateService.getRangeForReqest()) }
        });
      }
      Observable.forkJoin(obs.map(_elt => _elt.obs)).subscribe(
        _weight => {
          if(this.ref_Date !== undefined && this.ref_Values !== undefined){ // TEST DATE IS NOT UNDEFINED
            this.ref_Values.forEach((e,i) => {
              if(e != null){ // TEST IF HIVE HAS REF_VALUE FOR GIVEN DATE
                //console.log("Date = "+ this.ref_Date + "\nHive name = " + obs[i].hive.name + "\nref_Value = " + e);
              }
              else{
                console.log('No ref Value for' + obs[i].hive.name + ' at date ' + this.ref_Date);
              }
            });
          }
          else{
            if(this.normWeightDisplay){ // CONSOLE THING FOR NORMALIZED AND GAIN DISPLAY
              console.log('Please enter a reference Date');
            }
          }
          if(this.normWeightDisplay){ // NEW VALUES FOR NORMALIZED DISPLAY
            _weight.forEach((w_array: any[],index) => {
              w_array.forEach((_elt, i) => {
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
            });
          }
          this.option.baseOption.series = [];
          _weight.forEach((_elt: any[], index) => { // ITERATE THROUGH WEIGHT ARRAY
            this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
              serieComplete.itemStyle = {
                color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
              };
              // ADD DATA TO GRAPH
              let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
              if(this.gainWeightDisplay){
                serieComplete.type = 'bar';
              }
              else{
                serieComplete.showSymbol = true;
                serieComplete.symbol = 'emptyCircle';
                serieComplete.type = 'line';

              }
              if (indexSerie !== -1) {
                this.option.baseOption.series[indexSerie] = Object.assign({}, serieComplete);
              } else {
                this.option.baseOption.series.push(Object.assign({}, serieComplete));
              }
            });
            if(this.gainWeightDisplay){ // IF GAIN WEIGHT DISPLAY THEN TRANSFORM DATA AND ADD ANOTHER DATA SERIES
              let cumul = 0.0;
              let lastIndex = _elt.length-1;
              for(let i=lastIndex; i > -1; i--){
                if( i !== lastIndex ){ // i > 0
                  cumul += _elt[i].value;
                  _elt[i].value = cumul;
                }
                else{ // i = 0
                  _elt[i].value = 0.0;
                }
              }
              this.getSerieByData(<any>_elt, obs[index].name, (serieComplete: any) => {
                serieComplete.itemStyle = {
                  color: this.stackService.getColorByIndex(this.getHiveIndex(obs[index].hive), obs[index].hive)
                };
                // ADD ANOTHER DATA SERIES TO GRAPH
                let indexSerie = this.option.baseOption.series.map(_serie => _serie.name).indexOf(serieComplete.name);
                serieComplete.showSymbol = true;
                serieComplete.symbol = 'emptyCircle';
                serieComplete.type = 'line';
                if (indexSerie !== -1) {
                  this.option.baseOption.series.splice(indexSerie+1,0,Object.assign({}, serieComplete));
                }
                else {
                  this.option.baseOption.series.push(Object.assign({}, serieComplete));
                }
              });
            }
            // ADD MARKLINE
            if(this.ref_Date !== undefined && this.ref_Date !== null && this.option.baseOption.series[0] !== undefined){
              this.ref_Date.setHours(1);

                this.option.baseOption.series[0].markLine = {data:
                  [
                    [
                      {name: "", xAxis: this.ref_Date, yAxis: this.option.baseOption.yAxis[0].min, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                      {name: "end", xAxis: this.ref_Date, yAxis:this.option.baseOption.yAxis[0].max, lineStyle: {normal: { type:'dashed',color: 'red'}} },
                    ],
                  ]
                }
            }
            this.updateTableData(_weight, obs);
          })
        },
        () => {},
        () => {
          next(this.option);
          this.stackService.getWeightChartInstance().hideLoading();
        }
      )
    }
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
          let newDate = new Date(_map.date);
          newDate.setHours(1);
          if(newDate > this.melliDateService.start && newDate < this.melliDateService.end){
            return { name: newDate.toISOString(), value: [newDate.toISOString(), _map.value, _map.sensorRef] };
          }
        });
        next(serieTmp);
      }
    });
  }

  removeHiveSerie(hive: RucheInterface): void {
    /*let option = this.stackService.getWeightChartInstance().getOption();
    const series = option.series.filter(_filter => _filter.name.indexOf(hive.name) !== -1);
    if (series.length > 0) {
      series.forEach(element => {
        const indexSerie = option.series.map(_serie => _serie.name).indexOf(element.name);
        this.option.baseOption.series.splice(indexSerie, 1);
        option.series.splice(indexSerie, 1);
      });
    }
    this.stackService.getWeightChartInstance().setOption(option, true);*/
    this.disposeGraph();
    this.initGraph();
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
      document.getElementById("ref_date").style.display = "flex";
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
      case 'raw-weight': // SHOW RAW WEIGHT GRAPH
        this.changeRawWeight(true);
        this.changeNormWeight(false);
        this.changeGainWeight(false);
        this.disposeGraph();
        this.initGraph();
        break;
      case 'norm-weight': // SHOW NORMALIZED WEIGHT GRAPH
        this.changeRawWeight(false);
        this.changeNormWeight(true);
        this.changeGainWeight(false);
        this.disposeGraph();
        this.initGraph();
        break;
      case 'gain-weight': // SHOW WEIGHT GAIN GRAPH
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
    (<HTMLInputElement>document.getElementsByClassName('weight_ref_date')[0]).value = this.unitService.getDailyDate(this.ref_Date);
    this.disposeGraph();
    this.initGraph();
  }

  deleteDate(){
    (<HTMLInputElement>document.getElementsByClassName('weight_ref_date')[0]).value = "";
    this.ref_Date = null;
    this.disposeGraph();
    this.initGraph();
  }

  updateTableData(weight_income_array: any[], obs: any){
    let table = document.getElementById("weight-table").getElementsByTagName("table")[0];
    let dateCells = document.getElementsByClassName('date-head');
    if(this.ref_Date !== undefined && this.ref_Date !== null){
      Array.from(dateCells).forEach(e => {
        e.textContent = this.unitService.getDailyDate(this.ref_Date);
      });
    }
    else{
      Array.from(dateCells).forEach(e => {
        e.textContent = this.unitService.getDailyDate(this.melliDateService.start);
      });
    }
    let tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    /**
     * GET DATE FROM REF_DATE TO END DATE IN CALENDAR
    */

    weight_income_array.forEach((e, index) => {
          let cumul;
          let row = tbody.insertRow();
          let cell1 = row.insertCell(); // HIVE CELL
          cell1.innerHTML = obs[index].hive.name;
          let cell2 = row.insertCell(); // T0 CELL
          let cell3 = row.insertCell(); // 7DAYS CELL
          let cell4 = row.insertCell(); // 15DAYS CELL
          if(this.gainWeightDisplay){
            if(e.length > 7){
              cell3.innerHTML = (e[0].value - e[6].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              if(e.length > 14){
                cell4.innerHTML = (e[0].value - e[14].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              }
            }
            cell2.innerHTML = (e[0].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
          }
          else{
            if( this.ref_Values !== undefined && this.ref_Values[index] !== undefined && this.rawWeightDisplay){
              cell2.innerHTML = this.ref_Values[index].toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
            }
            else{
              cell2.innerHTML = "";
            }
            if(e.length > 7){
              cell3.innerHTML = parseFloat(e[6].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              if(e.length > 15){
                cell4.innerHTML = parseFloat(e[14].value).toFixed(2) + ' ' + this.graphGlobal.weight.unitW;
              }
            }
          }
    });
  }

  ngOnDestroy(): void {
  }



}
