import { OnInit } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { Http, Response } from "@angular/http";
import * as echarts from '../../../assets/echarts.js';
import { Rucher } from '../ruche-rucher/rucher';
import { RucherService } from '../ruche-rucher/rucher.service';

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent implements OnInit {

  username: string;
  
  private apiCityUrl;
  ruchers : any [] = [];
  selectedRucher = new Rucher();
  dataCity: any = {};
  rucherName: any ={};
  cityName='Pau';
  rucher = new Rucher();
  currentRucherID: string;
  x;
  constructor(private data : UserloggedService,
              private http: Http,
              private location: Location,
              private route: ActivatedRoute,     
              public rucherService : RucherService ) { 
  
        this.route.params.subscribe( params =>  this.getCityForecast(params['name']));
        
        this.username= data.currentUser().username;
     
        
  }
  ngOnInit() {
  
  
    this.currentRucherID= localStorage.getItem("currentRucher");
    this.x=String(this.selectedRucher);
    this.x=this.currentRucherID;
    this.selectedRucher=this.x;
    this.getUserRuchers();
    this.getRucherName();
    this.getCityTest();
    this.getCityData();



    //console.log("wtf");
   //console.log("rucher[0].codePostal : "+ this.ruchers[0].codePostal);
  }

  getUserRuchers(){
    this.rucherService.getUserRuchers(this.username).subscribe(
      data => { this.ruchers = data;},
      err => console.error(err),
      () => console.log()
    );
  }
  getRucherName(){
    console.log("this.selected "+ this.selectedRucher)
    this.rucherService.getRucherName(this.selectedRucher).subscribe(
      data => { 
                console.log("data : " + data.toString());
                this.rucher = data;
                //this.cityName=data;
               /* 
              */console.log("this.ruchername : "+ this.rucher.name)
              this.cityName=this.rucher.name;

                this.getCityForecast(this.cityName);
                this.getCityData();
                this.getCityTest();
              },
      err => console.error(err),
      () => console.log()
    );
  }



  onSelectRucher(event : any) : void{
  this.currentRucherID=String(this.selectedRucher);
  localStorage.setItem("currentRucher",String(this.selectedRucher));
  
    this.getRucherName();

  }

  getCityForecast(cityName) {
    console.log(cityName);
   
    this.apiCityUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + this.cityName + '&units=metric&appid=110ff02ed24ccd819801248373c3b208';
  }

  getCityData() {
      return this.http.get(this.apiCityUrl)
          .map((res: Response) => res.json())
  }

  getCityTest() {
      this.getCityData().subscribe(dataCity => {
          console.log(dataCity);
          this.dataCity = dataCity;
      })
  }

    // Goind back to the previous page, goBack() called on click in the city component template
  goBack(): void {
        this.location.back();
  }
    
    
  isMap(){
        
  }
}
