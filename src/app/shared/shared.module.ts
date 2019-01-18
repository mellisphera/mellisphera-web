import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RucheDetailComponent } from '../accueil/ruche-rucher/ruche-detail/ruche.detail.component';
import { SidebarModule } from '../sidebar/sidebar.module';
//import { NavbarComponent } from './navbar/navbar.component';
import { NavbarModule } from './navbar/navbar.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    NavbarModule,
    RouterModule
  ],
  exports:[
    RucheDetailComponent,
    NavbarModule,
    RouterModule
    //SidebarModule
  ],
  declarations: [
    RucheDetailComponent,
  ]
})
export class SharedModule { }
