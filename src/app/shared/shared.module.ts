import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RucheDetailComponent } from '../accueil/ruche-rucher/ruche-detail/ruche.detail.component';
import { SidebarModule } from '../sidebar/sidebar.module';
//import { NavbarComponent } from './navbar/navbar.component';
import { NavbarModule } from './navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { DailyComponent } from '../accueil/ruche-rucher/ruche-detail/daily/daily.component';
import { HourlyComponent } from '../accueil/ruche-rucher/ruche-detail/hourly/hourly.component';
import { StockComponent } from '../accueil/ruche-rucher/ruche-detail/stock/stock.component';
import { HealthComponent } from '../accueil/ruche-rucher/ruche-detail/health/health.component';
import { ObservationComponent } from '../accueil/ruche-rucher/ruche-detail/observation/observation.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendrierPoidsService } from '../accueil/ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { DailyRecordsWService } from '../accueil/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { DailyStockHoneyService } from '../accueil/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { GrapheReserveMielService } from '../accueil/ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { GraphRecordService } from '../accueil/ruche-rucher/ruche-detail/hourly/service/graph-record.service';
import { RecordService } from '../accueil/ruche-rucher/ruche-detail/service/Record/record.service';
import { CalendrierHealthService } from '../accueil/ruche-rucher/ruche-detail/health/service/calendrier-health.service';

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
    //SidebarModule
  ],
  declarations: [
    RucheDetailComponent,
    DailyComponent,
    HourlyComponent,
    StockComponent,
    HealthComponent,
    ObservationComponent
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
