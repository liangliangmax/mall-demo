let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//加载mongoose的初始化工具类
require('./util/mongoUtil');


let router = require('./routes/router');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('*', function(req, res, next) {

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

//总路由入口
app.use('/',router);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
