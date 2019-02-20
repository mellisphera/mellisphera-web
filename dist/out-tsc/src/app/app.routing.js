var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RucheRucherComponent } from './ruche-rucher/ruche.rucher.component';
import { MeteoComponent } from './meteo/meteo.component';
import { LoginComponent } from './auth/login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { CapteurComponent } from './capteur/capteur.component';
import { RapportComponent } from './rapport/rapport.component';
import { FleursFloraisonComponent } from './fleurs-floraison/fleurs.floraison.component';
import { HomeComponent } from './accueil/home/home.component';
import { DemoComponent } from './demo/demo.component';
import { AdminComponent } from './admin/admin.component';
import { RucheDetailComponent } from './ruche-rucher/ruche-detail/ruche.detail.component';
var routes = [
    /* { path: '',             component: LoginComponent },
     { path: 'login',          component: LoginComponent },
     { path: 'dashboard',      component: HomeComponent },
   //{ path: 'dashboard',      component: DashboardComponent },
     { path: 'user',           component: UserComponent },
     { path: 'table',          component: TablesComponent },
     { path: 'typography',     component: TypographyComponent },
     { path: 'icons',          component: IconsComponent },
     { path: 'maps',           component: MapsComponent },
     { path: 'notifications',  component: NotificationsComponent },
     { path: 'upgrade',        component: UpgradeComponent },
     { path: '',               redirectTo: 'dashboard', pathMatch: 'full' }*/
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'accueil', canActivate: [AuthGuard], component: AccueilComponent },
    { path: 'ruche-et-rucher', canActivate: [AuthGuard], component: RucheRucherComponent },
    { path: 'capteurs', canActivate: [AuthGuard], component: CapteurComponent },
    { path: 'meteo', canActivate: [AuthGuard], component: MeteoComponent },
    { path: 'ruche-detail/:id/:name', canActivate: [AuthGuard], component: RucheDetailComponent },
    { path: 'rapport', canActivate: [AuthGuard], component: RapportComponent },
    { path: 'fleurs-floraison', canActivate: [AuthGuard], component: FleursFloraisonComponent },
    { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
    { path: 'admin', canActivate: [AuthGuard], component: AdminComponent },
    { path: '***REMOVED***', component: DemoComponent }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                RouterModule.forRoot(routes)
            ],
            exports: [],
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
export { AppRoutingModule };
//# sourceMappingURL=app.routing.js.map