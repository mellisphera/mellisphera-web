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
import { MelliChartsRouting } from './melli-charts.routing';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HiveComponent } from './hive/hive.component';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { StackComponent } from './stack/stack.component';
import { VitalityComponent } from './vitality/vitality.component';
import { DailyManagerService } from './hive/service/daily-manager.service';
import { HourlyManagerService } from './hive/service/hourly-manager.service';
import { MelliChartsComponent } from './melli-charts.component';
import { DailyComponent } from './hive/daily/daily.component';
import { HourlyComponent } from './hive/hourly/hourly.component';
import { StackMelliChartsService } from './stack/service/stack-melli-charts.service';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';
import { AlertsService } from '../service/api/alerts.service';
import { GraphGlobal } from '../graph-echarts/GlobalGraph';
import { WeightComponent } from './weight/weight.component';

@NgModule({
  providers:[
    DailyManagerService,
    GraphGlobal,
    HourlyManagerService,
    StackMelliChartsService,
  ],
  declarations: [
    MelliChartsComponent,
    HiveComponent,
    MapComponent,
    StackComponent,
    VitalityComponent,
    DailyComponent,
    HourlyComponent,
    WeightComponent,
   ],
  imports: [
    MelliChartsRouting,
    SharedModule,
    RouterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MelliChartsModule { }
