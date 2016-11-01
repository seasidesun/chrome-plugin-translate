window.onload = function () {

    var dafaultUriOfBaidu = 'http://api.fanyi.baidu.com/api/trans/vip/translate?';
        dafaultUriOfBaidu += '&from=auto';
        dafaultUriOfBaidu += '&appid=20161028000030950';

    var dafaultUriOfYoudao = 'http://fanyi.youdao.com/openapi.do?';
        dafaultUriOfYoudao += '&keyfrom=chrome-plugin-v2';
        dafaultUriOfYoudao += '&key=1171028931';
        dafaultUriOfYoudao += '&type=data&doctype=json&version=1.1';
    var errMapOfYoudao = {
        0 : "正常",
        20: "要翻译的文本过长",
        30: "无法进行有效的翻译",
        40: "不支持的语言类型",
        50: "无效的key",
        60: "无词典结果，仅在获取词典结果生效",
    }

    var textEnBox = document.getElementById('text-en');
    var textZhBox = document.getElementById('text-zh');

    document.addEventListener('keydown', function (e) {
        if (e.keyCode != 13) return;
        e.preventDefault();

        var inputContent = '';
        inputContent = textEnBox.value;
        to = 'zh';

        if (!inputContent) return;
        callApi(inputContent, to, function (err, ret) {
            if (err) return;
            showResultWithYoudao(ret);
        });
    });

    function showResultWithYoudao(data) {
        if (!data) return;
        var outPut = "";

        switch (data.errorCode) {
            case 0:
                outPut = data.translation + '\n';
                if (data.basic && data.basic.explains) {
                    outPut += '------- \n'
                    data.basic.explains.map(function (item) {
                        outPut += item + '\n';
                    })
                }
                if (data.web) {
                    outPut += '------- \n'
                    data.web.map(function (item) {
                        outPut += item.key + ': ' + item.value[0] + '\n';
                    })
                }
                break;
            default:
                outPut = '错误: ' + errMapOfYoudao[data.errorCode];
        }
        textZhBox.value = outPut;
    }

    function callApi(q, to, cb) {
        //baidu-api-url
        // var salt = Date.now();
        // var url = dafaultUriOfBaidu + '&salt=' + salt;
        //     url += '&to=' + to;
        //     url += '&q=' + q;
        //     url += '&sign=' + createSign(q, salt);
        //     url += '&callback=retCallBackForbaidu';

        //youdao-api-url
        var url = dafaultUriOfYoudao + '&q=' + q;

        HttpGet(url, function (err, ret) {
            if (err) return cb(err);
            try {
                ret = JSON.parse(ret);
                cb(null, ret);
            } catch (e) {
                cb(e);
            }
        })
    }

    //http get
    function HttpGet(url, cb) {
        textZhBox.value = "loading...";
        var xmlHttp;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (!xmlHttp) return cb(true, null);

        xmlHttp.onreadystatechange = httpCallback;
        xmlHttp.open('get', url, true);
        xmlHttp.send();

        function httpCallback() {
            if (xmlHttp.readyState == 4) {
                //判断对象状态是否交互成功,如果成功则为200
                if(xmlHttp.status == 200) {
                    var response = xmlHttp.responseText;
                    return cb && cb(null, response);
                }
            }
        }
    }

    //jsonp callback
    window.retCallBackForbaidu = function (ret) {
        var to = ret && ret.to;
        var out = (ret && ret.trans_result && ret.trans_result[0].dst) || ""
        if (!out && !to) return;
        if (to === 'zh') textZhBox.value = out;
        else textEnBox.value = out;
    }

    //create baidu-sign with md5 for
    function createSign(q, salt) {
        return md5('20161028000030950' + q + salt + '3wxX5pgdI9PfP7Wqnvd0');
    }
}
