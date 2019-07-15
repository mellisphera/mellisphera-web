import { Component, OnInit, ViewChild } from '@angular/core';
import { UserloggedService } from '../userlogged.service';
import { LoadingService } from './service/loading.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { RucherService } from './service/api/rucher.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MyNotifierService } from './service/my-notifier.service';
import { TranslateService } from '@ngx-translate/core';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message: string;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = true;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public config = { animationType: ngxLoadingAnimationTypes.none, primaryColour: this.primaryColour, secondaryColour: this.secondaryColour}
  @ViewChild(NavbarComponent) public navComponent: NavbarComponent;
  constructor(public login: UserloggedService,
    private translateService: TranslateService,
    public loadingService: LoadingService,
    private myNotifierService: MyNotifierService,
    public rucherService: RucherService) {
    this.message = '';
    this.myNotifierService.setLang(this.login.getCountry() ? this.login.getCountry(): 'EN');
    this.rucherService.rucherSubject.subscribe(() => {}, () => {}, () => {
      if (this.rucherService.checkIfApiary()) {
        this.login.setWizardActive(false);
      }
    });
  }

  ngOnInit() {

  }

  receiveMessage($event) {
    this.message = $event;
  }
}
