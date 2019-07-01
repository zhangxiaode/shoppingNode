var sql = require('mysql');
var con = sql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '05cqwsbsy27',
    database: 'shopping'
});
con.connect();
module.exports = (app) => {
    require('./user')(app, con)
    require('./code')(app, con)
    require('./sms')(app, con)
    require('./socket')(app, con)
    // 配置错误处理中间件
    // app.use(function (err, req, res, next) {
    //     res.status(500).send(err.message)
    // })
}