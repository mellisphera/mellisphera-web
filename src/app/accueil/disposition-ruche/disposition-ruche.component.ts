import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DragAndCheckModule, Offsets } from 'ng2-drag-and-check';
import { UserloggedService } from '../../userlogged.service';
import { RucherService } from '../ruche-rucher/rucher.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ruche } from './ruche';
import { reject } from 'q';
import { parse } from 'querystring';

@Component({
  selector: 'app-disposition-ruche',
  templateUrl: './disposition-ruche.component.html',
  styleUrls: ['./disposition-ruche.component.scss']
})
export class DispositionRucheComponent implements OnInit {
  
  defautBackground = "../../../assets/img/rucher-loin.jpg";
  private top: any = Offsets.HANDLE_HEIGHT;
  private right: any= Offsets.HALF_WIDTH;
  private bottom: any= Offsets.HANDLE_HEIGHT;
  private left: any= Offsets.HALF_WIDTH;
  infoRuche : any = null;
  offset : Offsets;
  constructor( private draggable: DragAndCheckModule, private login: UserloggedService, private rucher: RucherService) { 
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
  username: string;
  rucherByUser: any[] = null;
  nbRucheByRucher: any[];
  rucherSelect: string;
  tabRuche: any[];
  tabInstanceRuche: Ruche[] = [];
  ngOnInit() {
    this.username = this.login.currentUser().username;
    this.getRucherByUser();
    setTimeout(() => {
      console.log(this.rucherByUser);
      this.rucherSelect = this.rucherByUser[0].id;
      this.setBackgroundById(this.rucherSelect);
      this.getRuche();
      setTimeout(() => {
        this.tabRuche.forEach((element, index) => {
          this.tabInstanceRuche.push(new Ruche(element.id ,element.name, element.description, element.username, element.idApiary, element.hivePosX, element.hivePosY));
        });
        //console.log(this.tabInstanceRuche);
      }, 1000)
      
    },500);
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


  /* Obtient les ruches d'un rucher pour un utilisateurs*/
  getRuche() {
    this.rucher.getUserRuches(this.username, this.rucherSelect).subscribe(
      (data) => {
        this.tabRuche = data;
      },
      (err) => { console.log(err); }
    );
  }

// [ngStyle]="{'left' : ruche.hivePosX+'%', 'top':ruche.hivePosY+'%' }"

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
  onChange($event) {
    this.tabInstanceRuche = [];
    this.rucherSelect = $event.target.value
    this.setBackgroundById(this.rucherSelect);
    this.getRuche();
    setTimeout(() => {
      this.tabRuche.forEach((element, index) => {
        this.tabInstanceRuche.push(new Ruche(element.id ,element.name, element.description, element.username, element.idApiary, element.hivePosX, element.hivePosY));
      });
      //console.log(this.tabInstanceRuche);
    }, 1000)
  }

  onMouseover($event){
    //console.log($event.target.id);
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
}