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

import { InspApiary } from '../../../_model/inspApiary';
import { InspHive } from '../../../_model/inspHive';
import { InspHiveService } from './../../service/api/insp-hive.service';
import { InspApiaryService } from './../../service/api/insp-apiary.service';

const PICTOS_APIARY = [
  {name:'A', img:'../../../../assets/icons/inspect/observations/queen_grey.png'},
  {name:'B', img:''},
  {name:'C', img:''},
  {name:'D', img:''},
  {name:'E', img:''},
  {name:'F', img:''},
  {name:'G', img:''},
  {name:'H', img:''},
  {name:'I', img:''},
  {name:'J', img:''},
  {name:'K', img:''},
  {name:'L', img:''},
  {name:'M', img:''},
  {name:'N', img:''},
];

const PICTOS_HIVES_ACTIONS = [
  {name:'z', img:''},
  {name:'y', img:''},
  {name:'x', img:''},
  {name:'w', img:''},
  {name:'v', img:''},
  {name:'u', img:''},
];

const PICTOS_HIVES_OBS = [
  {name:'Z1', img:''},
  {name:'Y2', img:''},
  {name:'X3', img:''},
  {name:'W4', img:''},
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
    private inspHiveService: InspHiveService
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
    this.displayActions();
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

  displayActions(): void{
    let table = (<HTMLTableElement>document.getElementById("apiary-op-table"));
    let tr, td, button;
    for(let i=0; i<PICTOS_APIARY.length; i++){
      // Create new row
      if( i%6 === 0 ){
        tr = document.createElement('tr');
      }
      td = document.createElement('td');
      button = document.createElement('button');
      button.classList.add('apiary-action');

      if(i === 0){
        button.classList.add('apiary-action-img');
        button.onclick = (evt: Event) => { this.test(evt) };
      }
      else{
        /* CHANGE DISPLAY TO IMAGE */
        button.textContent = PICTOS_APIARY[i].name;
        /* END */
        button.onclick = (evt: Event) => { this.apiaryActionButton(evt) };
      }

      td.appendChild(button);
      tr.appendChild(td);
      // Push row to table
      if( (i+1)%6 === 0 ){
        table.appendChild(tr);
      }
    }
    if(PICTOS_APIARY.length%6 !== 0){ // Push last row if not complete
      table.appendChild(tr);
    }
  }

  displayHives(): void{
    let tbody = document.getElementById("hives-table-body");
    tbody.innerHTML = ''; // Empty table
    let tr;
    for(let i=0; i<this.user_hives.length; i++){
      tr = document.createElement('tr');

      let tdRuche = document.createElement('td');
      tdRuche.textContent = this.user_hives[i].name;
      tr.appendChild(tdRuche);

      let tdAction = document.createElement('td');
      let mainDiv = document.createElement('div');

      let pA = document.createElement('p');
      pA.textContent = 'Actions';
      pA.style.paddingTop = '10px';
      pA.style.marginBottom = '-5px';
      pA.style.fontSize = '14px';
      mainDiv.appendChild(pA);

      let divA = document.createElement('div');
      divA.style.display = 'flex';
      divA.style.justifyContent = 'center';
      for(let j=0; j<PICTOS_HIVES_ACTIONS.length; j++){
        let divAction = document.createElement('div');
        divAction.className = 'hives-action';

        /* CHANGE DISPLAY TO IMAGE */
        divAction.textContent = PICTOS_HIVES_ACTIONS[j].name;
        /* END */

        divA.appendChild(divAction);
      }
      mainDiv.appendChild(divA);

      let pO = document.createElement('p');
      pO.textContent = 'Observations';
      pO.style.paddingTop = '10px';
      pO.style.marginBottom = '-5px';
      pO.style.fontSize = '14px';
      mainDiv.appendChild(pO);

      let divO = document.createElement('div');
      divO.style.display = 'flex';
      divO.style.justifyContent = 'center';
      for(let j=0; j<PICTOS_HIVES_OBS.length; j++){
        let divObs = document.createElement('div');
        divObs.className = 'hives-action';

        /* CHANGE DISPLAY TO IMAGE */
        divObs.textContent = PICTOS_HIVES_OBS[j].name;
        /* END */

        divO.appendChild(divObs);
      }
      divO.style.paddingBottom = '10px';
      mainDiv.appendChild(divO);

      tdAction.appendChild(mainDiv);
      tr.appendChild(tdAction);

      let tdNotes = document.createElement('td');
      tdNotes.textContent = 'N';
      tr.appendChild(tdNotes);

      let tdTaches = document.createElement('td');
      tdTaches.textContent = 'T';
      tr.appendChild(tdTaches);

      tbody.appendChild(tr);
    }
  }

  inspectDate(): void{
    //console.log(moment(this.inspect_date).format(this.user_pref.timeFormat));
    (<HTMLInputElement>document.getElementsByClassName('inspect-time-input')[0]).value = moment(this.inspect_date).format(this.user_pref.timeFormat);
    (<HTMLElement>document.getElementsByClassName('valid-icon')[0]).style.visibility ='visible';
  }

  onSelectChange(): void{
    (<HTMLElement>document.getElementsByClassName('valid-icon')[1]).style.visibility ='visible';
    this.active_apiary_index = (<HTMLSelectElement>document.getElementById("inspect-apiary-select")).selectedIndex;
    let index: number = this.active_apiary_index - 1;
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
    if( button.classList.contains('apiary-action-img-active') ){
        button.classList.remove('apiary-action-img-active');
        return;
    }
    button.classList.add('apiary-action-img-active');
    return;
  }

  apiaryActionButton(evt: Event): void{
    let button = (<HTMLButtonElement> evt.target);
    if( button.classList.contains('apiary-action-active') ){
        button.classList.remove('apiary-action-active');
        return;
    }
    button.classList.add('apiary-action-active');
    return;
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
    this.new_inspApiary.tasks = ['oui', 'oui2'];
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
      tasks: ['A', 'C', 'D'],
      notes: 'Test 1 hive',
      todo: 'Test all',
    };
    this.new_inspHives.push(aux);
    aux = {
      _id: null,
      inspId: null,
      date: new Date(),
      apiaryId: this.user_apiaries[this.active_apiary_index]._id,
      hiveId: this.user_hives[0]._id,
      tasks: ['D', 'F', 'G'],
      notes: 'Test 1 hive2',
      todo: 'Test all hives 2',
    }
    this.new_inspHives.push(aux);
    console.log(this.new_inspHives);
  }

}
