import { Component, OnInit, AfterViewInit} from '@angular/core';
import { MeteoService } from './Service/MeteoService';
import * as echarts from '../../../../assets/echarts';
import { UserloggedService } from '../../../userlogged.service';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { ECharts, EChartOption} from 'echarts';
/*import * as echarts from 'node_modules/echarts/dist/echarts.min.js'*/
import { CalendrierService } from './Service/calendrier.service';

@Component({
  selector: 'app-calendrier',
  templateUrl: './calendrier.component.html',
  styleUrls: ['./calendrier.component.scss']
})
export class CalendrierComponent implements OnInit{

  data : any = [
    ["2018-10-02","01d",15,15],
    ["2018-10-03","01d",15,15],
    ["2018-10-04","01d",15,15],
    ["2018-10-05","01d",15,15],
    ["2018-10-06","01d",15,15]
  ]
  constructor(public rucherService : RucherService, public meteoService : MeteoService, private login : UserloggedService, public calendrier : CalendrierService) {
  }

  calendrierInit : any = null;
  meteoSelect : any[];
  username: string;
  
  ngOnInit() {
    this.username = this.login.currentUser().username;
    //this.meteoSelect = this.meteoService.meteo[this.rucherService.ruchers[0].id]; 
  }
  
  /* affiche le calendrier avec le tableau récupèrer */

  showCalendar(){
    if(this.calendrierInit != null){
      this.calendrierInit.dispose("#main");
      this.calendrierInit = null;
    }
    this.calendrierInit = echarts.init(document.getElementById('main'));
    this.calendrier.options.series[0].data = this.meteoService.arrayMeteo;
    console.log(this.calendrier.options);
    this.calendrierInit.setOption(this.calendrier.options);
  }


  onSelectRucher($event){
    // this.idRucher = id.target.value;
    //this.meteoService.arrayMeteo = [];
    console.log(this.rucherService.rucher);
    this.meteoService.getWeather(this.rucherService.rucher.id,this.rucherService.rucher.ville);
    console.log(this.data);
    this.meteoService.meteoObs.subscribe(
      ()=>{},
      ()=>{},
      ()=>{
        console.log(this.meteoService.arrayMeteo);
        this.showCalendar();
      }
    );


  }

}
