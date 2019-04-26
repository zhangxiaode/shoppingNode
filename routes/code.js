var captchapng = require('captchapng');
module.exports = (app, con) => {
    app.get("/apis/getCode", (req, res) => {
        if(req.body.type) {

        }
        var code = '0123456789';
        var length = 4;
        var randomcode = '';
        for (var i = 0; i < length; i++) {
            randomcode += code[parseInt(Math.random() * 1000) % code.length];
        }
        // 保存到session
        if (null == req.session.randomcode) {
            req.session.randomcode = {};
        }
        req.session.randomcode = randomcode;
        // 输出图片
        var p = new captchapng(80, 30, parseInt(randomcode)); // width,height,numeric captcha
        p.color(255, 255, 255, 255); // First color: background (red, green, blue, alpha)
        p.color(255, 80, 80, 255); // Second color: paint (red, green, blue, alpha)
        var img = p.getBase64();
        var imgbase64 = "data:image/png;base64," + img;
        res.json({
            code: 0,
            msg: "获取成功",
            data: {
                img: imgbase64
            }
        });
    });
};
