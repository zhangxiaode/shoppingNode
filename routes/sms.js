const Core = require('@alicloud/pop-core');
module.exports = (app, con) => {
    app.post("/apis/postSms", (req, res, next) => {
        //随机产生六位数验证码
        var range = function (start, end) {
            var array = [];
            for (var i = start; i < end; ++i) array.push(i);
            return array;
        };
        var randomstr = range(0, 6).map(function (x) {
            return Math.floor(Math.random() * 10);
        }).join('');
        //获取前台的输入的手机号码
        var client = new Core({
            accessKeyId: 'LTAIVlTRMWjCgsrY',
            accessKeySecret: 'muVe1NcLXdRYW8D7UjllYVKu3o32X5',
            endpoint: 'https://dysmsapi.aliyuncs.com',
            apiVersion: '2017-05-25'
        });
        var params = {
            "RegionId": "cn-hangzhou",
            "SignName": "zxdkxl",
            "TemplateCode": "SMS_163055673",
            "PhoneNumbers": req.body.phone
        }
        var requestOption = {
            method: 'POST'
        };
        client.request('SendSms', params, requestOption).then((result) => {
            res.json({
                code: 200,
                msg: "发送短信成功",
                data: result
            });
        }, (ex) => {
            res.json({
                code: 500,
                msg: "发送短信失败",
                data: ex
            });
        })
    });
};
