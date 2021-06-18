import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { UserloggedService } from '../../../userlogged.service';
import { RucherModel } from '../../../_model/rucher-model';
import { UserPref } from '../../../_model/user-pref';
import { UserParamsService } from '../../preference-config/service/user-params.service';
import { RucheService } from '../../service/api/ruche.service';
import { RucherService } from '../../service/api/rucher.service';
import { UnitService } from '../../service/unit.service';
import { RucheInterface } from '../../../_model/ruche';
import { TranslateService } from '@ngx-translate/core';

import { InspApiary } from '../../../_model/inspApiary';
import { InspHive } from '../../../_model/inspHive';
import { InspHiveService } from './../../service/api/insp-hive.service';
import { InspApiaryService } from './../../service/api/insp-apiary.service';

import { Inspection } from '../../../_model/inspection';
import { InspectionService } from '../../service/api/inspection.service';
import { InspCat } from '../../../_model/inspCat';
import { InspCatService } from '../../service/api/insp-cat.service';
import { InspConf } from '../../../_model/inspConf';
import { InspUser } from '../../../_model/inspUser';
import { InspUserService } from '../../service/api/insp-user.service';
import { NotifierService } from 'angular-notifier';
import { e } from '@angular/core/src/render3';

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
    tasks: [],
    obs: [],
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
    tasks: [],
    obs: [],
    description: null,
    todo: null
  }

  public hive_insps: Inspection[];

  constructor(
    private inspService: InspectionService,
    private inspCatService: InspCatService,
    private inspUserService: InspUserService,
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
    public translateService: TranslateService,
    private notifyService: NotifierService,
  ) {}

  ngOnInit() {
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
      },
      () => {},
      () => {
        this.user_apiaries.sort(this.compare);
        this.rucheService.getHivesByApiary(this.user_apiaries[0]._id).subscribe(
          _hives => {
            this.user_hives = [..._hives];
          },
          () => {},
          () => {
          }
        )
      }
    );
    this.inspCatService.getInspCat().subscribe(
      _inspCat => {
        this.inspCat = [..._inspCat];
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

    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input-hours')[0]).disabled = true;
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input-minutes')[0]).disabled = true;
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
        if(nameCat === 'act'){
          index = this.new_apiary_insp.tasks.findIndex(_t => _t.name === inspCat.name)
          this.new_apiary_insp.tasks.splice(index, 1);
          button.style.border = '1px solid #ddd';
        }
        if(nameCat === 'obs'){
          index = this.new_apiary_insp.obs.findIndex(_t => _t.name === inspCat.name)
          this.new_apiary_insp.obs.splice(index, 1);
          button.style.border = '1px solid #ddd';
        }
        return;
      }
      if( type === 'hive' ){
        let indexInsp = this.hive_insps.findIndex( _i => _i.hiveId === ruche._id );
        if(nameCat === 'act'){
          index = this.hive_insps[indexInsp].tasks.findIndex(_t => _t.name === inspCat.name)
          this.hive_insps[indexInsp].tasks.splice(index, 1);
          button.style.border = '1px solid #ddd';
        }
        if(nameCat === 'obs'){
          index = this.hive_insps[indexInsp].obs.findIndex(_t => _t.name === inspCat.name)
          this.hive_insps[indexInsp].obs.splice(index, 1);
          button.style.border = '1px solid #ddd';
        }
        return;
      }
    }
    button.className = button.className.slice(0, -2);
    button.className += '_cb';
    if(type === 'apiary'){
      if(nameCat === 'act'){
        this.new_apiary_insp.tasks.push({name:inspCat.name, img:inspCat.img.toLocaleLowerCase() + '_b.svg'});
        button.style.border = '1px solid rgb(0, 180, 0)';
      }
      if(nameCat === 'obs'){
        this.new_apiary_insp.obs.push({name:inspCat.name, img:inspCat.img.toLocaleLowerCase() + '_b.svg'});
        button.style.border = '1px solid skyblue';
      }
      return;
    }
    if( type === 'hive' ){
      let indexInsp = this.hive_insps.findIndex( _i => _i.hiveId === ruche._id );
      if(nameCat === 'act'){
        index = this.hive_insps[indexInsp].tasks.push({name:inspCat.name, img:inspCat.img.toLocaleLowerCase() + '_b.svg'});
        button.style.border = '1px solid rgb(0, 180, 0)';
      }
      if(nameCat === 'obs'){
        index = this.hive_insps[indexInsp].obs.push({name:inspCat.name, img:inspCat.img.toLocaleLowerCase() + '_b.svg'});
        button.style.border = '1px solid skyblue';
      }
      return;
    }

  }

  onSelectChange(): void{
    this.active_apiary_index = (<HTMLSelectElement>document.getElementById('inspect-apiary-select')).selectedIndex;
    this.new_apiary_insp.apiaryId = this.user_apiaries[this.active_apiary_index - 1]._id;
    this.rucheService.getHivesByApiary(this.user_apiaries[this.active_apiary_index - 1]._id).subscribe(
      _hives => {
        this.user_hives = [..._hives];
      },
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
            tasks: [],
            obs: [],
            description: null,
            todo: null
          }
          this.hive_insps.push(insp);
        })
      }
    )
  }

  inspectDate(): void{
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = this.unitService.getDailyDate(this.inspect_date);
    this.new_apiary_insp.opsDate = new Date(this.inspect_date);
    this.hive_insps.forEach( _hInsp => {
      _hInsp.opsDate = this.inspect_date;
    });
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
    let textArea = button.parentNode.children[1];
    if(textArea.classList.contains('hide-textarea')){
      textArea.classList.remove('hide-textarea');
      return;
    }
    textArea.classList.add('hide-textarea');
    return;
  }

  toggleTodo(evt: Event): void{
    let button = <HTMLButtonElement>evt.target;
    let textArea = button.parentNode.children[1];
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
    return insp.obs.length === 0 &&
           insp.tasks.length === 0 &&
           (insp.description === '' || insp.description == null || insp.description == undefined)  &&
           (insp.todo === '' || insp.todo == null || insp.todo == undefined);
  }

  saveInspection(): void{
    if(this.inspect_date != null || this.inspect_date != undefined){
      let inspHivesToPush = [...this.hive_insps];
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
      this.inspService.insertApiaryInsp(this.new_apiary_insp).subscribe(
        _api_insp => {
          console.log(_api_insp);
          inspHivesToPush.forEach(_h => {
            _h.apiaryInspId = _api_insp._id;
            _h.createDate = new Date();
            this.inspService.insertHiveInsp(_h).subscribe(
              () => {}, () => {}, () => {}
            )
          });
        },
        () => {},
        () => {
          console.log(inspHivesToPush);
          if(this.translateService.currentLang === 'fr') {
            this.notifyService.notify('success', "Votre inspection a été enregistrée");
          } else {
            this.notifyService.notify('success', 'Your inspection has been saved');
          }
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

  setBeeLevel(lvl: string, entity: string, hive?: RucheInterface): void{
    let index;
    if(entity === 'apiary'){
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Lowbees', img:'lowbees_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Normbees', img:'normbees_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Highbees', img:'highbees_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById("bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("bees_high_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Nobees', img:'nobees_b.svg'});
          break;
      }
      return;
    }
    if(entity === 'hive'){
      let inspIndex;
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Lowbees', img:'lowbees_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Normbees', img:'normbees_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Highbees', img:'highbees_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_bees_high_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("bees"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Nobees', img:'nobees_b.svg'});
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
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Lowbrood', img:'lowbrood_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Normbrood', img:'normbrood_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Highbrood', img:'highbrood_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById("brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("brood_high_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Nobrood', img:'nobrood_b.svg'});
          break;
      }
      return;
    }
    if(entity === 'hive'){
      let inspIndex;
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Lowbrood', img:'lowbrood_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Normbrood', img:'normbrood_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Highbrood', img:'highbrood_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_brood_high_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("brood"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Nobrood', img:'nobrood_b.svg'});
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
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Lowres', img:'lowres_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Normres', img:'normres_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_none_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Highres', img:'highres_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById("res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById("res_high_check")).checked = false;
          index = this.new_apiary_insp.obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.new_apiary_insp.obs.splice(index,1);
          }
          this.new_apiary_insp.obs.push({name:'Nores', img:'nores_b.svg'});
          break;
      }
      return;
    }
    if(entity === 'hive'){
      let inspIndex;
      switch(lvl){
        case 'low':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Lowres', img:'lowres_b.svg'});
          break;
        case 'avg':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_high_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Normres', img:'normres_b.svg'});
          break;
        case 'high':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_none_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Highres', img:'highres_b.svg'});
          break;
        case 'none':
          (<HTMLInputElement>document.getElementById(hive.name + "_res_low_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_avg_check")).checked = false;
          (<HTMLInputElement>document.getElementById(hive.name + "_res_high_check")).checked = false;
          inspIndex = this.hive_insps.findIndex( _i => _i.hiveId === hive._id);
          index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name.includes("res"));
          if(index > -1){
            this.hive_insps[inspIndex].obs.splice(index,1);
          }
          this.hive_insps[inspIndex].obs.push({name:'Nores', img:'nores_b.svg'});
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
          if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Larva');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Drone');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-egg')[0];
          if(!button.classList.contains('brood-egg-active')){
            button.classList.add('brood-egg-active');
            this.new_apiary_insp.obs.push({name:'Egg', img:'egg_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'larva':
          if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Egg');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Drone');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-larva')[0];
          if(!button.classList.contains('brood-larva-active')){
            button.classList.add('brood-larva-active');
            this.new_apiary_insp.obs.push({name:'Larva', img:'larva_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'pupa':
          if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Egg');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Larva');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Drone');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-pupa')[0];
          if(!button.classList.contains('brood-pupa-active')){
            button.classList.add('brood-pupa-active');
            this.new_apiary_insp.obs.push({name:'Pupa', img:'pupa_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'drone':
          if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Egg');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Larva');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none-active')[0]).classList.remove('brood-none-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-drone')[0];
          if(!button.classList.contains('brood-drone-active')){
            button.classList.add('brood-drone-active');
            this.new_apiary_insp.obs.push({name:'Drone', img:'drone_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'none':
          if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Egg');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Larva');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Drone');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-none')[0];
          if(!button.classList.contains('brood-none-active')){
            button.classList.add('brood-none-active');
            this.new_apiary_insp.obs.push({name:'Nonebrood', img:'nobrood_cb.svg'});
            console.log(this.new_apiary_insp.obs);
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
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.contains('brood-larva-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.remove('brood-larva-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Larva');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.contains('brood-pupa-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.remove('brood-pupa-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Pupa');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.contains('brood-drone-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.remove('brood-drone-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Drone');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0];
          if(!button.classList.contains('brood-egg-active')){
            button.classList.add('brood-egg-active');
            this.hive_insps[inspIndex].obs.push({name:'Egg', img:'egg_cb.svg'});
          }

          break;
        case 'larva':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.contains('brood-egg-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.remove('brood-egg-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Egg');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.contains('brood-pupa-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.remove('brood-pupa-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Pupa');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.contains('brood-drone-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.remove('brood-drone-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Drone');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0];
          if(!button.classList.contains('brood-larva-active')){
            button.classList.add('brood-larva-active');
            this.hive_insps[inspIndex].obs.push({name:'Larva', img:'larva_cb.svg'});
          }

          break;
        case 'pupa':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.contains('brood-egg-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.remove('brood-egg-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Egg');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.contains('brood-larva-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.remove('brood-larva-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Larva');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.contains('brood-drone-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.remove('brood-drone-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Drone');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0];
          if(!button.classList.contains('brood-pupa-active')){
            button.classList.add('brood-pupa-active');
            this.hive_insps[inspIndex].obs.push({name:'Pupa', img:'pupa_cb.svg'});
          }

          break;
        case 'drone':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0]).classList.remove('brood-none-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Nonebrood');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.contains('brood-egg-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.remove('brood-egg-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Egg');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.contains('brood-larva-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.remove('brood-larva-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Larva');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.contains('brood-pupa-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.remove('brood-pupa-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Pupa');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0];
          if(!button.classList.contains('brood-drone-active')){
            button.classList.add('brood-drone-active');
            this.hive_insps[inspIndex].obs.push({name:'Drone', img:'drone_cb.svg'});
          }

          break;
        case 'none':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.contains('brood-egg-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_egg')[0]).classList.remove('brood-egg-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Egg');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.contains('brood-larva-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_larva')[0]).classList.remove('brood-larva-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Larva');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.contains('brood-pupa-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_pupa')[0]).classList.remove('brood-pupa-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Pupa');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.contains('brood-drone-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_drone')[0]).classList.remove('brood-drone-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Drone');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_none')[0];
          if(!button.classList.contains('brood-none-active')){
            button.classList.add('brood-none-active');
            this.hive_insps[inspIndex].obs.push({name:'Nonebrood', img:'nobrood_cb.svg'});
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
        case 'dead':
          if(<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0]).classList.remove('health-sick-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Sick');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0]).classList.remove('health-average-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Average');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0]).classList.remove('health-queen-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Queen');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0]).classList.remove('health-swarm-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Swarm');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('health-dead')[0];
          if(!button.classList.contains('health-dead-active')){
            button.classList.add('health-dead-active');
            this.new_apiary_insp.obs.push({name:'Dead', img:'dead_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }
          break;
        case 'sick':
          if(<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0]).classList.remove('health-dead-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Dead');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0]).classList.remove('health-average-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Average');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0]).classList.remove('health-queen-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Queen');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0]).classList.remove('health-swarm-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Swarm');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('health-sick')[0];
          if(!button.classList.contains('health-sick-active')){
            button.classList.add('health-sick-active');
            this.new_apiary_insp.obs.push({name:'Sick', img:'sick_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'average':
          if(<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0]).classList.remove('health-dead-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Dead');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0]).classList.remove('health-sick-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Sick');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0]).classList.remove('health-queen-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Queen');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0]).classList.remove('health-swarm-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Swarm');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('health-average')[0];
          if(!button.classList.contains('health-average-active')){
            button.classList.add('health-average-active');
            this.new_apiary_insp.obs.push({name:'Average', img:'average_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'queen':
          if(<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0]).classList.remove('health-dead-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Dead');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0]).classList.remove('health-sick-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Sick');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0]).classList.remove('health-average-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Average');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-swarm-active')[0]).classList.remove('health-swarm-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Swarm');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('health-queen')[0];
          if(!button.classList.contains('health-queen-active')){
            button.classList.add('health-queen-active');
            this.new_apiary_insp.obs.push({name:'Queen', img:'queen_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
        case 'swarm':
          if(<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-dead-active')[0]).classList.remove('health-dead-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Dead');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-sick-active')[0]).classList.remove('health-sick-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Sick');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-average-active')[0]).classList.remove('health-average-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Average');
            this.new_apiary_insp.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('health-queen-active')[0]).classList.remove('health-queen-active');
            index = this.new_apiary_insp.obs.findIndex(_o => _o.name === 'Queen');
            this.new_apiary_insp.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('health-swarm')[0];
          if(!button.classList.contains('health-swarm-active')){
            button.classList.add('health-swarm-active');
            this.new_apiary_insp.obs.push({name:'Swarm', img:'swarm_cb.svg'});
            console.log(this.new_apiary_insp.obs);
          }

          break;
      }
      return;
    }
    if(entity === 'hive'){
      inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
      switch(health){
        case 'dead':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.contains('health-swarm-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.remove('health-swarm-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Swarm');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.contains('health-sick-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.remove('health-sick-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Sick');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.contains('health-average-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.remove('health-average-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Average');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.contains('health-queen-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.remove('health-queen-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Queen');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0];
          if(!button.classList.contains('health-dead-active')){
            button.classList.add('health-dead-active');
            this.hive_insps[inspIndex].obs.push({name:'Dead', img:'dead_cb.svg'});
          }

          break;
        case 'sick':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.contains('health-swarm-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.remove('health-swarm-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Swarm');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.contains('health-dead-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.remove('health-dead-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Dead');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.contains('health-average-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.remove('health-average-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Average');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.contains('health-queen-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.remove('health-queen-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Queen');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0];
          if(!button.classList.contains('health-sick-active')){
            button.classList.add('health-sick-active');
            this.hive_insps[inspIndex].obs.push({name:'Sick', img:'sick_cb.svg'});
          }

          break;
        case 'average':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.contains('health-swarm-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.remove('health-swarm-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Swarm');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.contains('health-dead-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.remove('health-dead-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Dead');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.contains('health-sick-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.remove('health-sick-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Sick');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.contains('health-queen-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.remove('health-queen-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Queen');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0];
          if(!button.classList.contains('health-average-active')){
            button.classList.add('health-average-active');
            this.hive_insps[inspIndex].obs.push({name:'Average', img:'average_cb.svg'});
          }

          break;
        case 'queen':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.contains('health-swarm-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0]).classList.remove('health-swarm-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Swarm');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.contains('health-dead-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.remove('health-dead-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Dead');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.contains('health-sick-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.remove('health-sick-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Sick');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.contains('health-average-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.remove('health-average-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Average');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0];
          if(!button.classList.contains('health-queen-active')){
            button.classList.add('health-queen-active');
            this.hive_insps[inspIndex].obs.push({name:'Queen', img:'queen_cb.svg'});
          }

          break;
        case 'swarm':
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.contains('health-dead-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_dead')[0]).classList.remove('health-dead-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Dead');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.contains('health-sick-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_sick')[0]).classList.remove('health-sick-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Sick');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.contains('health-average-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_average')[0]).classList.remove('health-average-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Average');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }
          if((<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.contains('health-queen-active')){
            (<HTMLButtonElement>document.getElementsByClassName(hive.name + '_queen')[0]).classList.remove('health-queen-active');
            inspIndex = this.hive_insps.findIndex(_i => _i.hiveId === hive._id);
            index = this.hive_insps[inspIndex].obs.findIndex(_o => _o.name === 'Queen');
            this.hive_insps[inspIndex].obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName(hive.name + '_swarm')[0];
          if(!button.classList.contains('health-swarm-active')){
            button.classList.add('health-swarm-active');
            this.hive_insps[inspIndex].obs.push({name:'Swarm', img:'swarm_cb.svg'});
          }
          break;
      }
      return;
    }
  }

}
