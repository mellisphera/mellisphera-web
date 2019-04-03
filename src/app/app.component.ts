import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AtokenStorageService } from './auth/Service/atoken-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from './dashboard/service/loading.service';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  showLogin: boolean;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour}

 
     constructor(public location: Location,
      public router: Router,
      public tokenService: AtokenStorageService,
      private translateService: TranslateService,
      public loadingService: LoadingService) {
       console.log(location);
       this.showLogin = true;
       translateService.addLangs(['en', 'fr']);
       translateService.setDefaultLang('en');
       this.primaryColour = PrimaryRed;
       this.secondaryColour = SecondaryBlue;
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
