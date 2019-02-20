var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DailyComponent } from '../ruche-detail/daily/daily.component';
import { StockComponent } from '../ruche-detail/stock/stock.component';
import { HourlyComponent } from '../ruche-detail/hourly/hourly.component';
import { AuthGuardService as AuthGuard } from '../../auth/auth-guard.service';
import { HealthComponent } from '../ruche-detail/health/health.component';
import { RucheDetailComponent } from '../ruche-detail/ruche.detail.component';
import { ObservationComponent } from '../ruche-detail/observation/observation.component';
var routes = [
    {
        path: '',
        component: RucheDetailComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'daily/:id/:name', component: DailyComponent },
            { path: 'stock/:id/:name', component: StockComponent },
            { path: 'hourly/:id/:name', component: HourlyComponent },
            { path: 'health/:id/:name', component: HealthComponent },
            { path: 'observation/:id/:name', component: ObservationComponent }
        ]
    }
];
var NavRucheRoutingModule = /** @class */ (function () {
    function NavRucheRoutingModule() {
    }
    NavRucheRoutingModule = __decorate([
        NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
        })
    ], NavRucheRoutingModule);
    return NavRucheRoutingModule;
}());
export { NavRucheRoutingModule };
//# sourceMappingURL=nav-ruche-routing.module.js.map