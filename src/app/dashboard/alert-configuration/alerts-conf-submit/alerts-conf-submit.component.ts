import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AlertUser } from '../../../_model/alertUser';
import { AlertsService } from '../../service/api/alerts.service';

@Component({
  selector: 'app-alerts-conf-submit',
  templateUrl: './alerts-conf-submit.component.html',
  styleUrls: ['./alerts-conf-submit.component.css']
})
export class AlertsConfSubmitComponent implements OnInit, OnDestroy {

  public alertUser: AlertUser;
  public emails: string[];
  public frequency: string;
  constructor(private alertService: AlertsService) {
    this.alertUser = {
      _id: '',
      userId: '',
      availableFrequency: [],
      dayFrequency: 1,
      email: [],
      emailEnable: true,
      frequency: '',
      alertConf: new Map()
    }
    this.alertService.alertConfSubject.subscribe(
      () => {}, () => {}, () => {
        this.alertUser = this.alertService.alertUser;
        this.frequency = this.alertUser.frequency;
        this.emails = this.alertUser.email.slice();
      }
    );
  }

  ngOnInit() {
  }
  
  onMailChange(event: any, index: number) {
    this.alertUser.email[index] = event.target.value;
  }
  onChangeFrequency() {
    console.log(this.frequency);
  }

  ngOnDestroy(): void {

  }
}
