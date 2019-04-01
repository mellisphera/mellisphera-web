import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { RucheDetailComponent } from './ruche.detail.component';

const routes: Routes = [
    {
        path: '', component: RucheDetailComponent, children: [

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
export class RucheRoutingModule { }