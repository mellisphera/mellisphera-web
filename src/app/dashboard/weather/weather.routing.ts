import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../../auth/auth-guard.service";
import { WeatherComponent } from "./weather.component";
import { WeatherRecordsComponent } from "./weather-records/weather-records.component";
import { WeatherConfigComponent } from "./weather-config/weather-config.component";

const routes: Routes = [
    {
        path: '', component: WeatherComponent, children: [
            { path: 'records', component: WeatherRecordsComponent, canActivate: [AuthGuardService]},
            { path: 'config', component: WeatherConfigComponent, canActivate: [AuthGuardService]},
            { path: '', redirectTo: 'records', pathMatch: 'full', canActivate: [AuthGuardService]}
        ]
    }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
  ],
})
export class WeatherRouting { }