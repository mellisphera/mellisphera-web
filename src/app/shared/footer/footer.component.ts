import { Component } from '@angular/core';

declare var $:any;

@Component({
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent{
    test : Date = new Date();

    clientHeight: number;
    constructor() {
        this.clientHeight = window.innerHeight; 
     }

}
