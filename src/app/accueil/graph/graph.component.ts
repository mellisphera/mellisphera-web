import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { GraphService } from './graph.service'
import * as echarts from '../../../assets/echarts';
// import { AnonymousSubscription } from "rxjs";
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html'
})
export class GraphComponent implements OnInit {

  showLogin : boolean;
  dataCity: any[] = [];
  minTemps=[];
  maxTemps= [];
  private timerSubscription: Subscription;

  options ;
     constructor(public location: Location,
                 public router: Router,
                 public _testService : GraphService) {
       
       
     }


     
      

    ngOnInit(){
     
      this.getData();
      console.log("meteo : "+this.dataCity);
      this.subscribeToFillY();
      console.log("min temps: "+this.minTemps);
      this.subscribeToTest();
    }

    

    getData(){
     // console.log("this username :"+  this.username);
      this._testService.getWeather().subscribe(
        data => { this.dataCity = data;
        
        },
        err => console.error(err),
        () => console.log()
      );
    }


    fillY(){
        this._testService.getMinTems().subscribe(
            data => { this.minTemps = data;
                    },
            err => console.error(err),
            () => console.log()
          );
    }
    private subscribeToFillY(): void {
        this.timerSubscription = Observable.timer(500).first().subscribe(() => this.fillY());
    }
    private subscribeToTest(): void {
        this.timerSubscription = Observable.timer(800).first().subscribe(() => this.test());
    }
      

    test(){
       
   }
      
    
    goToDashboard(){
        
      this.router.navigate(['dashboard']);
    }

    logIn(){
      this.showLogin=false;
    }
    message="";
    receiveMessage($event){
        this.message=$event;
    }
}
