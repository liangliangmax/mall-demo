let express= require('express');
let app = express();


let indexRouter = require('../controller/index');
let usersRouter = require('../controller/users');
let goodsRouter = require('../controller/goods');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);


module.exports = app;
