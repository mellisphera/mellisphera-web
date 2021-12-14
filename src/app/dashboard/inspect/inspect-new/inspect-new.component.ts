import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserloggedService } from '../../../userlogged.service';
import { RucherModel } from '../../../_model/rucher-model';
import { UserPref } from '../../../_model/user-pref';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { RucheService } from '../../service/api/ruche.service';
import { RucherService } from '../../service/api/rucher.service';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { TranslateService } from '@ngx-translate/core';

import { Inspection } from '../../../_model/inspection';
import { InspectionService } from '../../service/api/inspection.service';
import { InspCat } from '../../../_model/inspCat';
import { InspCatService } from '../../service/api/insp-cat.service';
import { InspConf } from '../../../_model/inspConf';
import { InspUser } from '../../../_model/inspUser';
import { InspUserService } from '../../service/api/insp-user.service';
import { NotifierService } from 'angular-notifier';
import { SeasonsService } from '../service/seasons.service';

import { CapteurInterface } from '../../../_model/capteur';
import { CapteurService } from '../../service/api/capteur.service';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { FitnessService } from '../../service/api/fitness.service';
import { DailyRecordsWService } from '../../service/api/daily-records-w.service';
import { Fitness } from '../../../_model/fitness';
import { DailyRecordTh } from '../../../_model/daily-record-th';
import { DailyRecordsW } from '../../../_model/daily-records-w';
import { Observable } from 'rxjs';

declare var jsPDF: any;

