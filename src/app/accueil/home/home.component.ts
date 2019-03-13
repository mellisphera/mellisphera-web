import { User } from './../../_model/user';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../../apiary/ruche-rucher/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from '../Service/dailyRecordService';
import { DailyRecordsTH } from './DailyRecordTH';
import { RucheService } from '../Service/ruche.service';
import { RucheInterface } from '../../_model/ruche';
import { Route, Router } from '@angular/router';
import { CONFIG } from '../../../config';
import { AuthService } from '../../auth/Service/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class HomeComponent implements OnInit {
  public top: any = Offsets.HANDLE_HEIGHT;
  public right: any = Offsets.HALF_WIDTH;
  public bottom: any = Offsets.HANDLE_HEIGHT;
  public left: any = Offsets.HALF_WIDTH;
  infoRuche: any = null;
  offset: Offsets;
  photoApiary: File;
  username: string;
  rucheSelect: RucheInterface;
  baseDropValid: string;
  rucherSelectId: string;
  message: string;
  style: {
    'background-image': string,
    'background-position': string,
    'background-repeat': string
  };
  position: {
    'x': string,
    'y': string
  };

  rucheOnClick : Ruche;

  constructor( public dailyRecTh:  DailyRecordService, private draggable: DragAndCheckModule, 
    public login: UserloggedService,
    public rucheService: RucheService,
    public rucherService: RucherService,
    private route: Router,
    public authService: AuthService) {
      this.username = this.login.getUser();
      this.photoApiary = null;
      this.message = '';
      this.style = {
        'background-image': 'url(' + CONFIG.URL_FRONT + 'assets/imageClient/testAccount.png)',
        'background-position': 'center',
        'background-repeat': 'no-repeat'
      };
      this.position = {
        x : '0',
        y : '0'
      };
    this.offset = new Offsets(this.top, this.right, this.bottom, this.left);
  }

  receiveMessage($event) {
    this.message = $event;

  }


  ngOnInit() {
    if (!this.rucherService.rucherSubject.closed) {
      this.rucherService.rucherSubject.subscribe( () => {}, () => {}, () => {
        this.dailyRecTh.getDailyRecThByApiary(this.rucherService.getCurrentApiary());
      });
    }
  }

  onClick(ruche: RucheInterface)  {
    this.rucheService.saveCurrentHive(ruche.id);
    this.route.navigate(['/ruche-detail']);

  }

  onDragEnd($event) {
    let id = $event.id;

    this.getPosition($event.style);
    try{
          this.rucheSelect = this.rucheService.ruches[id];
          let rucheUpdate = new Ruche(this.rucheSelect.id,this.rucheSelect.name,this.rucheSelect.description,this.rucheSelect.username,this.rucheSelect.idApiary,this.rucheSelect.hivePosX,this.rucheSelect.hivePosY);
          rucheUpdate.setX(this.position.x);
          rucheUpdate.setY(this.position.y);
          this.rucheService.updateCoordonneesRuche(rucheUpdate);
          this.position.x = ''+0;
          this.position.y = ''+0;

    }
    catch(e){

    }

    //this.rucheService.getRucheByApiary(this.username,rucheUpdate.idApiary);

  }
  
  /* Calcule les positions */
  getPosition(position) {
    const container = document.getElementById("cadre");

    /* Dimensions block parent */
    const widthcontainer = container.offsetWidth;
    const heightcontainer = container.offsetHeight; 

    const coordonnes = position.transform.slice(10, position.transform.length - 1);
    /* Position en pourcentage */
    let left = parseInt(position.left);
    let top = parseInt(position.top);
    /* Convertir en px */
    left = this.getPourccentToPx(left,widthcontainer);
    top = this.getPourccentToPx(top,heightcontainer);

    const deplacement = coordonnes.split(',');

    deplacement[0] = parseInt(deplacement[0].slice(0,deplacement[0].length-2));
    deplacement[1] = parseInt(deplacement[1].slice(0,deplacement[1].length-2));

    this.position.x = ''+(parseInt(left+deplacement[0]) *100) / widthcontainer;
    this.position.y  =''+(parseInt(top+deplacement[1]) *100) / heightcontainer;
    if(parseInt(this.position.x) > 99 || parseInt(this.position.x) < 0){ this.position.x = ''+50;
      this.position.x = ""+50;
      this.position.y = ""+50;
      //this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
    }
    if(parseInt(this.position.y) > 99 || parseInt(this.position.y) < 0){ this.position.y = ''+50;
      this.position.x = ""+50;
      this.position.y = ""+50;
      //this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
    }
  }

  getPourccentToPx(valeur, valeurTotal){
    return ((valeur/100) * valeurTotal);
  }
  /* Pour chaque rucher selectionner */

  saveBackground(){
    this.rucherService.updateBackgroundApiary(this.rucherService.rucher.id);
    this.photoApiary = null;
  }

  cancelBackground() {
    this.rucherService.rucher.photo = this.rucherService.currentBackground;
    this.photoApiary = null;
  }
  onMouseover($ruche){
    const ruche = JSON.parse(JSON.stringify($ruche))
    this.infoRuche = ruche.name + ' : '+ruche.description;
  }
}
