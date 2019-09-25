var express = require('express');
var router = express.Router();

let User = require('./../modules/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录
router.post('/login',function (req,res,next) {
  let param = {
    userName : req.body.userName,
    userPwd : req.body.userPwd
  }

  User.findOne(param,function (err,userDoc) {
    if(err){
      res.json({
        status:1,
        msg:err.message
      });
    }else{

      if(userDoc){
        res.cookie('userId',userDoc.userId,{
          path:'/',
          maxAge : 1000*60*60
        });

        res.cookie('userName',userDoc.userName,{
          path:'/',
          maxAge : 1000*60*60
        });

        //req.session.user = userDoc;

        res.json({
          status: 0,
          msg:'',
          result:{
            userName:userDoc.userName
          }
        });

      }else {
        res.json({
          status:1,
          msg:"用户名或密码错误"
        });
      }

    }

  });


});

//退出
router.post('/logout',function (req,res,next) {
  res.cookie('userId','',{
    path:'/',
    maxAge:-1
  });

  res.json({
    status:0,
    msg:''
  });

});


router.get('/checkLogin',function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:0,
      msg:'',
      result:req.cookies.userName
    });
  }else {
    res.json({
      status:1,
      msg:'未登录',
      result:''
    });
  }

});


//查询当前用户的购物车
router.get('/cart/list',function (req,res,next) {

  let userId = req.cookies.userId;

  let param = {
    userId:userId
  };
  
  User.findOne(param,function (err,userDoc) {
    if(err){
      res.json({
        status:1,
        msg:"用户名或密码错误",
        result:''

      });
    }else{
      if(userDoc){
        res.json({
          status:0,
          msg:'查找成功',
          result:userDoc.cartList
        });
      }
    }
  });

});

//删除购物车
router.post('/cart/del',function (req,res,next) {
  let userId = req.cookies.userId;

  let productId = req.body.productId;

  User.update(
      {userId:userId},
      {$pull:
            {'cartList':
                  {'productId':productId}
            }
      },
      function (err,doc) {
        if(err){
          res.json({
            status:1,
            msg:err.message,
            result:''

          });
        }else {
          res.json({
            status:0,
            msg:'删除成功',
            result:''

          });
        }
      }
      
  );


});


module.exports = router;
