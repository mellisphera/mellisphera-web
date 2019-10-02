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

import { Component, OnInit, OnDestroy, AfterViewChecked,HostListener } from '@angular/core';
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


@Component({
  selector: 'app-notes-hives',
  templateUrl: './notes-hives.component.html',
  styleUrls: ['./notes-hives.component.css']
})
export class NotesHivesComponent implements OnInit,AfterViewChecked {

  ObservationForm: FormGroup;
  screenHeight:any;
    screenWidth:any;
  radioObs: boolean;
  typeAjout: any;
  private newObs: Observation;
  private notifier: NotifierService;
  typeObs: boolean;
  optionsDate = {
    weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  //observationsHive : ProcessReport[] = [];
  constructor(public rucherService: RucherService,
    private formBuilder: FormBuilder,
    private dailyRecWService: DailyRecordsWService,
    private activatedRoute: ActivatedRoute,
    private dailyStockHoneyService: DailyStockHoneyService,
    private recordService: RecordService,
    public observationService: ObservationService,
    public rucheService: RucheService,
    private notifyService: NotifierService,
    public userParamService: UserParamsService,
    public userService: UserloggedService,
    private myNotifer: MyNotifierService
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
    const heightPicture = document.getElementById('cadre').offsetHeight;
    const heightRight = document.getElementById('graphs').offsetHeight;
    if(this.screenWidth >1550){
      document.getElementById('notesHives').style.height = ''+(6 + heightRight - heightPicture) + 'px';
    }else if(this.screenWidth >990){
      document.getElementById('notesHives').style.height = ''+((heightRight - heightPicture -30)/2) + 'px';
    }else{
      document.getElementById('notesHives').style.height = ''+(40) + 'vh';
    }

  }

  initForm() {
    const defautDate = new Date();
    // defautDate.setUTCHours(new Date().getHours());
    this.ObservationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'type': 'HiveObs',
      'date': [ new Date(), Validators.required],
/*       'hours':null
 */    });
  }

  createObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.ObservationForm.value;
      this.newObs = formValue;
      this.newObs.type = 'HiveObs';
      this.newObs.idHive = this.rucheService.getCurrentHive()._id;
      this.newObs.idLHive = [this.rucheService.getCurrentHive()._id];
      this.newObs.userId = this.userService.getIdUserLoged();
      this.ObservationForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }, () => { }, () => {
        this.observationService.emitHiveSubject();
        this.initForm();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Observation créée');
        }else{
          this.notifier.notify('success', 'Created Observation');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }
  createAction() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.ObservationForm.value;
      this.newObs = formValue;
      this.newObs.type = 'HiveAct';
      this.newObs.idHive = this.rucheService.getCurrentHive()._id;
      this.newObs.idLHive = [this.rucheService.getCurrentHive()._id];
      this.newObs.userId = this.userService.getIdUserLoged();
      this.ObservationForm.reset();
      this.observationService.createObservation(this.newObs).subscribe((obs) => {
        this.observationService.observationsHive.push(obs);
        this.observationService.observationsHive.sort((a: Observation, b: Observation) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }, () => { }, () => {
        this.observationService.emitHiveSubject();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Action créée');
        }else{
          this.notifier.notify('success', 'Created Action');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  onSelectObsR(hiveOBS) {
    this.newObs = hiveOBS;
    const donnée = {
      sentence: this.newObs.sentence,
      type: this.newObs.type,
      date: new Date(this.newObs.date)
    };;
    this.ObservationForm.setValue(donnée);
  }

  onEditObservation() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.ObservationForm.value;
      this.newObs.sentence = formValue.sentence;
      this.newObs.date = formValue.date;
      this.newObs.type = formValue.type;
      const index = this.observationService.observationsHive.indexOf(this.newObs);
      // this.initForm();
      this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsHive[index] = this.newObs;
        this.observationService.emitHiveSubject();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Note mis à jour');
        }else{
          this.notifier.notify('success', 'Updated Note');
        }
      })
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  deleteObsR() {
    if (this.userService.checkWriteObject(this.rucherService.rucher.userId)) {
      const formValue = this.ObservationForm.value;
      this.newObs.sentence = formValue.sentence;
      this.newObs.date = formValue.date;
      this.newObs.type = formValue.type;
      const index = this.observationService.observationsHive.indexOf(this.newObs);
      document.getElementById('editObservationModal').style.display = 'none';
      this.observationService.deleteObservation(this.newObs.id).subscribe(() => { }, () => { }, () => {
        this.observationService.observationsHive.splice(index, 1);
        this.observationService.emitHiveSubject();
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Note supprimée');
        }else{
          this.notifier.notify('success', 'Deleted Note');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  resetObservationForm() {
    this.ObservationForm.get('sentence').reset();
  }

}
