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

import { Component, OnInit, AfterViewChecked,HostListener, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RucherService } from '../../../service/api/rucher.service';
import { ObservationService } from '../../../service/api/observation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RucheService } from '../../../service/api/ruche.service';
import { Observation } from '../../../../_model/observation';
import { UserParamsService } from '../../../preference-config/service/user-params.service';
import { UserloggedService } from '../../../../userlogged.service';
import { MyNotifierService } from '../../../service/my-notifier.service';
import { NotifList } from '../../../../../constants/notify';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { InspectionService } from '../../../../dashboard/service/api/inspection.service';
import { Inspection } from '../../../../_model/inspection';
import { RucheInterface } from '../../../../_model/ruche';
import { RucherModel } from '../../../../_model/rucher-model';
import { AlertInterface } from '../../../../_model/alert';
import { UnitService } from '../../../../dashboard/service/unit.service';

import { MORE_ICON_WHITE, MORE_ICON } from './../../../../../constants/pictos';

import { DomSanitizer} from '@angular/platform-browser';
import { SafeHtmlPipe } from '../../../melli-charts/safe-html.pipe';
import { MyDatePipe } from '../../../../pipe/my-date.pipe';
import { InspCatService } from '../../../service/api/insp-cat.service';
import { InspCat } from '../../../../_model/inspCat';


