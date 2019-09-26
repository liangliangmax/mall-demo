var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//登录拦截
app.use(function (req,res,next) {

  let urls = ['/users/login','/users/logout','/goods/list'];

  if(req.cookies.userId){
    next();
  }else{
    if(urls.indexOf(req.path) >-1){
      next();
    }else {
      res.json({
        status:10001,
        msg:'当前未登录',
        result:''
      });
    }
  }

});

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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

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
