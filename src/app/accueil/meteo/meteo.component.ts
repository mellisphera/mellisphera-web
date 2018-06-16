import { OnInit } from '@angular/core';
import { UserloggedService } from '../../userlogged.service';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { Http, Response } from "@angular/http";

@Component({
  selector: 'app-meteo',
  templateUrl: './meteo.component.html',
  styleUrls: ['./meteo.component.scss']
})
export class MeteoComponent implements OnInit {

  username: string;
  
  private apiCityUrl;
  dataCity: any = {};
  cityName='Pau';
  constructor(private data : UserloggedService,
              private http: Http,
              private location: Location,
              private route: ActivatedRoute ) { 
  
        this.route.params.subscribe( params =>  this.getCityForecast(params['name']));
        this.getCityTest();
        this.getCityData();
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
  
  ngOnInit() {
      }
      isMap(){
        
      }
}
