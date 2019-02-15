var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { GraphStackService } from './service/graph-stack.service';
import { Component } from '@angular/core';
import { RecordService } from '../service/Record/record.service';
var StackComponent = /** @class */ (function () {
    function StackComponent(graphStack, recordService) {
        this.graphStack = graphStack;
        this.recordService = recordService;
    }
    StackComponent.prototype.ngOnInit = function () {
    };
    StackComponent = __decorate([
        Component({
            selector: 'app-stack',
            templateUrl: './stack.component.html',
            styleUrls: ['./stack.component.css']
        }),
        __metadata("design:paramtypes", [GraphStackService, RecordService])
    ], StackComponent);
    return StackComponent;
}());
export { StackComponent };
//# sourceMappingURL=stack.component.js.map