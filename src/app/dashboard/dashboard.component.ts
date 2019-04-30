import { Component, OnInit } from '@angular/core';
import { UserloggedService } from '../userlogged.service';
import { LoadingService } from './service/loading.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { RucherService } from './apiary/ruche-rucher/rucher.service';

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

  constructor(public login: UserloggedService,
    public loadingService: LoadingService,
    public rucherService: RucherService) {
    this.message = '';
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
