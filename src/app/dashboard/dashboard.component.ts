import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { UserloggedService } from '../userlogged.service';
import { LoadingService } from './service/loading.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { RucherService } from './service/api/rucher.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { MyNotifierService } from './service/my-notifier.service';
import { MessagesService } from './service/messages.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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
    private renderer: Renderer2,
    private myNotifierService: MyNotifierService,
    private messagesService : MessagesService,
    public rucherService: RucherService,
    private router: Router) {
    this.message = '';
    this.myNotifierService.setLang(this.login.getCountry() ? this.login.getCountry(): 'EN');
    this.messagesService.setLang(this.login.getCountry() ? this.login.getCountry(): 'EN');
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

  hideCRUD(event : any){
    if(event.target.id !== 'menuCheckbox'){
      let elt : any = document.getElementById("menuCheckbox");
      elt.checked = false;
    }
    if((event.target.id !== 'menuCheckboxHome') && (/home/g.test(this.router.url))){
      let elt : any = document.getElementById("menuCheckboxHome");
      elt.checked = false;
    }
  }
}
