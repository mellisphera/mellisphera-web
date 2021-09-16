/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { StatesComponent } from './info-apiary/states/states.component';
import { AlertsComponent } from './info-apiary/alerts/alerts.component';
import { NotesComponent } from './info-apiary/notes/notes.component';
import { InfoHivesComponent } from './info-hives/info-hives.component';
import { ngfModule } from 'angular-file';
import { AngularDraggableModule } from 'angular2-draggable';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NotesHivesComponent } from './info-hives/notes-hives/notes-hives.component';
import { WeightHivesComponent } from './info-hives/weight-hives/weight-hives.component';
import { HealthHiveComponent } from './info-hives/health-hive/health-hive.component';
import { SensorsHiveComponent } from './info-hives/sensors-hive/sensors-hive.component';
import { AlertsHiveComponent } from './info-hives/alerts-hive/alerts-hive.component';
import { InfoApiaryComponent } from './info-apiary/info-apiary.component';
import { AlertsService } from '../service/api/alerts.service';
import { GraphGlobal } from '../graph-echarts/GlobalGraph';
import { NgxPrintModule } from 'ngx-print';
import { SafeHtmlPipe } from '../explore/safe-html.pipe';
import { PipeModule } from './../../pipe/pipe.module';
import { MyDatePipe } from '../../pipe/my-date.pipe';

import { UserParamsService } from '../preference-config/service/user-params.service';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';

const MY_CUSTOM_FORMATS = {
  fullPickerInput: UserParamsService.getUPref().timeFormat.split(' ')[0],
  parseInput: UserParamsService.getUPref().timeFormat.split(' ')[0],
  datePickerInput: UserParamsService.getUPref().timeFormat.split(' ')[0],
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ngfModule,
    NgxPrintModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularDraggableModule,
    PipeModule
  ],
  providers: [
    GraphGlobal,
    SafeHtmlPipe,
    MyDatePipe,
    UserParamsService,
    { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
  ],
  declarations: [
    HomeComponent,
    StatesComponent,
    AlertsComponent,
    NotesComponent,
    InfoHivesComponent,
    NotesHivesComponent,
    WeightHivesComponent,
    HealthHiveComponent,
    SensorsHiveComponent,
    AlertsHiveComponent,
    InfoApiaryComponent,
  ]
})
export class HomeModule { }
