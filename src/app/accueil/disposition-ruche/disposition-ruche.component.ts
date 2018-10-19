import { Component, OnInit, OnDestroy } from '@angular/core';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from './Service/dailyRecordService';
import { DailyRecordsTH } from './DailyRecordTH';
import { RucheService } from './Service/ruche.service';
import { RucherInterface } from '../../_model/rucherInterface';
import { RucheInterface } from '../../_model/ruche';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-disposition-ruche',
  templateUrl: './disposition-ruche.component.html',
  styleUrls: ['./disposition-ruche.component.scss']
})
export class DispositionRucheComponent implements OnInit, OnDestroy {
  
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
    private route : Router) { 
    
    
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
    'background-image':'',
    'background-position': "center",
    'background-repeat': "no-repeat",
    'url' : ''
  };
  statusImg = {
    "statusAFluctuation" : "../../../assets/icons/wfbfl.png",
    "statusADecline" : "../../../assets/icons/wfbde.png",
    "statusAImprove" : "../../../assets/icons/wfbim.png",
    "statusBImprove" : "../../../assets/icons/wnbim.png",
    "statusBFluctuation" : "../../../assets/icons/wnbfl.png",
    "statusBDecline" : "../../../assets//icons/wnbde.png",
    "statusBStable" : "../../../assets/icons/wnbst.png",
    "statusCImprove" : "../../../assets/icons/wobim.png",
    "statusCFluctuation" : "../../../assets/icons/wobfl.png",
     "Inconnu" : "../../../assets/icons/wos.png"
  };

  ngOnInit() {
    console.log(this.rucheService.ruches);
    this.username = this.login.currentUser().username;
    if(this.username == "jhe"){
      this.style["background-image"] = "url('../../../assets/imageClient/JHE.jpg')";
      this.style.url = "../../../assets/imageClient/JHE.jpg"
    }
    else if(this.username == "jcp"){
      this.style["background-image"] = "url('../../../assets/imageClient/JCP.png')";
      this.style.url = "../../../assets/imageClient/JHE.jpg"
    }
    else if(this.username == "blg"){
      this.style["background-image"] = "url('../../../assets/imageClient/blg.png')";
      this.style.url = "../../../assets/imageClient/blg.jpg"
    }
    console.log(this.style);
  }

  onClick(ruche){
   // console.log(ruche);
    sessionStorage.setItem("clickedRuche",ruche.id);
    sessionStorage.setItem("selectedRucheName",ruche.name);
    //this.route.navigate(['/ruche-detail']);

  }

  onDragEnd($event) {
    let id = $event.id;

    this.getPosition($event.style);
    console.log(this.rucheService.ruches[id]);
    this.rucheSelect = this.rucheService.ruches[id];
    let rucheUpdate = new Ruche(this.rucheSelect.id,this.rucheSelect.name,this.rucheSelect.description,this.rucheSelect.username,this.rucheSelect.idApiary,this.rucheSelect.hivePosX,this.rucheSelect.hivePosY);
    console.log(rucheUpdate);
    rucheUpdate.setX(this.position.x);
    rucheUpdate.setY(this.position.y);
    this.rucheService.updateCoordonneesRuche(rucheUpdate);
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
    console.log(this.position);
    if(parseInt(this.position.x) > 90 || parseInt(this.position.x) < 5){ this.position.x = ''+50;
    this.rucheService.cleanRuches();
    this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
    }
    if(parseInt(this.position.y) > 90 || parseInt(this.position.y) < 5){ this.position.y = ''+50;
    this.rucheService.cleanRuches();
    this.rucheService.getRucheByApiary(this.username,this.rucherService.rucher.id); 
    }
    console.log(this.position);
  }

  getPourccentToPx(valeur, valeurTotal){
    return ((valeur/100) * valeurTotal);
  }
  /* Pour chaque rucher selectionner */
  onChange($event) {
    let id = $event.target.selectedIndex;
    this.rucherService.rucher = this.rucherService.ruchers[id];
    console.log(this.rucherService.rucher);
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