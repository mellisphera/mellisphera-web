/* import { ConfirmationPopoverModule } from 'angular-confirmation-popover'; */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ngfModule } from 'angular-file';
import { DragAndCheckModule } from 'ng2-drag-and-check';

@NgModule({
    imports: [
        RouterModule,
       // BrowserModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        ngfModule
/*         ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          }) */
    ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
