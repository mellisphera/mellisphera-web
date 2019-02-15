var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavRucheRoutingModule } from './nav-ruche-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendrierPoidsService } from '../ruche-detail/stock/service/calendrier-poids.service';
import { DailyRecordsWService } from '../ruche-detail/service/daily-records-w.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { DailyStockHoneyService } from '../ruche-detail/service/daily-stock-honey.service';
import { GrapheReserveMielService } from '../ruche-detail/stock/service/graphe-reserve-miel.service';
import { GraphRecordService } from '../ruche-detail/hourly/service/graph-record.service';
import { RecordService } from '../ruche-detail/service/Record/record.service';
import { CalendrierHealthService } from '../ruche-detail/health/service/calendrier-health.service';
var NavRucheModule = /** @class */ (function () {
    function NavRucheModule() {
    }
    NavRucheModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                NavRucheRoutingModule,
                SharedModule,
                ReactiveFormsModule,
                NgxEchartsModule
            ],
            declarations: [],
            providers: [
                CalendrierPoidsService,
                DailyRecordsWService,
                DailyStockHoneyService,
                GrapheReserveMielService,
                GraphRecordService,
                RecordService,
                CalendrierHealthService,
            ]
        })
    ], NavRucheModule);
    return NavRucheModule;
}());
export { NavRucheModule };
//# sourceMappingURL=nav-ruche.module.js.map