import { Injectable } from '@angular/core';
import { RucheInterface } from '../../../_model/ruche';
import { UserloggedService } from '../../../userlogged.service';
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../../../../config';
import { RucherService } from '../../ruche-rucher/rucher.service';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RucheService {

  ruche : RucheInterface;
  ruches : RucheInterface[];

  rucheObs : Observable<RucheInterface>;
  ruchesObs : Observable<RucheInterface[]>;
  constructor(private user : UserloggedService, private http : HttpClient) {
    this.ruches = [];
  /* if(sessionStorage.getItem("idApiaryUpdate")){
      let id = sessionStorage.getItem("idApiaryUpdate");
      console.log(id);
      this.getRucheByApiary(this.user.currentUser().username,id);
    }*/
   }

   getRucheByApiary(username , idApiary){
      this.ruches = [];
      this.ruchesObs = this.http.get<RucheInterface[]>(CONFIG.URL+'hives/'+username+'/'+idApiary)
      this.ruchesObs.subscribe(
        (data)=>{
          data.forEach(element=>{
            this.ruches.push({
              id : element.id, 
              name : element.name, 
              description : element.description,
               username : element.username, 
               idApiary : element.idApiary , 
               hivePosX : element.hivePosX , 
               hivePosY : element.hivePosY});
          });
        },
        (err)=>{
          console.log(err);
        }
        
      )
   }

   updateCoordonneesRuche(ruche){
    this.rucheObs = this.http.put<RucheInterface>(CONFIG.URL+'hives/update/coordonnees/'+ruche.id,ruche,httpOptions)
    this.rucheObs.subscribe(
      ()=>{
        this.getRucheByApiary(this.user.currentUser().username,ruche.idApiary);
      },
      (err)=>{
        console.log(err);
      }
    );
  }

   cleanRuches(){
     this.ruches=[];
   }

   createRuche(){
    this.rucheObs = this.http.post<RucheInterface>(CONFIG.URL+'hives', this.ruche , httpOptions);
    this.rucheObs.subscribe(
      ()=>{},
      (err)=>{
        console.log(err);
      },
      ()=>{
        this.getRucheByApiary(this.user.currentUser().username,this.ruche.idApiary);
      }
    );
   }


}
