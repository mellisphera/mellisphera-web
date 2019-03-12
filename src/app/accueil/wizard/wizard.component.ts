import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit, OnDestroy {

  private wrapper: Element;
  constructor() { }

  ngOnInit() {
    this.wrapper = document.getElementsByClassName('wrapper')[0];
    this.wrapper.classList.add('wizard-active');
  }

  ngOnDestroy(): void {
    this.wrapper.classList.remove('wizard-active');
  }

}
