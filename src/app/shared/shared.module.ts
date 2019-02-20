import { StackComponent } from './../ruche-rucher/ruche-detail/stack/stack.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RucheDetailComponent } from '../ruche-rucher/ruche-detail/ruche.detail.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { NavbarModule } from './navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { DailyComponent } from '../ruche-rucher/ruche-detail/daily/daily.component';
import { HourlyComponent } from '../ruche-rucher/ruche-detail/hourly/hourly.component';
import { StockComponent } from '../ruche-rucher/ruche-detail/stock/stock.component';
import { HealthComponent } from '../ruche-rucher/ruche-detail/health/health.component';
import { ObservationComponent } from '../ruche-rucher/ruche-detail/observation/observation.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendrierPoidsService } from '../ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { DailyRecordsWService } from '../ruche-rucher/ruche-detail/service/daily-records-w.service';
import { DailyStockHoneyService } from '../ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { GrapheReserveMielService } from '../ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { GraphRecordService } from '../ruche-rucher/ruche-detail/hourly/service/graph-record.service';
import { RecordService } from '../ruche-rucher/ruche-detail/service/Record/record.service';
import { CalendrierHealthService } from '../ruche-rucher/ruche-detail/health/service/calendrier-health.service';
import { DemoComponent } from '../demo/demo.component';

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    NavbarModule,
    RouterModule,
    NgxEchartsModule,
    ReactiveFormsModule
  ],
  exports:[
    RucheDetailComponent,
    NavbarModule,
    RouterModule
  ],
  declarations: [
    RucheDetailComponent,
    DailyComponent,
    HourlyComponent,
    StockComponent,
    HealthComponent,
    ObservationComponent,
    StackComponent,
    DemoComponent
  ],
  providers : [
    CalendrierPoidsService,
    DailyRecordsWService,
    DailyStockHoneyService,
    GrapheReserveMielService,
    GraphRecordService,
    RecordService,
    CalendrierHealthService
  ]
})
export class SharedModule { }
