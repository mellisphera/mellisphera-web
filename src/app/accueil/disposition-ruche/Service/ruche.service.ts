import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { UserloggedService } from '../../../userlogged.service';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../config';
import { RucherService } from '../../ruche-rucher/rucher.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RucheService {

  ruche : RucheInterface;
  ruches : RucheInterface[];

  constructor(private user : UserloggedService, private http : HttpClient) {
    this.ruches = [];
   }

   getRucheByApiary(username , idApiary){
      this.http.get<RucheInterface[]>(CONFIG.URL+'hives/'+username+'/'+idApiary).subscribe(
        (data)=>{
          data.forEach(element=>{
            this.ruches.push({id : element.id, name : element.name, description : element.description, username : element.username, idApiary : element.idApiary , hivePosX : element.hivePosX , hivePosY : element.hivePosY});
          });
        },
        (err)=>{
          console.log(err);
        }
        
      )
   }

   updateCoordonneesRuche(ruche){
    //let body = JSON.stringify(ruche);
    this.http.put(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,ruche,httpOptions).subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      }
    );
  }

   cleanRuches(){
     this.ruches=[];
   }


}
