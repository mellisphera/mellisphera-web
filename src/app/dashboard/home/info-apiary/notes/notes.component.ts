/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { Component, OnInit, Renderer2, AfterViewChecked,HostListener, Output, EventEmitter, ViewEncapsulation  } from '@angular/core';
import { RucherService } from '../../../service/api/rucher.service';
import { ObservationService } from '../../../service/api/observation.service';
import { Subscription } from 'rxjs';
import { Observation } from '../../../../_model/observation';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RucheInterface } from '../../../../_model/ruche';
import { UserloggedService } from '../../../../userlogged.service';
import { MyNotifierService } from '../../../service/my-notifier.service';
import { NotifList } from '../../../../../constants/notify';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { InspectionService } from '../../../../dashboard/service/api/inspection.service';
import { Inspection } from '../../../../_model/inspection';
import { RucherModel } from '../../../../_model/rucher-model';
import { AlertInterface } from '../../../../_model/alert';
import { UnitService } from '../../../../dashboard/service/unit.service';
import { Router } from '@angular/router';

const PREFIX_PATH = '/dashboard/explore/';
const IMG_PATH = '../../../assets/icons/inspect/';
const ALERTS_ICONS_PATH = '../../../assets/pictos_alerts/iconesPNG/';
const ALERTS_CHART_PATH = '../../../assets/pictos_alerts/charts/';

