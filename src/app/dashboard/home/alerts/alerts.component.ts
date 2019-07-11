import { Component, OnInit, Renderer2 } from '@angular/core';
import { AlertsService } from '../../service/api/alerts.service';
import { RucherService } from '../../service/api/rucher.service';
import { AlertInterface } from '../../../_model/alert';
import { UserloggedService } from '../../../userlogged.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  private readonly notifier: NotifierService;
  private eltOnClickId: EventTarget;
  username: string;

  constructor(private alertsService: AlertsService,
              public rucherService: RucherService,
              private userService: UserloggedService,
              public notifierService: NotifierService,
              private renderer: Renderer2,
              public login: UserloggedService) {

                this.notifier = this.notifierService;
                this.eltOnClickId = null;
                this.username = this.login.getUser();
  }

  ngOnInit() {
    this.alertsService.getAlertsByApiary(this.rucherService.getCurrentApiary());

    // Active the alert button
    this.eltOnClickId = document.getElementById('alert');
    this.renderer.addClass(this.eltOnClickId, 'active0');

    // desactive other buttons
    this.eltOnClickId = document.getElementById('notes');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
    this.eltOnClickId = document.getElementById('summary');
    this.renderer.removeClass(this.eltOnClickId, 'active0');
  }

  onClickRead(alert : AlertInterface, i: number){
     // Update in database
     this.alertsService.updateAlert(alert._id, true).subscribe(() => { }, () => { }, () => {
      // Update in apiaryAlerts table
      this.alertsService.apiaryAlerts[i].check = true;
      // update the number of actives alerts
      this.alertsService.numberApiaryAlertsActives = this.alertsService.numberApiaryAlertsActives-1;
      if(this.userService.getJwtReponse().country === "FR"){
        this.notifier.notify('success', 'Alerte marquée comme lue');
      }else{
        this.notifier.notify('success', 'Alert marked as read');
      }
    });
  }

  onClickNotRead(alert : AlertInterface,  i: number){
    // Update in database
    this.alertsService.updateAlert(alert._id, false).subscribe(() => { }, () => { }, () => {
        // Update in apiaryAlerts table
        this.alertsService.apiaryAlerts[i].check = false;
        // update the number of actives alerts
      this.alertsService.numberApiaryAlertsActives = this.alertsService.numberApiaryAlertsActives+1;
        if(this.userService.getJwtReponse().country === "FR"){
          this.notifier.notify('success', 'Alerte marquée comme non lue');
        }else{
          this.notifier.notify('success', 'Alert marked as unread');
        }
    });
  }

}