@Component({
  selector: 'app-inspect-new',
  templateUrl: './inspect-new.component.html',
  styleUrls: ['./inspect-new.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InspectNewComponent implements OnInit {

  public inspUser: InspUser = {_id: null, idUser: null, inspConf: []};
  public inspConf: InspConf[];
  public inspCat: InspCat[];

  public user_pref : UserPref;

  public inspect_date: Date;
  public user_apiaries: RucherModel[];
  public user_hives: RucheInterface[];
  private sensors_by_apiary: CapteurInterface[] = [];
  public fitness_by_apiary: Fitness[] = [];
  public brood_by_apiary: DailyRecordTh[] = [];
  public weight_by_apiary: DailyRecordsW[] = [];
  
  public active_apiary_index: number;

  public new_apiary_insp: Inspection = {
    _id: null,
    apiaryInspId: null,
    apiaryId: null,
    hiveId: null,
    userId: this.userService.getIdUserLoged(),
    createDate: null,
    opsDate: null,
    type: 'apiary',
    tags: [],
    events: [],
    description: null,
    todo: null
  }

  public new_hive_insp: Inspection = {
    _id: null,
    apiaryInspId: null,
    apiaryId: null,
    hiveId: null,
    userId: this.userService.getIdUserLoged(),
    createDate: null,
    opsDate: null,
    type: 'hive',
    tags: [],
    events: [],
    description: null,
    todo: null
  }

  public hive_insps: Inspection[];

  private pdf = new jsPDF();
  
  constructor(
    private inspService: InspectionService,
    private inspCatService: InspCatService,
    private inspUserService: InspUserService,
    public unitService: UnitService,
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
    public translateService: TranslateService,
    private notifyService: NotifierService,
    public seasonService: SeasonsService,
    private captService: CapteurService,
    private dailyRecords: DailyRecordService,
    private fitnessService: FitnessService,
    private dailyRecordsW: DailyRecordsWService
  ) {}

  ngOnInit() {
    this.inspect_date = new Date();
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input-hours')[0]).value = this.inspect_date.getHours().toString();
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input-minutes')[0]).value = this.inspect_date.getMinutes().toString();
    this.active_apiary_index = 0;
    this.userPrefsService.getUserPrefs().subscribe(
      _userPrefs => {
        this.user_pref = _userPrefs;
      },
      () => {},
      () => {}
    );
    this.rucherService.getApiariesByUserId(this.userService.getIdUserLoged()).subscribe(
      _apiaries => { 
        this.user_apiaries = [..._apiaries];
        this.user_apiaries = this.user_apiaries.filter(apiary => apiary !== null && apiary.userId === this.userService.getIdUserLoged());
      },
      () => {},
      () => {
        this.user_apiaries.sort(this.compare);
        console.log(this.user_apiaries);
        this.rucheService.getHivesByApiary(this.user_apiaries[0]._id).subscribe(
          _hives => { this.user_hives = _hives.sort(this.compare); },
          () => {},
          () => {
            this.user_hives.sort(this.compare);
            this.captService.getCapteursByApiaryId(this.user_apiaries[0]._id).subscribe(
              _captArray => { this.sensors_by_apiary = _captArray.filter(_c => !_c.sensorRef.includes("_removed")); },
            );
            this.dailyRecords.getDailyTHByApiary(this.user_apiaries[0]._id).subscribe(
              _recTH => { this.brood_by_apiary = _recTH; },
            );
            this.fitnessService.getDailyFitnessByApiaryId(this.user_apiaries[0]._id).subscribe(
              _fit => { 
                this.fitness_by_apiary = _fit;
                this.user_hives.forEach( _hive => {
                  let index = _fit.findIndex( _f => _f.hiveId === _hive._id);
                  if(index === -1){
                    this.fitness_by_apiary.push({
                      _id: null,
                      userId: null,
                      hiveId: _hive._id, 
                      fitcode: null,
                      fitcolor: 'white',
                      date: null,
                    })
                  }
                })
              },
            );
            this.dailyRecordsW.getDailyWeightByApiary(this.user_apiaries[0]._id).subscribe(
              _recW => { this.weight_by_apiary = _recW; }
            );
          }
        )
      }
    );
    this.inspCatService.getInspCat().subscribe(
      _inspCat => {
        this.inspCat = [..._inspCat].sort((a,b) => {
          return a.code - b.code;
        });
      },
      () => {},
      () => {
        this.inspUserService.existsInspUser(this.userService.getIdUserLoged()).subscribe(
          _exists => {
            if(_exists){
              this.getInspUser(() => {
                this.inspConf = [...this.inspUser.inspConf];
              });
            }
            else{
              this.createInspUser((aux) => {
                this.inspUser = Object.assign({}, aux);
                this.inspConf = [...this.inspUser.inspConf];
              });
            }
          },
          () => {},
          () => {}
        )
      }
    );


    this.new_apiary_insp.userId = this.userService.getIdUserLoged();
    this.new_apiary_insp.opsDate = new Date(this.inspect_date);

    $("#downloadModal").on('shown.bs.modal', () => {this.generatePDF()} );

  }

  compare(a, b) {

    const apiA = a.name.toLowerCase();
    const apiB = b.name.toLowerCase();

    let comparison = 0;
    if (apiA > apiB) {
      comparison = 1;
    } else if (apiA < apiB) {
      comparison = -1;
    }
    return comparison;
  }

  createInspUser(next: Function): void{
    let aux : InspUser = {_id: null, idUser: null, inspConf: []};
    aux.idUser = this.userService.getIdUserLoged();
    this.inspCat.forEach(inspItem => {
      let conf: InspConf = { enable : true, inspCat: Object.assign({},inspItem) };
      aux.inspConf.push(conf);
    });
    next(aux);
  }

  getInspUser(next: Function): void{
    this.inspUserService.getInspUser(this.userService.getIdUserLoged()).subscribe(
      _inspUser => {
        this.inspUser = Object.assign({}, _inspUser);
        this.insertNewInspCat();
      },
      () => {},
      () => {
        next();
      }
    );
  }

  insertNewInspCat(): void{
    let array = this.inspCat.filter( x => !this.inspUser.inspConf.some(_conf => x.name === _conf.inspCat.name) );
    array.forEach(_elt => {
      let conf: InspConf = { enable: true, inspCat: _elt }
      this.inspUser.inspConf.push(conf);
    });
  }

  changeActive(evt: Event, inspCat: InspCat, type: string, nameCat: string, ruche? :RucheInterface): void{
    let button = <HTMLButtonElement>evt.target;
    let index;
    if(button.className.includes('_cb')){
      button.className = button.className.slice(0, -3);
      button.className += '_b';
      if(type === 'apiary'){
        index = this.new_apiary_insp.events.findIndex(_t => _t.name === inspCat.name)
        this.new_apiary_insp.events.splice(index, 1);
        return;
      }
      if( type === 'hive' ){
        let indexInsp = this.hive_insps.findIndex( _i => _i.hiveId === ruche._id );
        index = this.hive_insps[indexInsp].events.findIndex(_t => _t.name === inspCat.name)
        this.hive_insps[indexInsp].events.splice(index, 1);
        return;
      }
    }
    button.className = button.className.slice(0, -2);
    button.className += '_cb';
    if(type === 'apiary'){
      this.new_apiary_insp.events.push({name:inspCat.name, img:inspCat.img.toLocaleLowerCase() + '_b.svg'});
      return;
    }
    if( type === 'hive' ){
      let indexInsp = this.hive_insps.findIndex( _i => _i.hiveId === ruche._id );
      index = this.hive_insps[indexInsp].events.push({name:inspCat.name, img:inspCat.img.toLocaleLowerCase() + '_b.svg'});
      return;
    }

  }

  onSelectChange(): void{
    this.active_apiary_index = (<HTMLSelectElement>document.getElementById('inspect-apiary-select')).selectedIndex;
    this.new_apiary_insp.apiaryId = this.user_apiaries[this.active_apiary_index - 1]._id;
    this.rucheService.getHivesByApiary(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
      _hives => { this.user_hives = _hives.sort(this.compare); },
      () => {},
      () => {
        this.hive_insps = [];
        this.user_hives.forEach(_hive => {
          let insp = {
            _id: null,
            apiaryInspId: null,
            apiaryId: this.new_apiary_insp.apiaryId,
            hiveId: _hive._id,
            userId: this.userService.getIdUserLoged(),
            createDate: null,
            opsDate: this.new_apiary_insp.opsDate,
            type: 'hive',
            tags: [],
            events: [],
            description: null,
            todo: null
          }
          this.hive_insps.push(insp);
        })
        this.captService.getCapteursByApiaryId(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
          _captArray => { this.sensors_by_apiary = _captArray.filter(_c => !_c.sensorRef.includes("_removed")) },
        );
        this.dailyRecords.getDailyTHByApiary(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
          _recTH => { this.brood_by_apiary = _recTH; },
        );
        this.fitnessService.getDailyFitnessByApiaryId(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
          _fit => {
            this.fitness_by_apiary = _fit;
            this.user_hives.forEach( (_hive,i) => {
              let index = _fit.findIndex( _f => _f.hiveId === _hive._id);
              if(index === -1){
                this.fitness_by_apiary.splice(i, 0 ,{
                  _id: null,
                  userId: null,
                  hiveId: _hive._id, 
                  fitcode: null,
                  fitcolor: 'white',
                  date: null,
                });
              }
            });
          },
        );
        this.dailyRecordsW.getDailyWeightByApiary(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
          _recW => { this.weight_by_apiary = _recW; }
        );
      }
    )
  }

  inspectDate(): void{
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = this.unitService.getDailyDate(this.inspect_date);
    this.new_apiary_insp.opsDate = new Date(this.inspect_date);
    if(this.hive_insps != null && this.hive_insps != undefined && this.hive_insps.length > 0){
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate = new Date(this.inspect_date);
      });
    }
    if(this.inspect_date != undefined && this.inspect_date != null){
      (<HTMLInputElement>document.getElementsByClassName('inspect-time-input-hours')[0]).disabled = false;
      (<HTMLInputElement>document.getElementsByClassName('inspect-time-input-minutes')[0]).disabled = false;
    }
  }

  inspectDateHours(): void{
    let input = <HTMLInputElement>document.getElementsByClassName('inspect-time-input-hours')[0];
    if(parseInt(input.value) > 23){
      input.value = '23';
      this.new_apiary_insp.opsDate.setHours(23);
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate.setHours(23);
      });
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.new_apiary_insp.opsDate.setHours(0);
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate.setHours(0);
      });
    }
    else{
      this.new_apiary_insp.opsDate.setHours(parseInt(input.value));
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate.setHours(parseInt(input.value));
      });
    }
  }

  inspectDateMinutes(): void{
    let input = <HTMLInputElement>document.getElementsByClassName('inspect-time-input-minutes')[0];
    if(parseInt(input.value) > 59){
      input.value = '59';
      this.new_apiary_insp.opsDate.setMinutes(59);
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate.setMinutes(59);
      });
    }
    else if(parseInt(input.value) < 0){
      input.value = '00';
      this.new_apiary_insp.opsDate.setMinutes(0);
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate.setMinutes(0);
      });
    }
    else{
      this.new_apiary_insp.opsDate.setMinutes(parseInt(input.value));
      this.hive_insps.forEach( _hInsp => {
        _hInsp.opsDate.setMinutes(parseInt(input.value));
      });
    }

  }

  saveApiaryNotes(evt: Event){
    this.new_apiary_insp.description = (<HTMLTextAreaElement>evt.target).value;
  }

  saveApiaryTodo(evt: Event){
    this.new_apiary_insp.todo = (<HTMLTextAreaElement>evt.target).value;
  }

  toggleNotes(evt: Event): void{
    let button;
    if( (<HTMLElement>evt.target).tagName === 'I' ){
      button = (<HTMLElement>evt.target).parentNode;
    }
    else{
      button = <HTMLButtonElement>evt.target;
    }
    let textArea = button.parentNode.parentNode.children[1];
    if(textArea.classList.contains('hide-textarea')){
      textArea.classList.remove('hide-textarea');
      return;
    }
    textArea.classList.add('hide-textarea');
    return;
  }

  toggleTodo(evt: Event): void{
    let button = <HTMLButtonElement>evt.target;
    let textArea = button.parentNode.parentNode.parentNode.children[1].children[1];
    if(textArea.classList.contains('hide-textarea')){
      textArea.classList.remove('hide-textarea');
      return;
    }
    textArea.classList.add('hide-textarea');
    return;
  }

  saveHiveNotes(evt: Event, ruche: RucheInterface){
    let index = this.hive_insps.findIndex( _i => _i.hiveId === ruche._id);
    this.hive_insps[index].description = (<HTMLTextAreaElement>evt.target).value;
  }

  saveHiveTodo(evt: Event, ruche: RucheInterface){
    let index = this.hive_insps.findIndex( _i => _i.hiveId === ruche._id);
    this.hive_insps[index].todo = (<HTMLTextAreaElement>evt.target).value;
  }

  ifHiveInspEmpty(insp: Inspection): boolean{
    return insp.events.length === 0 &&
           (insp.description === '' || insp.description == null || insp.description == undefined)  &&
           (insp.todo === '' || insp.todo == null || insp.todo == undefined);
  }

  openSaveModal(){

  }

  saveInspection(): void{

    if(this.inspect_date != null || this.inspect_date != undefined){
      (<HTMLElement>document.getElementById("btn-save-icon")).style.display ="block";
      (<HTMLElement>document.getElementById("btn-save-text")).style.display ="none";
      (<HTMLButtonElement>document.getElementById("btn-save")).disabled = true;
      let inspHivesToPush = [...this.hive_insps];
      console.log("this.hive_insps", this.hive_insps); // TODO: remove
      let i = 0;
      while(i < inspHivesToPush.length){
        let insp : Inspection = inspHivesToPush[i];
        if( this.ifHiveInspEmpty(insp) ){
          inspHivesToPush.splice(i, 1);
        }
        else{
          i++;
        }
      }
      this.new_apiary_insp.createDate = new Date();
      this.new_apiary_insp.events = this.new_apiary_insp.events.sort((a,b) => {
        let iA = this.inspCat.find(_c => _c.name.toLowerCase() === a.name.toLowerCase()) || {code: 0};
        let iB = this.inspCat.find(_c => _c.name.toLowerCase() === b.name.toLowerCase()) || {code: 0};
        return iA.code - iB.code;
      });
      console.log("inspHivesToPush", inspHivesToPush); // TODO: remove
      this.inspService.insertApiaryInsp(this.new_apiary_insp).subscribe(
        _api_insp => {
          //console.log(_api_insp);
          inspHivesToPush.forEach(_h => {
            _h.events = _h.events.sort((a,b) => {
              let iA = this.inspCat.find(_c => _c.name.toLowerCase() === a.name.toLowerCase()) || {code: 0};
              let iB = this.inspCat.find(_c => _c.name.toLowerCase() === b.name.toLowerCase()) || {code: 0};
              return iA.code - iB.code;
            });
            _h.apiaryInspId = _api_insp._id;
            _h.createDate = new Date();
          });
          this.inspService.insertHiveInsp(inspHivesToPush).subscribe(
            _insps => {//console.log(_insps)
            },
            () => {}, () => {}
          );
        },
        () => {},
        () => {
          //console.log(inspHivesToPush);
          $("#saveModal").modal("hide");
          if(this.translateService.currentLang === 'fr') {
            this.notifyService.notify('success', "Votre inspection a été enregistrée");
          } else {
            this.notifyService.notify('success', 'Your inspection has been saved');
          }
          (<HTMLElement>document.getElementById("btn-save-icon")).style.display ="none";
          (<HTMLElement>document.getElementById("btn-save-text")).style.display ="block";
          (<HTMLButtonElement>document.getElementById("btn-save")).disabled = false;
          this.cancelInspection();
        }
      )
    }
    else{
      if(this.translateService.currentLang === 'fr') {
        this.notifyService.notify('error', 'Veuillez renseignez une date valide');
      } else {
        this.notifyService.notify('error', 'Please provide a valid date');
      }
    }

  }

  setGeneralLevel(lvl: string){
    let index;
    switch(lvl){
      case 'bad':
        if( <HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0] != null ){
          (<HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0]).classList.remove('btn-normal-active');
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Generalnormal"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
        }
        if( <HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0] != null ){
          (<HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0]).classList.remove('btn-happy-active');
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Generalgood"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
        }

        if(<HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0] == null){
          this.new_apiary_insp.events.push({name:'Generallow', img:'generallow_b.svg'});
          (<HTMLButtonElement>document.getElementsByClassName('btn-sad')[0]).classList.add('btn-sad-active');
        }

        break;
      case 'normal':
        if( <HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0] != null ){
          (<HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0]).classList.remove('btn-sad-active');
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Generallow"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
        }
        if( <HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0] != null ){
          (<HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0]).classList.remove('btn-happy-active');
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Generalgood"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
        }

        if( <HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0] == null ){
          this.new_apiary_insp.events.push({name:'Generalnormal', img:'generalnormal_b.svg'});
          (<HTMLButtonElement>document.getElementsByClassName('btn-normal')[0]).classList.add('btn-normal-active');
        }

        break;
      case 'good':
        if( <HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0] != null ){
          (<HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0]).classList.remove('btn-sad-active');
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Generallow"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
        }
        if( <HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0] != null ){
          (<HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0]).classList.remove('btn-normal-active');
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Generalnormal"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
        }

        if( <HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0] == null ){
          this.new_apiary_insp.events.push({name:'Generalgood', img:'generalgood_b.svg'});
          (<HTMLButtonElement>document.getElementsByClassName('btn-happy')[0]).classList.add('btn-happy-active');
        }

        break;
    }
  }

  setBeeLevel(lvl: string, entity: string, hive?: RucheInterface): void{
    let index;
    if(entity === 'apiary'){
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Lowbees', img:'lowbees_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Lowbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Normbees', img:'normbees_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Lowbees") || _o.name.includes("Nobees"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Highbees', img:'highbees_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Lowbees"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Nobees', img:'nobees_b.svg'});
          break;
      }
      return;
    }
    if(entity === 'hive'){
      let inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Lowbees', img:'lowbees_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Lowbees") || _o.name.includes("Highbees") || _o.name.includes("Nobees"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Normbees', img:'normbees_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Lowbees") || _o.name.includes("Nobees"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Highbees', img:'highbees_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_high_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normbees") || _o.name.includes("Highbees") || _o.name.includes("Lowbees"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Nobees', img:'nobees_b.svg'});
          break;
      }
      return;
    }

  }

  setBroodLevel(lvl: string, entity: string, hive?: RucheInterface){
    let index;
    if(entity === 'apiary'){
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Lowbrood', img:'lowbrood_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Lowbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Normbrood', img:'normbrood_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Lowbrood") || _o.name.includes("Nobrood"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Highbrood', img:'highbrood_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Lowbrood"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Nobrood', img:'nobrood_b.svg'});
          break;
      }
      return;
    }
    if(entity === 'hive'){
      let inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);;
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Lowbrood', img:'lowbrood_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Lowbrood") || _o.name.includes("Highbrood") || _o.name.includes("Nobrood"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Normbrood', img:'normbrood_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Lowbrood") || _o.name.includes("Nobrood"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Highbrood', img:'highbrood_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_high_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normbrood") || _o.name.includes("Highbrood") || _o.name.includes("Lowbrood"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Nobrood', img:'nobrood_b.svg'});
          break;
      }
      return;
    }
  }

  setResLevel(lvl: string, entity: string, hive?: RucheInterface): void{
    let index;
    if(entity === 'apiary'){
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Lowres', img:'lowres_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Lowres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Normres', img:'normres_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Lowres") || _o.name.includes("Nores"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Highres', img:'highres_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
          index = this.new_apiary_insp.events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Lowres"));
          if(index > -1){
            this.new_apiary_insp.events.splice(index,1);
          }
          this.new_apiary_insp.events.push({name:'Nores', img:'nores_b.svg'});
          break;
      }
      return;
    }
    if(entity === 'hive'){
      let inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Lowres', img:'lowres_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Lowres") || _o.name.includes("Highres") || _o.name.includes("Nores"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Normres', img:'normres_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_none_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Lowres") || _o.name.includes("Nores"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Highres', img:'highres_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_high_check")).checked = false;
          index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name.includes("Normres") || _o.name.includes("Highres") || _o.name.includes("Lowres"));
          if(index > -1){
            this.hive_insps[inspIndex].events.splice(index,1);
          }
          this.hive_insps[inspIndex].events.push({name:'Nores', img:'nores_b.svg'});
          break;
      }
      return;
    }
  }

  setBroodStage(stage: string, entity: string, hive?: RucheInterface): void{
    let button, index, inspIndex;
    if(entity === 'apiary'){
      switch(stage){
        case 'egg':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.events.splice(index, 1);
          }
          button = <HTMLButtonElement>document.getElementsByClassName('brood-egg')[0];
          if(!button.classList.contains('brood-egg-active')){
            button.classList.add('brood-egg-active');
            this.new_apiary_insp.events.push({name:'Egg', img:'egg_cb.svg'});
          }
          else{
            button.classList.remove('brood-egg-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Egg')
            this.new_apiary_insp.events.splice(index, 1);
          }

          break;
        case 'larva':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-larva')[0];
          if(!button.classList.contains('brood-larva-active')){
            button.classList.add('brood-larva-active');
            this.new_apiary_insp.events.push({name:'Larva', img:'larva_cb.svg'});
          }
          else{
            button.classList.remove('brood-larva-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Larva')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'pupa':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-pupa')[0];
          if(!button.classList.contains('brood-pupa-active')){
            button.classList.add('brood-pupa-active');
            this.new_apiary_insp.events.push({name:'Pupa', img:'pupa_cb.svg'});
            console.log(this.new_apiary_insp.events);
          }
          else{
            button.classList.remove('brood-pupa-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Pupa')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'drone':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-drone')[0];
          if(!button.classList.contains('brood-drone-active')){
            button.classList.add('brood-drone-active');
            this.new_apiary_insp.events.push({name:'Drone', img:'drone_cb.svg'});
            console.log(this.new_apiary_insp.events);
          }
          else{
            button.classList.remove('brood-drone-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Drone')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'none':
          if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Egg');
            this.new_apiary_insp.events.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Larva');
            this.new_apiary_insp.events.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Pupa');
            this.new_apiary_insp.events.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
            index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Drone');
            this.new_apiary_insp.events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-none')[0];
          if(!button.classList.contains('brood-none-active')){
            button.classList.add('brood-none-active');
            this.new_apiary_insp.events.push({name:'Nonebrood', img:'nobrood_cb.svg'});
            console.log(this.new_apiary_insp.events);
          }
          else{
            button.classList.remove('brood-none-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Nonebrood')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
      }
      return;
    }
    if(entity === 'hive'){
      inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
      switch(stage){
        case 'egg':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0];
          if(!button.classList.contains('brood-egg-active')){
            button.classList.add('brood-egg-active');
            this.hive_insps[inspIndex].events.push({name:'Egg', img:'egg_cb.svg'});
          }
          else{
            button.classList.remove('brood-egg-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Egg')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'larva':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0];
          if(!button.classList.contains('brood-larva-active')){
            button.classList.add('brood-larva-active');
            this.hive_insps[inspIndex].events.push({name:'Larva', img:'larva_cb.svg'});
          }
          else{
            button.classList.remove('brood-larva-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Larva')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'pupa':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0];
          if(!button.classList.contains('brood-pupa-active')){
            button.classList.add('brood-pupa-active');
            this.hive_insps[inspIndex].events.push({name:'Pupa', img:'pupa_cb.svg'});
          }
          else{
            button.classList.remove('brood-pupa-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Pupa')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'drone':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0];
          if(!button.classList.contains('brood-drone-active')){
            button.classList.add('brood-drone-active');
            this.hive_insps[inspIndex].events.push({name:'Drone', img:'drone_cb.svg'});
          }
          else{
            button.classList.remove('brood-drone-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Drone')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'none':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.contains('brood-egg-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.remove('brood-egg-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Egg');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.contains('brood-larva-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.remove('brood-larva-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Larva');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.contains('brood-pupa-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.remove('brood-pupa-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Pupa');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.contains('brood-drone-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.remove('brood-drone-active');
            index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Drone');
            this.hive_insps[inspIndex].events.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0];
          if(!button.classList.contains('brood-none-active')){
            button.classList.add('brood-none-active');
            this.hive_insps[inspIndex].events.push({name:'Nonebrood', img:'nobrood_cb.svg'});
          }
          else{
            button.classList.remove('brood-none-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Nonebrood')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
      }
      return;
    }

  }

  setHealth(health: string, entity: string, hive?: RucheInterface): void{
    let button, index, inspIndex;
    if(entity === 'apiary'){
      switch(health){
        case 'buzz':
          button = <HTMLButtonElement>document.getElementsByClassName('health-buzz')[0];
          if(!button.classList.contains('health-buzz-active')){
            button.classList.add('health-buzz-active');
            this.new_apiary_insp.events.push({name:'Buzzinghive', img:'buzzinghive_cb.svg'});
          }
          else{
            button.classList.remove('health-buzz-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Buzzinghive')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'sick':
          button = <HTMLButtonElement>document.getElementsByClassName('health-sick')[0];
          if(!button.classList.contains('health-sick-active')){
            button.classList.add('health-sick-active');
            this.new_apiary_insp.events.push({name:'Sick', img:'sick_cb.svg'});
          }
          else{
            button.classList.remove('health-sick-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Sick')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'mosaic':
          button = <HTMLButtonElement>document.getElementsByClassName('health-mosaic')[0];
          if(!button.classList.contains('health-mosaic-active')){
            button.classList.add('health-mosaic-active');
            this.new_apiary_insp.events.push({name:'Mosaichive', img:'mosaichive_cb.svg'});
          }
          else{
            button.classList.remove('health-mosaic-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Mosaichive')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'queenseen':
          button = <HTMLButtonElement>document.getElementsByClassName('health-queen')[0];
          if(!button.classList.contains('health-queen-active')){
            button.classList.add('health-queen-active');
            this.new_apiary_insp.events.push({name:'Queenseen', img:'queenseen_cb.svg'});
            //console.log(this.new_apiary_insp.events);
          }
          else{
            button.classList.remove('health-queen-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Queenseen')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
        case 'swarm':
          button = <HTMLButtonElement>document.getElementsByClassName('health-swarm')[0];
          if(!button.classList.contains('health-swarm-active')){
            button.classList.add('health-swarm-active');
            this.new_apiary_insp.events.push({name:'Swarm', img:'swarm_cb.svg'});
          }
          else{
            button.classList.remove('health-swarm-active');
            let index = this.new_apiary_insp.events.findIndex(_o => _o.name === 'Swarm')
            this.new_apiary_insp.events.splice(index, 1);
          }
          break;
      }
      return;
    }
    if(entity === 'hive'){
      inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
      switch(health){
        case 'buzz':
          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_buzz')[0];
          if(!button.classList.contains('health-buzz-active')){
            button.classList.add('health-buzz-active');
            this.hive_insps[inspIndex].events.push({name:'Buzzinghive', img:'buzzinghive_cb.svg'});
          }
          else{
            button.classList.remove('health-buzz-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Buzzinghive')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }

          break;
        case 'sick':
          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0];
          if(!button.classList.contains('health-sick-active')){
            button.classList.add('health-sick-active');
            this.hive_insps[inspIndex].events.push({name:'Sick', img:'sick_cb.svg'});
          }
          else{
            button.classList.remove('health-sick-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Sick')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'mosaic':
          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_mosaic')[0];
          if(!button.classList.contains('health-mosaic-active')){
            button.classList.add('health-mosaic-active');
            this.hive_insps[inspIndex].events.push({name:'Mosaichive', img:'mosaichive_cb.svg'});
          }
          else{
            button.classList.remove('health-mosaic-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Mosaichive')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'queenseen':
          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0];
          if(!button.classList.contains('health-queen-active')){
            button.classList.add('health-queen-active');
            this.hive_insps[inspIndex].events.push({name:'Queenseen', img:'queenseen_cb.svg'});
          }
          else{
            button.classList.remove('health-queen-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Queenseen')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
        case 'swarm':
          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0];
          if(!button.classList.contains('health-swarm-active')){
            button.classList.add('health-swarm-active');
            this.hive_insps[inspIndex].events.push({name:'Swarm', img:'swarm_cb.svg'});
          }else{
            button.classList.remove('health-swarm-active');
            let index = this.hive_insps[inspIndex].events.findIndex(_o => _o.name === 'Swarm')
            this.hive_insps[inspIndex].events.splice(index, 1);
          }
          break;
      }
      return;
    }
  }


  openModal():void{
    (<HTMLButtonElement>document.getElementById("btn-dl")).disabled = true;
    $("#downloadModal").modal("show");
  }

  generatePDF(): void{

    this.pdf = new jsPDF();

    let headerTitle = this.translateService.instant('INSPECT.NEW.TITLE');
    let headerDate = this.translateService.instant('INSPECT.NEW.DATE');

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "0%";

    this.pdf.setFont("courier","normal");
    this.pdf.setFontSize(18);
    this.pdf.text(headerTitle, 10, 10);

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "5%";
    
    this.pdf.setFont("courier","bolditalic");
    this.pdf.text(this.user_apiaries[this.active_apiary_index - 1].name, 123, 10);

    this.pdf.setFont("courier","normal");
    this.pdf.text(headerDate, 10, 20);

    this.pdf.setFont("courier","bolditalic");
    this.pdf.text(this.unitService.getHourlyDate(this.inspect_date), 37, 20);

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "10%";

    this.pdf.setFont("courier","normal");
    this.pdf.rect(10, 25, 190, 72, "S");

    this.pdf.setFontSize(14);
    this.pdf.text(this.translateService.instant('INSPECT.NEW.GENERAL'), 15, 35);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/generallow_b.png", "PNG", 20, 40, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/generalnormal_b.png", "PNG", 35, 40, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/generalgood_b.png", "PNG", 50, 40, 10, 10);

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "15%";

    this.pdf.setFillColor("#EEEEEE");
    //this.pdf.rect(15, 65, 77, 12, "F");
    this.pdf.addImage("../../../../assets/ms-pics/inspects/nobrood_b.png", "PNG", 17, 67, 8, 8);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/egg_b.png", "PNG", 32, 66, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/larva_b.png", "PNG", 47, 66, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/pupa_b.png", "PNG", 62, 66, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/dronebrood_b.png", "PNG", 77, 66, 10, 10);

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "20%";

    let nbElt = 5;
    let lineCount = 0;
    /*this.inspConf.forEach(conf => {
      lineCount = parseInt( (nbElt/15).toFixed(1) );
      if(conf.enable && conf.inspCat.applies.findIndex(_ap => _ap === 'apiary') !== -1 && conf.inspCat.type === 'act' && conf.inspCat.seasons.findIndex(_s => _s === this.seasonService.getSeason()) !== -1 && conf.inspCat.img !== 'Default'){
        nbElt++;
      }
    });
    if(nbElt > 15){
      this.pdf.rect(15, 80, 175, 12 + 10*lineCount, "F");
    }
    else{
      this.pdf.rect(15, 80, 15*nbElt, 12, "F");
    }*/

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "30%";

    this.pdf.addImage("../../../../assets/ms-pics/inspects/swarm_b.png", "PNG", 17, 81, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/buzzinghive_b.png", "PNG", 32, 81, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/sick_b.png", "PNG", 47, 81, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/mosaicbrood_b.png", "PNG", 62, 81, 10, 10);
    this.pdf.addImage("../../../../assets/ms-pics/inspects/queenseen_b.png", "PNG", 77, 81, 10, 10);

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "40%";

    nbElt = 5;
    lineCount = 0;
    this.inspConf.forEach(conf => {
      lineCount = parseInt( (nbElt/15).toFixed(1) );
      if(conf.enable && conf.inspCat.applies.findIndex(_ap => _ap === 'apiary') !== -1 && conf.inspCat.type === 'act' && conf.inspCat.seasons.findIndex(_s => _s === this.seasonService.getSeason()) !== -1 && conf.inspCat.img !== 'Default'){
        this.pdf.addImage("../../../../assets/ms-pics/inspects/"+ conf.inspCat.img.toLowerCase() +"_b.png", "PNG", 17 + 15*(nbElt%15), 81 + 10*lineCount, 8, 8);
        nbElt++;
      }
    });

    this.pdf.rect(10, 100, 190, 190, "S");

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "50%";

    this.generateRuche();

  }

  generateRuche(): void{
    let loading = 50;
    let startX = 15, startY = 108;
    let page = 1;
    let mult = 0;
    for(let i=0; i<this.user_hives.length; i++){
      let sensorsArr = this.sensors_by_apiary.filter(_s => _s.hiveId === this.user_hives[i]._id);
      let sensorX = 215 - ((sensorsArr.length + 1) * 20);
      let brood = this.brood_by_apiary.find( _b => _b.hiveId === this.user_hives[i]._id);
      let fitness = this.fitness_by_apiary.find( _f => _f.hiveId === this.user_hives[i]._id);
      let weight = this.weight_by_apiary.find( _w => _w.hiveId === this.user_hives[i]._id);

      // TITLE
      this.pdf.setFontSize(14);
      this.pdf.setFont("courier","bolditalic");
      this.pdf.setFillColor( fitness ? fitness.fitcolor : "white" );
      this.pdf.roundedRect(15, startY-4+(mult*30), 4, 4, 1, 1, "FD");
      this.pdf.text(this.user_hives[i].name , 22, startY+(mult*30));
      this.pdf.line(15, startY+2+(mult*30), 195, startY+2+(mult*30));
      this.pdf.setFontSize(9);
      this.pdf.setFont("courier","normal");
      for(let j=0; j<sensorsArr.length; j++){
        this.pdf.text(sensorsArr[j].sensorRef, sensorX + (j*20), startY+1+(mult*30));
      }

      // TABLEAU A COCHER
      this.pdf.setFont("courier","normal");
      this.pdf.setFontSize(10);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/none_cb.png", "PNG", 41, startY+4+(mult*30), 3, 3);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/low_cb.png", "PNG", 48, startY+4+(mult*30), 3, 3);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/average_cb.png", "PNG", 55, startY+4+(mult*30), 3, 3);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/hcc/high_cb.png", "PNG", 62, startY+4+(mult*30), 3, 3);

      this.pdf.text(this.translateService.instant('INSPECT.TABLE.BEES'), 20, startY+11+(mult*30));
      this.pdf.circle(42, startY+10+(mult*30), 1.5, "S");
      this.pdf.circle(49, startY+10+(mult*30), 1.5, "S");
      this.pdf.circle(56, startY+10+(mult*30), 1.5, "S");
      this.pdf.circle(63, startY+10+(mult*30), 1.5, "S");

      this.pdf.text(this.translateService.instant('INSPECT.TABLE.BROOD'), 20, startY+16+(mult*30));
      this.pdf.circle(42, startY+15+(mult*30), 1.5, "S");
      this.pdf.circle(49, startY+15+(mult*30), 1.5, "S");
      this.pdf.circle(56, startY+15+(mult*30), 1.5, "S");
      this.pdf.circle(63, startY+15+(mult*30), 1.5, "S");

      this.pdf.text(this.translateService.instant('INSPECT.TABLE.STORES'), 20, startY+21+(mult*30));
      this.pdf.circle(42, startY+20+(mult*30), 1.5, "S");
      this.pdf.circle(49, startY+20+(mult*30), 1.5, "S");
      this.pdf.circle(56, startY+20+(mult*30), 1.5, "S");
      this.pdf.circle(63, startY+20+(mult*30), 1.5, "S");

      this.pdf.setFontSize(9);
      if (brood){
        this.pdf.text( brood.brood ? brood.brood.toFixed(0) + '%' : '', 67, startY+16+(mult*30));
      }
      let textW = weight ? this.unitService.convertWeightFromuserPref(weight.weight_23f, this.unitService.getUserPref().unitSystem, true).toFixed(0) + (this.unitService.getUserPref().unitSystem === 'IMPERIAL' ? 'lbs':'Kg') : '';
      this.pdf.text(textW, 67, startY+21+(mult*30));

      this.pdf.setFillColor("#EEEEEE");
      //this.pdf.rect(85, startY+5+(mult*30), 110, 8, "F");
      this.pdf.addImage("../../../../assets/ms-pics/inspects/nobrood_b.png", "PNG", 87, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/egg_b.png", "PNG", 95, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/larva_b.png", "PNG", 103, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/pupa_b.png", "PNG", 111, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/dronebrood_b.png", "PNG", 119, startY+6+(mult*30), 6, 6);

      this.pdf.addImage("../../../../assets/ms-pics/inspects/swarm_b.png", "PNG", 137, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/buzzinghive_b.png", "PNG", 145, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/sick_b.png", "PNG", 153, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/mosaicbrood_b.png", "PNG", 161, startY+6+(mult*30), 6, 6);
      this.pdf.addImage("../../../../assets/ms-pics/inspects/queenseen_b.png", "PNG", 169, startY+6+(mult*30), 6, 6);
      
      mult++;

      if(mult%9 === 0 && i>0 && page > 1){
        this.pdf.addPage();
        page++;
        this.pdf.setPage(page);
        this.pdf.rect(10,10,190,280);
        startY = 18;
        mult = 0;
      }

      if(mult%6 === 0 && i>0 && page === 1){
        this.pdf.addPage();
        page++;
        this.pdf.setPage(page);
        this.pdf.rect(10,10,190,280);
        startY = 18;
        mult = 0;
      }

      loading += Math.floor(50/this.user_hives.length);

      (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + loading + "%";

    }

    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.GEN_DL') + "100%";
    (<HTMLElement>document.getElementById("loading-text")).innerHTML = this.translateService.instant('INSPECT.NEW.READY_DL');
    (<HTMLButtonElement>document.getElementById("btn-dl")).disabled = false;
  }


  printPDF(): void{
    this.pdf.save("inspection-" + this.user_apiaries[this.active_apiary_index - 1].name +"-"+this.unitService.getPDFDate(this.inspect_date)+ ".pdf");
  }

  cancelInspection(): void{
    (<HTMLSelectElement>document.getElementById("inspect-apiary-select")).selectedIndex = 0;
    this.active_apiary_index = 0;
    this.inspect_date = new Date();

    this.new_apiary_insp = {
      _id: null,
      apiaryInspId: null,
      apiaryId: null,
      hiveId: null,
      userId: this.userService.getIdUserLoged(),
      createDate: null,
      opsDate: null,
      type: 'apiary',
      tags: [],
      events: [],
      description: null,
      todo: null
    }
  
    this.new_hive_insp = {
      _id: null,
      apiaryInspId: null,
      apiaryId: null,
      hiveId: null,
      userId: this.userService.getIdUserLoged(),
      createDate: null,
      opsDate: null,
      type: 'hive',
      tags: [],
      events: [],
      description: null,
      todo: null
    }

    if( <HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0] != null ){
      (<HTMLButtonElement>document.getElementsByClassName('btn-sad-active')[0]).classList.remove('btn-sad-active');
    }

    if( <HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0] != null ){
      (<HTMLButtonElement>document.getElementsByClassName('btn-normal-active')[0]).classList.remove('btn-normal-active');
    }

    if( <HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0] != null ){
      (<HTMLButtonElement>document.getElementsByClassName('btn-happy-active')[0]).classList.remove('btn-happy-active');
    }

    (<HTMLTextAreaElement>document.getElementsByClassName('apiary-notes-input')[0]).value = "";
    (<HTMLTextAreaElement>document.getElementsByClassName('apiary-todo-input')[0]).value = "";
  

    if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active'); 
    }

    if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
    }

    if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
    }

    if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
    }

    if(<HTMLButtonElement>document.getElementsByClassName('health-buzz-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('health-buzz-active')[0]).classList.remove('health-buzz-active'); 
    }

    if(<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0]).classList.remove('health-sick-active');
    }

    if(<HTMLButtonElement>document.getElementsByClassName('health-mosaic-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('health-mosaic-active')[0]).classList.remove('health-mosaic-active');
    }

    if(<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0]).classList.remove('health-queen-active');
    }

    if(<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0] != null){
      (<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0]).classList.remove('health-swarm-active');
    }
    
    this.unactiveBtn();

  }

  unactiveBtn():void{
    let div = <HTMLDivElement>document.getElementById("not-brood-stage");
    Array.from(div.children).forEach((b,i) => {
      if(this.notConstant(b.className.split(' ')[1])){
        if((b.className.split(' ')[1]).includes('_cb')){
          b.className = b.className.slice(0, -3);
          b.className += '_b';
        }
      }
    });
  }

  notConstant(classname: string):boolean{
    if(classname === "health-swarm" || classname === "health-buzz" || classname === "health-sick"
       || classname === "health-mosaic" || classname === "health-queen"){
      return false;
    }
    return true;
  }
}
