let dbUtil = require('../util/dbUtil');

let db = new dbUtil();

db.operate("select * from user",[],function(result){
    console.log(result)
});