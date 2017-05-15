import api from './api'

var root = null

function registerRoot(r) {
    root = r
}

function ROOT() {
    return root
}

// Message
function toast(msg, color) {
    if (root) root.onToast("提示", msg, color)
}

function tostError(msg) {
    toast(msg, "red")
}

// Jump
function goto(path) {
    if (root) root.onGoto(path)
}

// Network
function NewAjax(path, param, method, showLoader, operation) {
    var obj = {}
    obj.path = path
    obj.param = param
    obj.method = method
    obj.showLoader = showLoader
    obj.operation = operation

    // function
    obj.success = function (func) {
        this.__success = func
        return this
    }
    
    obj.failure = function (func) {
        this.__failure = func
        return this
    }

    obj.fault = function(func){
        this.__fault = func
        return this
    }

    obj.before = function (func) {
        this.__before = func
        return this
    }

    obj.complete = function (func) {
        this.__complete = func
        return this
    }

    obj.go = function () {
        var self = this
        var prefix = self.operation && self.operation != "" ? self.operation + "失败：" : ""
        api.req(self.path, self.param, self.method,function (data) {
            if (data && (data.errno == 0 || data.errno == 1)) {
                if (self.__success) self.__success(data)
            } else if (data && data.errno == 200 && self.path!="/api/user" && self.path!="/api/menu")  {
                console.log(data)
                if (root) {
                    root.onGoto("/")
                    root.onRefreshTopbar()
                }
            } else if (data && self.__fault) {
                self.__fault(data)
            } else {
                var msg = "未知错误!"
                if (data && data.msg) {
                    msg = prefix + data.msg
                } else {
                    msg = prefix + msg
                }
                if (root != null) root.onToast("提示", msg, "red")
                if (self.__failure) self.__failure(msg)
            }
        }, function (status, msg) {
            var msg = prefix + "(status: " + status + ", message: "+msg+")"
            if (root != null) root.onToast("提示", msg, "red")
            if (self.__failure) self.__failure(msg)
        }, function () {
            if (self.showLoader && root != null) root.requestCount ++
            if (self.__before) self.__before(self.path, self.param)
        }, function () {
            if (self.showLoader && root != null) root.requestCount --
            if (self.__complete) self.__complete(self.path, self.param)
        })
    }

    return obj
}

function Get(path, param, showLoader, operation) {
    return NewAjax(path, param, "GET", showLoader, operation)
}

function Post(path, param, showLoader, operation) {
    return NewAjax(path, param, "POST", showLoader, operation)
}

export default {
    registerRoot: registerRoot,
    ROOT: ROOT,

    // Jump
    goto: goto,

    // message
    toast: toast,
    toastError:tostError,

    // Network
    GET: Get,
    POST: Post,
}