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

import { Component, OnInit, Renderer2, AfterViewChecked,HostListener  } from '@angular/core';
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

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit,AfterViewChecked {
  screenHeight:any;
  screenWidth:any;

  public hiveToMv: RucheInterface;
  private eltOnClickId: EventTarget;
  public typeToMv: number;
  public message: string;
  private selectHive: RucheInterface;
  public observationForm: FormGroup;
  private hiveIndex: number;
  public type: string;
  public noteDateTime: Date;
  private username: string;
  private notify: NotifierService;
  private subscribe: Subscription;
  private newObs: Observation;
  public updateRucherInput: boolean;
  public settings: any;
  private obsSubject: Subscription;
  public apiaryObs: Array<Observation>;
  constructor(public rucherService: RucherService,
    private notifyService: NotifierService,
    public observationService: ObservationService,
    private formBuilder: FormBuilder,
    public userService: UserloggedService,
    private translateService: TranslateService,
    private myNotifer: MyNotifierService) {
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
    const heightPicture = document.getElementById('cadre').offsetHeight;
    const heightRight = document.getElementById('graph').offsetHeight;
    if(this.screenWidth >990){
      document.getElementById('notesApiary').style.height = ''+(-94 + heightRight - heightPicture) + 'px';
    }else{
      document.getElementById('notesApiary').style.height = ''+(40) + 'vh';
    }

  }

  /**
   *
   *
   * @param {string} apiaryId
   * @returns {Observation[]}
   * @memberof NotesComponent
   */
  getNoteByApiaryId(apiaryId: string): Observation[]{
    return this.observationService.observationsApiary.filter(_note => _note.apiaryId === apiaryId);
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
      date: new Date(obs.createDate)
    };
    this.observationForm.setValue(donnée);
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
  createObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.observationForm.value;
      this.newObs = formValue;
      this.newObs.apiaryId = this.rucherService.rucher._id;
      this.newObs.opsDate = formValue.date.getTime();
      this.newObs.createDate = new Date();
      this.newObs.description = formValue.sentence;
      this.newObs.type = 'apiary';
      this.newObs.typeInspect = 'ApiaryObs';
      this.newObs.userId = this.userService.getIdUserLoged();
      this.initForm();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsApiary.push(obs);
        this.observationService.observationsApiary.sort((a: Observation, b: Observation) => {
          return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
        });
      }, () => { }, () => {
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Note créée');
        }else{
          this.notify.notify('success', 'Created Note');
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
  onEditObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.observationForm.value;
      this.newObs.description = formValue.sentence;
      this.newObs.opsDate = formValue.date;
      this.newObs.apiaryId = this.rucherService.getCurrentApiary();
      this.newObs.type = 'apiary';
      const index = this.observationService.observationsApiary.indexOf(this.newObs);
      this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsApiary[index] = this.newObs;
        this.initForm();
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Note mis à jour');
        }else{
          this.notify.notify('success', 'Updated Note');
        }
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
      this.observationService.deleteObservation(this.newObs._id).subscribe(() => { }, () => { }, () => {
        const index = this.observationService.observationsApiary.indexOf(this.newObs);
        this.observationService.observationsApiary.splice(index, 1);
        this.initForm();
        if(this.translateService.currentLang === 'fr'){
          this.notify.notify('success', 'Note supprimée');
        }else{
          this.notify.notify('success', 'Deleted Note');
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
  initForm() {
    this.observationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'date': new Date(),
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

}
