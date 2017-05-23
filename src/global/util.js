const crypto = require('crypto');

var role_map = {
    "9": "Agent",
    "3": "Admin",
    "2": "Developer",
    "1": "Viewer",
    "0": "Unknown"
}

var roleName = function(id) {
    var role = role_map[id]
    if (!role || role == "") {
        role = "Unknown"
    }
    return role
}

var roleList = function (exclude) {
    var list = []
    for(var key in role_map) {
        var item = {}
        item.role = intify(key, 0)
        if (exclude && arrayContains(exclude, item.role)) {
            continue
        }
        item.roleName = role_map[key]
        list.push(item)
    }
    list.sort(function (a, b) {
        return a.role - b.role
    })
    return list
}

var obj2Json = function (data,space){
    var seen=[];
    return JSON.stringify(data, function(key,val){
        if(!val||typeof val !=='object'){
            return val;
        }
        if(seen.indexOf(val)!==-1){
            return '[Circular]';
        }
        seen.push(val);
        return val;
    }, space);
}

var md5 = function (str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

var arrayContains = function (arr, ele) {
    if (!arr || !(arr instanceof Array)) return false
    for (var i in arr) {
        if (arr[i] == ele) return true;
    }
    return false;
}

var deepCopy = function (obj, exclude) {
    if (typeof obj != 'object') {
        return obj;
    }
    var isArray = obj instanceof Array
    var newobj = isArray ? [] : {};
    for (var attr in obj) {
        if (!isArray && exclude && arrayContains(exclude, attr)) {
            continue
        }
        if (isArray) {
            newobj.push(deepCopy(obj[attr]))
        }else {
            newobj[attr] = deepCopy(obj[attr]);
        }
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
    roleList: roleList,
    obj2Json: obj2Json,
}