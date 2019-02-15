var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '../../../config';
var ConnectionService = /** @class */ (function () {
    function ConnectionService(httpClient) {
        this.httpClient = httpClient;
        this.getConnection();
        this.connectionsByIp = {};
    }
    ConnectionService.prototype.getConnection = function () {
        var _this = this;
        this.connectionObs = this.httpClient.get(CONFIG.URL + 'logs');
        this.connectionObs.subscribe(function (data) {
            console.log(data);
            _this.connections = data;
        }, function (err) {
            console.log(err);
        }, function () {
            _this.formData();
        });
    };
    ConnectionService.prototype.formData = function () {
        var _this = this;
        this.connections.forEach(function (elt) {
            if (elt.location != null) {
                var ipTmp = elt.location['ip'];
                if (_this.connectionsByIp[ipTmp]) {
                    _this.connectionsByIp[ipTmp].push({ name: elt.username, value: new Array(elt.location['longitude'], elt.location['latitude']) });
                }
                else {
                    _this.connectionsByIp[ipTmp] = [];
                    _this.connectionsByIp[ipTmp].push({ name: elt.username, value: new Array(elt.location['longitude'], elt.location['latitude']) });
                }
            }
        });
        console.log(this.connectionsByIp);
    };
    ConnectionService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ConnectionService);
    return ConnectionService;
}());
export { ConnectionService };
//# sourceMappingURL=connection.service.js.map