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
  {name:'queen', img:'observations/crown_grey.svg', img_active: 'observations/crown.svg', class:'apiary-queen-img'},
  {name:'A2', img:'', class:''},
  {name:'A3', img:'', class:''},
  {name:'A4', img:'', class:''},
  {name:'A5', img:'', class:''},
  {name:'A6', img:'', class:''},
  {name:'A7', img:'', class:''},
  {name:'A8', img:'', class:''},
  {name:'A9', img:'', class:''},
  {name:'A10', img:'', class:''},
  {name:'A11', img:'', class:''},
  {name:'A12', img:'', class:''},
  {name:'A13', img:'', class:''},
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
  {name:'O1', img:'', class:''},
  {name:'O2', img:'', class:''},
  {name:'O3', img:'', class:''},
  {name:'O4', img:'', class:''},
  {name:'O5', img:'', class:''},
  {name:'O6', img:'', class:''},
  {name:'O7', img:'', class:''},
  {name:'O8', img:'', class:''},
  {name:'O9', img:'', class:''},
  {name:'O10', img:'', class:''},
  {name:'O11', img:'', class:''},
];

const PICTOS_HIVES_ACTIONS = [
  {name:'z', img:'', class:''},
  {name:'y', img:'', class:''},
  {name:'x', img:'', class:''},
  {name:'w', img:'', class:''},
  {name:'v', img:'', class:''},
  {name:'u', img:'', class:''},
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
        console.log(this.user_apiaries);
        this.initFakeInspApi();
        this.rucheService.getHivesByApiary(this.user_apiaries[0]._id).subscribe(
          _hives => {
            this.user_hives = [..._hives];
          },
          () => {},
          () => {
            this.initFakeInspHives();
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

      if(i === 0){
        button.classList.add('apiary-queen-img');
        button.onclick = (evt: Event) => { this.test(evt) };
      }
      else{
        /* CHANGE DISPLAY TO IMAGE */
        button.textContent = PICTOS_APIARY_ACTIONS[i].name;
        /* END */
        button.onclick = (evt: Event) => { this.apiaryButton(evt) };
      }

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

      /* CHANGE DISPLAY TO IMAGE */
      button.textContent = PICTOS_APIARY_OBS[i].name;
      /* END */
      button.onclick = (evt: Event) => { this.apiaryButton(evt) };

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

        if(PICTOS_HIVES_ACTIONS[j].class !== ''){
          button.classList.add(PICTOS_HIVES_ACTIONS[j].class);
          button.onclick = (evt: Event) => {
            let nb = j;
            this.hiveButton(evt, 'action', nb)
          };
        }
        else{
          /* CHANGE DISPLAY TO IMAGE */
          button.textContent = PICTOS_HIVES_ACTIONS[j].name;
          /* END */
          button.onclick = (evt: Event) => { this.apiaryButton(evt) };
        }

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

        if(PICTOS_HIVES_OBS[j].class !== ''){
          button.classList.add(PICTOS_HIVES_OBS[j].class);
          button.onclick = (evt: Event) => {
            let nb = j;
            this.hiveButton(evt, 'obs', nb)
          };
        }
        else{
          /* CHANGE DISPLAY TO IMAGE */
          button.textContent = PICTOS_HIVES_OBS[j].name;
          /* END */
          button.onclick = (evt: Event) => { this.apiaryButton(evt) };
        }

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

      divNote.appendChild(textAreaNotes);

      let textAreaTodo = document.createElement('textarea');
      textAreaTodo.className = 'hives-todo-textarea';
      textAreaTodo.name = 'text-todo';
      textAreaTodo.spellcheck = false;
      textAreaTodo.cols = 40;
      textAreaTodo.rows = 5;
      textAreaTodo.placeholder = 'Todo...';

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
    }
  }

  inspectDate(): void{
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = moment(this.inspect_date).format(this.user_pref.timeFormat);
    /* NEW INSPECTION CHANGE DATE */
    this.new_inspApiary.date = new Date(this.inspect_date);
    this.new_inspHives.forEach(e => {
      e.date = new Date(this.inspect_date);
    })
    /* END */
    console.log(this.new_inspApiary.date);
    (<HTMLElement>document.getElementsByClassName('valid-icon')[0]).style.visibility ='visible';
  }

  onSelectChange(): void{
    (<HTMLElement>document.getElementsByClassName('valid-icon')[1]).style.visibility ='visible';
    this.active_apiary_index = (<HTMLSelectElement>document.getElementById("inspect-apiary-select")).selectedIndex;
    let index: number = this.active_apiary_index - 1;
    /* NEW INSPECTION CHANGE APIARY ID */
    this.new_inspApiary.apiaryId = this.user_apiaries[index]._id;
    /* END */
    this.rucheService.getHivesByApiary(this.user_apiaries[index]._id).subscribe(
      _hives => {
        console.log(_hives);
        this.user_hives = [..._hives];
      },
      () => {},
      () => {
        this.displayHives();
      }
    )
  }

  test(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    if( button.classList.contains('apiary-queen-img-active') ){
        button.classList.remove('apiary-queen-img-active');
        return;
    }
    button.classList.add('apiary-queen-img-active');
    return;
  }

  apiaryButton(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    if( button.classList.contains('apiary-btn-active') ){
        button.classList.remove('apiary-btn-active');
        return;
    }
    button.classList.add('apiary-btn-active');
    return;
  }

  hiveButton(evt: Event, type: string, index: number): void{
    console.log(index);
    let button = (<HTMLButtonElement> evt.target);
    if(type === 'action'){
      if( button.classList.contains(PICTOS_HIVES_ACTIONS[index].class + '-active') ){
        button.classList.remove(PICTOS_HIVES_ACTIONS[index].class + '-active');
        return;
      }
      button.classList.add(PICTOS_HIVES_ACTIONS[index].class + '-active');
      return;
    }
    if(type === 'obs'){
      if( button.classList.contains(PICTOS_HIVES_OBS[index].class + '-active') ){
        button.classList.remove(PICTOS_HIVES_OBS[index].class + '-active');
        return;
      }
      button.classList.add(PICTOS_HIVES_OBS[index].class + '-active');
      return;
    }
  }

  toggleNote(evt: Event){
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

  toggleTodo(evt: Event){
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

  reset(){

  }

  saveInspection(): void{
    this.inspApiaryService.createNewInspApiary(this.new_inspApiary).subscribe(
      () => {},
      () => {},
      () => {
        this.new_inspHives.forEach(insp => {
          this.inspHiveService.createNewInspHive(insp).subscribe(
            () => {}, () => {}, () => {}
          );
        })
      }
    );
  }

  initFakeInspApi(): void{
    this.new_inspApiary._id = null;
    this.new_inspApiary.date = new Date();
    this.new_inspApiary.apiaryId = this.user_apiaries[this.active_apiary_index]._id;
    this.new_inspApiary.tasks = [
      {name:'A2', img:''},
      {name:'A3', img:''},
    ];
    this.new_inspApiary.obs = [
      {name:'O2', img:''},
    ];
    this.new_inspApiary.notes = 'Je teste un truc';
    this.new_inspApiary.todo = 'Faut regler les soucis';
  }

  initFakeInspHives(): void{
    let aux: InspHive = {
      _id: null,
      inspId: null,
      date: new Date(),
      apiaryId: this.user_apiaries[this.active_apiary_index]._id,
      hiveId: this.user_hives[0]._id,
      tasks: [
        {name:'A', img:''},
        {name:'C', img:''}
      ],
      obs: [
        {name:'swarm', img:'observations/swarm.png'}
      ],
      notes: 'Test 1 hive',
      todo: 'Test all',
    };
    this.new_inspHives.push(aux);
  }
}
