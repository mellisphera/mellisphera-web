import { MyDate } from '../../class/MyDate';
import { Observation } from '../../_model/observation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ProcessReport } from './processedReport';
import { RucherService } from './rucher.service';
import { UserloggedService } from '../../userlogged.service';
import { selectedRucherService } from '../../accueil/_shared-services/selected-rucher.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RapportService } from '../../rapport/rapport.service';
import { RucheService } from '../../accueil/Service/ruche.service';
import { ObservationService } from './ruche-detail/observation/service/observation.service';
import { RucherModel } from '../../_model/rucher-model';
import { AuthService } from '../../auth/Service/auth.service';
import { RucheInterface } from '../../_model/ruche';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-ruche-rucher',
  templateUrl: './ruche.rucher.component.html',
  styleUrls : ['./ruche.rucher.component.scss']
})

export class RucheRucherComponent implements OnInit, OnDestroy {

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

  public addNewShareStatus : Boolean;
  public newsUserSharing : String;
  public hiveToMv: RucheInterface;
  public typeToMv: number;
  private selectHive: RucheInterface;
  optionsDate = {
    weekday:'short',year:'numeric',month:'long',day:'2-digit',hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  constructor(  private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService: RucherService,
                private userService: UserloggedService,
                private _selectedRucherService: selectedRucherService,
                private _rapportService: RapportService,
                public observationService: ObservationService,
                public rucheService: RucheService,
                private authService: AuthService,
                private notifyService: NotifierService) {


        this.username = userService.getUser();
        this.type = 'ApiaryObs';
        this.message = '';
        this.typeToMv = 0;
        this.notify = notifyService;
        this.selectHive = {
          id : null,
          name : '',
          description : '',
          username : '',
          idApiary: '',
          hivePosX : '',
          hivePosY : '',
          sharingUser : []
        };


  }



  ngOnInit() {
    this.initForm();
    if (!this.observationService.obsApiarySubject.closed) {
      this.observationService.getObservationByIdApiary(this.rucherService.getCurrentApiary());
    }

  }


  clickOnRuche(ruche: RucherModel) {
    this.rucheService.saveCurrentHive(ruche.id);
  }

  resetForm() {
    this.newRucherForm.reset();
  }



  //Quand on Edite une ruche


  onSelectObs(obs) {
    this.hiveToMv = this.rucheService.ruches[0];
    this.newObs = obs;
    const donnée = {
      sentence : this.newObs.sentence,
      date : new MyDate(new Date()).getIso()
    };
    this.observationForm.setValue(donnée);
    }

  //Pour effacer une ruche
  deleteRuche(ruche: RucheInterface, index: number) {
    this.rucheService.deleteRuche(index, ruche).subscribe(() => {}, () => {}, () => {
      this.rucheService.ruches.splice(index, 1);
      this.rucheService.emitHiveSubject();
      this.notify.notify('success', 'Deleted Hive');
    });
  }

  //Pour créer une ruche
  createRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive.id = null;
    this.selectHive.idApiary = this.rucherService.rucher.id;
    this.selectHive.description = formValue.descriptionRuche;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.username = this.username.toLowerCase();
    this.initForm();
    this.rucheService.createRuche(this.selectHive).subscribe((hive) => {
      this.rucheService.ruches.push(hive);
    }, () => {}, () => {
      console.log(this.rucheService.ruches);
      this.rucheService.emitHiveSubject();
      this.notify.notify('success','Crated Hive');
    });
  }

  onSelectRuche(ruche: RucheInterface, index: number) {
    this.hiveIndex = index;
    this.rucherService.rucherSelectUpdate = this.rucherService.rucher;
    this.selectHive = ruche;
    const donnée = {
      nomRuche: this.selectHive.name,
      descriptionRuche: this.selectHive.description,
    };
    this.newRucheForm.setValue(donnée);
  }
  // pour editer une ruche
  onEditeRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive.idApiary = this.rucherService.rucherSelectUpdate.id;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.description = formValue.descriptionRuche;
    this.rucheService.updateRuche(this.hiveIndex, this.selectHive).subscribe(() => {}, () => {}, () => {
      if (this.selectHive.idApiary === this.rucherService.getCurrentApiary()) {
        this.rucheService.ruches[this.hiveIndex] = this.selectHive;
        this.rucheService.emitHiveSubject();
      } else {
        this.rucheService.ruches.splice(this.hiveIndex, 1);
        this.rucheService.emitHiveSubject();
      }
      this.notify.notify('success', 'Updated Hive');
    });
  }

  editRucherClicked() {
    this.updateRucherInput = true;
    const donnée = {
      nom: this.rucherService.rucher.name,
      description: this.rucherService.rucher.description,
      ville: this.rucherService.rucher.ville,
      codePostal: this.rucherService.rucher.codePostal,
      validate : ''
    };
    this.rucherForm.setValue(donnée);
  }

  mvToActions() {
    this.newObs.type = this.typeToMv === 0 ? 'HiveObs' : 'HiveAct';
    this.newObs.idApiary = null;
    this.newObs.idHive = this.hiveToMv.id;
    this.newObs.idLHive = new Array(this.hiveToMv.id);
    const index = this.observationService.observationsApiary.indexOf(this.newObs);
    console.log(this.newObs);
    this.observationService.updateObservation(this.newObs).subscribe(() => {}, () => {}, () => {
      this.observationService.observationsApiary.splice(index, 1);
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Moved Note ' + this.hiveToMv.name);
    });
  }
  //Pour créer une observation
  createObservation() {
    const formValue = this.observationForm.value;
    this.newObs = formValue;
    this.newObs.idApiary = this.rucherService.rucher.id;
    this.newObs.type = 'ApiaryObs';
    this.initForm();
    this.observationService.createObservation(this.newObs).subscribe( (obs) => {
      this.observationService.observationsApiary.push(obs);
    }, () => {}, () => {
      this.observationService.emitApiarySubject();
      this.notify.notify('success','Created Note');
    });
  }

  /*selectTypeToMv(event) {
    this.typeToMv = event.target.value;
  }*/
  deleteObs(index: number, obsApiary: Observation) {
    this.observationService.deleteObservation(obsApiary.id).subscribe(() => {}, () => {}, () => {
      this.observationService.observationsApiary.splice(index,1);
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Deleted Note');
    });
  }

  onEditObservation() {
    const formValue = this.observationForm.value;
    this.newObs.sentence = formValue.sentence;
    this.newObs.date = formValue.date;
    const index = this.observationService.observationsApiary.indexOf(this.newObs);
    this.observationService.updateObservation(this.newObs).subscribe(() => {}, () => {}, () => {
      this.observationService.observationsApiary[index] = this.newObs;
      console.log(this.observationService.observationsApiary);
      this.observationService.emitApiarySubject();
      this.notify.notify('success', 'Updated Note');
    });
  }

  resetRucheForm() {
    this.newRucheForm.reset();
  }

  initForm() {
    this.observationForm = this.formBuilder.group({
      'sentence': [null,Validators.compose([Validators.required])],
      'date' : new MyDate(new Date()).getIso(),
    });
    this.newRucheForm = this.formBuilder.group({
      'nomRuche': [null, Validators.compose([Validators.required])],
      'descriptionRuche': [null],
    });
    this.rucherForm = this.formBuilder.group({
      'nom': [null, Validators.compose([Validators.required])],
      'description': [null],
      'ville': [null, Validators.compose([Validators.required])],
      'codePostal': [null, Validators.compose([Validators.required])],
      'validate' : ``
    });
  }

  cancelUpdateRucher() {
    this.updateRucherInput = false;
    this.initForm();
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