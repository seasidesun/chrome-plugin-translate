window.onload = function () {
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

    var textFrBox = document.getElementById('text-from');
    var textToBox = document.getElementById('text-to');

    document.addEventListener('keydown', function (e) {
        if (e.keyCode != 13) return;
        e.preventDefault();

        var inputContent = textFrBox.value;
        if (!inputContent) return;

        callApi(inputContent, function (err, ret) {
            if (err) return;

            showResultWithYoudao(ret);
        });

        autoSetBoxHeight(textFrBox);
    });

    function showResultWithYoudao(data) {
        if (!data) return;

        var outPut = "";
        switch (data.errorCode) {
            case 0:
                outPut = data.translation + '\n';
                if (data.basic && data.basic.phonetic) {
                    outPut += '------- \n';
                    outPut += '英[' + data.basic.phonetic + ']';

                    if (data.basic['us-phonetic']) {
                        outPut += '   ';
                        outPut += '美[' + data.basic['us-phonetic'] + ']';
                    }
                    outPut += '\n';
                }
                if (data.basic && data.basic.explains) {
                    outPut += '------- \n';
                    data.basic.explains.map(function (item) {
                        outPut += item + '\n';
                    })
                }
                if (data.web) {
                    outPut += '------- \n';
                    data.web.map(function (item) {
                        outPut += item.key + ': ' + item.value[0] + '\n';
                    })
                }
                break;
            default:
                outPut = '错误: ' + errMapOfYoudao[data.errorCode];
        }

        textToBox.value = outPut;
        autoSetBoxHeight(textToBox);
    }

    function callApi(q, cb) {
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

    function HttpGet(url, cb) {
        textToBox.value = 'loading...';
        var xmlHttp;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
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

    function autoSetBoxHeight (box) {
        box.style = '';

        var clientHeight = box.clientHeight,
            scrollHeight = box.scrollHeight,
            scrollTop    = box.scrollTop;

        if (clientHeight >= scrollHeight) return;

        box.style.height = scrollHeight + 'px';
    }
}
