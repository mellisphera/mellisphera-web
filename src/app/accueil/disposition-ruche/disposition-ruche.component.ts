import { Component, OnInit, Input } from '@angular/core';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { Ruche } from './ruche';
import { DailyRecordService } from './Service/dailyRecordService';
import { DailyRecordsTH } from './DailyRecordTH';

@Component({
  selector: 'app-disposition-ruche',
  templateUrl: './disposition-ruche.component.html',
  styleUrls: ['./disposition-ruche.component.scss']
})
export class DispositionRucheComponent implements OnInit {
  
  defautBackground = "./assets/img/rucher-loin.jpg";
  private top: any = Offsets.HANDLE_HEIGHT;
  private right: any= Offsets.HALF_WIDTH;
  private bottom: any= Offsets.HANDLE_HEIGHT;
  private left: any= Offsets.HALF_WIDTH;
  infoRuche : any = null;
  offset : Offsets;
  username: string;
  rucherByUser: any[] = null;
  nbRucheByRucher: any[];
  rucherSelect: string;
  dailyRecHive : any;
  tabRuche: any[];
  tabInstanceRuche: Ruche[] = [];
  tabInstanceDailyRechTh : DailyRecordsTH[];

  constructor( private dailyRecTh :  DailyRecordService, private draggable: DragAndCheckModule, private login: UserloggedService, private rucher: RucherService) { 
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
    this.username = this.login.currentUser().username;
    this.getRucherByUser();
    setTimeout(() => {
      this.rucherSelect = this.rucherByUser[0].id;
      this.setBackgroundById(this.rucherSelect);
      this.getRuche();
      this.getDailyRecThByHive(this.rucherSelect);
      setTimeout(() => {
        this.createInstanceRuche();
        this.createInstanceDailyRecTh();
      }, 400);
      
    },600);
  }

  getColorStatus($index){
    try{
      return this.tabInstanceDailyRechTh[$index].getColorStatus();
    }
    catch(e){
      return "statusInconnu";
    }
  }

  getRucherByUser() {
    this.rucher.getUserRuchers(this.username).subscribe(
      (data) => {
        this.rucherByUser = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }


  getDailyRecThByHive(idApiary){
    this.dailyRecTh.getDailyRecThByIdHive(this.username,idApiary).subscribe(
      (data)=>{
        this.dailyRecHive = data;
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  /* Obtient les ruches d'un rucher pour un utilisateurs*/
  getRuche() {
    this.rucher.getUserRuches(this.username, this.rucherSelect).subscribe(
      (data) => {
        this.tabRuche = data;
      },
      (err) => { console.log(err); }
    );
  }

  /* Fonctions qui est appeler à chaquue deplacement d'une ruche */
  onDragEnd($event) {
    this.getPosition($event.style);
    let ruche = this.tabInstanceRuche[$event.id];
    ruche.setX(this.position.x);
    ruche.setY(this.position.y);
    //console.log(ruche.toString());
    this.saveCoordonnees(ruche);

  }
  /* Enregistre de la les coordonnees dans la db */
  saveCoordonnees(ruche : Ruche){
    this.rucher.updateCoordonneesRuche(ruche).subscribe(
      (err)=>{
        console.log(err);
      }
    );
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
  }

  getPourccentToPx(valeur, valeurTotal){
    return ((valeur/100) * valeurTotal);
  }
  /* Pour chaque rucher selectionner */
  onChange($event) {
    this.rucherSelect = $event.target.value
    this.getDailyRecThByHive(this.rucherSelect);
    this.setBackgroundById(this.rucherSelect);
    this.getRuche();
    setTimeout(() => {
      this.createInstanceRuche();
      this.createInstanceDailyRecTh();
    }, 300)
  }

  onMouseover($event){
    this.infoRuche = this.tabInstanceRuche[$event.target.id].toString();
  }

  setBackgroundById(id){
    this.rucherByUser.forEach((element) => {
        if(element.id==id){
          if(element.urlPhoto!=="void"){
            this.style["background-image"] = "url("+element.urlPhoto+")";
          }
          else{
            this.style['background-image']= "url("+this.defautBackground+")";
            console.log(this.style["background-image"]);
          }
          
        }
    });
  }

  createInstanceRuche(){
    this.tabRuche.forEach((element, index) => {
      this.tabInstanceRuche.push(new Ruche(element.id ,element.name, element.description, element.username, element.idApiary, element.hivePosX, element.hivePosY));
    });
  }

  createInstanceDailyRecTh(){
    this.tabInstanceDailyRechTh = [];
    this.dailyRecHive.forEach((element, index) => {
      this.tabInstanceDailyRechTh.push(new DailyRecordsTH(element.recordDate, element.idHive, 
        element.humidity_int_min, element.humidity_int_max, element.temp_int_min, element.temp_int_max, 
        element.temp_int_moy, element.temp_int_stddev, element.health_status, element.health_trend, element.r_int_text));
        console.log(this.tabInstanceDailyRechTh[index].getHealthStatus());
    });
  }
}