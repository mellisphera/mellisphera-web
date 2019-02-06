import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from '../Service/dailyRecordService';
import { DailyRecordsTH } from './DailyRecordTH';
import { RucheService } from '../Service/ruche.service';
//import { RucherInterface } from '../../_model/rucherInterface';
import { RucheInterface } from '../../_model/ruche';
import { Route, Router } from '@angular/router';
import { CONFIG } from '../../../config'
import { AuthService } from '../../auth/Service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  defautBackground = "../../../assets/img/rucher-loin.jpg";
  public top: any = Offsets.HANDLE_HEIGHT;
  public right: any= Offsets.HALF_WIDTH;
  public bottom: any= Offsets.HANDLE_HEIGHT;
  public left: any= Offsets.HALF_WIDTH;
  infoRuche : any = null;
  offset : Offsets;
  username: string;
  rucheSelect : RucheInterface;
  rucherSelectId : string;
  message="";

  rucheOnClick : Ruche;

  constructor( public dailyRecTh :  DailyRecordService, private draggable: DragAndCheckModule, 
    private login: UserloggedService, 
    public rucheService : RucheService, 
    public rucherService: RucherService,
    private route : Router,
    public authService : AuthService) { 
    
    
    this.offset = new Offsets(this.top,this.right,this.bottom, this.left);
    //this.rucheService.getRucheByApiary(this.login.currentUser().username, this.rucherService.rucher.id);
  }

  position = {
    'x': '0',
    'y': '0'
  };

  receiveMessage($event){
    this.message=$event;

  }

  style = {
    'background-image':'url('+CONFIG.URL_FRONT+'assets/imageClient/testAccount.png)',
    'background-position': "center",
    'background-repeat': "no-repeat"
  };

  ngOnInit() {
    this.username = this.login.currentUser().username;

    //this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/"+this.username.toUpperCase()+".png)";

    if(this.username == "***REMOVED***"){
      this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/JHE.png)";
    }
    else if(this.username == "***REMOVED***"){
      this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/JCP.png)";
    }
    else if(this.username == "***REMOVED***"){
      this.style["background-image"] = "url("+CONFIG.URL_FRONT+"assets/imageClient/***REMOVED***.png)";
    }
    else if(this.username == "***REMOVED***"){
      this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/LPO.png)";
    }
    else if(this.username == "aro"){
      this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/aro.png)";
    }
    else if(this.username == "theo"){
      this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/theo.png)";
    }
    else if(this.username == "pma"){
      this.style["background-image"]="url("+CONFIG.URL_FRONT+"assets/imageClient/PMA.png)";
    }
  }

  onClick(ruche){
    this.route.navigate(['/ruche-detail',ruche.id, ruche.name]);

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
    let container = document.getElementById("cadre");

    /* Dimensions block parent */
    let widthcontainer = container.offsetWidth;
    let heightcontainer = container.offsetHeight; 

    let coordonnes = position.transform.slice(10, position.transform.length - 1);
    /* Position en pourcentage */
    let left = parseInt(position.left);
    let top = parseInt(position.top);
    /* Convertir en px */
    
    left = this.getPourccentToPx(left,widthcontainer);
    top = this.getPourccentToPx(top,heightcontainer);

    let deplacement = coordonnes.split(',');

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
  onChange($event) {
    let id = $event.target.selectedIndex;
    this.rucherService.rucher = this.rucherService.ruchers[id];
    this.rucheService.cleanRuches();
    this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
    this.dailyRecTh.getDailyRecThByApiary(this.rucherService.rucher.id);
  }

  onMouseover($ruche){
    let ruche = JSON.parse(JSON.stringify($ruche))
    this.infoRuche = ruche.name + ' : '+ruche.description;
  }

  ngOnDestroy(){
    
  }
}
