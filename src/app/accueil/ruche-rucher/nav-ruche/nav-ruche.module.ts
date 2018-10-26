import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from '../ruche-detail/daily/daily.component';
import { HourlyComponent } from '../ruche-detail/hourly/hourly.component';
import { StockComponent } from '../ruche-detail/stock/stock.component';
import { HealthComponent } from '../ruche-detail/health/health.component';
import { NavRucheRoutingModule } from './nav-ruche-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ObservationComponent } from '../ruche-detail/observation/observation.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    NavRucheRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [
    DailyComponent,
    HourlyComponent,
    StockComponent,
    HealthComponent,
    ObservationComponent
  ],
})
export class NavRucheModule { }
