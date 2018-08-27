import { Component, OnInit } from '@angular/core';
import { UserloggedService } from '../userlogged.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  username: string;

  userBLG: boolean;
  userCLO: boolean;
  userJCP: boolean;
  userJHE: boolean;
  
  message="";
  
      receiveMessage($event){
          this.message=$event;
   }
  
  
  constructor( private data : UserloggedService ) { 
    this.username= data.currentUser().username;
    console.log("logged user accueil : "+ this.username);
    if(this.username=='***REMOVED***'){
      this.userBLG=true;
      console.log("userBLG : "+ this.userBLG);
    }
    if(this.username=='clo'){
      this.userCLO=true;
      console.log("userCLO : "+ this.userCLO);
    }
    if(this.username=='***REMOVED***'){
      this.userJCP=true;
      console.log("userCLO : "+ this.userJCP);
    }
    if(this.username=='***REMOVED***'){
      this.userJHE=true;
      console.log("userCLO : "+ this.userJHE);
    }
  }

  ngOnInit() {
  }
  isMap(){
    
  }
}
