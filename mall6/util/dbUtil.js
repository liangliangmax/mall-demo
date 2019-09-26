const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');

class db{
    _connection() {
        let connection = mysql.createConnection({
            host     : dbConfig.host,
            user     : dbConfig.user,
            password : dbConfig.password,
            port: dbConfig.port,
            database: dbConfig.database,
        });
        //数据库连接
        connection.connect(function(err){
            if(err){
                console.log("err",err);
                return;
            }
        });
        console.log("连接成功")
        return connection;
    }

    //关闭数据库
    _close(connection){
        //关闭连接
        connection.end(function(err){
            if(err){
                return;
            }else{
                console.log('关闭连接');
            }
        });
    }

    operate(sql,param,callback) {

        let connection = this._connection();

        connection.query(sql,param,function(err,data){
            if(err){
                throw err;
            } else {
                callback(data)
            }
        });

        this._close(connection);
    }


}



module.exports = db;