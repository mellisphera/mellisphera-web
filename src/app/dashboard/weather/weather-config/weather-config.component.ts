import { Component, OnInit } from '@angular/core';
import { RucherModel } from '../../../_model/rucher-model';
import { WeatherOptionService } from '../service/weather-option.service';
import { WeatherSource } from '../../../_model/weatherSource';
import { UserloggedService } from '../../../userlogged.service';
import { CapteurService } from '../../service/api/capteur.service';
import { CapteurInterface } from '../../../_model/capteur';
import { WeatherSrcsService } from '../../service/api/weather-srcs.service';
import { WeatherDateService } from '../service/weather-date.service';
import { UnitService } from '../../service/unit.service';
import { NotifierService } from 'angular-notifier';
import { TranslateService } from '@ngx-translate/core';
import { fakeAsync } from '@angular/core/testing';

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
    start: new Date(),
    end: null,
    sourceId: "WeatherSource",
    sourceType: null,
    stationId: null,
    key: null,
    secret: null
  }

  private edit_capt : CapteurInterface = {
    _id: null,
    sensorRef: null,
    name: null,
    model: null,
    type: null,
    hiveId: null,
    apiaryId: null,
    userId: null,
    dataLastReceived: null,
    deviceLocation: null,
    start: null,
    createDate: null,
    sensorTime: null,
    sensorBat: null
  }

  public captApiary: CapteurInterface[];
  public captByType: CapteurInterface[];

  public weatherSrcsByApiary: WeatherSource[];

  private edit: boolean = false;

  public sourceType: string;

  constructor(
    public w_o_service: WeatherOptionService,
    private w_d_service: WeatherDateService,
    private w_srcs_service: WeatherSrcsService,
    private userService: UserloggedService,
    private captService: CapteurService,
    public unitService: UnitService,
    private notify: NotifierService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-weather-records')) {
      elt.classList.remove('apiary-group-weather-records');
    } 
    elt.classList.add('apiary-group-weather-config');

    (<HTMLInputElement>document.getElementById("w-begin-h")).value = this.wS.start.getHours().toLocaleString('en-US',{minimumIntegerDigits : 2});;
    (<HTMLInputElement>document.getElementById("w-begin-m")).value = this.wS.start.getMinutes().toLocaleString('en-US',{minimumIntegerDigits : 2});;

    this.captService.getCapteursByApiaryId(this.w_o_service.getApiaryConfig()._id).subscribe(
      _captArray => { this.captApiary = _captArray.filter(_c => !_c.sensorRef.includes("_removed")) },
      () => {},
      () => {}
    );

    this.w_srcs_service.requestApiaryWeatherSrcsWithDateBetween(this.w_o_service.getApiaryConfig()._id, this.w_d_service.getRangeForRequest()).subscribe(
      _wsrcs => { this.weatherSrcsByApiary = [..._wsrcs]; }, () => {}, () => {}
    );

    this.wS = {
      _id: null,
      apiaryId: this.w_o_service.getApiaryConfig()._id,
      apiaryName: this.w_o_service.getApiaryConfig().name,
      userId: this.userService.getIdUserLoged(),
      userName: this.userService.getUser(),
      start: new Date(),
      end: null,
      sourceId: "WeatherSource",
      sourceType: null,
      stationId: null,
      key: null,
      secret: null,
    };

  }

  changeApiary(apiary: RucherModel){
    this.captService.getCapteursByApiaryId(apiary._id).subscribe(
      _captArray => { this.captApiary = [..._captArray]/*.filter(_c => !_c.sensorRef.includes("_removed"))*/ },
      () => {},
      () => {}
    );

    this.w_srcs_service.requestApiaryWeatherSrcsWithDateBetween(apiary._id, this.w_d_service.getRangeForRequest()).subscribe(
      _wsrcs => { this.weatherSrcsByApiary = [..._wsrcs]; }, () => {}, () => {}
    );

    this.wS = {
      _id: null,
      apiaryId: apiary._id,
      apiaryName: apiary.name,
      userId: this.userService.getIdUserLoged(),
      userName: this.userService.getUser(),
      start: new Date(),
      end: null,
      sourceId: "WeatherSource",
      sourceType: null,
      stationId: null,
      key: null,
      secret: null,
    };
    
  }

  reset(){
    this.edit = false;

    this.wS = {
      _id: null,
      apiaryId: this.w_o_service.getApiaryConfig()._id,
      apiaryName: this.w_o_service.getApiaryConfig().name,
      userId: this.userService.getIdUserLoged(),
      userName: this.userService.getUser(),
      start: new Date(),
      end: null,
      sourceId: null,
      sourceType: null,
      stationId: null,
      key: null,
      secret: null,
    };

    (<HTMLElement>document.getElementById("newSourceModalLabel")).textContent = this.translate.instant('WEATHER.CONFIG.NEW_SOURCE');
    (<HTMLSpanElement>document.getElementById("source-save-text")).textContent = this.translate.instant('WEATHER.CONFIG.BTN_ADD');

    let select = <HTMLSelectElement>document.getElementById("sources-select");
    select.selectedIndex = 0;
    select.disabled = false;
    (<HTMLInputElement>document.getElementById("w-begin-h")).value = this.wS.start.getHours().toLocaleString('en-US',{minimumIntegerDigits : 2});
    (<HTMLInputElement>document.getElementById("w-begin-m")).value = this.wS.start.getMinutes().toLocaleString('en-US',{minimumIntegerDigits : 2});

    (<HTMLInputElement>document.getElementById("w-end-h")).value = "";
    (<HTMLInputElement>document.getElementById("w-end-m")).value = "";

    this.sourceType = "WeatherSource";

    //this.disableEnd();
  }

  onSourceChange(){
    let select = <HTMLSelectElement>document.getElementById("sources-select");
    this.sourceType = select.value;
    this.wS.sourceType = select.value;
    setTimeout(() => {
      let selectSource = <HTMLSelectElement>document.getElementById("sensors-select");
      switch(select.value){
        case 'TH':
          this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '42' || _c.sensorRef.substr(0,2) === '56' );
          selectSource.disabled = false;
          break;
        case 'T2':
          this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '41' || _c.sensorRef.substr(0,2) === '47' );
          selectSource.disabled = false;
          break;
        case 'Scale':
          this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '43' || _c.sensorRef.substr(0,2) === '49' || _c.sensorRef.substr(0,2) === '57' || _c.sensorRef.substr(0,2) === '58' );
          selectSource.disabled = false;
          break;
        case 'Hub':
          this.captByType = this.captApiary.filter(_c => _c.sensorRef.substr(0,2) === '54');
          selectSource.disabled = false;
          break;
        case 'Station Davis':
        default:
          break;
      }
    }, 200);
    
  }

  sensorChange(){
    let select = <HTMLSelectElement>document.getElementById("sensors-select");
    this.wS.sourceId = select.value;
  }

  stationIdChange(evt: Event){
    this.wS.sourceId = (<HTMLInputElement>evt.target).value;
  }

  keyChange(evt: Event){
    this.wS.key = (<HTMLInputElement>evt.target).value;
  }

  secretChange(evt: Event){
    this.wS.secret = (<HTMLInputElement>evt.target).value;
  }

  beginDate(){
    //console.log(this.wS.start);
    this.wS.start = new Date( (<any>this.wS.start)._d);
  }
  beginHours(){
    let input = <HTMLInputElement>document.getElementById("w-begin-h");
    if(parseInt(input.value) > 23){
      input.value = '23';
      this.wS.start.setHours(23);
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.wS.start.setHours(0);
    }
    else{
      this.wS.start.setHours( parseInt(input.value) );
      if(parseInt(input.value) < 10){
        input.value = '0' + parseInt(input.value);
      } 
    }
  }
  beginMinutes(){
    let input = <HTMLInputElement>document.getElementById("w-begin-m");
    if(parseInt(input.value) > 59){
      input.value = '59';
      this.wS.start.setMinutes(59);
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.wS.start.setMinutes(0);
    }
    else{
      this.wS.start.setMinutes( parseInt(input.value) );
      if(parseInt(input.value) < 10){
        input.value = '0' + parseInt(input.value);
      } 
    }
  }

  endCheckbox(){
    let checkbox = <HTMLInputElement>document.getElementById("end-checkbox");
    if(checkbox.checked){
        this.enableEnd()
    }
    else{
        this.disableEnd()
    }
  }
  enableEnd(){
    let checkbox = <HTMLInputElement>document.getElementById("end-checkbox");
    let div = <HTMLDivElement>document.getElementById("end-div");
    let text = <HTMLDivElement>document.getElementById("end-field");
    checkbox.checked = true;
    (<HTMLInputElement>document.getElementById("end-date")).disabled = false;
    (<HTMLInputElement>document.getElementById("w-end-h")).disabled = false;
    (<HTMLInputElement>document.getElementById("w-end-m")).disabled = false;
    this.wS.end ? new Date(this.wS.end) : new Date();
    (<HTMLInputElement>document.getElementById("w-end-h")).value = this.wS.end.getHours().toLocaleString('en-US',{minimumIntegerDigits : 2});;
    (<HTMLInputElement>document.getElementById("w-end-m")).value = this.wS.end.getMinutes().toLocaleString('en-US',{minimumIntegerDigits : 2});;
    
    div.classList.remove('disabled');
      text.style.color = "unset";
    (<HTMLInputElement>document.getElementById("end-date")).classList.remove("owl-dt-trigger-disabled");
    (<HTMLInputElement>document.getElementById("end-date")).classList.add("ng-valid");
  }
  disableEnd(){
    let checkbox = <HTMLInputElement>document.getElementById("end-checkbox");
    let div = <HTMLDivElement>document.getElementById("end-div");
    let text = <HTMLDivElement>document.getElementById("end-field");
    checkbox.checked = false;
    (<HTMLInputElement>document.getElementById("end-date")).disabled = true;
    (<HTMLInputElement>document.getElementById("w-end-h")).disabled = true;
    (<HTMLInputElement>document.getElementById("w-end-m")).disabled = true;
    (<HTMLInputElement>document.getElementById("w-end-h")).value = "";
    (<HTMLInputElement>document.getElementById("w-end-m")).value = "";
    this.wS.end = null;
    div.classList.add('disabled');
  }
  endDate(){
    this.wS.end = new Date( (<any>this.wS.end)._d);
  }
  endHours(){
    let input = <HTMLInputElement>document.getElementById("w-end-h");
    if(parseInt(input.value) > 23){
      input.value = '23';
      this.wS.end.setHours(23);
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.wS.end.setHours(0);
    }
    else{
      this.wS.end.setHours( parseInt(input.value) );
      if(parseInt(input.value) < 10){
        input.value = '0' + parseInt(input.value);
      } 
    }
  }
  endMinutes(){
    let input = <HTMLInputElement>document.getElementById("w-end-m");
    if(parseInt(input.value) > 59){
      input.value = '59';
      this.wS.end.setMinutes(59);
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.wS.end.setMinutes(0);
    }
    else{
      this.wS.end.setMinutes( parseInt(input.value) );
      if(parseInt(input.value) < 10){
        input.value = '0' + parseInt(input.value);
      } 
    }
  }

  saveSource(){
    (<HTMLElement>document.getElementById("source-save-icon")).style.display ="block";
    (<HTMLElement>document.getElementById("source-save-text")).style.display ="none";
    if(!this.edit){
      if(this.verifyFields()){
        if(this.overlapDate()){
          setTimeout(()=> {
            (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
            (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
            this.notify.notify('error',"Il ne peut y avoir qu'une source méteo active a la fois");
          }, 500);
        }
        else{
          this.w_srcs_service.insert(this.wS).subscribe(
            _ws => {
              setTimeout(()=> {
                this.weatherSrcsByApiary.push(_ws);
                this.w_srcs_service.userWeatherSources.push(_ws);
                (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
                (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
                $("#newSourceModal").modal("hide");
                this.notify.notify('success','Source météo ajoutée');
              }, 500);
            }, 
            () => {}, 
            () => {}
          );
        }
      } 
    }
    else{
      if(this.verifyFields()){
        if(this.overlapDate()){
          setTimeout(()=> {
            (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
            (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
            this.notify.notify('error',"Il ne peut y avoir qu'une source méteo active a la fois");
          }, 500);
        }
        else{
           this.w_srcs_service.update(this.wS).subscribe(
            _ws => {
              let index = this.weatherSrcsByApiary.findIndex(_w => _w._id === _ws._id);
              let indexServ = this.w_srcs_service.userWeatherSources.findIndex(_w => _w._id === _ws._id);
              setTimeout(()=> {
                this.weatherSrcsByApiary[index] = _ws;
                this.w_srcs_service.userWeatherSources[indexServ] = _ws;
                (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
                (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
                $("#newSourceModal").modal("hide");
                this.notify.notify('success','Source météo editée');
              }, 500);
            }, 
            () => {}, 
            () => {}
          );
        }
      }
      
     
    }
  }

  verifyFields(): boolean{
    let select = <HTMLSelectElement>document.getElementById("sources-select");
    let sensorSelect = <HTMLSelectElement>document.getElementById("sensors-select");
    let inputId = <HTMLInputElement>document.getElementById("stationid");
    let inputKey = <HTMLInputElement>document.getElementById("key");
    let inputSecret = <HTMLInputElement>document.getElementById("secret");
    if(select.selectedIndex === 0){
      setTimeout(()=> {
        (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
        (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
        this.notify.notify('error',"Veuillez choisir un type de capteur");
      }, 500);
      return false;
    }
    if(select.selectedIndex > 0 && select.selectedIndex < 5){
      if(sensorSelect.selectedIndex === 0){
        setTimeout(()=> {
          (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
          (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
          this.notify.notify('error',"Veuillez choisir un capteur");
        }, 500);
        return false;
      }
      else return true;
    }
    if(select.selectedIndex === 5){
      if(inputId.value == null && inputKey.value == null && inputSecret.value == null){
        setTimeout(()=> {
          (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
          (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
          this.notify.notify('error',"Veuillez remplir les champs de la station météo");
        }, 500);
        return false;
      }
      else return true;
    }
    if(this.wS.start == null){
      setTimeout(()=> {
        (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
        (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
        this.notify.notify('error',"Veuillez remplir la date de début");
      }, 500);
      return false;
    }
    else return true;
  }

  editSource(wSId: string){
    let ws = this.weatherSrcsByApiary.find(_w => _w._id === wSId);

    this.wS = {
      _id: ws._id,
      apiaryId: ws.apiaryId,
      apiaryName: ws.apiaryName,
      userId: ws.userId,
      userName: ws.userName,
      start: new Date(ws.start),
      end: ws.end != null ? new Date(ws.end) : null,
      sourceId: ws.sourceId,
      sourceType: ws.sourceType,
      stationId: ws.stationId,
      key: ws.key,
      secret: ws.secret,
    };

    this.edit = true;

    let select = <HTMLSelectElement>document.getElementById("sources-select");
    select.disabled = true;
    if(ws.sourceType === "Scale"){
      this.sourceType = "Scale";
      select.selectedIndex = 3;
      setTimeout(()=> {
        this.changeSensorSelect();
      }, 200)
    }
    if(ws.sourceType === "T2"){
      this.sourceType = "T2";
      select.selectedIndex = 1;
      setTimeout(()=> {
        this.changeSensorSelect();
      }, 200)
    }
    if(ws.sourceType === "TH"){
      this.sourceType = "TH";
      select.selectedIndex = 2;
      setTimeout(()=> {
        this.changeSensorSelect();
      }, 200)
    }
    if(ws.sourceType === "Hub"){
      this.sourceType = "Hub";
      select.selectedIndex = 4;
      setTimeout(()=> {
        this.changeSensorSelect();
      }, 200)
    }
    if(ws.sourceType === 'Station Davis'){
      this.sourceType = "Station Davis";
      select.selectedIndex = 5;
      setTimeout(()=> {
        this.changeStationDavis();
      }, 200)
    }

    /*
    if(ws.sourceId.substr(0,2) === '43' || ws.sourceId.substr(0,2) === '49' || ws.sourceId.substr(0,2) === '57' || ws.sourceId.substr(0,2) === '58'){
      this.sourceType = "Scale";
      select.selectedIndex = 4;
    }
    if(ws.sourceId.substr(0,2) === '41' || ws.sourceId.substr(0,2) === '47'){
      this.sourceType = "T2";
      select.selectedIndex = 3;
    }
    if(ws.sourceId.substr(0,2) === '42' || ws.sourceId.substr(0,2) === '56'){
      this.sourceType = "TH";
      select.selectedIndex = 1;
    }
    if(ws.sourceId.substr(0,2) === '54'){
      this.sourceType = "Hub";
      select.selectedIndex = 2;
    }
    */

    (<HTMLElement>document.getElementById("newSourceModalLabel")).textContent = this.translate.instant('WEATHER.CONFIG.EDIT_SOURCE');
    (<HTMLSpanElement>document.getElementById("source-save-text")).textContent = this.translate.instant('WEATHER.CONFIG.BTN_EDIT');

    (<HTMLInputElement>document.getElementById("w-begin-h")).value = this.wS.start.getHours().toLocaleString('en-US',{minimumIntegerDigits : 2});
    (<HTMLInputElement>document.getElementById("w-begin-m")).value = this.wS.start.getMinutes().toLocaleString('en-US',{minimumIntegerDigits : 2});

    if(this.wS.end != null){
      //this.enableEnd();
      (<HTMLInputElement>document.getElementById("w-end-h")).value = this.wS.end.getHours().toLocaleString('en-US',{minimumIntegerDigits : 2});
      (<HTMLInputElement>document.getElementById("w-end-m")).value = this.wS.end.getMinutes().toLocaleString('en-US',{minimumIntegerDigits : 2});
    }
    
  }

  changeSensorSelect(){
    let sensorSelect = <HTMLSelectElement>document.getElementById("sensors-select");
    this.captByType = [];
    this.edit_capt.sensorRef = this.wS.sourceId;
    this.captByType.push(this.edit_capt);
    sensorSelect.selectedIndex = 1;
    sensorSelect.disabled = true;
  }

  changeStationDavis(){
    let inputId = <HTMLInputElement>document.getElementById("stationid");
    let inputKey = <HTMLInputElement>document.getElementById("key");
    let inputSecret = <HTMLInputElement>document.getElementById("secret");
    inputId.value = this.wS.sourceId;
    inputKey.value = this.wS.key;
    inputSecret.value = this.wS.secret;
  }

  openDeleteModal(ws: WeatherSource){
    this.wS = Object.assign({},ws);
  }

  deleteSource(){
    (<HTMLElement>document.getElementById("source-del-icon")).style.display ="block";
    (<HTMLElement>document.getElementById("source-del-text")).style.display ="none";
    let index = this.weatherSrcsByApiary.findIndex(_w => _w._id === this.wS._id);
    let indexServ = this.w_srcs_service.userWeatherSources.findIndex(_w => _w._id === this.wS._id);
    console.log(this.wS._id);
    this.w_srcs_service.delete(this.wS._id).subscribe(
      () => {
        setTimeout(() => {
          this.weatherSrcsByApiary.splice(index, 1);
          this.w_srcs_service.userWeatherSources.splice(indexServ, 1);
          (<HTMLElement>document.getElementById("source-save-icon")).style.display ="none";
          (<HTMLElement>document.getElementById("source-save-text")).style.display ="block";
          $("#deleteSourceModal").modal("hide");
          this.notify.notify('success','Source météo supprimée');
        }, 500)
      },
      () => {},
      () => {}
    );
  }

  overlapDate(): boolean{
    let overlaps: any[] = [];
    if(this.edit){
      let arr = this.weatherSrcsByApiary.filter(_ws => _ws._id !== this.wS._id);
      overlaps = arr.filter(_ws => {
        if(this.wS.end == null && new Date(this.wS.start) <= new Date(_ws.end)){
          return _ws;
        }
        else if(this.wS.end == null && _ws.end == null){
          return _ws;
        }
        else if(_ws.end == null && new Date(this.wS.end) >= new Date(_ws.start)){
          return _ws;
        }
        else if(this.wS.end != null && (new Date(this.wS.start) <= new Date(_ws.end) && new Date(this.wS.end) >= new Date(_ws.end) )){
          return _ws
        }
        else if(this.wS.end != null && (new Date(this.wS.start) <= new Date(_ws.start) && new Date(this.wS.end) >= new Date(_ws.start) )){
          return _ws
        }
        else if(this.wS.end != null && (new Date(this.wS.start) <= new Date(_ws.end) && new Date(this.wS.end) >= new Date(_ws.end) )){
          return _ws
        }
      }); 
      if(overlaps.length > 0){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      overlaps = this.weatherSrcsByApiary.filter(_ws => {
        if(this.wS.end == null && new Date(this.wS.start) <= new Date(_ws.end)){
          return _ws;
        }
        else if(this.wS.end == null && _ws.end == null){
          return _ws;
        }
        else if(_ws.end == null && new Date(this.wS.end) >= new Date(_ws.start)){
          return _ws;
        }
        else if(this.wS.end != null && (new Date(this.wS.start) <= new Date(_ws.end) && new Date(this.wS.end) >= new Date(_ws.end) )){
          return _ws
        }
        else if(this.wS.end != null && (new Date(this.wS.start) <= new Date(_ws.start) && new Date(this.wS.end) >= new Date(_ws.start) )){
          return _ws
        }
        else if(this.wS.end != null && (new Date(this.wS.start) <= new Date(_ws.end) && new Date(this.wS.end) >= new Date(_ws.end) )){
          return _ws
        }
      }); 
      if(overlaps.length > 0){
        return true;
      }
      else{
        return false;
      }   
    }
    
  }

}
