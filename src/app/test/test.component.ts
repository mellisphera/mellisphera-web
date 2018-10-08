import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { TestService } from './test.service'
import * as echarts from '../../assets/echarts.js';
// import { AnonymousSubscription } from "rxjs";
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  showLogin : boolean;
  dataCity: any[] = [];
  minTemps=[];
  maxTemps= [];
  recordDates:any[]= [];
  private timerSubscription: Subscription;
  mergeOption: any = null;  
  options ;
     constructor(public location: Location,
                 public router: Router,
                 public _testService : TestService) {
       this.showLogin=true;
       
    }
   
    ngOnInit(){
        for (var index = 0; index < 10; index++) {
           
            console.log(index);
        }
     
        //this.getData();
        //load dates
        this.subscribeToRecordDates();
        //load weight values
        this.subscribeToFillY();
        //console.log("record dates : " + this.recordDates);
        var T = this.recordDates;
        /*for (var index = 0; index < T.length; index++) {
          var element = this.recordDates[index];
          console.log("tegleb :) ");
          console.log("element : " + element);
          
        }*/
        this.subscribeToTest();
      
    }

    message="";
    receiveMessage($event){
        this.message=$event;
    }
    /*
    getRecordDates(){
        this._testService.getRecordDates().then(data => {
            // I got xAxis data from API, then merge it.
            this.mergeOption = {
              xAxis: {
                data: data
              }
            };
          });
        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(this.mergeOption);
    }

    fillY(){
        this._testService.getWeigthValues().then(data => {
            // I got data from API, then merge it too.
            this.mergeOption = {
              series: [{
                data: data
              }]
            }
          });

        var myChart = echarts.init(document.getElementById('main'));
        myChart.setOption(this.mergeOption);
    }


    createChart(){
        
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            title: {
                text: 'Weight ruche'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: [0, 0, 0, 0, 0, 0, 0],
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            toolbox: {
                left: 'center',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [{
                startValue: '2018-03-08T23:23:14'
            }, {
                type: 'inside'
            }],
            visualMap: {
                top: 10,
                right: 10,
                
            },
            series: {
                name: 'Poids(kg)',
                type: 'line',
                data: [0, 0, 0, 0, 0, 0, 0],
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 0
                    }, {
                        yAxis: 20
                    }, {
                        yAxis: 30
                    }, {
                        yAxis: 40
                    }, {
                        yAxis: 60
                    }]
                }
            }
        }
        myChart.setOption(option);


    }
    */

    updateChart(){
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
           
            xAxis: {
                data: this.recordDates,
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            }
        }
        myChart.mergeOption(option);
    }
    
    testChart() {
        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            title: {
                text: 'Weight ruche'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                data: this.recordDates,
            },
            yAxis: {
                splitLine: {
                    show: false
                }
            },
            toolbox: {
                left: 'center',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [{
                startValue: '2018-03-08T23:23:14'
            }, {
                type: 'inside'
            }],
            visualMap: {
                top: 10,
                right: 10,
                
            },
            series: {
                name: 'Poids(kg)',
                type: 'line',
                data: this.minTemps,
                markLine: {
                    silent: true,
                    data: [{
                        yAxis: 0
                    }, {
                        yAxis: 20
                    }, {
                        yAxis: 30
                    }, {
                        yAxis: 40
                    }, {
                        yAxis: 60
                    }]
                }
            }
        }
        myChart.setOption(option);
    }

    getRecordDates(){
        this._testService.getRecordDates().subscribe(
            data => { this.recordDates = data;
                        console.log(data);
                    },
            err => console.error(err),
            () => console.log()
          );
    }

    fillY(){
        this._testService.getWeigthValues().subscribe(
            data => { this.minTemps = data;
                    console.log("min temps : " + data);
                    },
            err => console.error(err),
            () => console.log()
          );
    }
    private subscribeToFillY(): void {
        this.timerSubscription = Observable.timer(100).first().subscribe(() => this.fillY());
    }
    private subscribeToRecordDates(): void {
        this.timerSubscription = Observable.timer(200).first().subscribe(() => this.getRecordDates());
    }
    private subscribeToTest(): void {
            this.timerSubscription = Observable.timer(4000).first().subscribe(() => this.testChart());
    }
      

    
/*
    getData(){
     // console.log("this username :"+  this.username);
      this._testService.getWeather().subscribe(
        data => { this.dataCity = data;
        
        },
        err => console.error(err),
        () => console.log()
      );
    }
*/

    
    goToDashboard(){
        
      this.router.navigate(['dashboard']);
    }

    logIn(){
      this.showLogin=false;
    }

}
