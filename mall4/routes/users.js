var express = require('express');
var router = express.Router();

let User = require('./../modules/users');

require('./../util/util');

/* GET users listing. */

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
      {
          $pull:{
                'cartList':{
                    'productId':productId
                }
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


router.post('/cart/edit',function (req,res,next) {
    let userId= req.cookies.userId;

    let productId = req.body.productId;

    let productNum = req.body.productNum;

    let checked = req.body.checked;

    User.update(
        {
            "userId":userId,
            "cartList.productId":productId
        },
        {
            "cartList.$.productNum":productNum,
            "cartList.$.checked":checked
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
                    msg:"",
                    result:''

                });
            }
        });

});


//选中全部
router.post('/cart/checkAll',function (req,res,next) {
    let userId= req.cookies.userId;
    let checkAll = req.body.checkAll;

    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
            res.json({
                status:1,
                msg:err.message,
                result:''

            });
        }else {
            if(userDoc){
                userDoc.cartList.forEach((item)=>{
                    item.checked = checkAll;
                });

                userDoc.save(function (err1,doc) {
                    if(err1){
                        res.json({
                            status:1,
                            msg:err1.message,
                            result:''

                        });
                    }else {
                        res.json({
                            status:0,
                            msg:'',
                            result:''

                        });
                    }
                });
            }
        }

    });
});


//获取用户地址列表
router.get('/address/list',function (req,res,next) {

    let userId = req.cookies.userId;
    
    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
            res.json({
                status:1,
                msg:err.message,
                result:''

            });
        }else{

            if(userDoc){
                res.json({
                    status:0,
                    msg:'',
                    result:userDoc.addressList

                });

            }else{
                res.json({
                    status:0,
                    msg:'',
                    result:''

                });
            }
        }
    });

});

//设置地址默认值
router.post('/address/setDefault',function (req,res,next) {
    let userId = req.cookies.userId;

    let addressId = req.body.addressId;
    
    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
            res.json({
                status:1,
                msg:err.message,
                result:''

            });
        }else {
            if(userDoc){
                let addressList = userDoc.addressList;
                addressList.forEach((item)=>{
                    if(item.addressId == addressId){
                        item.isDefault = true;
                    }else{
                        item.isDefault = false;
                    }
                });

                userDoc.save(function (err1,doc) {
                    if(err1){
                        res.json({
                            status:1,
                            msg:err1.message,
                            result:''

                        });
                    }else{
                        res.json({
                            status:0,
                            msg:'',
                            result:''

                        });
                    }
                });

            }

        }
    });


});

//删除地址
router.post('/address/del',function (req,res,next) {
    let userId = req.cookies.userId;

    let addressId = req.body.addressId;

    User.update(
        {userId:userId},
        {
            $pull:{
                'addressList':{
                    'addressId':addressId
                }
            }
        },
        function (err,doc) {
            if(err){
                res.json({
                    status:1,
                    msg:err.message,
                    result:''

                });
            }else{
                res.json({
                    status:1,
                    msg:'删除失败',
                    result:''

                });
            }
        }
    );
    
});


//生成订单
router.post('/payment',function (req,res,next) {

    let userId = req.cookies.userId;

    let orderTotal = req.body.orderTotal;
    let addressId = req.body.addressId;

    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
            res.json({
                status:1,
                msg:err.message,
                result:''

            });
        }else {
            if(userDoc){
                let address = '';
                let goodsList = [];

                //获取当前用户的地址
                userDoc.addressList.forEach((item)=>{
                    if(item.addressId == addressId){
                        address = item;
                    }

                });

                //获取用户购物车的购买商品
                userDoc.cartList.filter((item)=>{
                    if(item.checked == '1'){
                        goodsList.push(item);
                    }
                });


                //生成id
                let r1 = Math.floor(Math.random()*10);
                let r2 = Math.floor(Math.random()*10);

                let systemDate = new Date().Format('yyyyMMddhhmmss');
                let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

                let platform = 'xxx';
                let orderId = platform+r1+systemDate+r2;


                //创建订单
                let order = {
                    orderId:orderId,
                    orderTotal:orderTotal,
                    addressInfo:address,
                    goodsList:goodsList,
                    orderStatus:'1',
                    createDate:createDate

                };

                userDoc.orderList.push(order);

                userDoc.save(function (err1,doc) {
                    if(err1){
                        res.json({
                            status:1,
                            msg:err1.message,
                            result:''

                        });
                    }else {
                        res.json({
                            status:0,
                            msg:'',
                            result:{
                                orderId:order.orderId,
                                orderTotal:order.orderTotal
                            }

                        });
                    }
                });



            }

        }
    });


});

//根据订单id查询订单信息
router.get('/orderDetail',function (req,res,next) {

    let userId = req.cookies.userId;

    let orderId = req.param('orderId');

    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
            res.json({
                status:1,
                msg:err.message,
                result:''

            });
        }else {
            if(userDoc){
                let orderList = userDoc.orderList;
                let orderTotal = 0;
                let order = null;

                if(orderList.length==0){
                    res.json({
                        status:10002,
                        msg:'无此订单',
                        result:''

                    });
                }else {
                    orderList.forEach((item)=>{
                        if(item.orderId == orderId){
                            orderTotal = item.orderTotal;
                            order = item;
                        }
                    });

                    res.json({
                        status:0,
                        msg:'',
                        result:order

                    });

                }
            }
        }
    });
    
});

module.exports = router;










