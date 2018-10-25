import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { DailyComponent } from '../ruche-detail/daily/daily.component';
import { HourlyComponent } from '../ruche-detail/hourly/hourly.component';
import { StockComponent } from '../ruche-detail/stock/stock.component';
import { HealthComponent } from '../ruche-detail/health/health.component';
import { AppModule } from '../../../app.module';


@NgModule({
  imports: [
    //CommonModule,
    AppModule
  ],
  declarations: [
    DailyComponent,
    HourlyComponent,
    StockComponent,
    HealthComponent
  ]
})
export class NavRucheModule { }
