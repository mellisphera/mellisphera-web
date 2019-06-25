import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MelliChartsComponent } from "./melli-charts.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path: '', component: MelliChartsComponent, children: [
            
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