import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyComponent } from '../ruche-detail/daily/daily.component'
import { StockComponent } from '../ruche-detail/stock/stock.component';
import { HourlyComponent } from '../ruche-detail/hourly/hourly.component';
import { AuthGuardService as AuthGuard } from '../../../auth/auth-guard.service';
import { HealthComponent } from '../ruche-detail/health/health.component';
import { RucheDetailComponent } from '../ruche-detail/ruche.detail.component';
import { ObservationComponent } from '../ruche-detail/observation/observation.component';

const routes: Routes = [
  {
    path: '',
    component: RucheDetailComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'daily/:id/:name', component: DailyComponent },
      { path: 'stock/:id/:name', component: StockComponent },
      { path: 'hourly/:id/:name', component: HourlyComponent },
      { path: 'health/:id/:name', component : HealthComponent},
      { path: 'observation/:id/:name', component : ObservationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRucheRoutingModule { }
