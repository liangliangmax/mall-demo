let mongoose = require('mongoose');

let mongoConfig = require('../config/mongoConfig');

const uri = 'mongodb://'+mongoConfig.user+':'+mongoConfig.password+'@'+mongoConfig.host+':'+mongoConfig.port+'/'+mongoConfig.database;
console.log("连接url是："+uri)

mongoose.connect(uri);

mongoose.connection.on('connected',function () {
    console.log("mongodb 连接成功")
});

mongoose.connection.on('error',function () {
    console.log("mongodb 连接失败")
});

mongoose.connection.on('disconnected',function () {
    console.log("mongodb 连接失败")
});