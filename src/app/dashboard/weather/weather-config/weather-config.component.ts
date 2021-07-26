import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { WeatherOptionService } from '../service/weather-option.service';
import { WeatherSource } from '../../../_model/weatherSource';
import { WeatherConfig } from '../../../_model/weatherConfig';
import { UserloggedService } from '../../../userlogged.service';
import { CapteurService } from '../../service/api/capteur.service';
import { CapteurInterface } from '../../../_model/capteur';

@Component({
  selector: 'app-weather-config',
  templateUrl: './weather-config.component.html',
  styleUrls: ['./weather-config.component.css']
})
export class WeatherConfigComponent implements OnInit {

  public wS: WeatherSource = {
    _id: null,
    apiaryId: null,
    apiaryName: null,
    userId: null,
    userName: null,
    begin: new Date(),
    end: null,
    source: "WeatherSource",
    config: null,
  }

  public wG: WeatherConfig = {
    ref: null,
    active: true,
    station_id: null,
    key: null,
    secret: null
  }

  public captApiary: CapteurInterface[];
  public captByType: CapteurInterface[];

  constructor(
    public w_o_service: WeatherOptionService,
    private userService: UserloggedService,
    private captService: CapteurService,
  ) { }

  ngOnInit() {
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-weather-records')) {
      elt.classList.remove('apiary-group-weather-records');
    } 
    elt.classList.add('apiary-group-weather-config');

    this.captService.getCapteursByApiaryId(this.w_o_service.getApiaryConfig()._id).subscribe(
      _captArray => { this.captApiary = _captArray.filter(_c => !_c.sensorRef.includes("_removed")) },
      () => {},
      () => {}
    );

    (<HTMLInputElement>document.getElementById("w-begin-h")).value = this.wS.begin.getHours().toLocaleString('en-US', { minimumIntegerDigits: 2 });
    (<HTMLInputElement>document.getElementById("w-begin-m")).value = this.wS.begin.getMinutes().toLocaleString('en-US', { minimumIntegerDigits: 2 });
  }

  changeApiary(apiary: RucherModel){}

  onSourceChange(){
    let select = <HTMLSelectElement>document.getElementById("sources-select");
    this.wS.source = select.value;
    console.log(this.wS.source);
    switch(this.wS.source){
      case 'WSTH':
        this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '42' || _c.sensorRef.substr(0,2) === '56' );
        break;
      case 'T2':
        this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '41' || _c.sensorRef.substr(0,2) === '47' );
        break;
      case 'Scale':
        this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '43' || _c.sensorRef.substr(0,2) === '49' || _c.sensorRef.substr(0,2) === '57' || _c.sensorRef.substr(0,2) === '58' );
        break;
      case 'WeatherSource':
      case 'Station Davis':
      default:
        break;
    }
  }

  beginDate(){
    console.log(this.wS.begin);
    this.wS.begin = new Date( (<any>this.wS.begin)._d);
  }

  beginHours(){
    let input = <HTMLInputElement>document.getElementById("w-begin-h");
    if(parseInt(input.value) > 23){
      input.value = '23';
      this.wS.begin.setHours(23);
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.wS.begin.setHours(0);
    }
    else{
      this.wS.begin.setHours( parseInt(input.value) );
      if(parseInt(input.value) < 10){
        input.value = '0' + parseInt(input.value);
      } 
    }
  }

  beginMinutes(){
    let input = <HTMLInputElement>document.getElementById("w-begin-m");
    if(parseInt(input.value) > 59){
      input.value = '59';
      this.wS.begin.setMinutes(59);
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.wS.begin.setMinutes(0);
    }
    else{
      this.wS.begin.setMinutes( parseInt(input.value) );
      if(parseInt(input.value) < 10){
        input.value = '0' + parseInt(input.value);
      } 
    }
  }

}
