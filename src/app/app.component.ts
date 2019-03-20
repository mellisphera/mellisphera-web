import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AtokenStorageService } from './auth/Service/atoken-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showLogin : boolean;
 
     constructor(public location: Location,public router: Router, public tokenService: AtokenStorageService) {
       console.log(location);
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
