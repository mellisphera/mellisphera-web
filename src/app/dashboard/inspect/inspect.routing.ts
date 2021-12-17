import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AuthGuardService } from "../../auth/auth-guard.service";
import { InspectNewComponent } from './inspect-new/inspect-new.component';
import { InspectParamsComponent } from './inspect-params/inspect-params.component';
import { InspectComponent } from "./inspect.component";

const routes: Routes = [
    {
        path: '', component: InspectComponent, children: [
            { path: 'new', component: InspectNewComponent, canActivate: [AuthGuardService]},
            { path: 'params', component: InspectParamsComponent, canActivate: [AuthGuardService]},
            { path: '', redirectTo: 'new', pathMatch: 'full', canActivate: [AuthGuardService]}
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
export class InspectRouting { }
