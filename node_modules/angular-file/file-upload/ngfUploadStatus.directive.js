"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngfUploadStatus = (function () {
    function ngfUploadStatus() {
        this.percentChange = new core_1.EventEmitter();
    }
    ngfUploadStatus.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes.httpEvent && changes.httpEvent.currentValue) {
            var event_1 = changes.httpEvent.currentValue;
            if (event_1.loaded && event_1.total) {
                setTimeout(function () {
                    _this.percent = Math.round(100 * event_1.loaded / event_1.total);
                    _this.percentChange.emit(_this.percent);
                }, 0);
            }
        }
    };
    ngfUploadStatus.decorators = [
        { type: core_1.Directive, args: [{ selector: 'ngfUploadStatus' },] },
    ];
    /** @nocollapse */
    ngfUploadStatus.ctorParameters = function () { return []; };
    ngfUploadStatus.propDecorators = {
        "percent": [{ type: core_1.Input },],
        "percentChange": [{ type: core_1.Output },],
        "httpEvent": [{ type: core_1.Input },],
    };
    return ngfUploadStatus;
}());
exports.ngfUploadStatus = ngfUploadStatus;
