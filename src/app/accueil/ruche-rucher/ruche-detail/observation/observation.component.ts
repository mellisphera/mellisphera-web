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

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.css']
})
export class ObservationComponent implements OnInit {

  ObservationForm : FormGroup;
  rucheId;
  rucheName;
  rucheDescription;
  radioObs : boolean;
  typeAjout : any;

  optionsDate = {
    weekday:'short',year:'numeric',month:'long',day:'2-digit',hour: 'numeric', minute: 'numeric', second: 'numeric',
  };

  //observationsHive : ProcessReport[] = [];
  constructor(public rucherService : RucherService,
    private formBuilder : FormBuilder,
    private dailyRecWService : DailyRecordsWService,
    private activatedRoute : ActivatedRoute,
    private dailyStockHoneyService : DailyStockHoneyService,
    private recordService : RecordService,
    public observationService : ObservationService
    ) {
      this.initForm();
    }

  ngOnInit() {
    this.rucheId = this.activatedRoute.snapshot.params.id;
    console.log(this.rucheId);
    this.observationService.getObservationByIdHive(this.rucheId);
    /*this.getRucheDetails();
    this.getObservationsHive();*/
    /*this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheId);
    this.dailyStockHoneyService.cleanQuery();
    this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheId);*/
    this.recordService.getRecordByIdHive(this.rucheId);
  }


  initForm(){
    this.ObservationForm=this.formBuilder.group({
      'sentence': [null,Validators.compose([Validators.required])],
      'type': [],
      'date': new Intl.DateTimeFormat('fr-FR', this.optionsDate).format(new Date()),
    })
  }

  createObservation(event){
    const formValue = this.ObservationForm.value;
    this.observationService.observation = formValue;
    this.observationService.observation.idHive = this.rucheId;
    this.observationService.observation.idLHive = [this.rucheId];
    console.log(this.observationService.observation);
    this.initForm();
    this.observationService.createObservation();
  }

  onSelectObsR(hiveOBS){
    this.observationService.observation = hiveOBS;
    console.log(this.observationService.observation);
    var donnée = {
      sentence : this.observationService.observation.sentence,
      type : this.observationService.observation.type,
      date : this.observationService.observation.date
    };
    this.ObservationForm.setValue(donnée);
  }

  onEditObservation(){
   const formValue = this.ObservationForm.value;
   this.observationService.observation.sentence = formValue.sentence;
   console.log(this.observationService.observation);
   this.observationService.updateObservation();
  }

  deleteObsR(hiveObs){
    this.observationService.observation = hiveObs;
    this.observationService.deleteObservation();
  }

}
