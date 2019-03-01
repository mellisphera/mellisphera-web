import { MyDate } from './../../../class/MyDate';
import { NotifierService } from 'angular-notifier';
import { Component, OnInit } from '@angular/core';
import { RucherService } from '../../rucher.service';
import { Ruche } from '../../ruche';
import { RucheDetailService } from '../ruche.detail.service';
import { ProcessReport } from '../../processedReport';
import { DailyRecordsWService } from '../service/daily-records-w.service';
import { ActivatedRoute } from '@angular/router';
import { DailyStockHoneyService } from '../service/daily-stock-honey.service';
import { RecordService } from '../service/Record/record.service';
import { ObservationService } from './service/observation.service';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { RucheService } from '../../../accueil/Service/ruche.service';
import { Observation } from '../../../_model/observation';
@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  ObservationForm : FormGroup;
  radioObs: boolean;
  typeAjout: any;
  private newObs: Observation;
  private notifier: NotifierService;
  typeObs: boolean;
  optionsDate = {
    weekday:'short',year:'numeric',month:'long',day:'2-digit',hour: 'numeric', minute: 'numeric', second: 'numeric',
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
    private notifyService: NotifierService
    ) {
      this.typeObs = false;
      this.notifier = notifyService;
      this.initForm();
    }

  ngOnInit() {
    /*this.rucheId = this.activatedRoute.snapshot.params.id;
    this.rucheName = this.activatedRoute.snapshot.params.name;
    this.observationService.getObservationByIdHive(this.rucheService.ruche.id);*/
  }


  initForm(){
    this.ObservationForm = this.formBuilder.group({
      'sentence': [null,Validators.compose([Validators.required])],
      'type': 'HiveObs',
      'date': new MyDate(new Date()).getIso()
    });
  }

  createObservation() {
    const formValue = this.ObservationForm.value;
    this.newObs = formValue;
    this.newObs.type = 'HiveObs';
    this.newObs.idHive = this.rucheService.getCurrentHive();
    this.newObs.idLHive = [this.rucheService.getCurrentHive()];
    this.initForm();
    this.observationService.createObservation(this.newObs).subscribe( (obs) => {
      this.observationService.observationsHive.push(obs);
    }, () => {}, () => {
      this.observationService.emitHiveSubject();
      this.notifier.notify('success', 'Created Note');
    });
  }
  createAction() {
    const formValue = this.ObservationForm.value;
    this.newObs = formValue;
    this.newObs.type = 'HiveAct';
    this.newObs.idHive = this.rucheService.getCurrentHive();
    this.newObs.idLHive = [this.rucheService.getCurrentHive()];
    this.initForm();
    this.observationService.createObservation(this.newObs).subscribe( (obs) => {
      this.observationService.observationsHive.push(obs);
    }, () => {}, () => {
      this.observationService.emitHiveSubject();
      this.notifier.notify('success','Created Action');
    });
  }
  onSelectObsR(hiveOBS) {
    this.newObs = hiveOBS;
    const donnée = {
      sentence : this.newObs.sentence,
      type : this.newObs.type,
      date : this.newObs.date
    };
    this.ObservationForm.setValue(donnée);
  }

  onEditObservation() {
   const formValue = this.ObservationForm.value;
   this.newObs.sentence = formValue.sentence;
   this.newObs.date = formValue.date;
   this.newObs.type = formValue.type;
   const index = this.observationService.observationsHive.indexOf(this.newObs);
   this.observationService.updateObservation(this.newObs).subscribe(() => {}, () => {}, () => {
     this.observationService.observationsHive[index] = this.newObs;
     this.observationService.emitHiveSubject();
     this.notifier.notify('success', 'Updated Note');
   });
  }

  deleteObsR(index: number, hiveObs: Observation) {
    console.log(hiveObs);
    this.observationService.deleteObservation(hiveObs.id).subscribe(() => {}, () => {}, () => {
      this.observationService.observationsHive.splice(index, 1);
      this.observationService.emitHiveSubject();
      this.notifier.notify('success','Deleted Note');
    });
  }
  resetObservationForm() {
    this.ObservationForm.get('sentence').reset();
  }
}
