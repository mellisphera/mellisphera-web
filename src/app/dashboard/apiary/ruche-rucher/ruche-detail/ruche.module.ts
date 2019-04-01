import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RucheRoutingModule } from './ruche.routing';
import { RucheDetailComponent } from './ruche.detail.component';
import { ObservationComponent } from './observation/observation.component';
import { SharedModule } from '../../../shared/shared.module';
import { HealthComponent } from './health/health.component';
import { DailyComponent } from './daily/daily.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './stock/stock.component';
import { StackComponent } from './stack/stack.component';
import { HourlyComponent } from './hourly/hourly.component';

@NgModule({
  imports: [
  CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RucheRoutingModule,
    SharedModule
  ],
  providers: [
  ],
  declarations: [
    RucheDetailComponent,
    ObservationComponent,
    HealthComponent,
    DailyComponent,
    HourlyComponent,
    StackComponent,
    StockComponent
  ]
})
export class RucheModule { }
