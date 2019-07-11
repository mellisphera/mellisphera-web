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
    this.rucherService.rucheService.ruchesAllApiary = [];
    this.selectHive = {
      id: null,
      name: '',
      description: '',
      idUsername : '',
      username: '',
      idApiary: '',
      hivePosX: '',
      hivePosY: '',
      sharingUser: []
    };

    this.rucherService.rucheService.getHiveByUsername(this.userService.getUser()).subscribe(ruches => {
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
    this.rucheService.deleteRuche(ruche).subscribe(() => { }, () => { }, () => {
      if ((apiary.id === this.rucherService.getCurrentApiary())){
        let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive.id).indexOf(ruche.id);
        this.rucheService.ruches.splice(hiveIndexUpdate,1);
      }
      // update for manage pages
      let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive.id).indexOf(ruche.id);
      this.rucheService.ruchesAllApiary.splice(hiveIndexUpdateListAllApiary,1);
      this.rucheService.emitHiveSubject();
      if(this.userService.getJwtReponse().country === "FR"){
        this.notify.notify('success', 'Ruche supprimée');
      }else{
        this.notify.notify('success', 'Deleted Hive');
      }
    });
  }

  // Return a list of hives for an apiary
  getHiveByApiary(idApiary: string):RucheInterface[]{
    return(this.rucheService.ruchesAllApiary.filter(hive => hive.idApiary === idApiary));
  }

  createHiveFormClicked(apiary : RucherModel){
    this.currentApiary = apiary;
  }

  //Pour créer une ruche
  createRuche() {
    const formValue = this.newRucheForm.value;
    this.selectHive.id = null;
    this.selectHive.idApiary = this.currentApiary.id;
    this.selectHive.description = formValue.descriptionRuche;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.apiaryName = this.currentApiary.name;
    this.selectHive.username = this.username.toLowerCase();
    this.initForm();
    this.rucheService.createRuche(this.selectHive).subscribe((hive) => {
      // this.rucheService.saveCurrentHive(hive.id);
      this.rucheService.ruchesAllApiary.push(hive);
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

  onSelectRuche(ruche: RucheInterface, apiary : RucherModel) {
    this.currentApiary = apiary;
    this.currentRuche = ruche;
    this.rucherService.rucherSelectUpdate = apiary;
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
    this.selectHive = this.currentRuche;
    this.selectHive.idApiary = this.rucherService.rucherSelectUpdate.id;
    this.selectHive.name = formValue.nomRuche;
    this.selectHive.description = formValue.descriptionRuche;
    this.rucheService.updateRuche(this.selectHive).subscribe(() => { }, () => { }, () => {
      // update for homePage
      if ((this.selectHive.idApiary === this.rucherService.getCurrentApiary()) && (this.currentApiary.id === this.rucherService.getCurrentApiary())) {
        let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive.id).indexOf(this.selectHive.id);
        this.rucheService.ruches[hiveIndexUpdate] = this.selectHive;
        this.rucheService.emitHiveSubject();
      } else if((this.currentApiary.id === this.rucherService.getCurrentApiary())){
        let hiveIndexUpdate = this.rucheService.ruches.map(hive => hive.id).indexOf(this.selectHive.id);
        this.rucheService.ruches.splice(hiveIndexUpdate, 1);
        this.rucheService.emitHiveSubject();
      } else if(((this.selectHive.idApiary === this.rucherService.getCurrentApiary()))){
        this.rucheService.ruches.push(this.selectHive);
      }
      // update for manage pages
      let hiveIndexUpdateListAllApiary = this.rucheService.ruchesAllApiary.map(hive => hive.id).indexOf(this.selectHive.id);
      this.rucheService.ruchesAllApiary[hiveIndexUpdateListAllApiary] = this.selectHive;

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