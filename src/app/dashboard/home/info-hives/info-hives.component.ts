import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
export class InfoHivesComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  @ViewChild(AlertsHiveComponent) alertsHiveComponent: AlertsHiveComponent;

  constructor(private observationService: ObservationService,
    public rucheService: RucheService,
    private route: ActivatedRoute,
    public dailyRecordThService: DailyRecordService,
    public capteurService: CapteurService,
    public dailyRecordWservice: DailyRecordsWService,
    private alertsService: AlertsService) {

  }


  ngOnInit() {
    // this.subscription = this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive().id).subscribe();
    this.observationService.getObservationByIdHive(this.rucheService.getCurrentHive().id).subscribe();
    this.dailyRecordThService.getByIdHive(this.rucheService.getCurrentHive().id);
    this.dailyRecordWservice.getDailyRecordsWbyIdHive(this.rucheService.getCurrentHive().id)
    this.capteurService.getUserCapteurs();
  }


  ngOnDestroy() {
    // this.observationService.obsHiveSubject.unsubscribe();
  }

}
