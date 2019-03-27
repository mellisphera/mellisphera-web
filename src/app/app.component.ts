import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AtokenStorageService } from './auth/Service/atoken-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showLogin : boolean;
 
     constructor(public location: Location,
      public router: Router, 
      public tokenService: AtokenStorageService,
      private translateService: TranslateService) {
       console.log(location);
       this.showLogin = true;
       translateService.addLangs(['en', 'fr']);
       translateService.setDefaultLang('en');
   
       const browserLang = translateService.getBrowserLang();
       translateService.use(browserLang.match(/en|fr/) ? browserLang : 'en');
     }

    ngOnInit(){
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
