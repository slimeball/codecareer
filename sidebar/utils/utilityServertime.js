/*
 * getDate  获取服務器时间
 * getUnix: 获取服務器时间戳
 * isWorkTime: 当前时间是否在工作时间內
 * getServertime: 获取服务器时间請求
 * */

import { getServerTimeAjax } from '../utils/getData';

window.utilityServertime = function () {
    var servertimeDiff;
    let servertimeRequest = async function (fn) {
        try {
            const res = await getServerTimeAjax();
            if(res.code == 200) {
                // var serverTimeStr = obj.ResponseMessage.replace(/-/g, '/');
                var servertime = new Date(parseInt(res.data)* 1000);
                var localtime = new Date();
                servertimeDiff = { server: servertime, local: localtime };
                var localtimeStr = localtime.getFullYear() + '/' + (localtime.getMonth() + 1) + '/' + localtime.getDate() + ' ' + localtime.getHours() + ':' + localtime.getMinutes() + ':' + localtime.getSeconds();
                var serverTimeStr = servertime.getFullYear() + '/' + (servertime.getMonth() + 1) + '/' + servertime.getDate() + ' ' + servertime.getHours() + ':' + servertime.getMinutes() + ':' + servertime.getSeconds();
                localStorage.setItem('SERVERTIME', JSON.stringify( { serverTimeStr: serverTimeStr, localtimeStr: localtimeStr } ) )
                // store.set('TRAIN_SERVERTIME', { serverTimeStr: serverTimeStr, localtimeStr: localtimeStr });
                fn && fn();
            }
        } catch (error) {
            fn && fn();
        }
    }

    function getServertime(fn) {
        let storageServertime = localStorage.getItem('SERVERTIME')
        // console.log('storageServertime', storageServertime)
        if (storageServertime) {
            try {
                storageServertime = JSON.parse(storageServertime)
                servertimeDiff = {
                    server: new Date(Date.parse(storageServertime.serverTimeStr)),
                    local: new Date(Date.parse(storageServertime.localtimeStr))
                }
                if (fn) fn();
            } catch (e) {
                servertimeRequest(fn);
            }
        } else {
            servertimeRequest(fn);
        }
    };

    var isExist = function () {
        if (typeof servertimeDiff == "undefined" || !servertimeDiff.server) {
            return false;
        }
        return true;
    };

    var getDate = function () {
        var currentTime;
        if (isExist()) {
            currentTime = new Date(new Date().getTime() + (servertimeDiff.server - servertimeDiff.local)); //服务器时间
        } else {
            currentTime = new Date(_DATA.activity.server_time); //当前时间
        }
        return currentTime;
    };

    var getUnix = function () {
        return getDate().getTime();
    };
    


    return {
        servertimeRequest,
        getDate,
        getUnix,
        getServertime
    };
}();

export default utilityServertime;