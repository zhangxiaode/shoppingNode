const { appid, appSecret, grantType } = require("../utils/params");
const axios = require("axios");
const WXBizDataCrypt = require("../utils/WXBizDataCrypt");
module.exports = (app, con) => {
  app.get("/apis/user", (req, res) => {
    var sql = `select * from wx_user where openid = '${req.body.openid}'`;
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
    var url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appSecret}&js_code=${req.body.code}&grant_type=${grantType}`;
    axios.get(url).then(response => {
      var userInfo = new WXBizDataCrypt(appid, response.data.session_key).decryptData(
        req.body.encryptedData,
        req.body.iv
      );
      var sql = `insert into wx_user(openid, nickname, avatarurl, gender, country, province, city, language, unionid) values ('${userInfo.openid}','${req.body.phone}','${userInfo.nickname}','${userInfo.avatarurl}',${userInfo.gender},'${userInfo.country}','${userInfo.province}','${userInfo.city}','${userInfo.language}','${userInfo.unionid}'})`;
      con.query(sql, (err, result) => {
        if (err) {
          res.status(500)
          res.json({
            code: 500,
            msg: "新建失败",
            data: err
          })
        } else {
          res.status(200)
          res.json({
            code: 0,
            msg: "新建成功",
            data: result
          })
        }
      });
    });
  });
  app.put("/apis/user", (req, res) => {
    var sql = `update wx_user 
        set 
            openid='${req.body.openid}',
            nickname='${req.body.nickname}',
            avatarurl='${req.body.avatarurl}',
            gender=${req.body.gender},
            country='${req.body.country}',
            province='${req.body.province}',
            city='${req.body.city}',
            language='${req.body.language}',
            unionid='${req.body.unionid}',
            ctime=${req.body.ctime} 
        where
            openid = '${req.body.openid}'`;
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
    var sql = `delete from wx_user where openid = '${req.body.openid}'`;
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
