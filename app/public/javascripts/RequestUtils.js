/**
 * Created by LiuYuTao on 2017/11/28.
 */


var Bigpipe = function () {
    this.callbacks = {};
}

Bigpipe.prototype.ready = function (key, callback) {
    if (!this.callbacks[key]) {
        this.callbacks[key] = [];
    }
    this.callbacks[key].push(callback);
}

Bigpipe.prototype.set = function (key, data) {
    var callbacks = this.callbacks[key] || [];
    for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].call(this, data);
    }
}


var RU = RequestUtils = function () {
    this.requests = [];
    this.requestParams = {};
    this.requestHeader = {};
    this.requests = {};
};
var proto = {
    config: {
        crp: "/ncall/CRP/",
        bp: "/ncall/bigpipe/"
    },
    requestId: 1,

    getCommonParam: function () {
        return {lan: "zh"};
    },
    // 检查bigPipe 请求
    checkBigPipeRequest: function (requests) {
        if (!$.isPlainObject(requests)) {
            return false;
        }
        for (var key in requests) {
            if (!requests[key].hasOwnProperty("success") && !requests[key].hasOwnProperty("fail")) {
                console.log("请求中应包含success 和 fail 回调方法");
                return false;
            }
        }
        return true;
    },
    // 检查请求
    checkRequest: function (requests) {
        if (!$.isArray(requests)) {
            for (var key in requests) {
                var req = requests[key];
                if (!req.hasOwnProperty("url")) {
                    return false;
                }
            }
        } else {
            for (var i = 0; i < requests.length; i++) {
                var obj = requests[i];
                if (!obj.hasOwnProperty("url")) {
                    return false;
                }
            }
        }
        return true;
    },

    postRequest: function (requests) {
        var t = this;
        if (this.checkRequest(requests)) {
            t.requestParams = t.buildReqeustParams(requests);
            return $.ajax({
                url: t.config.crp,
                data: {paramJson: JSON.stringify(t.requestParams)},
                type: "post",
                dataType: "json",
                timeout: function (data) {
                    console.log("timeout");
                },
                error: function (err) {
                    console.log(err);
                }
            });
        } else {
            return null;
        }
    },

    buildReqeustParams: function (requests, options) {
        var t = this;
        var requestParams = {};
        var requestHeader;
        requestHeader = t.getCommonParam();


        requestParams.requestHeader = requestHeader;
        requestParams.requests = requests;
        return requestParams;
    },
    // 创建bigPipe 请求参数
    buildBigPipeReqeustParams: function (requests) {
        var t = this;
        var requestParams = {};
        var requestHeader;
        requestHeader = t.getCommonParam();
        var callbackName;
        requestParams.requestHeader = requestHeader;
        var newRequests = [];
        var req;

        for (var key in requests) {
            req = requests[key];
            callbackName = ('jsonp_' + key + "_" + Math.random()).replace(".", "");
            window[callbackName] = function (data) {  //创建jsonp回调函数
                window[callbackName] = null;
                req.success && req.success(data);   //先删除script标签，实际上执行的是success函数
            };
            req.jsonp = callbackName;
        }

        requestParams.requests = requests;
        return requestParams;
    },
    // 处理响应
    handleResponse: function (data) {
        if (data) {

        }
    },
    bigPipeRequest: function (requests) {
        var t = this;
        if ((typeof requests).toLowerCase() != "object") {
            if (console) {
                console.log(typeof requests);
                console.log("请以对象方式组织组合请求");
            }
            return false;   // TODO:
        }
        if (this.checkBigPipeRequest(requests)) {
            t.requestParams = t.buildBigPipeReqeustParams(requests);
            var bd = document.body;
            var scp = document.createElement("script");
            scp.src = "/ncall/bigpipe?paramJson=" + JSON.stringify(t.requestParams);
            bd.appendChild(scp);
        } else {
            return null;
        }
    }
};

RU.prototype = RequestUtils.prototype = proto;
