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
import { CONFIG } from '../../../../constants/config';
import { TranslateService } from '@ngx-translate/core';
import { MyNotifierService } from '../../service/my-notifier.service';
import { NotifList } from '../../../../constants/notify';


@Component({
  selector: 'app-manage-apiarys',
  templateUrl: './manage-apiarys.component.html',
  styleUrls: ['./manage-apiarys.component.css']
})
export class ManageApiarysComponent implements OnInit, OnDestroy {

  @ViewChild('closeBtn') closeBtn: ElementRef;

  baseDropValid: string;
  public editPhotoApiary: string;
  private apiaryUpdate: RucherModel;
  public newApiary: RucherModel;
  location: Location;
  photoApiary: File;
  file: File;
  newRucherForm: FormGroup;
  private newObs: Observation;
  username: string;
  observationForm: FormGroup;
  rucherForm: FormGroup;
  type: string;
  message: string;
  private notify: NotifierService;
  newRucheForm: FormGroup;
  updateRucherInput: boolean;
  apiaryToEdit : RucherModel;

  public addNewShareStatus: Boolean;
  public newsUserSharing: String;
  public hiveToMv: RucheInterface;
  public typeToMv: number;
  optionsDate = {
    weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  constructor(private formBuilder: FormBuilder,
    location: Location,
    public router: Router,
    public rucherService: RucherService,
    private userService: UserloggedService,
    public observationService: ObservationService,
    public rucheService: RucheService,
    private authService: AuthService,
    private notifyService: NotifierService,
    private myNotifer: MyNotifierService,
    private element: ElementRef,
    public translateService: TranslateService) {

    this.location = location;

    this.username = userService.getUser();
    this.type = 'ApiaryObs';
    this.message = '';
    this.typeToMv = 0;
    this.notify = notifyService;

    this.apiaryUpdate = this.newApiary = {
      _id: null,
      userId : '',
      name: '',
      description: '',
      createDate: null,
      photo: 'void',
      username: '',
      zipCode: '',
      city: '',
      privateApiary: false,
      countryCode: '',
      dataLastReceived: null
    };

    this.editPhotoApiary = null;

  }



  ngOnInit() {
    this.initForm();

  }

  // init apiary forms
  initForm() {
    this.rucherForm = this.formBuilder.group({
      'name': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'description': [null, Validators.compose([Validators.maxLength(40)])],
      'ville': [null, Validators.compose([Validators.required])],
      'codePostal': [null, Validators.compose([Validators.required])],
      'validate': ``,
    });
  }

  // create apiary
  apiarySubmit() {
    const formValue = this.rucherForm.value;
    if (this.photoApiary == null) {
        this.newApiary.photo = './assets/imageClient/testAccount.png';
    }
    this.newApiary._id = null;
    this.newApiary.description = formValue.description;
    this.newApiary.name = formValue.name;
    this.newApiary.city = formValue.ville;
    this.newApiary.zipCode = formValue.codePostal;
    this.newApiary.userId = this.userService.getIdUserLoged();
    this.newApiary.createDate = new Date();
    this.newApiary.username = this.username;
    this.initForm();
    this.rucherService.createRucher(this.newApiary).subscribe((apiary) => {
        if (this.rucherService.ruchers != null) {
            this.rucherService.ruchers.push(apiary);
        } else {
            this.rucherService.ruchers = new Array(apiary);
        }
        this.rucherService.saveCurrentApiaryId(apiary._id);
    }, () => { }, () => {
        this.rucheService.getHivesByApiary(this.rucherService.getCurrentApiary());
        this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
        if (this.translateService.currentLang === 'fr') {
            this.notify.notify('success', 'Rucher créé');
        } else {
            this.notify.notify('success', 'Created Apaiary');
        }
        this.photoApiary = null;
    });
}

// Set edit apiary form
editApiaryClicked(apiary : RucherModel) {
  this.rucherService.rucherSelectUpdate = apiary;
  this.apiaryToEdit = apiary;
  const donnée = {
      name: apiary.name,
      description: apiary.description,
      ville: apiary.city,
      codePostal: apiary.zipCode,
      validate: ''
  };
  this.rucherForm.setValue(donnée);
}

//Edit Apiary
onEditApiary() {
  if (this.userService.checkWriteObject(this.apiaryToEdit.userId)) {
    const formValue = this.rucherForm.value;
    const index = this.rucherService.ruchers.indexOf(this.rucherService.rucherSelectUpdate);
    this.apiaryUpdate = formValue;
    this.apiaryUpdate._id = this.rucherService.rucherSelectUpdate._id;
    if (this.photoApiary === null || this.photoApiary === undefined) {
        this.apiaryUpdate.photo = this.rucherService.rucherSelectUpdate.photo
    } else {
        this.apiaryUpdate.photo = this.editPhotoApiary;
    }
    this.apiaryUpdate.username = this.rucherService.rucherSelectUpdate.username;
    this.rucherService.updateRucher(this.rucherService.rucherSelectUpdate._id, this.apiaryUpdate).subscribe(
        () => { }, () => { }, () => {
            this.rucherService.ruchers[index] = this.apiaryUpdate;
            this.photoApiary = null;
            this.editPhotoApiary = null;
            this.rucherService.rucherSelectUpdate = this.apiaryUpdate;
            if (this.rucherService.rucherSelectUpdate._id === this.rucherService.getCurrentApiary()) {
              this.rucherService.rucher = this.apiaryUpdate;
          }
            if (this.translateService.currentLang === 'fr') {
                this.notify.notify('success', 'Rucher mis à jour');
            } else {
                this.notify.notify('success', 'Updated Apiary');
            }
            this.initForm();
        }
    );
  } else {
    this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
  }
}

// delete apiary
deleteApiary(apiary : RucherModel) {
  if (this.userService.checkWriteObject(apiary.userId)) {
    this.rucherService.deleteRucher(apiary).subscribe(() => { }, () => { }, () => {
        const index = this.rucherService.ruchers.indexOf(apiary);
        this.rucherService.ruchers.splice(index, 1);
        if(this.translateService.currentLang === 'fr'){
            this.notify.notify('success', 'Rucher supprimé');
        }else{
            this.notify.notify('success', 'Deleted Apaiary');
        }
        if ((this.rucherService.ruchers.length > 0) && (apiary._id === this.rucherService.getCurrentApiary())) {
            this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
            this.rucherService.saveCurrentApiaryId(this.rucherService.rucher._id);
            this.rucheService.getHivesByApiary(this.rucherService.rucher._id);
        }
        if (this.rucherService.ruchers.length < 1) {
            this.rucherService.initRucher();
        }
    });
  } else {
    this.myNotifer.sendWarningNotif(NotifList.AUTH_WRITE_APIARY);
  }
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
