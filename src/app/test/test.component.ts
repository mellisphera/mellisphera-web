import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  showLogin : boolean;
 
     constructor(public location: Location,public router: Router) {
       this.showLogin=true;
       
     }

    ngOnInit(){
    }


  goToDashboard(){
    
    this.router.navigate(['dashboard']);
  }

  logIn(){
    this.showLogin=false;
  }


    isMap(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }
}
