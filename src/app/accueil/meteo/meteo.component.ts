import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { MeteoService } from './Service/MeteoService';
import * as echarts from '../../../assets/echarts';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { ECharts, EChartOption} from 'echarts';
//import * as echarts from 'node_modules/echarts/dist/echarts.min.js'
import { CalendrierService } from './Service/calendrier.service';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent implements OnInit {

  constructor(public rucherService : RucherService, public meteoService : MeteoService, private login : UserloggedService, public calendrier : CalendrierService) {
  }

  calendrierInit : any = null;
  meteoSelect : any[];
  username: string;
  
  ngOnInit() {
    this.username = this.login.currentUser().username;
  }
  

  onSelectRucher($event){
    console.log(this.rucherService.rucher);
    this.meteoService.getWeather(this.rucherService.rucher.ville);
  }
}