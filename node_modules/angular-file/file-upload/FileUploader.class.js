"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileLikeObject_class_1 = require("./FileLikeObject.class");
var FileItem_class_1 = require("./FileItem.class");
var FileType_class_1 = require("./FileType.class");
var core_1 = require("@angular/core");
function getWindow() { return window; }
function isFile(value) {
    return (File && value instanceof File);
}
var FileUploader = (function () {
    function FileUploader(options) {
        if (options === void 0) { options = {}; }
        this.done = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.catcher = new core_1.EventEmitter();
        this.isUploading = false;
        this.queue = [];
        this.progress = 0;
        this._nextIndex = 0;
        this.options = {
            autoUpload: false,
            isHTML5: true,
            filters: [],
            removeAfterUpload: false,
            disableMultipart: false
        };
        this.setOptions(options);
    }
    FileUploader.prototype.setOptions = function (options) {
        this.options = Object.assign(this.options, options);
        this.authToken = options.authToken;
        this.authTokenHeader = options.authTokenHeader || 'Authorization';
        this.autoUpload = options.autoUpload;
        this.options.filters = this.options.filters || [];
        this.options.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
        this.options.filters.unshift({ name: 'fileSize', fn: this._fileSizeFilter });
        this.options.filters.unshift({ name: 'fileType', fn: this._fileTypeFilter });
        this.options.filters.unshift({ name: 'mimeType', fn: this._mimeTypeFilter });
        this.options.filters.unshift({ name: 'accept', fn: this._acceptFilter });
        for (var i = 0; i < this.queue.length; i++) {
            this.queue[i].url = this.options.url;
        }
    };
    FileUploader.prototype.isFileValid = function (file) {
        var temp = new FileLikeObject_class_1.FileLikeObject(file);
        return this._isValidFile(temp, this.options.filters, this.options);
    };
    FileUploader.prototype.isFilesValid = function (files) {
        for (var x = files.length - 1; x >= 0; --x) {
            if (!this.isFileValid(files[x])) {
                return false;
            }
        }
        return true;
    };
    FileUploader.prototype.getValidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            if (this.isFileValid(files[x])) {
                rtn.push(files[x]);
            }
        }
        return rtn;
    };
    FileUploader.prototype.getInvalidFiles = function (files) {
        var rtn = [];
        for (var x = files.length - 1; x >= 0; --x) {
            var failReason = this.getFileFilterFailName(files[x]);
            if (failReason) {
                rtn.push({ file: files[x], type: failReason });
            }
        }
        return rtn;
    };
    FileUploader.prototype.addToQueue = function (files, options, filters) {
        var _this = this;
        var list = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            list.push(file);
        }
        var arrayOfFilters = this._getFilters(filters);
        var count = this.queue.length;
        var addedFileItems = [];
        list.forEach(function (some, index) {
            if (!options) {
                options = _this.options;
            }
            if (_this.isFileValid(some)) {
                var fileItem = new FileItem_class_1.FileItem(_this, some, options);
                addedFileItems.push(fileItem);
                _this.queue.push(fileItem);
                _this._onAfterAddingFile(fileItem);
            }
            else {
                var temp = new FileLikeObject_class_1.FileLikeObject(some);
                var filter = arrayOfFilters[index];
                _this._onWhenAddingFileFailed(temp, filter, options);
            }
        });
        if (this.queue.length !== count) {
            this._onAfterAddingAll(addedFileItems);
            this.progress = this._getTotalProgress();
        }
        if (this.options.autoUpload) {
            this.uploadAll();
        }
    };
    FileUploader.prototype.removeFromQueue = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        if (item.isUploading) {
            item.cancel();
        }
        this.queue.splice(index, 1);
        this.progress = this._getTotalProgress();
    };
    FileUploader.prototype.clearQueue = function () {
        while (this.queue.length) {
            this.queue[0].remove();
        }
        this.progress = 0;
    };
    //most likely deprecated
    /*isHtml5Mode(){
      return this.options.isHTML5 || this.options.isHTML5==null
    }*/
    //most likely deprecated
    /*isHtml5Mode(){
        return this.options.isHTML5 || this.options.isHTML5==null
      }*/
    FileUploader.prototype.uploadItem = 
    //most likely deprecated
    /*isHtml5Mode(){
        return this.options.isHTML5 || this.options.isHTML5==null
      }*/
    function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        var transport = '_xhrTransport';
        //original author never finished this and iframe file sending is dead
        //let transport = this.isHtml5Mode() ? '_xhrTransport' : '_iframeTransport';
        item._prepareToUploading();
        if (this.isUploading) {
            return;
        }
        this.isUploading = true;
        return this[transport](item);
    };
    FileUploader.prototype.cancelItem = function (value) {
        var index = this.getIndexOfItem(value);
        var item = this.queue[index];
        var prop = item._xhr;
        //original author never finished this
        //let prop = this.isHtml5Mode() ? item._xhr : item._form;
        if (item && item.isUploading) {
            prop.abort();
        }
    };
    FileUploader.prototype.uploadAll = function () {
        var _this = this;
        var items = this.getNotUploadedItems().filter(function (item) { return !item.isUploading; });
        if (!items.length) {
            this.done.emit([]);
            return Promise.resolve([]);
        }
        items.map(function (item) { return item._prepareToUploading(); });
        var promises = [];
        promises.push(items[0].upload());
        return Promise.all(promises)
            .then(function (r) {
            _this.done.emit(r);
            _this.success.emit(r);
            return r;
        })
            .catch(function (e) {
            _this.catcher.emit(e);
            return Promise.reject(e);
        });
    };
    FileUploader.prototype.cancelAll = function () {
        var items = this.getNotUploadedItems();
        items.map(function (item) { return item.cancel(); });
    };
    FileUploader.prototype.isFile = function (value) {
        return isFile(value);
    };
    FileUploader.prototype.isFileLikeObject = function (value) {
        return value instanceof FileLikeObject_class_1.FileLikeObject;
    };
    FileUploader.prototype.getIndexOfItem = function (value) {
        return typeof value === 'number' ? value : this.queue.indexOf(value);
    };
    FileUploader.prototype.getNotUploadedItems = function () {
        return this.queue.filter(function (item) { return !item.isUploaded; });
    };
    FileUploader.prototype.getReadyItems = function () {
        return this.queue
            .filter(function (item) { return (item.isReady && !item.isUploading); })
            .sort(function (item1, item2) { return item1.index - item2.index; });
    };
    FileUploader.prototype.destroy = function () {
        return void 0;
        /*forEach(this._directives, (key) => {
             forEach(this._directives[key], (object) => {
             object.destroy();
             });
             });*/
    };
    FileUploader.prototype.onAfterAddingAll = function (fileItems) {
        return { fileItems: fileItems };
    };
    FileUploader.prototype.onBuildItemForm = function (fileItem, form) {
        return { fileItem: fileItem, form: form };
    };
    FileUploader.prototype.onAfterAddingFile = function (fileItem) {
        return { fileItem: fileItem };
    };
    FileUploader.prototype.onWhenAddingFileFailed = function (item, filter, options) {
        return { item: item, filter: filter, options: options };
    };
    FileUploader.prototype.onBeforeUploadItem = function (fileItem) {
        return { fileItem: fileItem };
    };
    FileUploader.prototype.onProgressItem = function (fileItem, progress) {
        return { fileItem: fileItem, progress: progress };
    };
    FileUploader.prototype.onProgressAll = function (progress) {
        return { progress: progress };
    };
    FileUploader.prototype.onSuccessItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onErrorItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCancelItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCompleteItem = function (item, response, status, headers) {
        return { item: item, response: response, status: status, headers: headers };
    };
    FileUploader.prototype.onCompleteAll = function () {
        return void 0;
    };
    FileUploader.prototype._acceptFilter = function (item) {
        return this.acceptType(item.type, item.name);
    };
    FileUploader.prototype.acceptType = function (type, name) {
        if (!this.options.accept)
            return true;
        var defs = this.options.accept.split(',');
        var regx = null;
        var acceptRegString = null;
        for (var x = defs.length - 1; x >= 0; --x) {
            //Escapes dots in mimetype
            acceptRegString = defs[x]; //.replace(/\./g,'\\.')
            //Escapes stars in mimetype
            acceptRegString = acceptRegString.replace(/\*/g, '.*');
            //let acceptReg = '^((' + acceptRegString
            //acceptReg = acceptReg.replace(/,/g,')|(') + '))$'
            //try by mime
            regx = new RegExp(acceptRegString, 'gi');
            if (type.search(regx) >= 0) {
                return true;
            }
            //try by ext
            if (acceptRegString.substring(0, 1) == '.') {
                acceptRegString = '\\' + acceptRegString; //.substring(1, acceptRegString.length-1)//remove dot at front
                regx = new RegExp(acceptRegString + '$', 'i');
                if ((name || type).search(regx) >= 0) {
                    return true;
                }
            }
        }
        return false;
    };
    FileUploader.prototype._mimeTypeFilter = function (item) {
        return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
    };
    FileUploader.prototype._fileSizeFilter = function (item) {
        return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
    };
    FileUploader.prototype._fileTypeFilter = function (item) {
        return !(this.options.allowedFileType &&
            this.options.allowedFileType.indexOf(FileType_class_1.FileType.getMimeClass(item)) === -1);
    };
    FileUploader.prototype._onErrorItem = function (item, response, status, headers) {
        item._onError(response, status, headers);
        this.onErrorItem(item, response, status, headers);
    };
    FileUploader.prototype._onCompleteItem = function (item, response, status, headers) {
        item._onComplete(response, status, headers);
        this.onCompleteItem(item, response, status, headers);
        var nextItem = this.getReadyItems()[0];
        this.isUploading = false;
        if (nextItem) {
            nextItem.upload();
            return;
        }
        this.onCompleteAll();
        this.progress = this._getTotalProgress();
        //this._render();
    };
    FileUploader.prototype._headersGetter = function (parsedHeaders) {
        return function (name) {
            if (name) {
                return parsedHeaders[name.toLowerCase()] || void 0;
            }
            return parsedHeaders;
        };
    };
    FileUploader.prototype.getQuedFiles = function () {
        var rtn = [];
        for (var x = 0; x < this.queue.length; ++x) {
            rtn.push(this.queue[x]._file);
        }
        return rtn;
    };
    FileUploader.prototype.getFormData = function (files) {
        files = files || this.getQuedFiles();
        var formData = new FormData();
        for (var x = 0; x < files.length; ++x) {
            var filename = this.options.forceFilename || files[x].name;
            var alias = this.options.forcePostname || 'file';
            formData.append(alias, files[x], filename);
        }
        return formData;
    };
    FileUploader.prototype._xhrTransport = function (item) {
        var _this = this;
        var xhr = item._xhr = new XMLHttpRequest();
        var sendable;
        this._onBeforeUploadItem(item);
        // todo
        /*item.formData.map(obj => {
             obj.map((value, key) => {
             form.append(key, value);
             });
             });*/
        if (typeof item._file.size !== 'number') {
            throw new TypeError('The file specified is no longer valid');
        }
        if (!this.options.disableMultipart) {
            sendable = new FormData();
            this._onBuildItemForm(item, sendable);
            sendable.append(item.alias, item._file, item.file.name);
            if (this.options.additionalParameter !== undefined) {
                Object.keys(this.options.additionalParameter).forEach(function (key) {
                    sendable.append(key, _this.options.additionalParameter[key]);
                });
            }
        }
        else {
            sendable = item._file;
        }
        return this.sendFormDataFileItem(sendable, item, xhr);
    };
    FileUploader.prototype.sendFormDataFileItem = function (sendable, item, xhr) {
        var _this = this;
        xhr = xhr || new XMLHttpRequest();
        xhr.upload.onprogress = function (event) {
            var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
            _this._onProgressItem(item, progress);
        };
        return new Promise(function (res, rej) {
            xhr.onload = function () {
                var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
                var response = _this._transformResponse(xhr.response, headers);
                var gist = _this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
                var method = '_on' + gist + 'Item';
                _this[method](item, response, xhr.status, headers);
                _this._onCompleteItem(item, response, xhr.status, headers);
                res(response);
            };
            xhr.onerror = function (e) {
                var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
                var response = _this._transformResponse(xhr.response, headers);
                _this._onErrorItem(item, response, xhr.status, headers);
                _this._onCompleteItem(item, response, xhr.status, headers);
                rej(e);
            };
            xhr.onabort = function () {
                var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
                var response = _this._transformResponse(xhr.response, headers);
                _this._onCancelItem(item, response, xhr.status, headers);
                _this._onCompleteItem(item, response, xhr.status, headers);
                res(response);
            };
            xhr.open(item.method, item.url, true);
            xhr.withCredentials = item.withCredentials;
            if (_this.options.headers) {
                for (var _i = 0, _a = _this.options.headers; _i < _a.length; _i++) {
                    var header = _a[_i];
                    xhr.setRequestHeader(header.name, header.value);
                }
            }
            if (item.headers.length) {
                for (var _b = 0, _c = item.headers; _b < _c.length; _b++) {
                    var header = _c[_b];
                    xhr.setRequestHeader(header.name, header.value);
                }
            }
            if (_this.authToken) {
                xhr.setRequestHeader(_this.authTokenHeader, _this.authToken);
            }
            xhr.send(sendable);
            //this._render();
        });
    };
    FileUploader.prototype._getTotalProgress = function (value) {
        if (value === void 0) { value = 0; }
        if (this.options.removeAfterUpload) {
            return value;
        }
        var notUploaded = this.getNotUploadedItems().length;
        var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
        var ratio = 100 / this.queue.length;
        var current = value * ratio / 100;
        return Math.round(uploaded * ratio + current);
    };
    FileUploader.prototype._getFilters = function (filters) {
        if (!filters) {
            return this.options.filters;
        }
        if (Array.isArray(filters)) {
            return filters;
        }
        if (typeof filters === 'string') {
            var names_1 = filters.match(/[^\s,]+/g);
            return this.options.filters
                .filter(function (filter) { return names_1.indexOf(filter.name) !== -1; });
        }
        return this.options.filters;
    };
    /*protected _render():any {
      return void 0;
      // todo: ?
    }*/
    /*protected _render():any {
        return void 0;
        // todo: ?
      }*/
    FileUploader.prototype._queueLimitFilter = /*protected _render():any {
        return void 0;
        // todo: ?
      }*/
    function () {
        return this.options.queueLimit === undefined || this.queue.length < this.options.queueLimit;
    };
    FileUploader.prototype.getFileFilterFailName = function (file) {
        for (var x = this.options.filters.length - 1; x >= 0; --x) {
            if (!this.options.filters[x].fn.call(this, file, this.options)) {
                return this.options.filters[x].name;
            }
        }
        return;
    };
    FileUploader.prototype._isValidFile = function (file, filters, options) {
        if (!filters.length)
            return true;
        return this.getFileFilterFailName(file) ? false : true;
    };
    FileUploader.prototype._isSuccessCode = function (status) {
        return (status >= 200 && status < 300) || status === 304;
    };
    /* tslint:disable */
    /* tslint:disable */
    FileUploader.prototype._transformResponse = /* tslint:disable */
    function (response, headers) {
        // todo: ?
        /*var headersGetter = this._headersGetter(headers);
             forEach($http.defaults.transformResponse, (transformFn) => {
             response = transformFn(response, headersGetter);
             });*/
        return response;
    };
    /* tslint:enable */
    /* tslint:enable */
    FileUploader.prototype._parseHeaders = /* tslint:enable */
    function (headers) {
        var parsed = {};
        var key;
        var val;
        var i;
        if (!headers) {
            return parsed;
        }
        headers.split('\n').map(function (line) {
            i = line.indexOf(':');
            key = line.slice(0, i).trim().toLowerCase();
            val = line.slice(i + 1).trim();
            if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        });
        return parsed;
    };
    /*protected _iframeTransport(item:FileItem) {
     // todo: implement it later
     }*/
    /*protected _iframeTransport(item:FileItem) {
       // todo: implement it later
       }*/
    FileUploader.prototype._onWhenAddingFileFailed = /*protected _iframeTransport(item:FileItem) {
       // todo: implement it later
       }*/
    function (item, filter, options) {
        this.onWhenAddingFileFailed(item, filter, options);
    };
    FileUploader.prototype._onAfterAddingFile = function (item) {
        this.onAfterAddingFile(item);
    };
    FileUploader.prototype._onAfterAddingAll = function (items) {
        this.onAfterAddingAll(items);
    };
    FileUploader.prototype._onBeforeUploadItem = function (item) {
        item._onBeforeUpload();
        this.onBeforeUploadItem(item);
    };
    FileUploader.prototype._onBuildItemForm = function (item, form) {
        item._onBuildForm(form);
        this.onBuildItemForm(item, form);
    };
    FileUploader.prototype._onProgressItem = function (item, progress) {
        var total = this._getTotalProgress(progress);
        this.progress = total;
        item._onProgress(progress);
        this.onProgressItem(item, progress);
        this.onProgressAll(total);
        //this._render();
    };
    /* tslint:disable */
    /* tslint:disable */
    FileUploader.prototype._onSuccessItem = /* tslint:disable */
    function (item, response, status, headers) {
        item._onSuccess(response, status, headers);
        this.onSuccessItem(item, response, status, headers);
    };
    /* tslint:enable */
    /* tslint:enable */
    FileUploader.prototype._onCancelItem = /* tslint:enable */
    function (item, response, status, headers) {
        item._onCancel(response, status, headers);
        this.onCancelItem(item, response, status, headers);
    };
    /** converts file-input file into base64 dataUri */
    /** converts file-input file into base64 dataUri */
    FileUploader.prototype.dataUrl = /** converts file-input file into base64 dataUri */
    function (file, disallowObjectUrl) {
        return dataUrl(file, disallowObjectUrl);
    };
    FileUploader.prototype.applyExifRotation = function (file) {
        if (file.type.indexOf('image/jpeg') !== 0) {
            return Promise.resolve(file);
        }
        return readOrientation(file)
            .then(function (result) {
            if (result.orientation < 2 || result.orientation > 8) {
                return file;
            }
            return fixFileOrientationByMeta(file, result);
        });
    };
    FileUploader.propDecorators = {
        "done": [{ type: core_1.Output },],
        "success": [{ type: core_1.Output },],
        "catcher": [{ type: core_1.Output, args: ['catch',] },],
    };
    return FileUploader;
}());
exports.FileUploader = FileUploader;
/** converts file-input file into base64 dataUri */
function dataUrl(file, disallowObjectUrl) {
    if (!file)
        return Promise.resolve(file);
    if ((disallowObjectUrl && file.$ngfDataUrl != null) || (!disallowObjectUrl && file.$ngfBlobUrl != null)) {
        return Promise.resolve(disallowObjectUrl ? file.$ngfDataUrl : file.$ngfBlobUrl);
    }
    var p = disallowObjectUrl ? file.$$ngfDataUrlPromise : file.$$ngfBlobUrlPromise;
    if (p)
        return p;
    var win = getWindow();
    var deferred = Promise.resolve();
    if (win.FileReader && file &&
        (!win.FileAPI || navigator.userAgent.indexOf('MSIE 8') === -1 || file.size < 20000) &&
        (!win.FileAPI || navigator.userAgent.indexOf('MSIE 9') === -1 || file.size < 4000000)) {
        //prefer URL.createObjectURL for handling refrences to files of all sizes
        //since it doesn´t build a large string in memory
        var URL = win.URL || win.webkitURL;
        if (FileReader) {
            deferred = new Promise(function (res, rej) {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    file.$ngfDataUrl = event.target.result;
                    delete file.$ngfDataUrl;
                    res(event.target.result);
                };
                fileReader.onerror = function (e) {
                    file.$ngfDataUrl = '';
                    rej(e);
                };
                fileReader.readAsDataURL(file);
            });
        }
        else {
            var url;
            try {
                url = URL.createObjectURL(file);
            }
            catch (e) {
                return Promise.reject(e);
            }
            deferred = deferred.then(function () { return url; });
            file.$ngfBlobUrl = url;
        }
    }
    else {
        file[disallowObjectUrl ? '$ngfDataUrl' : '$ngfBlobUrl'] = '';
        return Promise.reject(new Error('Browser does not support window.FileReader, window.FileReader, or window.FileAPI')); //deferred.reject();
    }
    if (disallowObjectUrl) {
        p = file.$$ngfDataUrlPromise = deferred;
    }
    else {
        p = file.$$ngfBlobUrlPromise = deferred;
    }
    p = p.then(function (x) {
        delete file[disallowObjectUrl ? '$$ngfDataUrlPromise' : '$$ngfBlobUrlPromise'];
        return x;
    });
    return p;
}
function fixFileOrientationByMeta(file, result) {
    return dataUrl(file, true)
        .then(function (url) {
        var canvas = document.createElement('canvas');
        var img = document.createElement('img');
        return new Promise(function (res, rej) {
            img.onload = function () {
                try {
                    canvas.width = result.orientation > 4 ? img.height : img.width;
                    canvas.height = result.orientation > 4 ? img.width : img.height;
                    var ctx = canvas.getContext('2d');
                    applyTransform(ctx, result.orientation, img.width, img.height);
                    ctx.drawImage(img, 0, 0);
                    var dataUrl = canvas.toDataURL(file.type || 'image/WebP', 0.934);
                    var base = arrayBufferToBase64(result.fixedArrayBuffer);
                    dataUrl = restoreExif(base, dataUrl);
                    var blob = dataUrltoBlob(dataUrl, file.name);
                    res(blob);
                }
                catch (e) {
                    return rej(e);
                }
            };
            img.onerror = rej;
            img.src = url;
        });
    });
}
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
function restoreExif(orig, resized) {
    var ExifRestorer = {
        KEY_STR: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
    ExifRestorer.encode64 = function (input) {
        var output = '', chr1, chr2, chr3 = '', enc1, enc2, enc3, enc4 = '', i = 0;
        do {
            chr1 = input[i++];
            chr2 = input[i++];
            chr3 = input[i++];
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                this.KEY_STR.charAt(enc1) +
                this.KEY_STR.charAt(enc2) +
                this.KEY_STR.charAt(enc3) +
                this.KEY_STR.charAt(enc4);
            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);
        return output;
    };
    ExifRestorer.restore = function (origFileBase64, resizedFileBase64) {
        if (origFileBase64.match('data:image/jpeg;base64,')) {
            origFileBase64 = origFileBase64.replace('data:image/jpeg;base64,', '');
        }
        var rawImage = this.decode64(origFileBase64);
        var segments = this.slice2Segments(rawImage);
        var image = this.exifManipulation(resizedFileBase64, segments);
        return 'data:image/jpeg;base64,' + this.encode64(image);
    };
    ExifRestorer.exifManipulation = function (resizedFileBase64, segments) {
        var exifArray = this.getExifArray(segments), newImageArray = this.insertExif(resizedFileBase64, exifArray);
        return new Uint8Array(newImageArray);
    };
    ExifRestorer.getExifArray = function (segments) {
        var seg;
        for (var x = 0; x < segments.length; x++) {
            seg = segments[x];
            if (seg[0] === 255 && seg[1] === 225) {
                return seg;
            }
        }
        return [];
    };
    ExifRestorer.insertExif = function (resizedFileBase64, exifArray) {
        var imageData = resizedFileBase64.replace('data:image/jpeg;base64,', ''), buf = this.decode64(imageData), separatePoint = buf.indexOf(255, 3), mae = buf.slice(0, separatePoint), ato = buf.slice(separatePoint), array = mae;
        array = array.concat(exifArray);
        array = array.concat(ato);
        return array;
    };
    ExifRestorer.slice2Segments = function (rawImageArray) {
        var head = 0, segments = [];
        while (1) {
            if (rawImageArray[head] === 255 && rawImageArray[head + 1] === 218) {
                break;
            }
            if (rawImageArray[head] === 255 && rawImageArray[head + 1] === 216) {
                head += 2;
            }
            else {
                var length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3], endPoint = head + length + 2, seg = rawImageArray.slice(head, endPoint);
                segments.push(seg);
                head = endPoint;
            }
            if (head > rawImageArray.length) {
                break;
            }
        }
        return segments;
    };
    ExifRestorer.decode64 = function (input) {
        var chr1, chr2, chr3 = '', enc1, enc2, enc3, enc4 = '', i = 0, buf = [];
        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            console.log('There were invalid base64 characters in the input text.');
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
        do {
            enc1 = this.KEY_STR.indexOf(input.charAt(i++));
            enc2 = this.KEY_STR.indexOf(input.charAt(i++));
            enc3 = this.KEY_STR.indexOf(input.charAt(i++));
            enc4 = this.KEY_STR.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            buf.push(chr1);
            if (enc3 !== 64) {
                buf.push(chr2);
            }
            if (enc4 !== 64) {
                buf.push(chr3);
            }
            chr1 = chr2 = chr3 = '';
            enc1 = enc2 = enc3 = enc4 = '';
        } while (i < input.length);
        return buf;
    };
    return ExifRestorer.restore(orig, resized); //<= EXIF
}
;
function readOrientation(file) {
    return new Promise(function (res, rej) {
        var reader = new FileReader();
        var slicedFile = file.slice ? file.slice(0, 64 * 1024) : file;
        reader.readAsArrayBuffer(slicedFile);
        reader.onerror = rej;
        reader.onload = function (e) {
            var result = { orientation: 1 };
            var view = new DataView(this.result);
            if (view.getUint16(0, false) !== 0xFFD8)
                return res(result);
            var length = view.byteLength, offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker === 0xFFE1) {
                    if (view.getUint32(offset += 2, false) !== 0x45786966)
                        return res(result);
                    var little = view.getUint16(offset += 6, false) === 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                            var orientation = view.getUint16(offset + (i * 12) + 8, little);
                            if (orientation >= 2 && orientation <= 8) {
                                view.setUint16(offset + (i * 12) + 8, 1, little);
                                result.fixedArrayBuffer = e.target.result;
                            }
                            result.orientation = orientation;
                            return res(result);
                        }
                }
                else if ((marker & 0xFF00) !== 0xFF00)
                    break;
                else
                    offset += view.getUint16(offset, false);
            }
            return res(result);
        };
    });
}
;
function applyTransform(ctx, orientation, width, height) {
    switch (orientation) {
        case 2:
            return ctx.transform(-1, 0, 0, 1, width, 0);
        case 3:
            return ctx.transform(-1, 0, 0, -1, width, height);
        case 4:
            return ctx.transform(1, 0, 0, -1, 0, height);
        case 5:
            return ctx.transform(0, 1, 1, 0, 0, 0);
        case 6:
            return ctx.transform(0, 1, -1, 0, height, 0);
        case 7:
            return ctx.transform(0, -1, -1, 0, height, width);
        case 8:
            return ctx.transform(0, -1, 1, 0, 0, width);
    }
}
function dataUrltoBlob(dataurl, name, origSize) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = new window.Blob([u8arr], { type: mime });
    blob["name"] = name;
    blob["$ngfOrigSize"] = origSize;
    return blob;
}
;
