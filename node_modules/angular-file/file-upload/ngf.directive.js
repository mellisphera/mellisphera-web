"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var doc_event_help_functions_1 = require("./doc-event-help.functions");
var fileTools_1 = require("./fileTools");
var ngf = (function () {
    function ngf(element) {
        this.element = element;
        this.filters = [];
        this.lastFileCount = 0;
        //@Input() forceFilename:string
        //@Input() forcePostname:string
        this.ngfFixOrientation = true;
        this.fileDropDisabled = false;
        this.selectable = false;
        this.directiveInit = new core_1.EventEmitter();
        this.lastInvalids = [];
        this.lastInvalidsChange = new core_1.EventEmitter();
        this.lastBaseUrlChange = new core_1.EventEmitter();
        this.fileChange = new core_1.EventEmitter();
        this.files = [];
        this.filesChange = new core_1.EventEmitter();
        this.initFilters();
    }
    ngf.prototype.initFilters = function () {
        // the order is important
        this.filters.push({ name: 'accept', fn: this._acceptFilter });
        this.filters.push({ name: 'fileSize', fn: this._fileSizeFilter });
        //this.filters.push({name: 'fileType', fn: this._fileTypeFilter})
        //this.filters.push({name: 'queueLimit', fn: this._queueLimitFilter})
        //this.filters.push({name: 'mimeType', fn: this._mimeTypeFilter})
    };
    ngf.prototype.ngOnDestroy = function () {
        delete this.fileElm; //faster memory release of dom element
    };
    ngf.prototype.ngOnInit = function () {
        var _this = this;
        if (this.selectable) {
            this.enableSelecting();
        }
        if (this.multiple) {
            this.paramFileElm().setAttribute('multiple', this.multiple);
        }
        //create reference to this class with one cycle delay to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(function () {
            _this.directiveInit.emit(_this);
        }, 0);
    };
    ngf.prototype.ngOnChanges = function (changes) {
        if (changes.accept) {
            this.paramFileElm().setAttribute('accept', changes.accept.currentValue || '*');
        }
    };
    ngf.prototype.paramFileElm = function () {
        if (this.fileElm)
            return this.fileElm; //already defined
        //elm is a file input
        var isFile = doc_event_help_functions_1.isFileInput(this.element.nativeElement);
        if (isFile)
            return this.fileElm = this.element.nativeElement;
        //create foo file input
        var label = doc_event_help_functions_1.createInvisibleFileInputWrap();
        this.fileElm = label.getElementsByTagName('input')[0];
        this.fileElm.addEventListener('change', this.changeFn.bind(this));
        this.element.nativeElement.appendChild(label);
        return this.fileElm;
    };
    ngf.prototype.enableSelecting = function () {
        var _this = this;
        var elm = this.element.nativeElement;
        if (doc_event_help_functions_1.isFileInput(elm)) {
            var bindedHandler_1 = function (ev) { return _this.beforeSelect(); };
            elm.addEventListener('click', bindedHandler_1);
            elm.addEventListener('touchstart', bindedHandler_1);
            return;
        }
        var bindedHandler = function (ev) { return _this.clickHandler(ev); };
        elm.addEventListener('click', bindedHandler);
        elm.addEventListener('touchstart', bindedHandler);
        elm.addEventListener('touchend', bindedHandler);
    };
    ngf.prototype.getValidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            if (this.isFileValid(files[x])) {
                rtn.push(files[x]);
            }
        }
        return rtn;
    };
    ngf.prototype.getInvalidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            var failReason = this.getFileFilterFailName(files[x]);
            if (failReason) {
                rtn.push({
                    file: files[x],
                    type: failReason
                });
            }
        }
        return rtn;
    };
    ngf.prototype.handleFiles = function (files) {
        var _this = this;
        var valids = this.getValidFiles(files);
        if (files.length != valids.length) {
            this.lastInvalids = this.getInvalidFiles(files);
        }
        else {
            delete this.lastInvalids;
        }
        this.lastInvalidsChange.emit(this.lastInvalids);
        if (valids.length) {
            if (this.ngfFixOrientation) {
                this.applyExifRotations(valids)
                    .then(function (fixedFiles) { return _this.que(fixedFiles); });
            }
            else {
                this.que(valids);
            }
        }
        if (this.isEmptyAfterSelection()) {
            this.element.nativeElement.value = '';
        }
    };
    ngf.prototype.que = function (files) {
        var _this = this;
        this.files = this.files || [];
        Array.prototype.push.apply(this.files, files);
        //below break memory ref and doesnt act like a que
        //this.files = files//causes memory change which triggers bindings like <ngfFormData [files]="files"></ngfFormData>
        this.filesChange.emit(this.files);
        if (files.length) {
            this.fileChange.emit(this.file = files[0]);
            if (this.lastBaseUrlChange.observers.length) {
                fileTools_1.dataUrl(files[0])
                    .then(function (url) { return _this.lastBaseUrlChange.emit(url); });
            }
        }
        //will be checked for input value clearing
        this.lastFileCount = this.files.length;
    };
    /** called when input has files */
    /** called when input has files */
    ngf.prototype.changeFn = /** called when input has files */
    function (event) {
        var fileList = event.__files_ || (event.target && event.target.files);
        if (!fileList)
            return;
        this.stopEvent(event);
        this.handleFiles(fileList);
    };
    ngf.prototype.clickHandler = function (evt) {
        var elm = this.element.nativeElement;
        if (elm.getAttribute('disabled') || this.fileDropDisabled) {
            return false;
        }
        var r = doc_event_help_functions_1.detectSwipe(evt);
        // prevent the click if it is a swipe
        if (r != null)
            return r;
        var fileElm = this.paramFileElm();
        fileElm.click();
        //fileElm.dispatchEvent( new Event('click') );
        this.beforeSelect();
        return false;
    };
    ngf.prototype.beforeSelect = function () {
        if (this.files && this.lastFileCount === this.files.length)
            return;
        //if no files in array, be sure browser doesnt prevent reselect of same file (see github issue 27)
        this.fileElm.value = null;
    };
    ngf.prototype.isEmptyAfterSelection = function () {
        return !!this.element.nativeElement.attributes.multiple;
    };
    ngf.prototype.eventToTransfer = function (event) {
        if (event.dataTransfer)
            return event.dataTransfer;
        return event.originalEvent ? event.originalEvent.dataTransfer : null;
    };
    ngf.prototype.stopEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    ngf.prototype.transferHasFiles = function (transfer) {
        if (!transfer.types) {
            return false;
        }
        if (transfer.types.indexOf) {
            return transfer.types.indexOf('Files') !== -1;
        }
        else if (transfer.types.contains) {
            return transfer.types.contains('Files');
        }
        else {
            return false;
        }
    };
    ngf.prototype.eventToFiles = function (event) {
        var transfer = this.eventToTransfer(event);
        if (transfer.files && transfer.files.length)
            return transfer.files;
        if (transfer.items && transfer.items.length)
            return transfer.items;
        return [];
    };
    ngf.prototype.applyExifRotations = function (files) {
        var mapper = function (file, index) {
            return fileTools_1.applyExifRotation(file)
                .then(function (fixedFile) { return files.splice(index, 1, fixedFile); });
        };
        var proms = [];
        for (var x = files.length - 1; x >= 0; --x) {
            proms[x] = mapper(files[x], x);
        }
        return Promise.all(proms).then(function () { return files; });
    };
    ngf.prototype.onChange = function (event) {
        var files = this.element.nativeElement.files || this.eventToFiles(event);
        if (!files.length)
            return;
        this.stopEvent(event);
        this.handleFiles(files);
    };
    ngf.prototype.getFileFilterFailName = function (file) {
        for (var i = 0; i < this.filters.length; i++) {
            if (!this.filters[i].fn.call(this, file)) {
                return this.filters[i].name;
            }
        }
        return;
    };
    ngf.prototype.isFileValid = function (file) {
        var noFilters = !this.accept && (!this.filters || !this.filters.length);
        if (noFilters) {
            return true; //we have no filters so all files are valid
        }
        return this.getFileFilterFailName(file) ? false : true;
    };
    ngf.prototype.isFilesValid = function (files) {
        for (var x = files.length - 1; x >= 0; --x) {
            if (!this.isFileValid(files[x])) {
                return false;
            }
        }
        return true;
    };
    ngf.prototype._acceptFilter = function (item) {
        return fileTools_1.acceptType(this.accept, item.type, item.name);
    };
    /*protected _queueLimitFilter():boolean {
      return this.queueLimit === undefined || this.files.length < this.queueLimit
    }*/
    /*protected _queueLimitFilter():boolean {
        return this.queueLimit === undefined || this.files.length < this.queueLimit
      }*/
    ngf.prototype._fileSizeFilter = /*protected _queueLimitFilter():boolean {
        return this.queueLimit === undefined || this.files.length < this.queueLimit
      }*/
    function (item) {
        return !(this.maxSize && item.size > this.maxSize);
    };
    /*protected _fileTypeFilter(item:File):boolean {
        return !(this.allowedFileType &&
        this.allowedFileType.indexOf(FileType.getMimeClass(item)) === -1)
      }*/
    /*protected _mimeTypeFilter(item:File):boolean {
        return !(this.allowedMimeType && this.allowedMimeType.indexOf(item.type) === -1);
      }*/
    ngf.decorators = [
        { type: core_1.Directive, args: [{
                    selector: "[ngf]",
                    exportAs: "ngf"
                },] },
    ];
    /** @nocollapse */
    ngf.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
    ]; };
    ngf.propDecorators = {
        "multiple": [{ type: core_1.Input },],
        "accept": [{ type: core_1.Input },],
        "maxSize": [{ type: core_1.Input },],
        "ngfFixOrientation": [{ type: core_1.Input },],
        "fileDropDisabled": [{ type: core_1.Input },],
        "selectable": [{ type: core_1.Input },],
        "directiveInit": [{ type: core_1.Output, args: ['init',] },],
        "lastInvalids": [{ type: core_1.Input },],
        "lastInvalidsChange": [{ type: core_1.Output },],
        "lastBaseUrl": [{ type: core_1.Input },],
        "lastBaseUrlChange": [{ type: core_1.Output },],
        "file": [{ type: core_1.Input },],
        "fileChange": [{ type: core_1.Output },],
        "files": [{ type: core_1.Input },],
        "filesChange": [{ type: core_1.Output },],
        "onChange": [{ type: core_1.HostListener, args: ['change', ['$event'],] },],
    };
    return ngf;
}());
exports.ngf = ngf;
