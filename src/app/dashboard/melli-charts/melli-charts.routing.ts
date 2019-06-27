import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MelliChartsComponent } from "./melli-charts.component";
import { NgModule } from "@angular/core";
import { HiveComponent } from "./hive/hive.component";
import { AuthGuardService } from "../../auth/auth-guard.service";
import { MapComponent } from "./map/map.component";
import { VitalityComponent } from "./vitality/vitality.component";
import { StackComponent } from "./stack/stack.component";

const routes: Routes = [
    {
        path: '', component: MelliChartsComponent, children: [
            { path: 'hive', component: HiveComponent, canActivate: [AuthGuardService]},
            { path: 'map', component: MapComponent, canActivate: [AuthGuardService]},
            { path: 'vitality', component: VitalityComponent, canActivate: [AuthGuardService]},
            { path: 'stack', component: StackComponent, canActivate: [AuthGuardService]}
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
export class MelliChartsRouting { }