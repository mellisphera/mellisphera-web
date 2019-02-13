import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule, ngfDrop, ngfSelect } from 'angular-file';

@NgModule({
    imports: [
        RouterModule,
        ngfModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
