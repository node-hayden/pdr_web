const crypto = require('crypto');

var role_map = {
    "9": "Agent",
    "2": "Admin",
    "1": "Developer",
    "0": "Unknown"
}

var roleName = function(id) {
    var role = role_map[id]
    if (!role || role == "") {
        role = "Unknown"
    }
    return role
}

var md5 = function (str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

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

var trimAll = function (str) {
    if (!str || (typeof str) != "string") {
        return ""
    }
    return str.replace(/s+/g, "")
}

var trim = function (str) {
    if (!str || (typeof str) != "string") {
        return ""
    }
    return str.replace(/(^\s+)|(\s+$)/g, "")
}

var trimObj = function (obj, all) {
    if (!obj || (typeof str) != "object") {
        return
    }
    for (var attr in obj) {
        var val = obj[attr]
        if ((typeof val) == "string") {
            if (all) {
                obj[attr] = trimAll(val)
            } else {
                obj[attr] = trim(val)
            }
        }
    }
}

var intify = function (str, i) {
    var res = parseInt(str, 10)
    if (res == NaN) {
        if ((typeof i) == "int") {
            return i
        }
        return 0
    }
    return res
}

export default {
    md5: md5,
    deepCopy: deepCopy,
    arrayContains: arrayContains,
    trim: trim,
    trimAll: trimAll,
    trimObj: trimObj,
    intify: intify,
    roleName: roleName,
}