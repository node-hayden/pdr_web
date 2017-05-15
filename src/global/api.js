// 配置API接口地址
const root = 'http://localhost:3001';

// 超时时间
const timeout = 10000;

const postJson = true;

var jquery = require('jquery');

// 自定义判断元素类型JS
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 参数过滤函数
function filter_null(o) {
    for (var key in o) {
        if (o[key] == null) {
            delete o[key]
        }
        if (toType(o[key]) == 'string') {
            o[key] = o[key].trim()
            if (o[key].length == 0) {
                delete o[key]
            }
        }
    }
    return o
}

function _api_base(method, url, params, success, failure, beforeSend, complete) {
    if (!params) params = {}
    params = filter_null(params)
    var options = {
        url: url,
        type: method,
        async: true,
        timeout: timeout,
        dataType: 'json',
        crossDomain: true,
        xhrFields: {  withCredentials: true  },
        beforeSend: function (xhr) {
            if (beforeSend) {
                beforeSend(xhr)
            } else {
                console.log("Ajax before: " + url)
            }
        },
        success: function (data, textStatus, xhr) {
            if (success) {
                success(data)
            } else {
                console.log("Ajax success: " + url)
                console.log(data)
            }
        },
        error: function (xhr, textStatus) {
            var statusText = xhr.status == 0 ? "The server doesn't seem to open" : xhr.statusText
            if (failure) {
                failure(xhr.status, statusText, xhr)
            } else {
                console.log('Ajax failed: ' + url + " status: " + textStatus)
                console.log(xhr)
            }
        },
        complete: function () {
            if (complete) {
                complete()
            } else {
                console.log("Ajax complete: " + url)
            }
        }
    };
    if (postJson && method == "POST") {
        options.data = JSON.stringify(params)
        options.contentType = "application/json"
    } else {
        options.data = params
    }
    jquery.ajax(options);
};

// 返回在vue模板中的调用接口
export default {
    req: function (path, params, method, success, failure, beforeSend, complete) {
        _api_base(method, root + path, params, success, failure, beforeSend, complete)
    },
    get: function (url, params, success, failure, beforeSend, complete) {
        _api_base('GET', root + url, params, success, failure, beforeSend, complete)
    },
    post: function (url, params, success, failure, beforeSend, complete) {
        _api_base('POST', root + url, params, success, failure, beforeSend, complete)
    },
    put: function (url, params, success, failure, beforeSend, complete) {
        _api_base('PUT', root + url, params, success, failure, beforeSend, complete)
    },
    delete: function (url, params, success, failure, beforeSend, complete) {
        _api_base('DELETE', root + url, params, success, failure, beforeSend, complete)
    },
}