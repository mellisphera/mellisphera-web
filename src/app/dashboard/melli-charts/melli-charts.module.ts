import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MelliChartsComponent } from './melli-charts.component';
import { MelliChartsRouting } from './melli-charts.routing';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MelliChartsComponent
   ],
  imports: [
    MelliChartsRouting,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MelliChartsModule { }
