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

const IMG_PATH = '../../../../assets/icons/inspect/';

const PICTOS_APIARY_ACTIONS = [
  {name:'queen', img:'observations/crown_grey.png', img_active: 'observations/crown.png', class:'apiary-queen-img'},
  {name:'A2', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A3', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A4', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A5', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A6', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A7', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A8', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A9', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A10', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A11', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A12', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'A13', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  /*{name:'A14', img:''},
  {name:'A15', img:''},
  {name:'A16', img:''},
  {name:'A17', img:''},
  {name:'A18', img:''},
  {name:'A19', img:''},
  {name:'A20', img:''},
  {name:'A21', img:''},
  {name:'A22', img:''},
  {name:'A23', img:''},
  {name:'A24', img:''},*/
];

const PICTOS_APIARY_OBS = [
  {name:'O1', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O2', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O3', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O4', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O5', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O6', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O7', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O8', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O9', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O10', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'O11', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
];

const PICTOS_HIVES_ACTIONS = [
  {name:'z', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'y', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'x', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'w', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'v', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
  {name:'u', img:'default_grey.png', img_active:'default.png', class:'apiary-default-img'},
];

const PICTOS_HIVES_OBS = [
  {name:'swarm', img:'observations/swarm_grey.png', img_active: 'observations/swarm.png', class:'hives-swarm-img'},
  /*{name:'Y2', img:''},
  {name:'X3', img:''},
  {name:'W4', img:''},*/
];

@Component({
  selector: 'app-inspect-new',
  templateUrl: './inspect-new.component.html',
  styleUrls: ['./inspect-new.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InspectNewComponent implements OnInit {

  public user_pref : UserPref;

  public inspect_date: Date;
  public user_apiaries: RucherModel[];
  public user_hives: RucheInterface[];
  public active_apiary_index: number;

  public new_inspApiary: InspApiary = {
    _id: null,
    date: null,
    apiaryId: null,
    tasks: [],
    obs: [],
    notes: null,
    todo: null,
  };
  public new_inspHives: InspHive[] = [];

  constructor(
    private unitService: UnitService,
    private userPrefsService: UserParamsService,
    private rucherService: RucherService,
    private rucheService: RucheService,
    private userService: UserloggedService,
    private inspApiaryService: InspApiaryService,
    private inspHiveService: InspHiveService,
    public translateService: TranslateService,
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
    )
    this.displayApiaryActions();
    this.displayApiaryObs();
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

  // DISPLAY ACTIONS IN APIARY
  displayApiaryActions(): void{
    let table = (<HTMLTableElement>document.getElementById("apiary-op-table"));
    let tr, td, button;
    for(let i=0; i<PICTOS_APIARY_ACTIONS.length; i++){
      // Create new row
      if( i%8 === 0 ){
        tr = document.createElement('tr');
      }
      td = document.createElement('td');
      button = document.createElement('button');
      button.classList.add('apiary-action');

      button.classList.add(PICTOS_APIARY_ACTIONS[i].class);
      button.onclick = (evt: Event) => {
          let n = i;
          this.apiaryButton(evt, 'action', n);
      };


      td.appendChild(button);
      tr.appendChild(td);
      // Push row to table
      if( (i+1)%8 === 0 ){
        table.appendChild(tr);
      }
    }
    if(PICTOS_APIARY_ACTIONS.length%6 !== 0){ // Push last row if not complete
      table.appendChild(tr);
    }
  }

  // DISPLAY OBSERVATIONS IN APIARY
  displayApiaryObs(): void{
    let table = (<HTMLTableElement>document.getElementById("apiary-obs-table"));
    let tr, td, button;
    for(let i=0; i<PICTOS_APIARY_OBS.length; i++){
      // Create new row
      if( i%8 === 0 ){
        tr = document.createElement('tr');
      }
      td = document.createElement('td');
      button = document.createElement('button');
      button.classList.add('apiary-obs');

      button.classList.add(PICTOS_APIARY_OBS[i].class);
      button.onclick = (evt: Event) => {
        let n = i;
        this.apiaryButton(evt, 'obs', n)
      };

      td.appendChild(button);
      tr.appendChild(td);
      // Push row to table
      if( (i+1)%8 === 0 ){
        table.appendChild(tr);
      }
    }
    if(PICTOS_APIARY_OBS.length%6 !== 0){ // Push last row if not complete
      table.appendChild(tr);
    }
  }

  displayHives(): void{
    let tbody = document.getElementById("hives-table-body");
    tbody.innerHTML = ''; // Empty table
    let tr;
    for(let i=0; i<this.user_hives.length; i++){
      let div = document.createElement('div');
      div.className = 'hives-item';
      let div1 = document.createElement('div');
      div1.className = 'hives-div-main';
      div1.style.display ='flex';
      let divNote = document.createElement('div');
      divNote.className = 'hives-div-note';
      let divTodo = document.createElement('div');
      divTodo.className = 'hives-div-todo';

      let tdRuche = document.createElement('p');
      tdRuche.textContent = this.user_hives[i].name;
      div1.appendChild(tdRuche);

      let tdAction = document.createElement('div');
      let mainDiv = document.createElement('div');

      let divA = document.createElement('div');
      divA.style.display = 'flex';
      divA.style.justifyContent = 'center';
      for(let j=0; j<PICTOS_HIVES_ACTIONS.length; j++){
        let divAction = document.createElement('div');
        //divAction.className = 'hives-action';

        let button = document.createElement('button');
        button.className = 'hives-action';

        button.classList.add(PICTOS_HIVES_ACTIONS[j].class);
        button.onclick = (evt: Event) => {
          let n = i;
          let nb = j;
          this.hiveButton(evt, 'action', i, nb);
        };

        divAction.appendChild(button);
        divA.appendChild(divAction);
      }
      divA.style.marginTop = '15px';
      divA.style.marginLeft = '10px';
      mainDiv.appendChild(divA);

      let divO = document.createElement('div');
      divO.style.display = 'flex';
      divO.style.justifyContent = 'center';
      for(let j=0; j<PICTOS_HIVES_OBS.length; j++){
        let divObs = document.createElement('div');
        let button = document.createElement('button');
        button.className = 'hives-obs';

        button.classList.add(PICTOS_HIVES_OBS[j].class);
        button.onclick = (evt: Event) => {
          let n = i;
          let nb = j;
          this.hiveButton(evt, 'obs', n, nb)
        };

        divObs.appendChild(button);

        divO.appendChild(divObs);
      }
      divO.style.paddingBottom = '15px';
      divO.style.marginLeft = '10px';
      mainDiv.appendChild(divO);

      tdAction.appendChild(mainDiv);
      div1.appendChild(tdAction);

      let textAreaNotes = document.createElement('textarea');
      textAreaNotes.className = 'hives-note-textarea';
      textAreaNotes.name = 'text-note';
      textAreaNotes.spellcheck = false;
      textAreaNotes.cols = 40;
      textAreaNotes.rows = 5;
      textAreaNotes.placeholder = 'Notes...';
      textAreaNotes.onchange = (evt: Event) => {
        let n = i;
        this.saveInspHivesNotes(evt, n);
      }

      divNote.appendChild(textAreaNotes);

      let textAreaTodo = document.createElement('textarea');
      textAreaTodo.className = 'hives-todo-textarea';
      textAreaTodo.name = 'text-todo';
      textAreaTodo.spellcheck = false;
      textAreaTodo.cols = 40;
      textAreaTodo.rows = 5;
      textAreaTodo.placeholder = 'Todo...';
      textAreaTodo.onchange = (evt: Event) => {
        let n = i;
        this.saveInspHivesTodo(evt, n);
      }

      divTodo.appendChild(textAreaTodo);

      let tdNotes = document.createElement('div');
      let btnNotes = document.createElement('button');
      btnNotes.className = 'hives-notes';
      btnNotes.onclick = (evt: Event) => { this.toggleNote(evt) };
      tdNotes.appendChild(btnNotes);
      div1.appendChild(tdNotes);

      let tdTaches = document.createElement('div');
      let btnTaches = document.createElement('button');
      btnTaches.className = 'hives-todo';
      btnTaches.onclick = (evt: Event) => { this.toggleTodo(evt) };
      tdTaches.appendChild(btnTaches);
      div1.appendChild(tdTaches);

      div.appendChild(div1);

      div.appendChild(divNote);
      div.appendChild(divTodo);

      tbody.appendChild(div);

      this.createInspHive(i);
    }
  }

  inspectDate(): void{
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = moment(this.inspect_date).format(this.user_pref.timeFormat);
    /* NEW INSPECTION CHANGE DATE */
    this.new_inspApiary.date = new Date(this.inspect_date);
    this.new_inspHives.forEach(e => {
      e.date = new Date(this.inspect_date);
    });
    /* END */
    console.log(this.new_inspApiary.date);
    (<HTMLElement>document.getElementsByClassName('valid-icon-date')[0]).style.visibility ='visible';
  }

  onSelectChange(): void{
    (<HTMLElement>document.getElementsByClassName('valid-icon-select')[0]).style.visibility ='visible';
    this.active_apiary_index = (<HTMLSelectElement>document.getElementById("inspect-apiary-select")).selectedIndex;
    let index: number = this.active_apiary_index - 1;
    /* NEW INSPECTION CHANGE APIARY ID */
    this.new_inspApiary.apiaryId = this.user_apiaries[index]._id;
    this.new_inspHives = [];
    /* END */
    this.reset();
    this.rucheService.getHivesByApiary(this.user_apiaries[index]._id).subscribe(
      _hives => {
        this.user_hives = [..._hives];
      },
      () => {},
      () => {
        this.displayHives();
      }
    )
  }

  apiaryButton(evt: Event, type: string, btnIndex: number): void{
    let button = (<HTMLButtonElement> evt.target);
    if(type === 'action'){
      if( button.classList.contains(PICTOS_APIARY_ACTIONS[btnIndex].class + '-active') ){
        button.classList.remove(PICTOS_APIARY_ACTIONS[btnIndex].class + '-active');
        let i = this.new_inspApiary.tasks.findIndex(e => e.name === PICTOS_APIARY_ACTIONS[btnIndex].name);
        this.new_inspApiary.tasks.splice(i,1);
        return;
      }
      button.classList.add(PICTOS_APIARY_ACTIONS[btnIndex].class + '-active');
      this.new_inspApiary.tasks.push({name:PICTOS_APIARY_ACTIONS[btnIndex].name, img:PICTOS_APIARY_ACTIONS[btnIndex].img_active});
      return;
    }
    if(type === 'obs'){
      if( button.classList.contains(PICTOS_APIARY_OBS[btnIndex].class + '-active') ){
        button.classList.remove(PICTOS_APIARY_OBS[btnIndex].class + '-active');
        let i = this.new_inspApiary.obs.findIndex(e => e.name === PICTOS_APIARY_OBS[btnIndex].name);
        this.new_inspApiary.obs.splice(i,1);
        return;
      }
      button.classList.add(PICTOS_APIARY_OBS[btnIndex].class + '-active');
      this.new_inspApiary.obs.push({name:PICTOS_APIARY_OBS[btnIndex].name, img:PICTOS_APIARY_OBS[btnIndex].img_active});
      return;
    }
  }

  saveApiaryNotes(evt: Event): void{
    let textArea = <HTMLTextAreaElement>evt.target;
    this.new_inspApiary.notes = textArea.value;
  }

  saveApiaryTodo(evt: Event): void{
    let textArea = <HTMLTextAreaElement>evt.target;
    this.new_inspApiary.todo = textArea.value;
  }

  hiveButton(evt: Event, type: string, hiveIndex: number, btnIndex: number): void{
    let button = (<HTMLButtonElement> evt.target);
    if(type === 'action'){
      if( button.classList.contains(PICTOS_HIVES_ACTIONS[btnIndex].class + '-active') ){
        button.classList.remove(PICTOS_HIVES_ACTIONS[btnIndex].class + '-active');
        let i = this.new_inspHives[hiveIndex].tasks.findIndex(e => e.name === PICTOS_HIVES_ACTIONS[btnIndex].name);
        this.new_inspHives[hiveIndex].tasks.splice(i, 1);
        return;
      }
      button.classList.add(PICTOS_HIVES_ACTIONS[btnIndex].class + '-active');
      this.new_inspHives[hiveIndex].tasks.push({name:PICTOS_HIVES_ACTIONS[btnIndex].name, img:PICTOS_HIVES_ACTIONS[btnIndex].img_active});
      return;
    }
    if(type === 'obs'){
      if( button.classList.contains(PICTOS_HIVES_OBS[btnIndex].class + '-active') ){
        button.classList.remove(PICTOS_HIVES_OBS[btnIndex].class + '-active');
        let i = this.new_inspHives[hiveIndex].obs.findIndex(e => e.name === PICTOS_HIVES_OBS[btnIndex].name);
        this.new_inspHives[hiveIndex].obs.splice(i, 1);
        return;
      }
      button.classList.add(PICTOS_HIVES_OBS[btnIndex].class + '-active');
      this.new_inspHives[hiveIndex].obs.push({name:PICTOS_HIVES_OBS[btnIndex].name, img:PICTOS_HIVES_OBS[btnIndex].img_active});
      return;
    }
  }

  toggleNote(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    let textArea = button.parentNode.parentNode.parentNode.children[1].children[0];
    if(textArea.classList.contains('hives-note-textarea-active')){
      textArea.classList.add('hives-note-textarea-inactive');
      setTimeout(()=> {
        textArea.classList.remove('hives-note-textarea-inactive');
        textArea.classList.remove('hives-note-textarea-active');
      }, 400);
    }
    else{
      textArea.classList.add('hives-note-textarea-active');
    }

  }

  toggleTodo(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    let textArea = button.parentNode.parentNode.parentNode.children[2].children[0];
    if(textArea.classList.contains('hives-todo-textarea-active')){
      textArea.classList.add('hives-todo-textarea-inactive');
      setTimeout(()=> {
        textArea.classList.remove('hives-todo-textarea-inactive');
        textArea.classList.remove('hives-todo-textarea-active');
      }, 400);
    }
    else{
      textArea.classList.add('hives-todo-textarea-active');
    }
  }

  saveInspHivesNotes(evt: Event, hiveIndex: number): void{
    let textArea = <HTMLTextAreaElement>evt.target;
    this.new_inspHives[hiveIndex].notes = textArea.value;
  }

  saveInspHivesTodo(evt: Event, hiveIndex: number): void{
    let textArea = <HTMLTextAreaElement>evt.target;
    this.new_inspHives[hiveIndex].todo = textArea.value;
  }

  reset(): void{
    let apiAct: HTMLTableElement = (<HTMLTableElement>document.getElementById("apiary-op-table"));
    Array.from(apiAct.children).forEach((row,i) => {
      Array.from(row.children).forEach((cell,j) => {
        if(cell.children[0].classList.contains(PICTOS_APIARY_ACTIONS[i*8 + j].class + '-active')){
          cell.children[0].classList.remove(PICTOS_APIARY_ACTIONS[i*8 + j].class + '-active');
        }
      });
    });
    let apiObs: HTMLTableElement = (<HTMLTableElement>document.getElementById("apiary-obs-table"));
    Array.from(apiObs.children).forEach((row,i) => {
      Array.from(row.children).forEach((cell,j) => {
        if(cell.children[0].classList.contains(PICTOS_APIARY_OBS[i*8 + j].class + '-active')){
          cell.children[0].classList.remove(PICTOS_APIARY_OBS[i*8 + j].class + '-active');
        }
      });
    });
    let apiNotes: HTMLTextAreaElement = (<HTMLTextAreaElement>document.getElementsByClassName("apiary-notes-input")[0]);
    apiNotes.value = '';
    let apiTodo: HTMLTextAreaElement = (<HTMLTextAreaElement>document.getElementsByClassName("apiary-todo-input")[0]);
    apiTodo.value = '';

    this.new_inspApiary.tasks = [];
    this.new_inspApiary.obs = [];
    this.new_inspApiary.notes = null;
    this.new_inspApiary.todo = null;

  }

  removeInspHiveNull(): InspHive[]{
    let i = 0;
    let tab = [...this.new_inspHives];
    while(i < tab.length){
      if(
        tab[i].notes == null &&
        tab[i].todo == null &&
        tab[i].tasks.length === 0 &&
        tab[i].obs.length === 0
      ){
        tab.splice(i,1);
      }
      else{
        i += 1;
      }
    }
    return tab;
  }

  createInspHive(hiveIndex: number): void{
    let new_insp : InspHive = {
      _id: null,
      inspId: null,
      date: null,
      apiaryId: null,
      tasks: [],
      obs: [],
      hiveId: null,
      notes: null,
      todo: null,
    }
    if(this.new_inspApiary.date != null){
      new_insp.date = this.new_inspApiary.date;
    }
    new_insp.apiaryId = this.user_apiaries[this.active_apiary_index - 1]._id;
    new_insp.hiveId = this.user_hives[hiveIndex]._id;
    this.new_inspHives.push(new_insp);
  }

  deleteInspHive(index: number): void{
    this.new_inspHives.splice(index, 1);
  }

  saveInspection(): void{
    let hives_to_send = this.removeInspHiveNull();
    console.log(hives_to_send);
    this.inspApiaryService.createNewInspApiary(this.new_inspApiary).subscribe(
      () => {},
      () => {},
      () => {
        hives_to_send.forEach(insp => {
          this.inspHiveService.createNewInspHive(insp).subscribe(
            () => {}, () => {}, () => {}
          );
        })
      }
    );
  }

}
