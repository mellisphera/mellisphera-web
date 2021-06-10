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

import { PICTOS_HIVES_OBS } from '../../../../../constants/pictosHiveObs'
import { MORE_ICON_WHITE, MORE_ICON } from './../../../../../constants/pictos';

import { DomSanitizer} from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../melli-charts/safe-html.pipe';
import { RucheService } from '../../../../dashboard/service/api/ruche.service';
import { MyDatePipe } from '../../../../pipe/my-date.pipe';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css', '../../../../../pictos.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesComponent implements OnInit,AfterViewChecked {
  screenHeight:any;
  screenWidth:any;

  public more_icon_white: string = MORE_ICON_WHITE;
  public more_icon: string = MORE_ICON;

  public newEventDate: Date;
  public hiveEvent: RucheInterface;
  public apiaryEvent: RucherModel;

  public apiaryInsp: Inspection[];

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

  public inspClicked: number;

  public tags: string[] = [];

  
  public isDesktop: boolean = true;


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

  constructor(private deviceService: DeviceDetectorService,
    public rucherService: RucherService,
    private notifyService: NotifierService,
    public observationService: ObservationService,
    public inspectionService: InspectionService,
    private formBuilder: FormBuilder,
    public userService: UserloggedService,
    private translateService: TranslateService,
    private myNotifer: MyNotifierService,
    private unitService: UnitService,
    private inspService: InspectionService,
    private router: Router,
    public sanitizer: DomSanitizer,
    public safeHtml: SafeHtmlPipe,
    private myDate: MyDatePipe) {
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
    let ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
       this.isDesktop = false;
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

  mouseEnter(evt: Event){
    let div = <HTMLDivElement>evt.target;
    let more_btn = <HTMLButtonElement>div.getElementsByClassName("apiary-edit-insp")[0];
    more_btn.style.visibility = 'visible';
  }

  mouseLeave(evt: Event){
    let div = <HTMLDivElement>evt.target;
    let more_btn = <HTMLButtonElement>div.getElementsByClassName("apiary-edit-insp")[0];
    more_btn.style.visibility = 'hidden';
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
    let start = new Date();
    start.setDate(start.getDate() - 35);
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



  showContextMenu(evt: MouseEvent): void {
    evt.stopPropagation();
    evt.preventDefault();
    const menu = (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]);
    menu.style.top = '40px';
    menu.style.left = (evt.clientX - 180) + 'px';
    menu.style.visibility = 'visible';

    const list = (<HTMLElement>menu.getElementsByClassName('context-menu-group')[0]);

    this.new_event = {
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

    this.apiaryEvent = Object.assign({}, this.rucherService.rucher);
    this.new_event.apiaryId = this.rucherService.rucher._id;
  }

  closeContextMenu(): void {
    (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]).style.visibility = 'hidden';
  }

  // <--- ADD EVENT SCREEN --->

  showAddEvent(): void {
    this.apiaryEvent = Object.assign({}, this.rucherService.rucher);
    this.new_event._id = null;
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
    
    for (let i = 0; i < PICTOS_HIVES_OBS.length; i++) {

      const button = document.createElement('button');
      button.className = 'hives-obs-add';

      button.classList.add(PICTOS_HIVES_OBS[i].class);
      button.onclick = (evt: Event) => {
        const n = i;
        this.hiveButton(evt, n);
      };

      obsDiv.appendChild(button);

      /*if ( (i + 1) % 8 === 0 ) {
        obsDiv.appendChild(div);
      }*/
    }
    /*if (PICTOS_HIVES_OBS.length % 8 !== 0) { // Push last row if not complete
      obsDiv.appendChild(div);
    }*/
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
    if(this.new_event.obs == null){
      this.new_event.obs = [];
    }
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
      _insp => {
        this.inspectionService.inspectionsApiary.push(_insp);
        this.new_event._id = _insp._id;
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

  // <--- START EDIT EVENT SCREEN --->
  
  showEditEvent(insp: Inspection, i: number){
    this.newEventDate = new Date(insp.opsDate);
    (<HTMLElement>document.getElementsByClassName('edit-event-time-error')[0]).style.display = 'none';
    (<HTMLInputElement>document.getElementsByClassName('edit-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    (<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).value = this.newEventDate.getHours().toString();
    (<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).value = this.newEventDate.getMinutes().toString();
    this.inspClicked = i;
    this.new_event = {
      _id: insp._id.valueOf(),
      apiaryInspId: insp.apiaryInspId != null ? insp.apiaryInspId.valueOf() : null ,
      apiaryId: insp.apiaryId.valueOf(),
      hiveId: insp.hiveId != null ? insp.hiveId.valueOf() : null ,
      userId: insp.userId.valueOf(),
      createDate: new Date (insp.createDate),
      opsDate: new Date(insp.opsDate),
      type: insp.type.valueOf(),
      description: insp.description != null ? insp.description.valueOf() : null,
      tags: insp.tags != null ? [...insp.tags] : null,
      tasks: insp.tasks != null ? [...insp.tasks] : null,
      obs: insp.obs != null ? [...insp.obs] : null,
      todo: insp.todo != null ? insp.todo.valueOf() : null
    };
    this.editObsList();
  }

  editObsList(): void {
    const obsDiv = (<HTMLElement>document.getElementsByClassName('edit-event-choice-obs')[0]);
    obsDiv.innerHTML = '';

    // TO REMOVE
    let def_count = 0;
    if(this.new_event.obs != null){
      for (let i=0; i < this.new_event.obs.length; i++){

        const button = document.createElement('button');
        button.className = 'hives-obs-add';

        let index = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === this.new_event.obs[i].name);
        button.classList.add(PICTOS_HIVES_OBS[index].class);
        button.classList.add(PICTOS_HIVES_OBS[index].class + '-active');

        button.onclick = (evt: Event) => {
          this.hiveButton(evt, index);
        }

        if(this.new_event.obs[i].name === 'default'){
          def_count++;
        }

        obsDiv.appendChild(button);

      }
    }


    if(this.new_event.obs != null){
      // TO BE REMOVED WHEN ALL PICTOS ARE READY
      if(!this.new_event.obs.some(_obs => _obs.name === 'swarm')){
        const button = document.createElement('button');
        button.className = 'hives-obs-add';

        button.classList.add(PICTOS_HIVES_OBS[ PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'swarm') ].class);

        button.onclick = (evt: Event) => {
          let n = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'swarm');
          this.hiveButton(evt, n);
        }

        obsDiv.appendChild(button);
      }
      if(!this.new_event.obs.some(_obs => _obs.name === 'super+')){
        const button = document.createElement('button');
        button.className = 'hives-obs-add';

        button.classList.add(PICTOS_HIVES_OBS[ PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super+') ].class);

        button.onclick = (evt: Event) => {
          let n = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super+')
          this.hiveButton(evt, n);
        }

        obsDiv.appendChild(button);
      }
      if(!this.new_event.obs.some(_obs => _obs.name === 'super-')){
        const button = document.createElement('button');
        button.className = 'hives-obs-add';

        button.classList.add(PICTOS_HIVES_OBS[ PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super-') ].class);

        button.onclick = (evt: Event) => {
          let n = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super-');
          this.hiveButton(evt, n);
        }

        obsDiv.appendChild(button);
      }
    }
    else{
      let button = document.createElement('button');
      button.className = 'hives-obs-add';

      button.classList.add(PICTOS_HIVES_OBS[ PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'swarm') ].class);

      button.onclick = (evt: Event) => {
        let n = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'swarm');
        this.hiveButton(evt, n);
      }

      obsDiv.appendChild(button);

      button = document.createElement('button');
      button.className = 'hives-obs-add';

      button.classList.add(PICTOS_HIVES_OBS[ PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super+') ].class);

      button.onclick = (evt: Event) => {
        let n = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super+');
        this.hiveButton(evt, n);
      }

      obsDiv.appendChild(button);

      button = document.createElement('button');
      button.className = 'hives-obs-add';

      button.classList.add(PICTOS_HIVES_OBS[ PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super-') ].class);

      button.onclick = (evt: Event) => {
        let n = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'super-');
        this.hiveButton(evt, n);
      }

      obsDiv.appendChild(button);
    }



    for(let i=0; i<6 - def_count; i++){

      const button = document.createElement('button');
      button.className = 'hives-obs-add';

      let index = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === 'default');
      button.classList.add(PICTOS_HIVES_OBS[index].class);

      button.onclick = (evt: Event) => {
        this.hiveButton(evt, index);
      }

      obsDiv.appendChild(button);
    }

  }

  updateRow(i: number){
    let tbody = <HTMLTableElement>document.getElementsByClassName('apiary-events')[0];
    let tr = <HTMLTableRowElement>tbody.rows[i];
    tr.cells[0].innerHTML = this.myDate.transform(this.new_event.opsDate, 'myDate');
    tr.cells[1].innerHTML = this.new_event.description;
    const obsDiv = (<HTMLElement>document.getElementsByClassName('edit-event-choice-obs')[0]);
    obsDiv.innerHTML = '';
    if(this.new_event.obs != null){
      for (let i=0; i < this.new_event.obs.length; i++){

        const button = document.createElement('button');
        button.className = 'hives-obs-add';

        let index = PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === this.new_event.obs[i].name);
        button.classList.add(PICTOS_HIVES_OBS[index].class);
        button.classList.add(PICTOS_HIVES_OBS[index].class + '-active');

        button.onclick = (evt: Event) => {
          this.hiveButton(evt, index);
        }

        obsDiv.appendChild(button);

      }
    }
  }

  editEvent(): void{
    this.inspectionService.inspectionsApiary[ this.inspectionService.inspectionsApiary.findIndex(_insp => _insp._id === this.new_event._id) ] = Object.assign({}, this.new_event);
    this.inspService.updateInspection(this.new_event).subscribe(
      () => {},
      () => {},
      () => {
        if(this.translateService.currentLang === 'fr'){
          this.notifyService.notify('success', 'Inspection editée');
        }else{
          this.notifyService.notify('success', 'Edited inspection');
        }
        $('#editObservationModal').modal('hide');
      }
    );

  }

  // <--- END EDIT EVENT SCREEN --->






}
