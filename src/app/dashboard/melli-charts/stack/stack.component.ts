import { Component, OnInit } from '@angular/core';
import { UnitService } from '../../service/unit.service';
import { BASE_OPTIONS } from '../charts/BASE_OPTIONS';
import * as echarts from 'echarts';
import { StackMelliChartsService } from './service/stack-melli-charts.service';
import { GraphGlobal } from '../../graph-echarts/GlobalGraph';

@Component({
  selector: 'app-stack',
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.css']
})
export class StackComponent implements OnInit {

  public options: any;
  constructor(private unitService: UnitService,
    private stackService: StackMelliChartsService,
    private graphGlobal: GraphGlobal) { }

  ngOnInit() {
    this.options = BASE_OPTIONS.baseOptionStack;
    this.setOptionForStackChart();
    this.stackService.setEchartInstance(echarts.init(<HTMLDivElement>document.getElementById('graph-stack')));
    console.log(this.stackService.getEchartInstance());
    console.log(this.options);
    this.stackService.getEchartInstance().setOption(this.options);
  }


  setOptionForStackChart() {
    const yAxisWeight = Object.assign({}, BASE_OPTIONS.yAxis);
    console.log(this.options);
    yAxisWeight.name = this.graphGlobal.weight.name;
    yAxisWeight.min = this.graphGlobal.weight.min;
    yAxisWeight.max = this.graphGlobal.weight.max;
    yAxisWeight.interval = this.graphGlobal.weight.interval;
    this.options.yAxis.push(yAxisWeight);
    console.log(this.options);

    const yAxisTemp = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxisTemp.name = this.graphGlobal.temp.name;
    yAxisTemp.min = this.graphGlobal.temp.min;
    yAxisTemp.max = this.graphGlobal.temp.max;
    this.options.yAxis.push(yAxisTemp);
    console.log(this.options);

    const yAxisHum = Object.assign({}, BASE_OPTIONS.yAxis);
    yAxisHum.name = this.graphGlobal.humidity.name;
    yAxisHum.min = this.graphGlobal.humidity.min;
    yAxisHum.max = this.graphGlobal.humidity.max;
    this.options.yAxis.push(yAxisHum);
    console.log(this.options);

    const xAxis = Object.assign({}, BASE_OPTIONS.xAxis);
    xAxis.gridIndex = 0;
    this.options.xAxis.push(xAxis);
    xAxis.gridIndex = 1;
    this.options.xAxis.push(xAxis);
    xAxis.gridIndex = 2;
    this.options.xAxis.push(xAxis);
  }

}
