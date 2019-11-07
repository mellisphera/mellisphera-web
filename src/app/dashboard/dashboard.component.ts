/* Copyright 2018-present Mellisphera
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

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
import { HomeComponent } from './home/home.component';
import { RoutingHistoryService } from './service/routing-history.service';
import { SocketService } from './service/socket.service';
import { AuthService } from '../auth/Service/auth.service';

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
  private homeComponent: any;
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
    private socketService: SocketService,
    private userService: UserloggedService,
    private authService: AuthService,
    private myNotifierService: MyNotifierService,
    private routingHistory: RoutingHistoryService,
    private messagesService : MessagesService,
    public rucherService: RucherService,
    private router: Router) {
    this.message = '';
    this.myNotifierService.setLang(this.login.getCountry() ? this.login.getCountry() : 'EN');
    this.messagesService.setLang(this.login.getCountry() ? this.login.getCountry() : 'EN');
    this.rucherService.rucherSubject.subscribe(() => {}, () => {}, () => {
      console.log(this.login.getWizardActive());
      console.log(this.rucherService.ruchers);
      if (this.rucherService.checkIfApiary()) {
        this.login.setWizardActive(false);
      }
    });
    this.routingHistory.loadRouting();
    this.socketService.loadDataRequest(this.userService.getJwtReponse(  ));
  }

  ngOnInit() {

  }

  apiaryChange(event) {
    this.checkHomeComponent().then(status => {
      <HomeComponent>this.homeComponent.checkIfInfoApiaryComponent().then(
        res => {
          <HomeComponent>this.homeComponent.infoApiaryComponent.alertsComponent.initCalendar(true);
          <HomeComponent>this.homeComponent.changeHandleHive('fixHive');
          <HomeComponent>this.homeComponent.loadAlert();
        }
      )
    }).catch(err => {
      console.log(err);
    });
  }

  setRouterPage(event) {
    if (event instanceof HomeComponent) {
      this.homeComponent = event;
    }
  }

  checkHomeComponent(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      if (this.homeComponent instanceof HomeComponent) {
        resolve(true);
      } else {
        reject(false);
      }
    })
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
      if(elt !== null){
        elt.checked = false;
      }
    }
  }
}
