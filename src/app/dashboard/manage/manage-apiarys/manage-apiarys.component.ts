import { MyDate } from '../../../class/MyDate';
import { Observation } from '../../../_model/observation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ProcessReport } from '../../apiary/ruche-rucher/processedReport';
import { RucherService } from '../../service/api/rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RapportService } from '../../rapport/rapport.service';
import { RucheService } from '../../service/api/ruche.service';
import { ObservationService } from '../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { RucherModel } from '../../../_model/rucher-model';
import { AuthService } from '../../../auth/Service/auth.service';
import { RucheInterface } from '../../../_model/ruche';
import { NotifierService } from 'angular-notifier';
import { CONFIG } from '../../../../constants/config';
import { TranslateService } from '@ngx-translate/core';


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
    private _rapportService: RapportService,
    public observationService: ObservationService,
    public rucheService: RucheService,
    private authService: AuthService,
    private notifyService: NotifierService,
    private element: ElementRef,
    public translateService: TranslateService) {

    this.location = location;

    this.username = userService.getUser();
    this.type = 'ApiaryObs';
    this.message = '';
    this.typeToMv = 0;
    this.notify = notifyService;

    this.apiaryUpdate = this.newApiary = {
      id: null,
      latitude: '',
      longitude: '',
      idUsername : '',
      name: '',
      description: '',
      createdAt: null,
      photo: 'void',
      username: '',
      codePostal: '',
      ville: ''
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
    this.newApiary.id = null;
    this.newApiary.description = formValue.description;
    this.newApiary.name = formValue.name;
    this.newApiary.ville = formValue.ville;
    this.newApiary.codePostal = formValue.codePostal;
    this.newApiary.idUsername = this.userService.getIdUserLoged();
    this.newApiary.createdAt = new Date();
    this.newApiary.username = this.username;
    this.initForm();
    this.rucherService.createRucher(this.newApiary).subscribe((apiary) => {
        if (this.rucherService.ruchers != null) {
            this.rucherService.ruchers.push(apiary);
        } else {
            this.rucherService.ruchers = new Array(apiary);
        }
        this.rucherService.saveCurrentApiaryId(apiary.id);
    }, () => { }, () => {
        this.rucherService.emitApiarySubject();
        this.rucheService.getHivesByApiary(this.rucherService.getCurrentApiary());
        this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
        if(this.userService.getJwtReponse().country === "FR"){
            this.notify.notify('success', 'Rucher créé');
        }else{
            this.notify.notify('success', 'Created Apaiary');
        }
        this.photoApiary = null;
    });
}

// Set edit apiary form
editApiaryClicked(apiary : RucherModel) {
  this.rucherService.rucherSelectUpdate = apiary;
  const donnée = {
      name: apiary.name,
      description: apiary.description,
      ville: apiary.ville,
      codePostal: apiary.codePostal,
      validate: ''
  };
  this.rucherForm.setValue(donnée);
}

//Edit Apiary
onEditApiary() {
  const formValue = this.rucherForm.value;
  const index = this.rucherService.ruchers.indexOf(this.rucherService.rucherSelectUpdate);
  this.apiaryUpdate = formValue;
  this.apiaryUpdate.id = this.rucherService.rucherSelectUpdate.id;
  if (this.photoApiary === null || this.photoApiary === undefined) {
      this.apiaryUpdate.photo = this.rucherService.rucherSelectUpdate.photo
  } else {
      this.apiaryUpdate.photo = this.editPhotoApiary;
  }
  this.apiaryUpdate.username = this.rucherService.rucherSelectUpdate.username;
  this.rucherService.updateRucher(this.rucherService.rucherSelectUpdate.id, this.apiaryUpdate).subscribe(
      () => { }, () => { }, () => {
          this.rucherService.ruchers[index] = this.apiaryUpdate;
          this.rucherService.emitApiarySubject();
          this.photoApiary = null;
          this.editPhotoApiary = null;
          this.rucherService.rucherSelectUpdate = this.apiaryUpdate;
          if(this.rucherService.rucherSelectUpdate.id === this.rucherService.getCurrentApiary()){
            this.rucherService.rucher = this.apiaryUpdate;
        }
          if(this.userService.getJwtReponse().country === "FR"){
              this.notify.notify('success', 'Rucher mis à jour');
          }else{
              this.notify.notify('success', 'Updated Apiary');
          }
          this.initForm();
      }
  );
}

// delete apiary
deleteApiary(apiary : RucherModel) {
  this.rucherService.deleteRucher(apiary).subscribe(() => { }, () => { }, () => {
      const index = this.rucherService.ruchers.indexOf(apiary);
      this.rucherService.ruchers.splice(index, 1);
      this.rucherService.emitApiarySubject();
      if(this.userService.getJwtReponse().country === "FR"){
          this.notify.notify('success', 'Rucher supprimé');
      }else{
          this.notify.notify('success', 'Deleted Apaiary');
      }
      if ((this.rucherService.ruchers.length > 0) && (apiary.id === this.rucherService.getCurrentApiary())) {
          this.rucherService.rucher = this.rucherService.ruchers[this.rucherService.ruchers.length - 1];
          this.rucherService.saveCurrentApiaryId(this.rucherService.rucher.id);
          this.rucheService.getHivesByApiary(this.rucherService.rucher.id);
      }
      if (this.rucherService.ruchers.length < 1) {
          this.rucherService.initRucher();
      }
  });
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
