"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getWindow() { return window; }
exports.getWindow = getWindow;
function acceptType(accept, type, name) {
    if (!accept) {
        return true;
    }
    var defs = accept.split(',');
    var regx;
    var acceptRegString;
    for (var x = defs.length - 1; x >= 0; --x) {
        //Escapes dots in mimetype
        acceptRegString = defs[x];
        //trim
        acceptRegString = acceptRegString.replace(/(^\s+|\s+$)/g, '');
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
}
exports.acceptType = acceptType;
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
exports.arrayBufferToBase64 = arrayBufferToBase64;
function dataUrltoBlob(dataurl, name, origSize) {
    var arr = dataurl.split(',');
    var mimeMatch = arr[0].match(/:(.*?);/);
    var mime = mimeMatch ? mimeMatch[1] : 'text/plain';
    var bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = new window.Blob([u8arr], { type: mime });
    blob["name"] = name;
    blob["$ngfOrigSize"] = origSize;
    return blob;
}
exports.dataUrltoBlob = dataUrltoBlob;
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
exports.applyTransform = applyTransform;
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
                    rej(e);
                }
            };
            img.onerror = rej;
            img.src = url;
        });
    });
}
exports.fixFileOrientationByMeta = fixFileOrientationByMeta;
function applyExifRotation(file) {
    if (file.type.indexOf('image/jpeg') !== 0) {
        return Promise.resolve(file);
    }
    return readOrientation(file)
        .then(function (result) {
        if (result.orientation < 2 || result.orientation > 8) {
            return file;
        }
        return fixFileOrientationByMeta(file, result);
    })
        .then(function () { return file; });
}
exports.applyExifRotation = applyExifRotation;
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
exports.readOrientation = readOrientation;
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
    var deferred;
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
            deferred = Promise.resolve(url);
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
exports.dataUrl = dataUrl;
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
                var length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3];
                var endPoint = head + length + 2;
                var seg = rawImageArray.slice(head, endPoint);
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
exports.restoreExif = restoreExif;
;
