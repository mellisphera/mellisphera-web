import { Component, OnInit, Renderer2, AfterViewChecked } from '@angular/core';
import { MelliChartsDateService } from '../service/melli-charts-date.service';
import { MelliChartsHiveService } from '../service/melli-charts-hive.service';

@Component({
  selector: 'app-hive',
  templateUrl: './hive.component.html',
  styleUrls: ['./hive.component.css']
})
export class HiveComponent implements OnInit,AfterViewChecked {

  public typeData: Array<Object>;
  private currentEltType: HTMLElement;
  private currentType: string;
  constructor(private melliDate: MelliChartsDateService, 
    private melliHive: MelliChartsHiveService,
    private renderer: Renderer2) {
      this.currentType = 'WEIGHT';
      this.typeData = [
        { name: 'WEIGHT', class: 'item-type active'},
        { name: 'TEMPERATURE', class: 'item-type'},
        { name: 'COUVAIN', class: 'item-type'}
      ];
    }

  ngOnInit() {
  }


  ngAfterViewChecked(): void {
    this.currentEltType = document.getElementById(this.currentType);
  }
  newHive(){
    console.log(this.melliHive.getHiveSelect());
  }
  setType(type: string) {
    if ((type === this.currentType) !== true) {
      this.currentType = type;
      this.renderer.removeClass(this.currentEltType, 'active');
      this.currentEltType = document.getElementById(this.currentType);
      this.renderer.addClass(this.currentEltType, 'active');
    } else {

    }
  }

}
