import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { InspectHistoryComponent } from './inspect-history/inspect-history.component';
import { InspectNewComponent } from './inspect-new/inspect-new.component';
import { InspectParamsComponent } from './inspect-params/inspect-params.component';

const PREFIX_PATH = '/dashboard/inspect/';

@Component({
  selector: 'app-inspect',
  templateUrl: './inspect.component.html',
  styleUrls: ['./inspect.component.css']
})
export class InspectComponent implements OnInit {

  private eltOnClick: EventTarget;
  private inspNewComponent: InspectNewComponent;
  private inspHistoryComponent: InspectHistoryComponent;
  private inspParamsComponent: InspectParamsComponent;

  constructor(
    private renderer: Renderer2,
    private router: Router
  ){
  }

  ngOnInit(): void{

  }

  ngAfterViewInit(): void{
    if(this.router.url === PREFIX_PATH + 'new'){
      this.eltOnClick = document.getElementById('inspect-new-btn');
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    if(this.router.url === PREFIX_PATH + 'history'){
      this.eltOnClick = document.getElementById('inspect-history-btn');
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    if(this.router.url === PREFIX_PATH + 'params'){
      this.eltOnClick = document.getElementById('inspect-params-btn');
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
    
  }

  setButtonActive(_id: string): void{
    if (this.eltOnClick === null) {
      this.eltOnClick = document.getElementById(_id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    } else {
      this.renderer.removeClass(this.eltOnClick, 'nav-active');
      this.eltOnClick = document.getElementById(_id);
      this.renderer.addClass(this.eltOnClick, 'nav-active');
    }
  }

}
