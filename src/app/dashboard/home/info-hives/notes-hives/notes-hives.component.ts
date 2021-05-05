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

import { Component, OnInit, OnDestroy, AfterViewChecked,HostListener, EventEmitter, Output } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RucherService } from '../../../service/api/rucher.service';
import { DailyRecordsWService } from '../../../service/api/daily-records-w.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../../../service/api/daily-stock-honey.service';
import { RecordService } from '../../../service/api/record.service';
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

@Component({
  selector: 'app-notes-hives',
  templateUrl: './notes-hives.component.html',
  styleUrls: ['./notes-hives.component.css']
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

  //observationsHive : ProcessReport[] = [];
  constructor(public rucherService: RucherService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    public observationService: ObservationService,
    public rucheService: RucheService,
    private notifyService: NotifierService,
    public userParamService: UserParamsService,
    public userService: UserloggedService,
    private myNotifer: MyNotifierService,
    public inspectionService: InspectionService
  ) {
    this.typeObs = false;
    this.notifier = notifyService;
    this.initForm();
    this.getScreenSize();
  }

  ngOnInit() {
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
    const heightRight = document.getElementById('graphs').offsetHeight;
    if(this.screenWidth >1550){
      document.getElementById('notesHives').style.height = ''+(6 + heightRight - heightPicture) + 'px';
    }else if(this.screenWidth >990){
      document.getElementById('notesHives').style.height = ''+((heightRight - heightPicture -30)/2) + 'px';
    }else{
      document.getElementById('notesHives').style.height = ''+(40) + 'vh';
    } */

  }


  /**
   *
   *
   * @param {string} hiveId
   * @returns {Observation[]}
   * @memberof NotesHivesComponent
   */
  getNoteByHiveId(hiveId: string): Observation[] {
   // console.log(this.observationService.observationsHive);
    return this.observationService.observationsHive.filter(_note => _note.hiveId === hiveId).sort((noteA, noteB) => {
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
  getInspectionByHiveId(hiveId: string): Inspection[]{
    return this.inspectionService.inspectionsHive.filter(_insp => _insp.hiveId === hiveId).sort((inspA, inspB) => {
      return -(moment(inspA.opsDate).unix() - moment(inspB.opsDate).unix());
    });
  }



  initForm() {
    const defautDate = new Date();
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
  
  createAction() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.ObservationForm.value;
      this.newObs = formValue;
      this.newObs.typeInspect = 'HiveAct';
      this.newObs.type = 'hive';
      this.newObs.opsDate = formValue.date;
      this.newObs.apiaryId = this.rucherService.rucher._id;
      this.newObs.createDate = new Date();
      this.newObs.description = formValue.sentence;
      this.newObs.hiveId = this.rucheService.getCurrentHive()._id;
      this.newObs.userId = this.userService.getIdUserLoged();
      this.ObservationForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.opsDate).getTime() - new Date(a.opsDate).getTime();
        });
      }, () => { }, () => {
        this.observationService.emitHiveSubject();
        if (this.translateService.currentLang === 'fr') {
          this.notifier.notify('success', 'Action créée');
        } else {
          this.notifier.notify('success', 'Created Action');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.  AUTH_WRITE_NOTES_HIVE);
    }
  }

  onSelectObsR(hiveOBS) {
    this.newObs = hiveOBS;
    const donnée = {
      sentence: this.newObs.description,
      type: this.newObs.typeInspect,
      date: moment(this.newObs.opsDate).toDate()
    };;
    this.ObservationForm.setValue(donnée);
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
      this.inspectionService.updateInspection(this.newInsp).subscribe(() => { }, 
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

}
