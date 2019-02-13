"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngf_directive_1 = require("./ngf.directive");
var ngfDrop = (function (_super) {
    __extends(ngfDrop, _super);
    function ngfDrop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fileOver = new core_1.EventEmitter();
        _this.validDrag = false;
        _this.validDragChange = new core_1.EventEmitter();
        _this.invalidDrag = false;
        _this.invalidDragChange = new core_1.EventEmitter();
        _this.dragFilesChange = new core_1.EventEmitter();
        return _this;
    }
    ngfDrop.prototype.onDrop = function (event) {
        this.closeDrags();
        var files = this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    };
    ngfDrop.prototype.handleFiles = function (files) {
        this.fileOver.emit(false); //turn-off dragover
        _super.prototype.handleFiles.call(this, files);
    };
    ngfDrop.prototype.onDragOver = function (event) {
        var transfer = this.eventToTransfer(event);
        var files = this.eventToFiles(event);
        var jsonFiles = this.filesToWriteableObject(files);
        this.dragFilesChange.emit(this.dragFiles = jsonFiles);
        if (files.length) {
            this.validDrag = this.isFilesValid(files);
        }
        else {
            //Safari, IE11 & some browsers do NOT tell you about dragged files until dropped. Always consider a valid drag
            this.validDrag = true;
        }
        this.validDragChange.emit(this.validDrag);
        this.invalidDrag = !this.validDrag;
        this.invalidDragChange.emit(this.invalidDrag);
        transfer.dropEffect = 'copy'; //change cursor and such
        this.stopEvent(event);
        this.fileOver.emit(true);
    };
    /** browsers try hard to conceal data about file drags, this tends to undo that */
    /** browsers try hard to conceal data about file drags, this tends to undo that */
    ngfDrop.prototype.filesToWriteableObject = /** browsers try hard to conceal data about file drags, this tends to undo that */
    function (files) {
        var jsonFiles = [];
        for (var x = 0; x < files.length; ++x) {
            jsonFiles.push({
                type: files[x].type,
                kind: files[x]["kind"]
            });
        }
        return jsonFiles;
    };
    ngfDrop.prototype.closeDrags = function () {
        delete this.validDrag;
        this.validDragChange.emit(this.validDrag);
        this.invalidDrag = false;
        this.invalidDragChange.emit(this.invalidDrag);
        delete this.dragFiles;
        this.dragFilesChange.emit(this.dragFiles);
    };
    ngfDrop.prototype.onDragLeave = function (event) {
        this.closeDrags();
        if (this.element) {
            if (event.currentTarget === this.element[0]) {
                return;
            }
        }
        this.stopEvent(event);
        this.fileOver.emit(false);
    };
    ngfDrop.decorators = [
        { type: core_1.Directive, args: [{
                    selector: "[ngfDrop]",
                    exportAs: "ngfDrop"
                },] },
    ];
    /** @nocollapse */
    ngfDrop.ctorParameters = function () { return []; };
    ngfDrop.propDecorators = {
        "fileOver": [{ type: core_1.Output },],
        "validDrag": [{ type: core_1.Input },],
        "validDragChange": [{ type: core_1.Output },],
        "invalidDrag": [{ type: core_1.Input },],
        "invalidDragChange": [{ type: core_1.Output },],
        "dragFiles": [{ type: core_1.Input },],
        "dragFilesChange": [{ type: core_1.Output },],
        "onDrop": [{ type: core_1.HostListener, args: ['drop', ['$event'],] },],
        "onDragOver": [{ type: core_1.HostListener, args: ['dragover', ['$event'],] },],
        "onDragLeave": [{ type: core_1.HostListener, args: ['dragleave', ['$event'],] },],
    };
    return ngfDrop;
}(ngf_directive_1.ngf));
exports.ngfDrop = ngfDrop;
