const { appid, appSecret, grantType } = require("../utils/params");
const axios = require("axios");
const WXBizDataCrypt = require("../utils/WXBizDataCrypt");
module.exports = (app, con) => {
  app.get("/apis/user", (req, res) => {
    var sql = `select * from wx_user where openid = '${req.query.openid}'`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500);
        res.json({
          code: 500,
          msg: "获取失败",
          data: err
        });
      } else {
        res.status(200);
        res.json({
          code: 0,
          msg: "获取成功",
          data: result
        });
      }
    });
  });
  app.post("/apis/user", (req, res) => {
    var url =
      "https://api.weixin.qq.com/sns/jscode2session?appid=" +
      appid +
      "&secret=" +
      appSecret +
      "&js_code=" +
      req.body.code +
      "&grant_type=" +
      grantType;
    axios.get(url).then(response => {
      res.json(new WXBizDataCrypt(appid, response.data.session_key).decryptData(
        req.body.encryptedData,
        req.body.iv
      ));
    });
    // var sql = `insert into wx_user(openid, nickname, avatarurl, gender, country, province, city, language, unionid, ctime) values ('${req.query.openid}','${req.query.nickname}','${req.query.avatarurl}',${req.query.gender},'${req.query.country}','${req.query.province}','${req.query.city}','${req.query.language}','${req.query.unionid}',${req.query.ctime})`;
    // con.query(sql, (err, result) => {
    //     if (err) {
    //         res.status(500)
    //         res.json({
    //             code: 500,
    //             msg: "新建失败",
    //             data: err
    //         })
    //     } else {
    //         res.status(200)
    //         res.json({
    //             code: 0,
    //             msg: "新建成功",
    //             data: result
    //         })
    //     }
    // });
  });
  app.put("/apis/user", (req, res) => {
    var sql = `update wx_user 
        set 
            openid='${req.query.openid}',
            nickname='${req.query.nickname}',
            avatarurl='${req.query.avatarurl}',
            gender=${req.query.gender},
            country='${req.query.country}',
            province='${req.query.province}',
            city='${req.query.city}',
            language='${req.query.language}',
            unionid='${req.query.unionid}',
            ctime=${req.query.ctime} 
        where
            openid = '${req.query.openid}'`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500);
        res.json({
          code: 500,
          msg: "更新失败",
          data: err
        });
      } else {
        res.status(200);
        res.json({
          code: 0,
          msg: "更新成功",
          data: result
        });
      }
    });
  });
  app.delete("/apis/user", (req, res) => {
    var sql = `delete from wx_user where openid = '${req.query.openid}'`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(500);
        res.json({
          code: 500,
          msg: "删除失败",
          data: err
        });
      } else {
        res.status(200);
        res.json({
          code: 0,
          msg: "删除成功",
          data: result
        });
      }
    });
  });
};
