let express = require('express');

let app = express();

app.use('*', function(req, res, next) {
    console.log('跨域拦截');

    res.header('Access-Control-Allow-Origin', req.headers.origin);//注意这里不能使用 *
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header("X-Powered-By",' 3.2.1');
    res.header('Access-Control-Allow-Credentials', true); // 允许服务器端发送Cookie数据
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
    if (req.method == 'OPTIONS') {
        res.sendStatus(200); // 在正常的请求之前，会发送一个验证，是否可以请求。
    }
    else {

        next();
    }

});


module.exports = app;