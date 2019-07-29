import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked,HostListener } from '@angular/core';
import { ObservationService } from '../../apiary/ruche-rucher/ruche-detail/observation/service/observation.service';
import { RucheService } from '../../service/api/ruche.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DailyRecordService } from '../../service/api/dailyRecordService';
import { DailyRecordsWService } from '../../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { RucheInterface } from '../../../_model/ruche';
import { CapteurService } from '../../capteur/capteur.service';
import { AlertsService } from '../../service/api/alerts.service';
import { AlertsHiveComponent } from './alerts-hive/alerts-hive.component';

@Component({
  selector: 'app-info-hives',
  templateUrl: './info-hives.component.html',
  styleUrls: ['./info-hives.component.css']
})
export class InfoHivesComponent implements OnInit, OnDestroy, AfterViewChecked {

  private subscription: Subscription;
  screenHeight:any;
    screenWidth:any;
  @ViewChild(AlertsHiveComponent) alertsHiveComponent: AlertsHiveComponent;

  constructor(private observationService: ObservationService,
    public rucheService: RucheService,
    private route: ActivatedRoute,
    public dailyRecordThService: DailyRecordService,
    public capteurService: CapteurService,
    public dailyRecordWservice: DailyRecordsWService,
    private alertsService: AlertsService) {

      this.getScreenSize();

  }


  ngOnInit() {
    // this.subscription = this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive().id).subscribe();
    this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive().id).subscribe();
    this.dailyRecordThService.getByIdHive(this.rucheService.getCurrentHive().id);
    this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.getCurrentHive().id)
    // this.capteurService.getUserCapteurs();
  }

  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight;
          this.screenWidth = window.innerWidth;
    }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    if(this.screenWidth >990){
      const height = document.getElementById('cadre').offsetHeight;
      document.getElementById('left').style.top = ''+(0 + height) + 'px';
    }
  }


  ngOnDestroy() {
    // this.observationService.obsHiveSubject.unsubscribe();
  }

}
