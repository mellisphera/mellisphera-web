import { Component, OnInit, OnDestroy} from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
//import * as echarts from '../../../../assets/echarts.js';
import { ECharts, EChartOption} from 'echarts';
import { Rucher } from '../rucher';
import { Ruche } from '../ruche';
import { ProcessReport } from '../processedReport';
import { RucherService } from '../rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { selectedRucherService } from '../../_shared-services/selected-rucher.service';
import { Observable, Subscription } from 'rxjs';
// import { AnonymousSubscription } from "rxjs/Subscription";
import { RucheDetailService } from './ruche.detail.service';
import { CalendrierPoidsService } from './service/calendrier-poids.service';
import { DailyRecordsWService } from './service/daily-records-w.service';
import { DailyStockHoneyService } from './service/daily-stock-honey.service';
import { GrapheReserveMielService } from './service/graphe-reserve-miel.service';
import { RecordService } from './service/Record/record.service';
import { GraphRecordService } from './service/Record/graph-record.service';
import { DailyRecordService } from '../../disposition-ruche/Service/dailyRecordService';
import { CalendrierHealthService } from './service/health/calendrier-health.service';

@Component({
  selector: 'app-ruche-detail',
  templateUrl: './ruche.detail.component.html',
  styleUrls : ['./ruche.detail.component.scss']
})

export class RucheDetailComponent implements OnInit, OnDestroy {
   
    rucheId;
    rucheDetail = new Ruche();
    rucheName;
    rucheDescription;
    rucheCity;
    observationsHive : ProcessReport[] = [];

    //New Observation
    ObservationForm : FormGroup;
    type='';
    date = new Date();
    dateEdit = String();
    sentence='';
    selectedObs = new ProcessReport();

    radioObs : boolean;
    radioAct : boolean;

    //
    newObs = new ProcessReport();

    selectedObsR = new ProcessReport();

    public errorMsg;

  private timerSubscription: Subscription;

constructor(    private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService : RucherService,
                public RucheDetailService : RucheDetailService,
                private data : UserloggedService,
                public calendrierPoids : CalendrierPoidsService,
                private _selectedRucherService : selectedRucherService,
                public dailyRecWService : DailyRecordsWService,
                public dailyStockHoneyService : DailyStockHoneyService,
                public grapheMielService : GrapheReserveMielService,
                public recordService : RecordService,
                public graphRecordService : GraphRecordService,
                public calendrierHealthService : CalendrierHealthService,
                public dailyRecThService : DailyRecordService,
                private activatedRoute : ActivatedRoute){
                    this.rucheId = null;
                this.ObservationForm=formBuilder.group({
                        'sentence': [null,Validators.compose([Validators.required])],
                        'checkbox': [],
                  })
}
ngOnInit(){

    this.rucheId = this.activatedRoute.snapshot.params.id;
    console.log(this.rucheId);
    /*this.rucheId=localStorage.getItem("clickedRuche");
    console.log(this.rucheId);*/
    console.log(sessionStorage.getItem("selectedRucheName"));
    this.getRucheDetails();
    this.getObservationsHive();
    this.dailyRecWService.getDailyRecordsWbyIdHive(this.rucheId);
    this.dailyStockHoneyService.cleanQuery();
    this.dailyStockHoneyService.getDailyStockHoneyByApiary(this.rucheId);
    this.recordService.getRecordByIdHive(this.rucheId);
    console.log("ok");
    //this.chartWeightGain();
    //this.dailyRecThService.getByIdHive(this.rucheId);
    this.radioAct = false;
    this.radioObs = true;
    //console.log(this.calendrierPoids.option);
}

getRucheDetails(){
    console.log(this.rucheId);
    this.rucherService.getRucheDetail(this.rucheId).subscribe(
        data => { 
            console.log(data);
                this.rucheDetail = data;
                this.rucheName = this.rucheDetail.name;
                this.rucheDescription = this.rucheDetail.description;

              },
         err => console.error(err)
    );
}

getObservationsHive(){
    this.RucheDetailService.getObservationsHive(this.rucheId).subscribe(
        data => { 
                this.observationsHive = data;
            },
        err => console.error(err)
    );
}

onSelectObsR(obs){
    this.selectedObsR=obs;
    this.type=this.selectedObsR.type;
    this.sentence=this.selectedObsR.sentence;
    this.dateEdit=this.selectedObsR.date;
  }

selectRadioAction(){
    this.radioAct = true;
    this.radioObs = false;
}


selectRadioObs(){
    this.radioAct = false;
    this.radioObs = true;
}

//Pour créer une observation
createObservation(observation){

    // sometimes you want to be more precise
    var options = {
        weekday:'short',year:'numeric',month:'long',day:'2-digit',hour: 'numeric', minute: 'numeric', second: 'numeric',
    };
    this.newObs.date = new Intl.DateTimeFormat('fr-FR', options).format(this.date);

    if (this.radioAct){
        this.newObs.type = 'HiveAct';
    } else {
        this.newObs.type = 'HiveObs';
    }
    
    this.newObs.sentence = this.sentence;
    this.newObs.idApiary = '';
    this.newObs.idHive = this.rucheId;
    this.newObs.idLHive = [this.rucheId];
    this.newObs.nluScore = '';
    this.newObs.id=null;

      this.rucherService.createObservation(this.newObs).subscribe( 
        data => {},
        ( error => this.errorMsg=error)
      );
    alert("Votre Observations a été enregistrée avec Succès !");
    
    this.resetObservationForm();
    this.radioAct = false;
    this.radioObs = true;
    this.getObservationsHive();
}

onEditObservation(FormObs){
    this.newObs.date = this.dateEdit;
    this.newObs.sentence = this.sentence;
    this.newObs.type = this.selectedObsR.type;
    this.newObs.id = this.selectedObsR.id;
    this.newObs.idApiary = this.selectedObsR.idApiary;
    this.newObs.idHive = this.selectedObsR.idHive;
    this.newObs.idLHive = [this.rucheId];
    this.newObs.nluScore = this.selectedObsR.nluScore;
    this.rucherService.updateObs(this.newObs).subscribe( 
      data => {},
      ( error => this.errorMsg=error)
    );
    alert("Votre observation a été éditée");
    this.getObservationsHive();
  }

deleteObsR(ap){
    if (confirm("Etes vous sur de vouloir supprimer cette observation ?")) {
      this.rucherService.deleteObservation(ap.id).subscribe( 
        data => {},
        ( error => this.errorMsg=error)
      );
    }
    this.subscribeToData();
  }

resetObservationForm(){
    this.ObservationForm.get('sentence').reset();
}

private subscribeToData(): void {
    this.timerSubscription = Observable.timer(100).first().subscribe(() => this.getObservationsHive());
}
message="";
    receiveMessage($event){
        this.message=$event;
    }


    ngOnDestroy() {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.dailyRecWService.cleanQuery();
        this.dailyStockHoneyService.cleanQuery();
    }

}


