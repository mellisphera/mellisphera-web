import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RucherService } from '../../../service/api/rucher.service';
import { DailyRecordsWService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../../../apiary/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { RecordService } from '../../../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { ObservationService } from '../../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RucheService } from '../../../service/api/ruche.service';
import { Observation } from '../../../../_model/observation';
import { UserParamsService } from '../../../preference-config/service/user-params.service';
import { UserloggedService } from '../../../../userlogged.service';


@Component({
  selector: 'app-notes-hives',
  templateUrl: './notes-hives.component.html',
  styleUrls: ['./notes-hives.component.css']
})
export class NotesHivesComponent implements OnInit {

  ObservationForm: FormGroup;
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
    private rucheService: RucheService,
    private notifyService: NotifierService,
    public userParamService: UserParamsService,
    private userService: UserloggedService
  ) {
    this.typeObs = false;
    this.notifier = notifyService;
    this.initForm();
  }

  ngOnInit() {
  }

  initForm() {
    const defautDate = new Date();
    // defautDate.setUTCHours(new Date().getHours());
    this.ObservationForm = this.formBuilder.group({
      'sentence': [null, Validators.compose([Validators.required])],
      'type': 'HiveObs',
      'date': new Date()
    });
  }

  createObservation() {
    const formValue = this.ObservationForm.value;
    this.newObs = formValue;
    this.newObs.type = 'HiveObs';
    this.newObs.idHive = this.rucheService.getCurrentHive().id;
    this.newObs.idLHive = [this.rucheService.getCurrentHive().id];
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
  }
  createAction() {
    const formValue = this.ObservationForm.value;
    this.newObs = formValue;
    this.newObs.type = 'HiveAct';
    this.newObs.idHive = this.rucheService.getCurrentHive().id;
    this.newObs.idLHive = [this.rucheService.getCurrentHive().id];
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
    const formValue = this.ObservationForm.value;
    this.newObs.sentence = formValue.sentence;
    this.newObs.date = formValue.date;
    this.newObs.type = formValue.type;
    const index = this.observationService.observationsHive.indexOf(this.newObs);
    this.initForm();
    this.observationService.updateObservation(this.newObs).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsHive[index] = this.newObs;
      this.observationService.emitHiveSubject();
      if(this.userService.getJwtReponse().country === "FR"){
        this.notifier.notify('success', 'Note mis à jour');
      }else{
        this.notifier.notify('success', 'Updated Note');
      }
    })
  }
  deleteObsR(index: number, hiveObs: Observation) {
    this.observationService.deleteObservation(hiveObs.id).subscribe(() => { }, () => { }, () => {
      this.observationService.observationsHive.splice(index, 1);
      this.observationService.emitHiveSubject();
      if(this.userService.getJwtReponse().country === "FR"){
        this.notifier.notify('success', 'Note supprimée');
      }else{
        this.notifier.notify('success', 'Deleted Note');
      }
    });
  }
  resetObservationForm() {
    this.ObservationForm.get('sentence').reset();
  }

}
