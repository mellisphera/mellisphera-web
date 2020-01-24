import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertConfigurationRoutingModule } from './alert-configuration-routing.module';
import { AlertConfigurationComponent } from './alert-configuration.component';
import { SensorAlertComponent } from './sensor-alert/sensor-alert.component';
import { WeatherAlertComponent } from './weather-alert/weather-alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SettingsViewTemplateComponent } from './settings-view-template/settings-view-template.component';
import { HiveAlertComponent } from './hive-alert/hive-alert.component';
import { AlertsConfSubmitComponent } from './alerts-conf-submit/alerts-conf-submit.component';

@NgModule({
  declarations: [
    AlertConfigurationComponent,
    SensorAlertComponent,
    WeatherAlertComponent,
    SettingsViewTemplateComponent,
    HiveAlertComponent,
    AlertsConfSubmitComponent
  ],
  providers: [

  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AlertConfigurationRoutingModule
  ]
})
export class AlertConfigurationModule { }
