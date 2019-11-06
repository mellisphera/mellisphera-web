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

import { MyDate } from '../../../class/MyDate';
import { Observation } from '../../../_model/observation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { RucherService } from '../../service/api/rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RucheService } from '../../service/api/ruche.service';
import { ObservationService } from '../../service/api/observation.service';
import { RucherModel } from '../../../_model/rucher-model';
import { AuthService } from '../../../auth/Service/auth.service';
import { RucheInterface } from '../../../_model/ruche';
import { NotifierService } from 'angular-notifier';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-hives',
  templateUrl: './manage-hives.component.html',
  styleUrls: ['./manage-hives.component.css']
})
export class ManageHivesComponent implements OnInit, OnDestroy {

  @ViewChild('closeBtn') closeBtn: ElementRef;

  newRucherForm: FormGroup;
  private newObs: Observation;
  username: string;
  observationForm: FormGroup;
  rucherForm: FormGroup;
  type: string;
  message: string;
  private hiveIndex: number;
  private notify: NotifierService;
  newRucheForm: FormGroup;
  updateRucherInput: boolean;
  apiaryToEdit: RucherModel;

  public addNewShareStatus: Boolean;
  public newsUserSharing: String;
  public hiveToMv: RucheInterface;
  public typeToMv: number;
  private selectHive: RucheInterface;
  public currentApiary : RucherModel
  public currentRuche : RucheInterface;

  optionsDate = {
    weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  constructor(private formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public observationService: ObservationService,
    public rucheService: RucheService,
    private translateService: TranslateService,
    private notifyService: NotifierService,
    private myNotifer: MyNotifierService) {


    this.username = userService.getUser();
    this.type = 'ApiaryObs';
    this.message = '';
    this.typeToMv = 0;
    this.notify = notifyService;
    this.rucherService.rucheService.ruchesAllApiary = [];
    this.selectHive = {
      _id : '',
      name : '',
      description : '',
      userId : '',
      username : '',
      apiaryId: '',
      dataLastReceived: null,
      hidden: false,
      createDate: null,
      apiaryName: '',
      hivePosX : '',
      hivePosY : '',
      sharingUser : []
    };

    this.rucherService.rucheService.getHiveByUserId(this.userService.getJwtReponse().idUser).subscribe(ruches => {
      console.log(ruches);
      this.rucherService.rucheService.ruchesAllApiary = ruches;
    });


  }



  ngOnInit() {
    this.initForm();

  }

  resetForm() {
    this.newRucherForm.reset();
  }

  //Pour effacer une ruche
  deleteRuche(ruche: RucheInterface, apiary : RucherModel) {
    if (this.userService.checkWriteObject(apiary.userId)) {
      this.rucheService.deleteRuche(ruche).subscribe(() => { }, () => { }, () => {
        if ((apiary._id === this.rucherService.getCurrentApiary())){
          let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive._id).indexOf(ruche._id);
          this.rucheService.ruches.splice(hiveIndexUpdate,1);
        }
        // update for manage pages
        let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive._id).indexOf(ruche._id);
        this.rucheService.ruchesAllApiary.splice(hiveIndexUpdateListAllApiary,1);
        this.rucheService.emitHiveSubject();
        if (this.translateService.currentLang === 'fr') {
          this.notify.notify('success', 'Ruche supprimée');
        } else {
          this.notify.notify('success', 'Deleted Hive');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  // Return a list of hives for an apiary
  getHiveByApiary(apiaryId: string):RucheInterface[]{
    return(this.rucheService.ruchesAllApiary.filter(hive => hive.apiaryId === apiaryId));
  }

  createHiveFormClicked(apiary : RucherModel){
    this.currentApiary = apiary;
  }

  //Pour créer une ruche
  createRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive._id = null;
    this.selectHive.apiaryId = this.currentApiary._id;
    this.selectHive.description = formValue.descriptionRuche;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.userId = this.userService.getIdUserLoged();
    this.selectHive.apiaryName = this.currentApiary.name;
    this.selectHive.username = this.username.toLowerCase();
    this.initForm();
    this.rucheService.createRuche(this.selectHive).subscribe((hive) => {
      // this.rucheService.saveCurrentHive(hive.id);
      this.rucheService.ruchesAllApiary.push(hive);
      this.rucheService.ruches.push(hive);
    }, () => { }, () => {
      this.rucheService.emitHiveSubject();
      if (this.translateService.currentLang === 'fr'){
        this.notify.notify('success', 'Ruche créée');
      } else {
        this.notify.notify('success', 'Crated Hive');
      }
    });
  }

  onSelectRuche(ruche: RucheInterface, apiary : RucherModel) {
    this.currentApiary = apiary;
    this.currentRuche = ruche;
    this.rucherService.rucherSelectUpdate = apiary;
    this.apiaryToEdit = apiary;
    this.selectHive = ruche;
    const donnée = {
      nomRuche: this.selectHive.name,
      descriptionRuche: this.selectHive.description,
    };
    this.newRucheForm.setValue(donnée);
  }
  // pour editer une ruche
  onEditeRuche() {
    if (this.userService.checkWriteObject(this.apiaryToEdit.userId)) {
      const formValue = this.newRucheForm.value;
      this.selectHive = this.currentRuche;
      this.selectHive.apiaryId = this.rucherService.rucherSelectUpdate._id;
      this.selectHive.name = formValue.nomRuche;
      this.selectHive.description = formValue.descriptionRuche;
      this.rucheService.updateRuche(this.selectHive).subscribe(() => { }, () => { }, () => {
        // update for homePage
        if ((this.selectHive.apiaryId === this.rucherService.getCurrentApiary()) && (this.currentApiary._id === this.rucherService.getCurrentApiary())) {
          let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive._id).indexOf(this.selectHive._id);
          this.rucheService.ruches[hiveIndexUpdate] = this.selectHive;
          this.rucheService.emitHiveSubject();
        } else if((this.currentApiary._id === this.rucherService.getCurrentApiary())){
          let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive._id).indexOf(this.selectHive._id);
          this.rucheService.ruches.splice(hiveIndexUpdate, 1);
          this.rucheService.emitHiveSubject();
        } else if(((this.selectHive.apiaryId === this.rucherService.getCurrentApiary()))){
          this.rucheService.ruches.push(this.selectHive);
        }
        // update for manage pages
        let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive._id).indexOf(this.selectHive._id);
        this.rucheService.ruchesAllApiary[hiveIndexUpdateListAllApiary] = this.selectHive;

        if (this.translateService.currentLang === 'fr') {
          this.notify.notify('success', 'Ruche mis à jour');
        } else {
          this.notify.notify('success', 'Updated Hive');
        }
      });
    } else {
      this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
    }
  }

  editRucherClicked() {
    this.updateRucherInput = true;
    const donnée = {
      nom: this.rucherService.rucher.name,
      description: this.rucherService.rucher.description,
      ville: this.rucherService.rucher.city,
      codePostal: this.rucherService.rucher.zipCode,
      validate: ''
    };
    this.rucherForm.setValue(donnée);
  }
  //Pour créer une observation

  resetRucheForm() {
    this.newRucheForm.reset();
  }

  initForm() {
    this.newRucheForm = this.formBuilder.group({
      'nomRuche': [null, Validators.compose([Validators.required])],
      'descriptionRuche': [null],
    });
  }

  checkSensor(hive: RucheInterface) {
    return hive.sensor ? 'sensor' : null;
  }
  receiveMessage($event) {
    this.message = $event;
  }
  ngOnDestroy(): void {
    /*  this.rucheService.hiveSubject.unsubscribe();
      this.rucherService.rucherSubject.unsubscribe();
      this.observationService.obsApiarySubject.unsubscribe();*/
  }
}