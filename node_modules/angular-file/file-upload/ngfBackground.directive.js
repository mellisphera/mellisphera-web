"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fileTools_1 = require("./fileTools");
var ngfBackground = (function () {
    function ngfBackground(ElementRef) {
        this.ElementRef = ElementRef;
    }
    ngfBackground.prototype.ngOnChanges = function (changes) {
        var _this = this;
        fileTools_1.dataUrl(this.file)
            .then(function (src) {
            var urlString = 'url(\'' + (src || '') + '\')';
            _this.ElementRef.nativeElement.style.backgroundImage = urlString;
        });
    };
    ngfBackground.decorators = [
        { type: core_1.Directive, args: [{ selector: '[ngfBackground]' },] },
    ];
    /** @nocollapse */
    ngfBackground.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
    ]; };
    ngfBackground.propDecorators = {
        "file": [{ type: core_1.Input, args: ['ngfBackground',] },],
    };
    return ngfBackground;
}());
exports.ngfBackground = ngfBackground;
