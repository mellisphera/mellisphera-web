import { Component, OnInit, Input} from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import * as echarts from '../../../../assets/echarts.js';

import { Rucher } from '../rucher';
import { Ruche } from '../ruche';
import { ProcessReport } from '../processedReport';
import { RucherService } from '../rucher.service';
import { UserloggedService } from '../../../userlogged.service';
import { selectedRucherService } from '../../_shared-services/selected-rucher.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
import { RucheDetailService } from './ruche.detail.service';

@Component({
  selector: 'app-ruche-detail',
  templateUrl: './ruche.detail.component.html'
})

export class RucheDetailComponent implements OnInit {
   
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

  private timerSubscription: AnonymousSubscription;

constructor(    private formBuilder: FormBuilder,
                public location: Location,
                public router: Router,
                public rucherService : RucherService,
                public RucheDetailService : RucheDetailService,
                private data : UserloggedService,
                private _selectedRucherService : selectedRucherService){
                this.ObservationForm=formBuilder.group({
                        'sentence': [null,Validators.compose([Validators.required])],
                        'checkbox': [],
                  })
   
    console.log("local storage ruche ID "+localStorage.getItem("clickedRuche") );
}
ngOnInit(){
    this.rucheId=localStorage.getItem("clickedRuche");
    this.chartWeightGain();
    this.getRucheDetails();
    this.subscribeToData();
    this.radioAct = false;
    this.radioObs = true;
}

getRucheDetails(){
    this.rucherService.getRucheDetail(this.rucheId).subscribe(
        data => { 
                this.rucheDetail = data;
                this.rucheName = this.rucheDetail.name;
                this.rucheDescription = this.rucheDetail.description;

              },
         err => console.error(err),
         () => console.log()
    );
}

getObservationsHive(){
    this.RucheDetailService.getObservationsHive(this.rucheId).subscribe(
        data => { 
                this.observationsHive = data;
            },
        err => console.error(err),
        () => console.log()
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
    this.subscribeToData();
}

onEditObservation(){
    this.newObs.date = this.dateEdit;
    this.newObs.sentence = this.sentence;
    this.newObs.type = this.selectedObsR.type;
    this.newObs.id = this.selectedObsR.id;
    this.newObs.idApiary = this.selectedObsR.idApiary;
    this.newObs.idHive = this.selectedObsR.idHive;
    this.newObs.nluScore = this.selectedObsR.nluScore;
    this.rucherService.updateObs(this.newObs).subscribe( 
      data => {},
      ( error => this.errorMsg=error)
    );
    alert("Votre observation a été éditée");
    this.subscribeToData();
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
    this.timerSubscription = Observable.timer(500).first().subscribe(() => this.getObservationsHive());
}

chartWeightGain(){
      var myChart = echarts.init(document.getElementById('main'));

      var data = 
      [
       ['2018-03-09T00:05:02', 4709],
       ['2018-03-10T23:57:11', -1679],
       ['2018-03-11T17:03:21', 33167],
       ['2018-03-12T04:21:44', 581],
       ['2018-03-13T22:39:56', 408],
       ['2018-03-14T22:19:56', 453],
       ['2018-03-15T21:59:56', 282],
       ['2018-03-16T22:32:08', 589],
       ['2018-03-17T00:23:32', -18],
       ['2018-03-18T04:49:01', -453],
       ['2018-03-19T20:14:37', -19],
       ['2018-03-20T00:01:49', -136],
       ['2018-03-21T07:16:13', -426],
       ['2018-03-22T07:29:53', 299],
       ['2018-03-23T04:27:49', -344],
       ['2018-03-24T04:12:40', -617],
       ['2018-03-25T05:34:19', -182],
       ['2018-03-26T04:05:19', 100],
       ['2018-03-27T02:46:05', -562],
       ['2018-03-28T05:57:49', -463],
       ['2018-03-29T23:25:00', 82],
       ['2018-03-30T23:52:58', 9507],
       ['2018-03-31T12:06:10', 272],
       ['2018-04-01T23:45:45', -190],
       ['2018-04-02T23:05:55', 1261],
       ['2018-04-03T22:54:40', 934],
       ['2018-04-04T19:51:58', 844],
       ['2018-04-05T23:30:13', 299],
       ['2018-04-06T21:25:26', 1225],
       ['2018-04-07T23:09:23', -46],
       ['2018-04-08T02:00:56', 146],
       ['2018-04-09T08:30:48', -626],
       ['2018-04-10T23:25:50', 571],
       ['2018-04-11T00:22:00', 27],
       ['2018-04-12T23:52:24', -607],
       ['2018-04-13T08:07:06', 562],
       ['2018-04-14T23:27:50', -4618],
       ['2018-04-15T23:03:40', 309],
       ['2018-04-16T00:00:18', -9],
       ['2018-04-17T21:18:42', 771],
       ['2018-04-18T05:48:24', 136],
       ['2018-04-19T23:16:18', -1061],
       ['2018-04-20T00:10:36', 18],
       ['2018-04-21T04:09:38', -372],
       ['2018-04-22T09:30:29', -1116],
       ['2018-04-23T06:50:26', -11539],
       ['2018-04-24T23:52:04', -808],
       ['2018-04-25T04:32:04', 127],
       ['2018-04-26T03:39:45', -336],
       ['2018-04-27T05:35:32', 200],
       ['2018-04-28T00:32:12', -444],
       ['2018-04-29T23:48:39', -254],
       ['2018-04-30T07:17:59', 235],
       ['2018-05-01T06:42:09', -154],
       ['2018-05-02T07:14:14', 254],
       ['2018-05-03T08:05:46', -653],
       ['2018-05-04T00:21:00', -390],
       ['2018-05-05T07:54:06', -227],
       ['2018-05-06T07:42:45', 617],
       ['2018-05-07T23:09:08', 889],
       ['2018-05-08T23:12:03', 1116],
       ['2018-05-09T00:09:46', -18],
       ['2018-05-10T23:17:53', 508],
       ['2018-05-11T23:20:48', 1950],
       ['2018-05-12T03:11:40', 46],
       ['2018-05-13T02:16:52', -536],
       ['2018-05-14T06:10:39', -208],
       ['2018-05-15T00:27:16', -536],
       ['2018-05-16T23:23:47', 1933],
       ['2018-05-17T23:16:17', 1379],
       ['2018-05-18T23:08:47', 553],
       ['2018-05-19T03:55:17', 526],
       ['2018-05-20T08:39:40', 300],
       ['2018-05-21T08:38:00', -318],
       ['2018-05-22T08:36:20', -617],
       ['2018-05-23T07:37:08', 227],
       ['2018-05-24T23:53:32', 4926],
       ['2018-05-25T04:41:12', 64],
       ['2018-05-26T21:03:23', -218],
       ['2018-05-27T00:53:55', -572],
       ['2018-05-28T23:57:57', 563],
       ['2018-05-29T02:50:51', 290],
       ['2018-05-30T01:54:03', -572],
       ['2018-05-31T00:57:15', -54],
       ['2018-06-01T00:00:27', -390],
       ['2018-06-02T23:04:29', 227],
       ['2018-06-03T06:45:33', 417],
      
       ]
       ;
      
      
     var option = {
          backgroundColor: 'white',
      
          title: {
              top: 70,
              text: 'Weight_max for each day',
              left: 'center',
              textStyle: {
                  color: '#fff'
              }
          },
          tooltip : {
              trigger: 'item'
          },
          legend: {
              top: '30',
              left: '100',
              data:['gain','perte'],
              textStyle: {
                  color: 'black'
              }
          },
          calendar: [{
              top: 140,
              left: 'center',
              range: ['2018-03-01', '2018-06-30'],
              orient: 'vertical',
              cellSize: '30',
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: '#000',
                      width: 4,
                      type: 'solid'
                  }
              },
              dayLabel: {
                  firstDay: 1, // start on Monday
                },
              yearLabel: {
                  formatter: '{start}',
                  textStyle: {
                      color: 'black'
                  }
              },
              itemStyle: {
                  normal: {
                      color: 'lightgrey',
                      borderWidth: 1,
                      borderColor: '#111'
                  }
              }
          }],
          series : [
              {
                  name: 'gain',
                  type: 'effectScatter',
                  coordinateSystem: 'calendar',
                  data: data,
                  symbolSize: function (val) {
                         if(val[1]>=0){return 0.5*Math.sqrt(val[1]);}
                         else{ return 0;} 
                  },
                  showEffectOn: 'emphasis',
                  rippleEffect: {
                      brushType: 'stroke'
                  },
                  hoverAnimation: true,
                  itemStyle: {
                      normal: {
                          color: '#00FE0C'
                      }
                  }
              },
              {
                  name: 'perte',
                  type: 'effectScatter',
                  coordinateSystem: 'calendar',
                  data: data,
                  symbolSize: function (val) {
                     if(val[1]<0){return 0.5*Math.sqrt(Math.abs(val[1]));}
                 else{ return 0;} 
                  },
                  showEffectOn: 'emphasis',
                  rippleEffect: {
                      brushType: 'stroke'
                  },
                  hoverAnimation: true,
                  
                  itemStyle: {
                      normal: {
                          color: '#FE0000'
              
                      }
                  }
              },
      
                  
              
          ]
      };
              // use configuration item and data specified to show chart
              myChart.setOption(option);


}




}
