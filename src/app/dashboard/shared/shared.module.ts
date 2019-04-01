import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NotifierModule } from 'angular-notifier';
import { StackComponent } from '../apiary/ruche-rucher/ruche-detail/stack/stack.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RucheDetailComponent } from '../apiary/ruche-rucher/ruche-detail/ruche.detail.component';
import { SidebarModule } from '../sidebar/sidebar.module';
import { NavbarModule } from './navbar/navbar.module';
import { RouterModule } from '@angular/router';
import { DailyComponent } from '../apiary/ruche-rucher/ruche-detail/daily/daily.component';
import { HourlyComponent } from '../apiary/ruche-rucher/ruche-detail/hourly/hourly.component';
import { StockComponent } from '../apiary/ruche-rucher/ruche-detail/stock/stock.component';
import { HealthComponent } from '../apiary/ruche-rucher/ruche-detail/health/health.component';
import { ObservationComponent } from '../apiary/ruche-rucher/ruche-detail/observation/observation.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendrierPoidsService } from '../apiary/ruche-rucher/ruche-detail/stock/service/calendrier-poids.service';
import { DailyRecordsWService } from '../apiary/ruche-rucher/ruche-detail/service/daily-records-w.service';
import { DailyStockHoneyService } from '../apiary/ruche-rucher/ruche-detail/service/daily-stock-honey.service';
import { GrapheReserveMielService } from '../apiary/ruche-rucher/ruche-detail/stock/service/graphe-reserve-miel.service';
import { GraphRecordService } from '../apiary/ruche-rucher/ruche-detail/hourly/service/graph-record.service';
import { RecordService } from '../apiary/ruche-rucher/ruche-detail/service/Record/record.service';
import { CalendrierHealthService } from '../apiary/ruche-rucher/ruche-detail/health/service/calendrier-health.service';
import { DemoComponent } from '../../demo/demo.component';
import { BrowserModule } from '@angular/platform-browser';
import { FeedbackComponent } from '../../feedback/feedback.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    NavbarModule,
    RouterModule,
    // BrowserModule,
    FormsModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    }),
  ],
  exports: [
    TranslateModule,
    NgxEchartsModule
  ],
  declarations: [

  ],
  providers : [
  ]
})
export class SharedModule { }
