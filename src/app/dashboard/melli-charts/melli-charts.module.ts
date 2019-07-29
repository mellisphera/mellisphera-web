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

@NgModule({
  providers:[
    DailyManagerService,
    HourlyManagerService,
    StackMelliChartsService
  ],
  declarations: [
    MelliChartsComponent,
    HiveComponent,
    MapComponent,
    StackComponent,
    VitalityComponent,
    DailyComponent,
    HourlyComponent
   ],
  imports: [
    MelliChartsRouting,
    SharedModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MelliChartsModule { }
