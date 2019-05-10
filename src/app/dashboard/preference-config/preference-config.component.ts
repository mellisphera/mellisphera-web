import { Component, OnInit } from '@angular/core';
import { UserParamsService } from './service/user-params.service';

@Component({
  selector: 'app-preference-config',
  templateUrl: './preference-config.component.html',
  styleUrls: ['./preference-config.component.css']
})
export class PreferenceConfigComponent implements OnInit {

  constructor(public userConfig: UserParamsService) { }

  ngOnInit() {
  }

}
