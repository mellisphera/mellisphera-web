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

import { Component, OnInit, AfterViewChecked,HostListener, Output, EventEmitter, ViewEncapsulation  } from '@angular/core';
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
import { UnitService } from '../../../../dashboard/service/unit.service';
import { Router } from '@angular/router';

import { MORE_ICON_WHITE, MORE_ICON } from './../../../../../constants/pictos';

import { DomSanitizer} from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../melli-charts/safe-html.pipe';
import { MyDatePipe } from '../../../../pipe/my-date.pipe';
import { DeviceDetectorService } from 'ngx-device-detector';
import { InspCatService } from '../../../service/api/insp-cat.service';
import { InspCat } from '../../../../_model/inspCat';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css', '../../../../../pictos.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotesComponent implements OnInit,AfterViewChecked {
  screenHeight:any;
  screenWidth:any;

  public PICTOS_HIVES_OBS: any[] = [];

  public more_icon_white: string = MORE_ICON_WHITE;
  public more_icon: string = MORE_ICON;

  public newEventDate: Date = new Date();
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

  private edit: boolean;


  @Output() noteChange = new EventEmitter<any>();

  public hiveToMv: RucheInterface;
  public typeToMv: number;
  public message: string;
  public observationForm: FormGroup;
  public inspectionForm: FormGroup;
  public type: string;
  public noteDateTime: Date;
  private notify: NotifierService;
  private newObs: Observation;
  private newInsp: Inspection;
  public updateRucherInput: boolean;
  public settings: any;
  public apiaryObs: Array<Observation>;

  public insps: Inspection[];

  constructor(public rucherService: RucherService,
    private notifyService: NotifierService,
    public inspectionService: InspectionService,
    private formBuilder: FormBuilder,
    public userService: UserloggedService,
    private translateService: TranslateService,
    private myNotifer: MyNotifierService,
    private unitService: UnitService,
    private inspService: InspectionService,
    public sanitizer: DomSanitizer,
    public safeHtml: SafeHtmlPipe,
    private myDate: MyDatePipe,
    private inspCat: InspCatService) {
      this.type = 'ApiaryObs';
      this.message = '';
      this.typeToMv = 0;
      this.notify = notifyService;
      this.getScreenSize();
      this.insps = this.getInspectionByApiaryId(this.rucherService.rucher._id);
  }

  ngOnInit() {
    this.initForm();
    let ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
       this.isDesktop = false;
    // this.observationService.getObservationByapiaryId(this.rucherService.getCurrentApiary());
    this.inspCat.getInspCat().subscribe(
      _inspCat => {
        let arr = [..._inspCat].sort((a:InspCat, b:InspCat) => { return a.code - b.code });
        arr.forEach(_cat => {
          if(_cat.applies.indexOf("apiary") !== -1 && _cat.img !== "Default" && this.notConstant(_cat)){
            this.PICTOS_HIVES_OBS.push({
              name:_cat.name.toLowerCase(),
              img: _cat.img.toLowerCase() + '_b.svg',
              img_active: _cat.img.toLowerCase() + '_cb.svg',
              class: 'hives-' + _cat.name.toLowerCase() + '-img',
              type: _cat.type
            })
          }
        })
        this.PICTOS_HIVES_OBS.push({
          name:'default',
          img: 'default_b.svg',
          img_active:'default_cb.svg',
          class: 'hives-default-img',
          type: "obs"
        })
      },
      () => {},
      () => {
        console.log(this.PICTOS_HIVES_OBS);
      }
    )
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize() {
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

  notConstant(cat: InspCat): boolean{
    if(cat.name === 'Egg' || cat.name === 'Larva' || cat.name === 'Pupa' || cat.name === 'Dronebrood' || cat.name === 'Mitecountwash'){
      return false;
    }
    else return true;
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
   * @returns {Inspection[]}
   * @memberof NotesComponent
   */
  getInspectionByApiaryId(apiaryId: string): Inspection[]{
    let start = new Date();
    start.setDate(start.getDate() - 270);
    return this.inspectionService.inspectionsApiary.filter(_insp => (_insp.apiaryId === apiaryId && new Date(_insp.opsDate) > start)).sort((inspA, inspB) => {
      return -(moment(inspA.opsDate).unix() - moment(inspB.opsDate).unix());
    });
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
      this.inspectionService.insertApiaryEvent(this.newInsp).subscribe((obs) => {
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
      this.inspectionService.updateEvent(this.newInsp).subscribe(() => { },
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
    this.edit = false;

    this.apiaryEvent = Object.assign({}, this.rucherService.rucher);
    this.new_event._id = null;
    this.new_event.apiaryId = this.rucherService.rucher._id;
    this.new_event.userId = this.userService.getIdUserLoged();
    this.new_event.createDate = new Date();
    this.new_event.opsDate = new Date();
    this.new_event.obs = [];
    this.newEventDate = new Date();
    this.new_event.type = 'apiary';
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value = this.newEventDate.getHours().toString();
    (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value = this.newEventDate.getMinutes().toString();
    (<HTMLTextAreaElement>document.getElementsByClassName('add-home-event-notes-textarea')[0]).value = null;
    (<HTMLTextAreaElement>document.getElementsByClassName('add-home-event-todo-textarea')[0]).value = null;
    this.addObsList();
  }

  addObsList(): void {
    const obsDiv = (<HTMLElement>document.getElementsByClassName('add-event-choice-obs')[0]);
    obsDiv.innerHTML = '';

    for (let i = 0; i < this.PICTOS_HIVES_OBS.length; i++) {

      const button = document.createElement('button');
      if(this.PICTOS_HIVES_OBS[i].type === 'act'){
        button.className = 'hives-act-add';
      }
      if(this.PICTOS_HIVES_OBS[i].type === 'obs'){
        button.className = 'hives-obs-add';
      }
      
      button.setAttribute('data-toggle', 'tooltip');
      button.setAttribute('data-placement', 'top');
      button.setAttribute('title', this.translateService.instant('INSP_CONF.' + this.PICTOS_HIVES_OBS[i].name.toUpperCase()));

      button.classList.add(this.PICTOS_HIVES_OBS[i].class);
      button.onclick = (evt: Event) => {
        const n = i;
        this.hiveButton(evt, n);
      };

      obsDiv.appendChild(button);
    }
  }

  hiveButton(evt: Event, btnIndex: number): void {
    const button = (<HTMLButtonElement> evt.target);
    if ( button.classList.contains(this.PICTOS_HIVES_OBS[btnIndex].class + '-active') ) {
      button.classList.remove(this.PICTOS_HIVES_OBS[btnIndex].class + '-active');
      const i = this.new_event.obs.findIndex(e => e.name === this.PICTOS_HIVES_OBS[btnIndex].name);
      this.new_event.obs.splice(i, 1);
      return;
    }
    button.classList.add(this.PICTOS_HIVES_OBS[btnIndex].class + '-active');
    if(this.new_event.obs == null){
      this.new_event.obs = [];
    }
    this.new_event.obs.push({name: this.PICTOS_HIVES_OBS[btnIndex].name, img: this.PICTOS_HIVES_OBS[btnIndex].img});
    return;
  }

  setNewEventDate(): void {
    this.newEventDate = new Date( (<any>this.newEventDate)._d);
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.new_event.opsDate = new Date(this.newEventDate);
    if(this.edit){
      this.newEventDate.setHours( parseInt( (<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).value ));
      this.newEventDate.setMinutes( parseInt( (<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).value ));
    }
    else{
      this.newEventDate.setHours( parseInt( (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value ));
      this.newEventDate.setMinutes( parseInt( (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value ));
    }
    
  }

  setNewEventHours(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 23){
      (<HTMLInputElement>evt.target).value = "23";
    }
    this.newEventDate.setHours( parseInt((<HTMLInputElement>evt.target).value) );
    this.new_event.opsDate = new Date(this.newEventDate);
  }

  setNewEventMinutes(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 59){
      (<HTMLInputElement>evt.target).value = "59";
    }
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>evt.target).value) );
    this.new_event.opsDate = new Date(this.newEventDate);
  }

  showNotes(evt: Event){
    let textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.children[1];
    if( (<HTMLElement>evt.target).nodeName === 'I' ){
      textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.parentNode.children[1];
    }
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

  showTodo(evt: Event){
    let textArea = <HTMLTextAreaElement>(<HTMLElement>evt.target).parentNode.parentNode.parentNode.children[2].children[1];
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

  addTag(): void{
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
    this.new_event.obs.sort((a,b) => {
      return a.code - b.code;
    });
    this.inspService.insertHiveEvent(this.new_event).subscribe(
      _insp => {
        this.inspectionService.inspectionsApiary.push(_insp);
        this.inspectionService.inspApi = this.inspectionService.getInspectionCurrentApiary(this.rucherService.getCurrentApiary())
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
    this.edit = true;

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
      tags: insp.tags != null ? [...insp.tags] : [],
      tasks: insp.tasks != null ? [...insp.tasks] : [],
      obs: insp.obs != null ? [...insp.obs] : [],
      todo: insp.todo != null ? insp.todo.valueOf() : null
    };
    this.editObsList();
  }

  editObsList(): void {
    const obsDiv = (<HTMLElement>document.getElementsByClassName('edit-event-choice-obs')[0]);
    obsDiv.innerHTML = '';

    for (let i=0; i < this.PICTOS_HIVES_OBS.length; i++){

      const button = document.createElement('button');
      if(this.PICTOS_HIVES_OBS[i].type === 'act'){
        button.className = 'hives-act-add';
      }
      if(this.PICTOS_HIVES_OBS[i].type === 'obs'){
        button.className = 'hives-obs-add';
      }
      button.classList.add(this.PICTOS_HIVES_OBS[i].class);

      if(this.new_event.obs != null && this.new_event.obs.findIndex( _o => _o.name === this.PICTOS_HIVES_OBS[i].name ) !== -1){
        button.classList.add(this.PICTOS_HIVES_OBS[i].class + '-active');
      }

      button.setAttribute('data-toggle', 'tooltip');
      button.setAttribute('data-placement', 'top');
      button.setAttribute('title', this.translateService.instant('INSP_CONF.' + this.PICTOS_HIVES_OBS[i].name.toUpperCase()));

      button.onclick = (evt: Event) => {
        let n = i;
        this.hiveButton(evt, n);
      }

      obsDiv.appendChild(button);

    }

    /*(<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('brood-none-active');
    (<HTMLButtonElement>document.getElementsByClassName('brood-egg')[1]).classList.remove('brood-egg-active');
    (<HTMLButtonElement>document.getElementsByClassName('brood-larva')[1]).classList.remove('brood-larva-active');
    (<HTMLButtonElement>document.getElementsByClassName('brood-pupa')[1]).classList.remove('brood-pupa-active');
    (<HTMLButtonElement>document.getElementsByClassName('brood-drone')[1]).classList.remove('brood-drone-active');
    

    if(this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood') !== -1){
      (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.add('brood-none-active')
    }
    if(this.new_event.obs.findIndex(_o => _o.name === 'Egg') !== -1){
      (<HTMLButtonElement>document.getElementsByClassName('brood-egg')[1]).classList.add('brood-egg-active');
    }
    if(this.new_event.obs.findIndex(_o => _o.name === 'Larva') !== -1){
      (<HTMLButtonElement>document.getElementsByClassName('brood-larva')[1]).classList.add('brood-larva-active');
    }
    if(this.new_event.obs.findIndex(_o => _o.name === 'Pupa') !== -1){
      (<HTMLButtonElement>document.getElementsByClassName('brood-pupa')[1]).classList.add('brood-pupa-active');
    }
    if(this.new_event.obs.findIndex(_o => _o.name === 'Drone') !== -1){
      (<HTMLButtonElement>document.getElementsByClassName('brood-drone')[1]).classList.add('brood-drone-active');
    }*/
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

        let index = this.PICTOS_HIVES_OBS.findIndex(_picto => _picto.name === this.new_event.obs[i].name);
        button.classList.add(this.PICTOS_HIVES_OBS[index].class);
        button.classList.add(this.PICTOS_HIVES_OBS[index].class + '-active');

        button.onclick = (evt: Event) => {
          this.hiveButton(evt, index);
        }

        obsDiv.appendChild(button);

      }
    }
  }

  editEvent(): void{
    this.inspectionService.inspectionsApiary[ this.inspectionService.inspectionsApiary.findIndex(_insp => _insp._id === this.new_event._id) ] = Object.assign({}, this.new_event);
    this.new_event.obs.sort((a,b) => {
      return a.code - b.code;
    });
    this.inspService.updateEvent(this.new_event).subscribe(
      _insp => {
        let index = this.inspectionService.inspectionsApiary.findIndex( _i => _i._id === _insp._id);
        this.inspectionService.inspectionsApiary[index] = Object.assign({}, _insp);
        this.inspectionService.inspApi = this.inspectionService.getInspectionCurrentApiary(this.rucherService.getCurrentApiary())
      },
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

  deleteEvent(): void{
    let index = this.inspectionService.inspectionsApiary.findIndex(_insp => _insp._id === this.new_event._id);
    this.inspectionService.deleteHiveInsp([this.inspectionService.inspectionsApiary[index]._id]).subscribe(
      () => {},
      () => {},
      () => {
        this.inspectionService.inspectionsApiary.splice(index, 1);
        index = this.inspectionService.inspApi.findIndex(_insp => _insp._id === this.new_event._id);
        this.inspectionService.inspApi.splice(index, 1);
        if(this.translateService.currentLang === 'fr'){
          this.notifyService.notify('success', 'Inspection suprimmée');
        }else{
          this.notifyService.notify('success', 'Deleted inspection');
        }
        $('#editObservationModal').modal('hide');
      }
    )
  }


  setBroodStage(stage: string, entity: string, hive?: RucheInterface): void{
    let button, index, inspIndex;
    if(entity === 'apiary'){
      switch(stage){
        case 'egg':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }
          button = <HTMLButtonElement>document.getElementsByClassName('brood-egg')[0];
          if(!button.classList.contains('brood-egg-active')){
            button.classList.add('brood-egg-active');
            this.new_event.obs.push({name:'Egg', img:'egg_cb.svg'});
          }
          else{
            button.classList.remove('brood-egg-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Egg')
            this.new_event.obs.splice(index, 1);
          }

          break;
        case 'larva':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-larva')[0];
          if(!button.classList.contains('brood-larva-active')){
            button.classList.add('brood-larva-active');
            this.new_event.obs.push({name:'Larva', img:'larva_cb.svg'});
          }
          else{
            button.classList.remove('brood-larva-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Larva')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'pupa':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-pupa')[0];
          if(!button.classList.contains('brood-pupa-active')){
            button.classList.add('brood-pupa-active');
            this.new_event.obs.push({name:'Pupa', img:'pupa_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('brood-pupa-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Pupa')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'drone':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.contains('brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[0]).classList.remove('brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-drone')[0];
          if(!button.classList.contains('brood-drone-active')){
            button.classList.add('brood-drone-active');
            this.new_event.obs.push({name:'Drone', img:'drone_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('brood-drone-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Drone')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'none':
          if(<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-egg-active')[0]).classList.remove('brood-egg-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Egg');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-larva-active')[0]).classList.remove('brood-larva-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Larva');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-pupa-active')[0]).classList.remove('brood-pupa-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('brood-drone-active')[0]).classList.remove('brood-drone-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Drone');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-none')[0];
          if(!button.classList.contains('brood-none-active')){
            button.classList.add('brood-none-active');
            this.new_event.obs.push({name:'Nonebrood', img:'nobrood_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('brood-none-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood')
            this.new_event.obs.splice(index, 1);
          }
          break;
      }
      return;
    }
  }


  editBroodStage(stage: string, entity: string, hive?: RucheInterface): void{
    let button, index, inspIndex;
    if(entity === 'apiary'){
      switch(stage){
        case 'egg':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('apiary-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('apiary-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }
          button = <HTMLButtonElement>document.getElementsByClassName('brood-egg')[1];
          if(!button.classList.contains('apiary-brood-egg-active')){
            button.classList.add('apiary-brood-egg-active');
            this.new_event.obs.push({name:'Egg', img:'egg_cb.svg'});
          }
          else{
            button.classList.remove('apiary-brood-egg-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Egg')
            this.new_event.obs.splice(index, 1);
          }

          break;
        case 'larva':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('apiary-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('apiary-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-larva')[1];
          if(!button.classList.contains('apiary-brood-larva-active')){
            button.classList.add('apiary-brood-larva-active');
            this.new_event.obs.push({name:'Larva', img:'larva_cb.svg'});
          }
          else{
            button.classList.remove('apiary-brood-larva-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Larva')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'pupa':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('apiary-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('apiary-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-pupa')[1];
          if(!button.classList.contains('apiary-brood-pupa-active')){
            button.classList.add('apiary-brood-pupa-active');
            this.new_event.obs.push({name:'Pupa', img:'pupa_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('apiary-brood-pupa-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Pupa')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'drone':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('apiary-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('apiary-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-drone')[1];
          if(!button.classList.contains('apiary-brood-drone-active')){
            button.classList.add('apiary-brood-drone-active');
            this.new_event.obs.push({name:'Drone', img:'drone_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('apiary-brood-drone-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Drone')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'none':
          if(<HTMLButtonElement>document.getElementsByClassName('apiary-brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('apiary-brood-egg-active')[0]).classList.remove('apiary-brood-egg-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Egg');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('apiary-brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('apiary-brood-larva-active')[0]).classList.remove('apiary-brood-larva-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Larva');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('apiary-brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('apiary-brood-pupa-active')[0]).classList.remove('apiary-brood-pupa-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('apiary-brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('apiary-brood-drone-active')[0]).classList.remove('apiary-brood-drone-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Drone');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-none')[1];
          if(!button.classList.contains('apiary-brood-none-active')){
            button.classList.add('apiary-brood-none-active');
            this.new_event.obs.push({name:'Nonebrood', img:'nobrood_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('apiary-brood-none-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood')
            this.new_event.obs.splice(index, 1);
          }
          break;
      }
      return;
    }
  }


}
