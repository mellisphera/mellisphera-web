import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './../dashboard/melli-charts/safe-html.pipe';

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [
    CommonModule,
  ],
  exports:[SafeHtmlPipe],
})
export class PipeModule { }
