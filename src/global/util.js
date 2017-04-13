const crypto = require('crypto');

var arrayContains = function (arr, ele) {
    if (!arr || !ele) return false
    for (var i in arr) {
        if (arr[i] == ele) return true;
    }
    return false;
}

var deepCopy = function (obj, exclude) {
    if (typeof obj != 'object') {
        return obj;
    }
    var newobj = {};
    for (var attr in obj) {
        if (arrayContains(exclude, attr)) {
            continue
        }
        newobj[attr] = deepCopy(obj[attr]);
    }
    return newobj;
}

export default {
    md5: function (str) {
        var md5 = crypto.createHash('md5');
        md5.update(str);
        return md5.digest('hex');
    },
    deepCopy: deepCopy,
    arrayContains:arrayContains
}