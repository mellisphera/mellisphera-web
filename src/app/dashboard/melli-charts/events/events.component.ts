import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Inspection } from '../../../_model/inspection';
import { AlertInterface } from '../../../_model/alert';
import { RucheInterface } from '../../../_model/ruche';
import { RucheService } from '../../service/api/ruche.service';
import { MelliChartsFilterService } from '../service/melli-charts-filter.service';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { AlertsService } from '../../service/api/alerts.service';
import { InspectionService } from '../../service/api/inspection.service';
import { StackMelliChartsService } from '../stack/service/stack-melli-charts.service';
import { iif, Observable } from 'rxjs';
import { UnitService } from '../../service/unit.service';
import { RucherService } from '../../service/api/rucher.service';
import { TranslateService } from '@ngx-translate/core';
import { RucherModel } from '../../../_model/rucher-model';
import { observeOn } from 'rxjs/operators';
import { P } from '@angular/core/src/render3';

const INSPECT_IMG_PATH = '../../../../assets/icons/inspect/';
const ALERT_IMG_PATH = '../../../../assets/pictos_alerts/charts/';
const PICTOS_HIVES_OBS = [
  {name:'swarm', img: 'observations/swarm_grey.png', img_active: 'observations/swarm.png', class: 'hives-swarm-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'default', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
];

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css','../melli-charts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit {

  private table: HTMLTableElement;
  private tbody: HTMLTableElement;

  private events: Inspection[] = [];
  private alerts: AlertInterface[] = [];

  private apiaries: string[] = [];
  private hives: string[] = [];

  public eventToEdit: Inspection;
  public alertToEdit: AlertInterface;

  public hiveEvent: RucheInterface;
  public apiaryEvent: RucherModel;
  public newEventDate: Date;

  constructor(
    private rucheService: RucheService,
    private rucherService: RucherService,
    private melliFilters: MelliChartsFilterService,
    private melliDate: MelliChartsDateService,
    private alertService: AlertsService,
    private inspService: InspectionService,
    private stackService: StackMelliChartsService,
    private unitService: UnitService,
    private translate: TranslateService
  )
  { }

  ngOnInit() {
    this.table = <HTMLTableElement>document.getElementsByClassName("table-events")[0];
    this.tbody = <HTMLTableElement>document.getElementsByClassName("table-body-events")[0];
    this.events = [];
    this.alerts = [];

    const elt = document.getElementsByClassName('apiaryGroup')[0];
    if (elt.classList.contains('apiary-group-brood')) {
      elt.classList.remove('apiary-group-brood');
    } else if (elt.classList.contains('apiary-group-stack')) {
      elt.classList.remove('apiary-group-stack');
    } else if (elt.classList.contains('apiary-group-weight')){
      elt.classList.remove('apiary-group-weight');
    } else if (elt.classList.contains('apiary-group-hive')){
      elt.classList.remove('apiary-group-hive');
    }
    elt.classList.add('apiary-group-events');

    this.getApiariesId();
    this.getHivesId();

    this.loadAll();
  }

  getHiveIndex(hive: RucheInterface): number {
    return this.rucheService.ruchesAllApiary.findIndex(elt => elt._id === hive._id);
  }

  getApiariesId(): string[]{
    this.apiaries = [ ...Array.from(new Set( this.stackService.getHiveSelect().map(_hive => _hive.apiaryId) )) ];
    return this.apiaries;
  }

  getHivesId(): string[]{
    this.hives = [...this.stackService.getHiveSelectIds()];
    return this.hives;
  }

  apiaryLoaded(apiaryId: string): boolean{
    if(this.apiaries.findIndex(_id => _id === apiaryId) > -1){
      return true;
    }
    return false;
  }

  loadAll(): void{
    this.tbody.innerHTML = '';
    let locations = [];
    this.events = [];
    this.alerts = [];
    if(this.melliFilters.getFilters().alert){
      locations.push('Hive');
      locations.push('Apiary');
    }
    const obsInsp = this.getApiariesId().map(_id => {
      return { _id: _id,
               obs: this.inspService.getInspectionByFilters(_id,
                                                            this.stackService.getHiveSelectIds(),
                                                            this.melliDate.getRangeForReqest(),
                                                            this.melliFilters.getEventArrayFilter(),
                                                            this.melliFilters.getPictosArrayFilter().map(s => s.toLowerCase()),
                                                            true
                                                           )
              }
    });
    const obsAlert = this.getApiariesId().map(_id => {
      return { _id: _id,
               obs: this.alertService.getAlertsByFilters(_id,
                                                         this.stackService.getHiveSelectIds(),
                                                         this.melliDate.getRangeForReqest(),
                                                         this.melliFilters.getPictosArrayFilter(),
                                                         locations
                                                        )
              }
    });
    Observable.forkJoin(obsInsp.map(_elt => _elt.obs)).subscribe(
      insps_events => {
        insps_events.forEach(_elt => {
          _elt.forEach((_insp,i) => {
            this.tbody.appendChild( this.createRowInsp(_insp, i) );
          });
          this.events.push(..._elt);
        });
      },
      () => {},
      () => {}
    );

    Observable.forkJoin(obsAlert.map(_elt => _elt.obs)).subscribe(
      alerts => {
        alerts.forEach(_elt => {
          _elt.forEach((_alert,i) => {
            this.tbody.appendChild( this.createRowAlert(_alert, i) );
          });
          this.alerts.push(..._elt);
        });
      },
      () => {},
      () => {}
    );

  }

  loadHive(hive: RucheInterface): void {
    let types = [];
    let locations = [];
    if(this.melliFilters.getShowEvent()){
      types.push('hive');
    }
    if(this.melliFilters.getShowAlert()){
      locations.push('Hive');
      locations.push('Apiary');
    }
    if(!this.apiaryLoaded(hive.apiaryId) && this.melliFilters.getFilters().insp){
      types.push('apiary');
      this.apiaries.push(hive.apiaryId);
    }
    this.inspService.getInspectionByFilters(hive.apiaryId, [hive._id], this.melliDate.getRangeForReqest(), types, this.melliFilters.getPictosArrayFilter().map(s => s.toLowerCase()), true).subscribe(
      _inspections => {
        _inspections.forEach((_insp,i) => {
          this.tbody.insertBefore(this.createRowInsp(_insp, i), this.tbody.firstElementChild);
        });
        this.events.push(..._inspections);
      },
      () => {},
      () => {}
    );
    this.alertService.getAlertsByFilters(hive.apiaryId, [hive._id], this.melliDate.getRangeForReqest(), this.melliFilters.getPictosArrayFilter(), locations).subscribe(
      _alerts => {
        _alerts.forEach((_alt,i) => {
          this.tbody.insertBefore(this.createRowAlert(_alt, i), this.tbody.firstElementChild);
        })
        this.alerts.push(..._alerts);
      },
      () => {},
      () => {}
    );
  }

  removeHive(hive: RucheInterface): void {
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[1].innerHTML === hive.name){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
    if(this.stackService.getHiveSelectFromApiaryId(hive.apiaryId) === 0){
      this.removeApiary(this.rucherService.getApiaryByApiaryId(hive.apiaryId));
    }
  }

  removeApiary(apiary: RucherModel): void {
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[0].innerHTML === apiary.name){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
    let index = this.apiaries.findIndex(_id => _id === apiary._id);
    if(index > -1){
      this.apiaries.splice(index, 1);
    }
  }

  applyFilter(filter: string, show: boolean): void{
    if(!show){
      this.removeByFilter(filter);
      return;
    }
    this.addByFilter(filter);
    return;

  }

  removeByFilter(filter: string): void{
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      if(row.cells[3].className.includes(filter)){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }
    }
  }

  addByFilter(filter: string): void{
    switch(filter){
      case 'inspection':
        const obsInsp = this.getApiariesId().map(_id => {
          return { _id: _id,
                   obs: this.inspService.getInspectionByFilters(_id,
                                                                this.stackService.getHiveSelectIds(),
                                                                this.melliDate.getRangeForReqest(),
                                                                ['apiary'],
                                                                this.melliFilters.getPictosArrayFilter().map(s => s.toLowerCase()),
                                                                true
                                                               )
                  }
          });
          Observable.forkJoin(obsInsp.map(_elt => _elt.obs)).subscribe(
            _insps_apiary => {
              _insps_apiary.forEach(_elt => {
                _elt.forEach((_insp,i) => {
                  this.tbody.insertBefore(this.createRowInsp(_insp, i), this.tbody.firstElementChild);
                });
                this.events.push(..._elt);
              });
            },
            () => {},
            () => {}
          );
        break;
      case 'event':
        const obsEvent = this.getApiariesId().map(_id => {
          return { _id: _id,
                   obs: this.inspService.getInspectionByFilters(_id,
                                                                this.stackService.getHiveSelectIds(),
                                                                this.melliDate.getRangeForReqest(),
                                                                ['hive'],
                                                                this.melliFilters.getPictosArrayFilter().map(s => s.toLowerCase()),
                                                                true
                                                               )
                  }
          });
          Observable.forkJoin(obsEvent.map(_elt => _elt.obs)).subscribe(
            _insps_hive => {
              _insps_hive.forEach(_elt => {
                _elt.forEach((_insp, i) => {
                  this.tbody.insertBefore(this.createRowInsp(_insp, i), this.tbody.firstElementChild);
                });
                this.events.push(..._elt);
              });
            },
            () => {},
            () => {}
          );
        break;
      case 'alert':
        let locations = ['Apiary','Hive'];
        const obsAlert = this.getApiariesId().map(_id => {
          return { _id: _id,
                   obs: this.alertService.getAlertsByFilters(_id,
                                                             this.stackService.getHiveSelectIds(),
                                                             this.melliDate.getRangeForReqest(),
                                                             this.melliFilters.getPictosArrayFilter(),
                                                             locations
                                                            )
                  }
          });
          Observable.forkJoin(obsAlert.map(_elt => _elt.obs)).subscribe(
            _alerts => {
              _alerts.forEach(_elt => {
                _elt.forEach((_alt, i) => {
                  this.tbody.insertBefore(this.createRowAlert(_alt, i), this.tbody.firstElementChild);
                });
                this.alerts.push(..._elt);
              });
            },
            () => {},
            () => {}
          );
        break;
      default:
        break;
    }
  }

  applyDisplay(display: string, show: boolean): void{
    if(!show){
      this.removeByDisplay(display);
      return;
    }
    this.addByDisplay(display);
    return;
  }

  removeByDisplay(display: string): void{
    let i=0;
    while(i<this.tbody.rows.length){
      let row: HTMLTableRowElement = this.tbody.rows[i];
      let div: HTMLDivElement = <HTMLDivElement>row.cells[4].firstElementChild;
      let j=0;
      let suppr: Boolean = false;
      if(div != null){
        whileRow:
        while(j<div.childElementCount){
          let picto = div.children[j];
          if(picto.className.toLowerCase().includes(display.toLowerCase())){
            suppr = true;
            break whileRow;
          }
          j++;
        }
      }

      if(suppr){
        this.tbody.deleteRow(i);
      }
      else{
        i++;
      }

    }
  }

  addByDisplay(display: string): void{
    let types = [];
    let locations = [];
    if(this.melliFilters.getShowInsp()){
      types.push('apiary');
    }
    if(this.melliFilters.getShowEvent()){
      types.push('hive');
    }
    if(this.melliFilters.getShowAlert()){
      locations.push('Hive');
      locations.push('Apiary');
    }
    const obsInsp = this.getApiariesId().map(_id => {
      return { _id: _id,
               obs: this.inspService.getInspectionByFilters(_id,
                                                            this.stackService.getHiveSelectIds(),
                                                            this.melliDate.getRangeForReqest(),
                                                            this.melliFilters.getEventArrayFilter(),
                                                            [display.toLowerCase()],
                                                            false
                                                           )
              }
      });;
    const obsAlert = this.getApiariesId().map(_id => {
      return { _id: _id,
               obs: this.alertService.getAlertsByFilters(_id,
                                                         this.stackService.getHiveSelectIds(),
                                                         this.melliDate.getRangeForReqest(),
                                                         [display],
                                                         locations
                                                        )
              }
    });
    Observable.forkJoin(obsInsp.map(_elt => _elt.obs)).subscribe(
      insps_events => {
        insps_events.forEach(_elt => {
          _elt.forEach((_insp, i) => {
            this.tbody.insertBefore( this.createRowInsp(_insp, i), this.tbody.firstElementChild);
          });
          this.events.push(..._elt);
        });
      },
      () => {},
      () => {}
    );
    Observable.forkJoin(obsAlert.map(_elt => _elt.obs)).subscribe(
      _alerts => {
        _alerts.forEach(_elt => {
          _elt.forEach((_alt, i) => {
            this.tbody.insertBefore(this.createRowAlert(_alt, i), this.tbody.firstElementChild);
          });
          this.alerts.push(..._elt);
        });
      },
      () => {},
      () => {}
    );
  }

  edit(type: string, evt: Event): void{
    let icon = <HTMLElement>evt.target;
    let row = <HTMLTableRowElement>icon.parentNode.parentNode;
    let _id: string = row.cells[8].innerHTML;
    if(type === 'insp'){
      this.eventToEdit = this.events.find(_insp => _insp._id === _id);
      if(this.eventToEdit.type === 'hive'){
        this.hiveEvent = this.rucheService.getHiveById(this.eventToEdit.apiaryId);
        this.newEventDate = new Date(this.eventToEdit.opsDate);
      }
      if(this.eventToEdit.type === 'apiary'){
        this.apiaryEvent = this.rucherService.getApiaryByApiaryId(this.eventToEdit.apiaryId);
        this.newEventDate = new Date(this.eventToEdit.opsDate);
      }
      $('#editInspectionModal').modal('show');
      this.addObsList();
    }
    if(type === 'alert'){
      this.alertToEdit = this.alerts.find(_alt => _alt._id === _id);
      return;
    }
  }

  confirmEditEvent(): void{

  }

  confirmEditAlert(): void{

  }

  cancelEditEvent(): void{

  }

  cancelEditAlert(): void{

  }

  remove(type: string, evt: Event): void{
    if(type === 'insp'){
      return;
    }
    if(type === 'alert'){
      return;
    }
  }

  createRowInsp(_insp: Inspection, index: number): HTMLTableRowElement{
    let tr = document.createElement('tr');
    tr.style.marginBottom = '5px';
    tr.style.borderBottom = '1px solid #ddd';

    let cell1 = document.createElement('td');
    cell1.innerHTML = this.rucherService.getRucherNameById(_insp.apiaryId).name;

    let cell2 = document.createElement('td');
    if(_insp.hiveId != null){
      cell2.innerHTML = this.rucheService.getRucheNameById(_insp.hiveId).name;
    }

    let cell3 = document.createElement('td');
    let hours = '' + new Date(_insp.opsDate).getHours();
    let minutes = '' + new Date(_insp.opsDate).getMinutes();
    if(new Date(_insp.opsDate).getHours() < 10){
      hours = '0' + new Date(_insp.opsDate).getHours();
    }
    if(new Date(_insp.opsDate).getMinutes() < 10){
      minutes = '0' + new Date(_insp.opsDate).getMinutes();
    }
    cell3.innerHTML = this.unitService.getDailyDate(_insp.opsDate) + '<br />' + hours + ':' +  minutes;

    let cell4 = document.createElement('td');
    if(_insp.type === 'apiary'){
      cell4.className = 'inspection-icon';
    }
    else{
      cell4.className = 'event-icon';
    }

    // Liste des pictos
    let cell5 = document.createElement('td');
    let container = document.createElement('div');
    container.className = "event-obs-container";
    if(_insp.obs != null){
      _insp.obs.forEach(_obs => {
        let div = document.createElement('div');
        div.style.background = "url('../../../../assets/icons/inspect/"+ _obs.img +"') center no-repeat";
        div.style.backgroundSize = "30px";
        div.className = "event-obs-item " + _obs.name;
        container.appendChild(div);
      });
      cell5.appendChild(container);
    }

     // Notes & taches
    let cell6 = document.createElement('td');
    var text = _insp.description;
    var match = /\r|\n/.exec(text);
    if (match) {
      cell6.innerHTML = '<pre>' + _insp.description + '</pre>';
    }
    else{
      cell6.innerHTML = '<p>' + _insp.description + '</p>';
    }

    // Editer
    let cell7 = document.createElement('td');
    let i7 = document.createElement('i');
    let n7 = this.alerts.length + index;
    i7.className = "fa fa-pen edit-icon";
    i7.onclick = (evt: Event) => this.edit('insp', evt);
    cell7.appendChild(i7);


    // Supprimer
    let cell8 = document.createElement('td');
    let i8 = document.createElement('i');
    let n8 = this.events.length + index;
    i8.className = "fa fa-trash delete-icon";
    i8.onclick = (evt: Event) => this.remove('insp', evt);
    cell8.appendChild(i8);

    let cell9 = document.createElement('td');
    cell9.style.display = 'none';
    cell9.innerHTML = _insp._id;

    tr.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9);

    return tr;
  }

  createRowAlert(_alert: AlertInterface, index: number): HTMLTableRowElement{
    let tr = document.createElement('tr');
    tr.style.marginBottom = '5px';
    tr.style.borderBottom = '1px solid #ddd';

    let cell1 = document.createElement('td');
    cell1.innerHTML = this.rucherService.getRucherNameById(_alert.apiaryId).name;

    let cell2 = document.createElement('td');
    if(_alert.hiveId != null){
      cell2.innerHTML = this.rucheService.getRucheNameById(_alert.hiveId).name;
    }

    let cell3 = document.createElement('td');
    let hours = '' + new Date(_alert.opsDate).getHours();
    let minutes = '' + new Date(_alert.opsDate).getMinutes();
    if(new Date(_alert.opsDate).getHours() < 10){
      hours = '0' + new Date(_alert.opsDate).getHours();
    }
    if(new Date(_alert.opsDate).getMinutes() < 10){
      minutes = '0' + new Date(_alert.opsDate).getMinutes();
    }
    cell3.innerHTML = this.unitService.getDailyDate(_alert.opsDate) + '<br />' + hours + ':' +  minutes;

    let cell4 = document.createElement('td');
    cell4.className = 'alert-icon';

    // Liste des pictos
    let cell5 = document.createElement('td');
    let container = document.createElement('div');
    container.className = "event-obs-container";
    let div = document.createElement('div');
    div.style.background = "url('../../../../assets/pictos_alerts/charts/"+ _alert.icon +".png') center no-repeat";
    div.style.backgroundSize = "30px";
    div.className = "event-obs-item " + _alert.icon;
    container.appendChild(div);
    cell5.appendChild(container);

     // Notes & taches
    let cell6 = document.createElement('td');
    cell6.innerHTML = '<p>' + this.translate.instant('MELLICHARTS.FILTERS.DISPLAY.' + _alert.icon.toUpperCase()) + '</p>';

    // Editer
    let cell7 = document.createElement('td');
    let i7 = document.createElement('i');
    let n7 = this.alerts.length + index;
    i7.className = "fa fa-pen edit-icon";
    i7.onclick = (evt: Event) => this.edit('alert', evt);
    cell7.appendChild(i7);


    // Supprimer
    let cell8 = document.createElement('td');
    let i8 = document.createElement('i');
    let n8 = this.alerts.length + index;
    i8.className = "fa fa-trash delete-icon";
    i8.onclick = (evt: Event) => this.remove('alert', evt);
    cell8.appendChild(i8);

    let cell9 = document.createElement('td');
    cell9.style.display = 'none';
    cell9.innerHTML = _alert._id;

    tr.append(cell1,cell2,cell3,cell4,cell5,cell6,cell7,cell8,cell9);

    return tr;
  }


  addObsList(): void {
    const obsDiv = (<HTMLElement>document.getElementsByClassName('add-event-choice-obs')[0]);
    obsDiv.innerHTML = '';

    // TO REMOVE
    let def_count = 0;

    for (let i=0; i < this.eventToEdit.obs.length; i++){

      const button = document.createElement('button');
      button.className = 'hives-obs-add';

      let index = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === this.eventToEdit.obs[i].name);
      button.classList.add(PICTOS_HIVES_OBS[index].class + '-active');

      button.onclick = (evt: Event) => {
        this.hiveButton(evt);
      }

      if(this.eventToEdit.obs[i].name === 'default'){
        def_count++;
      }

      obsDiv.appendChild(button);

    }

    // TO BE REMOVED WHEN ALL PICTOS ARE READY
    if(!this.eventToEdit.obs.some(_obs => _obs.name === 'swarm')){
      console.log('add swarm');
      const button = document.createElement('button');
      button.className = 'hives-obs-add';

      let index = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'swarm');
      button.classList.add(PICTOS_HIVES_OBS[index].class);

      button.onclick = (evt: Event) => {
        this.hiveButton(evt);
      }

      obsDiv.appendChild(button);
    }


    for(let i=0; i<8 - def_count; i++){

      const button = document.createElement('button');
      button.className = 'hives-obs-add';

      let index = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'default');
      button.classList.add(PICTOS_HIVES_OBS[index].class);

      button.onclick = (evt: Event) => {
        this.hiveButton(evt);
      }

      obsDiv.appendChild(button);
    }


  }

  hiveButton(evt: Event): void {
    const button = (<HTMLButtonElement> evt.target);
    if ( button.classList.contains(PICTOS_HIVES_OBS[btnIndex].class + '-active') ) {
      button.classList.remove(PICTOS_HIVES_OBS[btnIndex].class + '-active');
      const i = this.eventToEdit.obs.findIndex(e => e.name === PICTOS_HIVES_OBS[btnIndex].name);
      this.eventToEdit.obs.splice(i, 1);
      return;
    }
    button.classList.add(PICTOS_HIVES_OBS[btnIndex].class + '-active');
    this.eventToEdit.obs.push({name: PICTOS_HIVES_OBS[btnIndex].name, img: PICTOS_HIVES_OBS[btnIndex].img_active});
    return;
  }

  setNewEventDate(): void {
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.eventToEdit.opsDate = this.newEventDate;
    (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).disabled = false;
    (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).disabled = false;
  }

  setNewEventHours(): void{
    this.newEventDate.setHours( parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value) );
    this.eventToEdit.opsDate = this.newEventDate;
  }

  setNewEventMinutes(): void{
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value) );
    this.eventToEdit.opsDate = this.newEventDate;
  }

  showNotes(){
    let textArea = <HTMLTextAreaElement>document.getElementsByClassName('add-event-notes-textarea')[0];
    if (textArea.classList.contains('hives-note-textarea-add-active')) {
        textArea.classList.remove('hives-note-textarea-add-active');
    } else {
      textArea.classList.add('hives-note-textarea-add-active');
    }
  }

  saveNotes(evt: Event): void {
    const textArea = <HTMLTextAreaElement>evt.target;
    this.eventToEdit.description = textArea.value;
  }

  showTodo(){
    let textArea = <HTMLTextAreaElement>document.getElementsByClassName('add-event-todo-textarea')[0];
    if (textArea.classList.contains('hives-todo-textarea-add-active')) {
        textArea.classList.remove('hives-todo-textarea-add-active');
    } else {
      textArea.classList.add('hives-todo-textarea-add-active');
    }
  }

  saveTodo(evt: Event): void {
    const textArea = <HTMLTextAreaElement>evt.target;
    this.eventToEdit.todo = textArea.value;
  }

}
