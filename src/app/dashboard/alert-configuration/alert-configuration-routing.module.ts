import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertConfigurationComponent } from './alert-configuration.component';
import { SensorAlertComponent } from './sensor-alert/sensor-alert.component';
import { WeatherAlertComponent } from './weather-alert/weather-alert.component';
import { AuthGuardService } from '../../auth/auth-guard.service';
import { HiveAlertComponent } from './hive-alert/hive-alert.component';
import { AlertsConfSubmitComponent } from './alerts-conf-submit/alerts-conf-submit.component';

const routes: Routes = [
  { path: '', component: AlertConfigurationComponent, children: [
    { path: 'sensor-alert', component: SensorAlertComponent, canActivate: [AuthGuardService]},
    { path: 'weather-alert', component: WeatherAlertComponent, canActivate: [AuthGuardService]},
    { path: 'hive-alert', component: HiveAlertComponent, canActivate: [AuthGuardService]},
    { path: 'alert-submit',component: AlertsConfSubmitComponent, canActivate: [AuthGuardService]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertConfigurationRoutingModule { }
