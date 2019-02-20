"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngfFormData = (function () {
    function ngfFormData(IterableDiffers) {
        this.postName = "file";
        this.FormData = new FormData();
        this.FormDataChange = new core_1.EventEmitter();
        this.differ = IterableDiffers.find([]).create();
    }
    ngfFormData.prototype.ngDoCheck = function () {
        var _this = this;
        var changes = this.differ.diff(this.files);
        if (changes) {
            setTimeout(function () { return _this.buildFormData(); }, 0);
        }
    };
    ngfFormData.prototype.buildFormData = function () {
        var _this = this;
        var isArray = typeof (this.files) === 'object' && this.files.constructor === Array;
        if (isArray) {
            this.FormData = new FormData();
            var files = this.files || [];
            files.forEach(function (file) {
                return _this.FormData.append(_this.postName, file, _this.fileName || file.name);
            });
            this.FormDataChange.emit(this.FormData);
        }
        else {
            delete this.FormData;
        }
    };
    ngfFormData.decorators = [
        { type: core_1.Directive, args: [{ selector: 'ngfFormData' },] },
    ];
    /** @nocollapse */
    ngfFormData.ctorParameters = function () { return [
        { type: core_1.IterableDiffers, },
    ]; };
    ngfFormData.propDecorators = {
        "files": [{ type: core_1.Input },],
        "postName": [{ type: core_1.Input },],
        "fileName": [{ type: core_1.Input },],
        "FormData": [{ type: core_1.Input },],
        "FormDataChange": [{ type: core_1.Output },],
    };
    return ngfFormData;
}());
exports.ngfFormData = ngfFormData;
