import { Component, OnInit, Input } from '@angular/core';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from './Service/dailyRecordService';
import { DailyRecordsTH } from './DailyRecordTH';
import { RucheService } from './Service/ruche.service';
import { RucherInterface } from '../../_model/rucherInterface';
import { RucheInterface } from '../../_model/ruche';

@Component({
  selector: 'app-disposition-ruche',
  templateUrl: './disposition-ruche.component.html',
  styleUrls: ['./disposition-ruche.component.scss']
})
export class DispositionRucheComponent implements OnInit {
  
  defautBackground = "../../../assets/img/rucher-loin.jpg";
  public top: any = Offsets.HANDLE_HEIGHT;
  public right: any= Offsets.HALF_WIDTH;
  public bottom: any= Offsets.HANDLE_HEIGHT;
  public left: any= Offsets.HALF_WIDTH;
  
  infoRuche : any = null;
  offset : Offsets;
  username: string;
  rucheSelect : RucheInterface;
  
  constructor( public dailyRecTh :  DailyRecordService, private draggable: DragAndCheckModule, private login: UserloggedService, public rucheService : RucheService, public rucherService: RucherService) { 
    this.offset = new Offsets(this.top,this.right,this.bottom, this.left);
  }

  position = {
    'x': '0',
    'y': '0'
  };


  style = {
    'background-image':'',
    'background-position': "center",
    'background-repeat': "no-repeat"
  };

  ngOnInit() {
    console.log(this.rucheService.ruches);
    this.username = this.login.currentUser().username;
  }

  /*getColorStatus($index){
    try{
      return this.tabInstanceDailyRechTh[$index].getColorStatus();
    }
    catch(e){
      return "statusInconnu";
    }
  }
*/
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
}