@Component({
  selector: 'app-notes-hives',
  templateUrl: './notes-hives.component.html',
  styleUrls: ['./notes-hives.component.css', '../../../../../pictos.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesHivesComponent implements OnInit,AfterViewChecked {
  @Output() noteChange = new EventEmitter<any>();
  ObservationForm: FormGroup;
  InspectionForm: FormGroup;
  screenHeight:any;
    screenWidth:any;
  radioObs: boolean;
  typeAjout: any;
  private newObs: Observation;
  private newInsp: Inspection;
  private notifier: NotifierService;
  typeObs: boolean;
  optionsDate = {
    weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  public PICTOS_HIVES_OBS: any[] = [];

  public more_icon_white: string = MORE_ICON_WHITE;
  public more_icon: string = MORE_ICON;

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
  inspClicked: number;

  public isDesktop: boolean = true;

  private edit: boolean;

  public insps: Inspection[] = [];

  //observationsHive : ProcessReport[] = [];
  constructor(public rucherService: RucherService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    public rucheService: RucheService,
    private notifyService: NotifierService,
    public userParamService: UserParamsService,
    public userService: UserloggedService,
    private myNotifer: MyNotifierService,
    public inspectionService: InspectionService,
    private unitService: UnitService,
    public sanitizer: DomSanitizer,
    public safeHtml: SafeHtmlPipe,
    private myDate: MyDatePipe,
    private inspCat: InspCatService
  ) {
    this.typeObs = false;
    this.notifier = notifyService;
    this.insps = this.getInspectionByHiveId(this.rucheService.getCurrentHive()._id);
    this.initForm();
    this.getScreenSize();
  }

  ngOnInit() {
    let ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
       this.isDesktop = false;

    this.inspCat.getInspCat().subscribe(
      _inspCat => {
        _inspCat.forEach(_cat => {
          if(_cat.applies.indexOf("hive") !== -1 && _cat.img !== "Default" && this.notConstant(_cat)){
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
          type: 'obs'
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
    const heightRight = document.getElementById('graphs').offsetHeight;
    if(this.screenWidth >1550){
      document.getElementById('notesHives').style.height = ''+(6 + heightRight - heightPicture) + 'px';
    }else if(this.screenWidth >990){
      document.getElementById('notesHives').style.height = ''+((heightRight - heightPicture -30)/2) + 'px';
    }else{
      document.getElementById('notesHives').style.height = ''+(40) + 'vh';
    } */

  }


  notConstant(cat: InspCat): boolean{
    if(cat.name === 'Egg' || cat.name === 'Larva' || cat.name === 'Pupa' || cat.name === 'Dronebrood' || cat.name === 'Mitecountwash'){
      return false;
    }
    else return true;
  }

 /**
  *
  *
  * @param {string} apiaryId
  * @returns {Inspection[]}
  * @memberof NotesComponent
  */
  getInspectionByHiveId(hiveId: string): Inspection[]{
    let start = new Date();
    start.setDate(start.getDate() - 180);
    return this.inspectionService.inspectionsHive.filter(_insp => (_insp.hiveId === hiveId && new Date(_insp.opsDate) > start )).sort((inspA, inspB) => {
      return -(moment(inspA.opsDate).unix() - moment(inspB.opsDate).unix());
    });
  }



  initForm() {
    // defautDate.setUTCHours(new Date().getHours());
    this.ObservationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'type': 'HiveObs',
      'date': [ moment().toDate(), Validators.required],
    });
    this.InspectionForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'type': 'HiveObs',
      'date': [ moment().toDate(), Validators.required],
    });
  }

  createInspection() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.InspectionForm.value;
      this.newInsp = formValue;
      this.newInsp.type = 'hive';
      this.newInsp.opsDate = formValue.date;
      this.newInsp.createDate = new Date();
      this.newInsp.description = formValue.sentence;
      this.newInsp.hiveId = this.rucheService.getCurrentHive()._id;
      this.newInsp.apiaryId = this.rucherService.rucher._id;
      this.newInsp.userId = this.userService.getIdUserLoged();
      this.InspectionForm.reset();
      this.inspectionService.insertHiveEvent(this.newInsp).subscribe((obs) => {
        this.inspectionService.inspectionsHive.push(obs);

      }, (_err) => {
        if (_err.error_code === 403) {
          this.inspectionService.inspectionsHive.push(this.newInsp);
        }
      }, () => {
        this.inspectionService.emitHiveSubject();
        this.initForm();
        if (this.translateService.currentLang === 'fr'){
          this.notifier.notify('success', 'Inspection créée');
        } else {
          this.notifier.notify('success', 'Created Inspection');
        }
        this.noteChange.emit(this.newInsp);
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }


  onSelectObsR(hiveInsp) {
    this.newInsp = hiveInsp;
    const donnée = {
      sentence: this.newInsp.description,
      type: this.newInsp.type,
      date: moment(this.newInsp.opsDate).toDate()
    };;
    this.InspectionForm.setValue(donnée);
  }

  onEditInspection() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.InspectionForm.value;
      this.newInsp.description = formValue.sentence;
      this.newInsp.createDate = new Date();
      this.newInsp.type = 'hive';
      this.newInsp.opsDate = formValue.date;
      this.newInsp.userId = this.userService.getIdUserLoged();
      this.newInsp.apiaryId = this.rucherService.rucher._id;
      this.newInsp.hiveId = this.rucheService.getCurrentHive()._id;
      const index = this.inspectionService.inspectionsHive.indexOf(this.newInsp);
      // this.initForm();
      this.inspectionService.updateEvent(this.newInsp).subscribe(() => { },
      (_err) => {
        if (_err.error_code === 403) {
          this.inspectionService.inspectionsHive[index] = this.newInsp;
        }
      }, () => {
        this.inspectionService.inspectionsHive[index] = this.newInsp;
        this.inspectionService.emitHiveSubject();
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Inspection mis à jour');
        } else {
          this.notifier.notify('success', 'Updated Inspection');
        }
        this.noteChange.emit(this.newInsp);
      })
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  deleteObsR() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.InspectionForm.value;
      this.newInsp.description = formValue.sentence;
      this.newInsp.createDate = formValue.date;
      const index = this.inspectionService.inspectionsHive.indexOf(this.newInsp);
      document.getElementById('editObservationModal').style.display = 'none';
      this.inspectionService.deleteHiveInsp([this.newObs._id]).subscribe(() => { },
      (_err) => {
        if (_err.error_code === 403) {
          this.inspectionService.inspectionsHive.splice(index, 1);
        }
      }, () => {
        this.inspectionService.inspectionsHive.splice(index, 1);
        this.inspectionService.emitHiveSubject();
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Inspection supprimée');
        } else {
          this.notifier.notify('success', 'Inspection Note');
        }
        this.noteChange.emit(false);
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  resetInspectionForm() {
    this.InspectionForm.get('sentence').reset();
  }


  mouseEnter(evt: Event){
    let div = <HTMLDivElement>evt.target;
    let more_btn = <HTMLButtonElement>div.getElementsByClassName("hive-edit-insp")[0];
    more_btn.style.visibility = 'visible';
  }

  mouseLeave(evt: Event){
    let div = <HTMLDivElement>evt.target;
    let more_btn = <HTMLButtonElement>div.getElementsByClassName("hive-edit-insp")[0];
    more_btn.style.visibility = 'hidden';
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

    this.hiveEvent = Object.assign({}, this.rucheService.getCurrentHive());
    this.new_event.hiveId = this.hiveEvent._id;

    this.apiaryEvent = Object.assign({}, this.rucherService.rucher);
    this.new_event.apiaryId = this.rucherService.rucher._id;
  }

  closeContextMenu(): void {
    (<HTMLElement>document.getElementsByClassName('right-click-menu')[0]).style.visibility = 'hidden';
  }



  // <--- ADD EVENT SCREEN --->

  showAddEvent(): void {
    this.edit = false;

    this.hiveEvent = Object.assign({}, this.rucheService.ruche);
    this.new_event._id = null;
    this.new_event.apiaryId = this.rucherService.rucher._id;
    this.new_event.hiveId = this.rucheService.getCurrentHive()._id;
    this.new_event.userId = this.userService.getIdUserLoged();
    this.new_event.createDate = new Date();
    this.new_event.opsDate = new Date();
    this.new_event.obs = [];
    this.newEventDate = new Date();
    this.new_event.type = 'hive';
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    (<HTMLInputElement>document.getElementsByClassName('add-event-hours-input')[0]).value = this.newEventDate.getHours().toString();
    (<HTMLInputElement>document.getElementsByClassName('add-event-minutes-input')[0]).value = this.newEventDate.getMinutes().toString();
    (<HTMLTextAreaElement>document.getElementsByClassName('add-event-notes-textarea')[0]).value = null;
    (<HTMLTextAreaElement>document.getElementsByClassName('add-event-todo-textarea')[0]).value = null;
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
    this.new_event.obs.push({name: this.PICTOS_HIVES_OBS[btnIndex].name, img: this.PICTOS_HIVES_OBS[btnIndex].img});
    return;
  }

  setNewEventDate(): void {
    (<HTMLInputElement>document.getElementsByClassName('add-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    this.new_event.opsDate = this.newEventDate;
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
    this.new_event.opsDate = this.newEventDate;
  }

  setNewEventMinutes(evt: Event): void{
    if(parseInt((<HTMLInputElement>evt.target).value) > 59){
      (<HTMLInputElement>evt.target).value = "59";
    }
    this.newEventDate.setMinutes( parseInt((<HTMLInputElement>evt.target).value) );
    this.new_event.opsDate = this.newEventDate;
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

  cancelAddEvent(): void{

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
    this.inspectionService.insertHiveEvent(this.new_event).subscribe(
      _insp => {
        this.inspectionService.inspectionsHive.push(_insp);
        this.inspectionService.inspHive = this.inspectionService.getInspectionCurrentHive(this.rucheService.getCurrentHive()._id)
        this.new_event._id = _insp._id;
      },
      () => {},
      () => {
        this.noteChange.emit(this.new_event);
        this.inspectionService.emitHiveSubject();
        if(this.translateService.currentLang === 'fr'){
          this.notifier.notify('success', 'Inspection créée');

        }else{
          this.notifier.notify('success', 'Created Inspection');
        }
      }
    );
    $('#newObservationModal').modal('hide');
    return;
  }

  // <--- END ADD EVENT SCREEN --->

   // <--- START EDIT EVENT SCREEN --->

   showEditEvent(insp: Inspection){
    this.edit = false;

    this.newEventDate = new Date(insp.opsDate);
    (<HTMLElement>document.getElementsByClassName('edit-event-time-error')[0]).style.display = 'none';
    (<HTMLInputElement>document.getElementsByClassName('edit-event-time-input')[0]).value = this.unitService.getDailyDate(this.newEventDate);
    (<HTMLInputElement>document.getElementsByClassName('edit-event-hours-input')[0]).value = this.newEventDate.getHours().toString();
    (<HTMLInputElement>document.getElementsByClassName('edit-event-minutes-input')[0]).value = this.newEventDate.getMinutes().toString();
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

    (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('brood-none-active');
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
    this.inspectionService.inspectionsHive[ this.inspectionService.inspectionsHive.findIndex(_insp => _insp._id === this.new_event._id) ] = Object.assign({}, this.new_event);
    this.new_event.obs.sort((a,b) => {
      return a.code - b.code;
    });
    this.inspectionService.updateEvent(this.new_event).subscribe(
      _insp => {
        let index = this.inspectionService.inspectionsHive.findIndex( _i => _i._id === _insp._id);
        this.inspectionService.inspectionsHive[index] = Object.assign({}, _insp);
        this.inspectionService.inspHive = this.inspectionService.getInspectionCurrentHive(this.rucheService.getCurrentHive()._id);
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
    let index = this.inspectionService.inspectionsHive.findIndex(_insp => _insp._id === this.new_event._id);
    this.inspectionService.deleteHiveInsp([this.inspectionService.inspectionsHive[index]._id]).subscribe(
      () => {},
      () => {},
      () => {
        this.inspectionService.inspectionsHive.splice(index, 1);
        index = this.inspectionService.inspHive.findIndex(_insp => _insp._id === this.new_event._id);
        this.inspectionService.inspHive.splice(index, 1);
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
    if(entity === 'hive'){
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
    if(entity === 'hive'){
      switch(stage){
        case 'egg':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('hive-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('hive-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }
          button = <HTMLButtonElement>document.getElementsByClassName('brood-egg')[1];
          if(!button.classList.contains('hive-brood-egg-active')){
            button.classList.add('hive-brood-egg-active');
            this.new_event.obs.push({name:'Egg', img:'egg_cb.svg'});
          }
          else{
            button.classList.remove('hive-brood-egg-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Egg')
            this.new_event.obs.splice(index, 1);
          }

          break;
        case 'larva':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('hive-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('hive-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-larva')[1];
          if(!button.classList.contains('hive-brood-larva-active')){
            button.classList.add('hive-brood-larva-active');
            this.new_event.obs.push({name:'Larva', img:'larva_cb.svg'});
          }
          else{
            button.classList.remove('hive-brood-larva-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Larva')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'pupa':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('hive-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('hive-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-pupa')[1];
          if(!button.classList.contains('hive-brood-pupa-active')){
            button.classList.add('hive-brood-pupa-active');
            this.new_event.obs.push({name:'Pupa', img:'pupa_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('hive-brood-pupa-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Pupa')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'drone':
          if((<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.contains('hive-brood-none-active')){
            (<HTMLButtonElement>document.getElementsByClassName('brood-none')[1]).classList.remove('hive-brood-none-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-drone')[1];
          if(!button.classList.contains('hive-brood-drone-active')){
            button.classList.add('hive-brood-drone-active');
            this.new_event.obs.push({name:'Drone', img:'drone_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('hive-brood-drone-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Drone')
            this.new_event.obs.splice(index, 1);
          }
          break;
        case 'none':
          if(<HTMLButtonElement>document.getElementsByClassName('hive-brood-egg-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('hive-brood-egg-active')[0]).classList.remove('hive-brood-egg-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Egg');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('hive-brood-larva-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('hive-brood-larva-active')[0]).classList.remove('hive-brood-larva-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Larva');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('hive-brood-pupa-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('hive-brood-pupa-active')[0]).classList.remove('hive-brood-pupa-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Pupa');
            this.new_event.obs.splice(index, 1);
          }
          if(<HTMLButtonElement>document.getElementsByClassName('hive-brood-drone-active')[0] != null){
            (<HTMLButtonElement>document.getElementsByClassName('hive-brood-drone-active')[0]).classList.remove('hive-brood-drone-active');
            index = this.new_event.obs.findIndex(_o => _o.name === 'Drone');
            this.new_event.obs.splice(index, 1);
          }

          button = <HTMLButtonElement>document.getElementsByClassName('brood-none')[1];
          if(!button.classList.contains('hive-brood-none-active')){
            button.classList.add('hive-brood-none-active');
            this.new_event.obs.push({name:'Nonebrood', img:'nobrood_cb.svg'});
            console.log(this.new_event.obs);
          }
          else{
            button.classList.remove('hive-brood-none-active');
            let index = this.new_event.obs.findIndex(_o => _o.name === 'Nonebrood')
            this.new_event.obs.splice(index, 1);
          }
          break;
      }
      return;
    }
  }

}