const PICTOS_HIVES_OBS = [
  {name: 'swarm', img: 'observations/swarm_grey.png', img_active: 'observations/swarm.png', class: 'hives-swarm-img'},
  {name:'O1', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O2', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O3', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O4', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O5', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O6', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O7', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  {name:'O8', img:'default_grey.png', img_active:'default.png', class:'hives-default-img'},
  /*{name:'Y2', img:''},
  {name:'X3', img:''},
  {name:'W4', img:''},*/
];

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NotesComponent implements OnInit,AfterViewChecked {
  screenHeight:any;
  screenWidth:any;

  public newEventDate: Date;
  public hiveEvent: RucheInterface;
  public apiaryEvent: RucherModel;

  public hiveEventList: Inspection[];
  public hiveAlertList: AlertInterface[];
  public hiveEventToDelete: Inspection[] | null;
  public hiveAlertToDelete: AlertInterface[] | null;

  public new_event: Inspection = {
    _id: null,
    apiaryInspId: null,
    apiaryId: null,
    hiveId: null,
    userId: null,
    createDate: null,
    opsDate: null,
    type: null,
    description: null,
    tags: [],
    tasks: [],
    obs: [],
    todo: null
  };

  public tags: string[] = [];

  @Output() noteChange = new EventEmitter<any>();

  public hiveToMv: RucheInterface;
  private eltOnClickId: EventTarget;
  public typeToMv: number;
  public message: string;
  private selectHive: RucheInterface;
  public observationForm: FormGroup;
  public inspectionForm: FormGroup;
  private hiveIndex: number;
  public type: string;
  public noteDateTime: Date;
  private username: string;
  private notify: NotifierService;
  private subscribe: Subscription;
  private newObs: Observation;
  private newInsp: Inspection;
  public updateRucherInput: boolean;
  public settings: any;
  private obsSubject: Subscription;
  public apiaryObs: Array<Observation>;
  constructor(public rucherService: RucherService,
    private notifyService: NotifierService,
    public observationService: ObservationService,
    public inspectionService: InspectionService,
    private formBuilder: FormBuilder,
    public userService: UserloggedService,
    private translateService: TranslateService,
    private myNotifer: MyNotifierService,
    private unitService: UnitService,
    private inspService: InspectionService,
    private router: Router) {
      this.type = 'ApiaryObs';
      this.message = '';
      this.typeToMv = 0;
      this.notify = notifyService;
      this.eltOnClickId = null;
      this.getScreenSize();
  }

  ngOnInit() {
    this.initForm();
    this.observationService.setRange({ scale: 100, type: 'YEARS' });
    // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
    }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
/*     const heightPicture = document.getElementById('cadre').offsetHeight;
    const heightRight = document.getElementById('graph').offsetHeight;
    if(this.screenWidth >990){
      document.getElementById('notesApiary').style.height = ''+(-94 + heightRight - heightPicture) + 'px';
    }else{
      document.getElementById('notesApiary').style.height = ''+(40) + 'vh';
    }
 */
  }

  /**
   *
   *
   * @param {string} apiaryId
   * @returns {Observation[]}
   * @memberof NotesComponent
   */
  getNoteByApiaryId(apiaryId: string): Observation[]{
    return this.observationService.observationsApiary.filter(_note => _note.apiaryId === apiaryId).sort((noteA, noteB) => {
      return -(moment(noteA.opsDate).unix() - moment(noteB.opsDate).unix());
    });
  }

   /**
   *
   *
   * @param {string} apiaryId
   * @returns {Inspection[]}
   * @memberof NotesComponent
   */
  getInspectionByApiaryId(apiaryId: string): Inspection[]{
    return this.inspectionService.inspectionsApiary.filter(_insp => _insp.apiaryId === apiaryId ).sort((inspA, inspB) => {
      return -(moment(inspA.opsDate).unix() - moment(inspB.opsDate).unix());
    });
  }

  /**
   *
   *
   * @param {Observation} obs
   * @memberof ApiaryNotesComponent
   */
  onSelectObs(obs: Observation) {
    this.hiveToMv = this.rucherService.rucheService.ruches[0];
    this.newObs = obs;
    const donnée = {
      sentence: this.newObs.description,
      date: moment(obs.opsDate).toDate()
    };
    this.observationForm.setValue(donnée);
  }

  /**
   *
   *
   * @param {Observation} obs
   * @memberof ApiaryNotesComponent
   */
  onSelectInsp(obs: Inspection) {
    this.hiveToMv = this.rucherService.rucheService.ruches[0];
    this.newInsp = obs;
    const donnée = {
      sentence: this.newInsp.description,
      date: moment(obs.opsDate).toDate()
    };
    this.inspectionForm.setValue(donnée);
  }

  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  mvToActions() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      this.newObs.typeInspect = this.typeToMv === 0 ? 'HiveObs' : 'HiveAct';
      this.newObs.apiaryId = null;
      this.newObs.hiveId = this.hiveToMv._id;
      const index = this.observationService.observationsApiary.indexOf(this.newObs);
      this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsApiary.splice(index, 1);
        if (this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Note déplacée ' + this.hiveToMv.name);
        } else {
          this.notify.notify('success', 'Moved Note ' + this.hiveToMv.name);
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  createInspection() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.inspectionForm.value;
      this.newInsp = formValue;
      this.newInsp.apiaryId = this.rucherService.rucher._id;
      this.newInsp.opsDate = formValue.date;
      this.newInsp.createDate = new Date();
      this.newInsp.description = formValue.sentence;
      this.newInsp.type = 'apiary';
      this.newInsp.userId = this.userService.getIdUserLoged();
      this.initForm();
      this.inspectionService.insertApiary(this.newInsp).subscribe((obs) => {
        this.inspectionService.inspectionsApiary.push(obs);
/*         this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
          return -(moment(a.opsDate).unix() - moment(b.opsDate).unix())
        }); */
      }, 
      (_err) => {
        if (_err.error_code === 403) {
          this.inspectionService.inspectionsApiary.push(this.newInsp);
        }
      }, () => {
        this.noteChange.emit(this.newInsp);
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Inspection créée');
          
        }else{
          this.notify.notify('success', 'Created Inspection');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  onEditInspection() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.inspectionForm.value;
      this.newInsp.description = formValue.sentence;
      this.newInsp.opsDate = formValue.date;
      this.newInsp.userId = this.userService.getIdUserLoged();
      this.newInsp.apiaryId = this.rucherService.getCurrentApiary();
      this.newInsp.type = 'apiary';
      const index = this.inspectionService.inspectionsApiary.indexOf(this.newInsp);
      this.inspectionService.updateInspection(this.newInsp).subscribe(() => { }, 
      (_err) => {
        if (_err.error_code === 403) {
          this.inspectionService.inspectionsApiary[index] = this.newInsp;
        }
      }, () => {
        this.inspectionService.inspectionsApiary[index] = this.newInsp;
        this.initForm();
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Inspection mis à jour');
        }else{
          this.notify.notify('success', 'Updated Inspection');
        }
        this.noteChange.emit(this.newObs);
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }
  /**
   *
   *
   * @param {number} index
   * @param {Observation} obsApiary
   * @memberof ApiaryNotesComponent
   */
  deleteObs() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const index = this.inspectionService.inspectionsApiary.indexOf(this.newInsp);
      this.inspectionService.deleteHiveInsp([this.newInsp._id]).subscribe(() => { }, 
      (_err) => {
        if (_err.error_code === 403) {
          this.inspectionService.inspectionsApiary.splice(index, 1);
        }
      }, () => {
        this.inspectionService.inspectionsApiary.splice(index, 1);
        this.initForm();
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Inspection supprimée');
        }else{
          this.notify.notify('success', 'Deleted Inspection');
        }
        this.noteChange.emit(false);
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  initForm() {
    this.inspectionForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'date': moment().toDate(),
    });
  }
  /**
   *
   *
   * @memberof ApiaryNotesComponent
   */
  cancelUpdateRucher() {
    this.updateRucherInput = false;
    this.initForm();
  }
  receiveMessage($event) {
    this.message = $event;
  }


   // <--- ADD EVENT SCREEN --->

  showAddEvent(): void {
    this.new_event.apiaryId = this.rucherService.rucher._id;
    this.new_event.userId = this.userService.getIdUserLoged();
    this.new_event.createDate = new Date();
    this.new_event.type = 'apiary';
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = null;
    (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value = null;
    (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value = null;
    (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).disabled = true;
    (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).disabled = true;
    (<HTMLTextAreaElement>document.getElementsByClassName('add-event-notes-textarea')[0]).value = null;
    (<HTMLTextAreaElement>document.getElementsByClassName('add-event-todo-textarea')[0]).value = null;
    this.addObsList();
  }

  addObsList(): void {
    const obsDiv = (<HTMLElement>document.getElementsByClassName('add-event-choice-obs')[0]);
    obsDiv.innerHTML = '';
    let div;
    for (let i = 0; i < PICTOS_HIVES_OBS.length; i++) {
      if ( i % 8 === 0 ) {
        div = document.createElement('div');
      }

      const button = document.createElement('button');
      button.className = 'hives-obs-add';

      button.classList.add(PICTOS_HIVES_OBS[i].class);
      button.onclick = (evt: Event) => {
        const n = i;
        this.hiveButton(evt, n);
      };

      div.appendChild(button);

      if ( (i + 1) % 8 === 0 ) {
        obsDiv.appendChild(div);
      }
    }
    if (PICTOS_HIVES_OBS.length % 8 !== 0) { // Push last row if not complete
      obsDiv.appendChild(div);
    }
  }

  hiveButton(evt: Event, btnIndex: number): void {
    const button = (<HTMLButtonElement> evt.target);
    if ( button.classList.contains(PICTOS_HIVES_OBS[btnIndex].class + '-active') ) {
      button.classList.remove(PICTOS_HIVES_OBS[btnIndex].class + '-active');
      const i = this.new_event.obs.findIndex(e => e.name === PICTOS_HIVES_OBS[btnIndex].name);
      this.new_event.obs.splice(i, 1);
      return;
    }
    button.classList.add(PICTOS_HIVES_OBS[btnIndex].class + '-active');
    this.new_event.obs.push({name: PICTOS_HIVES_OBS[btnIndex].name, img: PICTOS_HIVES_OBS[btnIndex].img_active});
    return;
  }

  setNewEventDate(): void {
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.new_event.opsDate = this.newEventDate;
    (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).disabled = false;
    (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).disabled = false;
  }

  setNewEventHours(): void{
    this.newEventDate.setHours( parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value) );
    this.new_event.opsDate = this.newEventDate;
  }

  setNewEventMinutes(): void{
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value) );
    this.new_event.opsDate = this.newEventDate;
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
    this.new_event.description = textArea.value;
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
    this.new_event.todo = textArea.value;
  }

  addTag(event: Event): void{
    const input = <HTMLInputElement>document.getElementsByClassName('add-event-tags-input')[0];
    const value = input.value;

    // Add our fruit
    if (value != null && value != '') {
      this.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void{
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  insertAddEvent(): void {
    let hours = parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value) 
    let minutes = parseInt((<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value) 
    if (this.new_event.opsDate == null  || hours > 23 || minutes > 59 ) {
      (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'flex';
      return;
    }
    (<HTMLElement>document.getElementsByClassName('add-event-time-error')[0]).style.display = 'none';
    this.inspService.insertHiveEvent(this.new_event).subscribe(
      () => {
        this.inspectionService.inspectionsApiary.push(this.new_event);
      }, 
      () => {}, 
      () => {
        this.noteChange.emit(this.new_event);
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Inspection créée');
          
        }else{
          this.notify.notify('success', 'Created Inspection');
        }
      }
    );
    $('#newObservationModal').modal('hide');
    return;
  }

  // <--- END ADD EVENT SCREEN --->








}
