import { MyDate } from '../../../class/MyDate';
import { Observation } from '../../../_model/observation';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { ProcessReport } from './processedReport';
import { RucherService } from '../../service/rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RapportService } from '../../rapport/rapport.service';
import { RucheService } from '../../service/ruche.service';
import { ObservationService } from './ruche-detail/observation/service/observation.service';
import { RucherModel } from '../../../_model/rucher-model';
import { AuthService } from '../../../auth/Service/auth.service';
import { RucheInterface } from '../../../_model/ruche';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-ruche-rucher',
  templateUrl: './ruche.rucher.component.html',
  styleUrls: ['./ruche.rucher.component.scss']
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

  public addNewShareStatus: Boolean;
  public newsUserSharing: String;
  public hiveToMv: RucheInterface;
  public typeToMv: number;
  private selectHive: RucheInterface;
  optionsDate = {
    weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  constructor(private formBuilder: FormBuilder,
    public location: Location,
    public router: Router,
    public rucherService: RucherService,
    private userService: UserloggedService,
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
      id: null,
      name: '',
      description: '',
      username: '',
      idApiary: '',
      hivePosX: '',
      hivePosY: '',
      sharingUser: []
    };


  }



  ngOnInit() {
    this.initForm();

  }


  clickOnRuche(ruche: RucherModel) {
    this.rucheService.saveCurrentHive(ruche.id);
    this.router.navigateByUrl('dashboard/ruche-detail');
  }

  resetForm() {
    this.newRucherForm.reset();
  }

  //Pour effacer une ruche
  deleteRuche(ruche: RucheInterface, index: number) {
    this.rucheService.deleteRuche(index, ruche).subscribe(() => { }, () => { }, () => {
      this.rucheService.ruches.splice(index, 1);
      this.rucheService.emitHiveSubject();
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Ruche supprimée');
      }else{
        this.notify.notify('success', 'Deleted Hive');
      }
    });
  }

  //Pour créer une ruche
  createRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive.id = null;
    this.selectHive.idApiary = this.rucherService.rucher.id;
    this.selectHive.description = formValue.descriptionRuche;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.apiaryName = this.rucherService.rucher.name;
    this.selectHive.username = this.username.toLowerCase();
    this.initForm();
    this.rucheService.createRuche(this.selectHive).subscribe((hive) => {
      // this.rucheService.saveCurrentHive(hive.id);
      this.rucheService.ruches.push(hive);
    }, () => { }, () => {
      this.rucheService.emitHiveSubject();
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Ruche créée');
      }else{
        this.notify.notify('success', 'Crated Hive');
      }
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
    this.rucheService.updateRuche(this.hiveIndex, this.selectHive).subscribe(() => { }, () => { }, () => {
      if (this.selectHive.idApiary === this.rucherService.getCurrentApiary()) {
        this.rucheService.ruches[this.hiveIndex] = this.selectHive;
        this.rucheService.emitHiveSubject();
      } else {
        this.rucheService.ruches.splice(this.hiveIndex, 1);
        this.rucheService.emitHiveSubject();
      }
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Ruche mis à jour');
      }else{
        this.notify.notify('success', 'Updated Hive');
      }
    });
  }

  editRucherClicked() {
    this.updateRucherInput = true;
    const donnée = {
      nom: this.rucherService.rucher.name,
      description: this.rucherService.rucher.description,
      ville: this.rucherService.rucher.ville,
      codePostal: this.rucherService.rucher.codePostal,
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