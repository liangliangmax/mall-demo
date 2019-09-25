let express = require('express');
let router = express.Router();


let mongoose = require('mongoose');
let Goods = require('../modules/goods');
let User = require('../modules/users');

mongoose.connect('mongodb://root:root@10.4.249.94:27017/liang-test');

mongoose.connection.on('connected',function () {
   console.log("mongodb 连接成功")
});

mongoose.connection.on('error',function () {
    console.log("mongodb 连接失败")
});

mongoose.connection.on('disconnected',function () {
    console.log("mongodb 连接失败")
});


router.get('/list', function(req, res, next) {


    let pageNum = req.param('pageNum');
    let pageSize = parseInt(req.param('pageSize'));
    let sort = req.param('sort');

    let skip = (pageNum-1)*pageSize;

    let param = {};
    let goodsModel = Goods.find(param).skip(skip).limit(pageSize);

    goodsModel.sort({'salePrice':sort});

    goodsModel.exec(function (err,doc) {

        if(err){
            console.log(err)
            res.json({
                status:"1",
                message:err.message
            });
        }else {

            res.json({
                status:'0',
                msg:'',
                result:{
                    count:doc.length,
                    list:doc
                }
            });
        }


    });
});

//添加购物车
router.post('/addCart',function (req,res,next) {
    let userId = req.cookies.userId;

    let productId = req.body.productId;

    let param = {
        userId:userId
    };
    User.findOne(param,function (err,userDoc) {
        if(err){
            console.log(err)
            res.json({
                status:1,
                msg:err.message
            });
        }else{

            if(userDoc){
                let goodsItem = '';

                //遍历购物车，如果有了，将数量加1即可
                userDoc.cartList.forEach(function (item) {
                    if(item.productId == productId){
                        goodsItem = item;

                        item.productNum ++;

                    }
                });

                //如果已经添加过了，则直接更新数量即可
                if(goodsItem){
                    userDoc.save(function (err2,doc) {
                        if(err2){
                            res.json({
                                status:1,
                                msg:err.message
                            });
                        }else {
                            res.json({
                                status:0,
                                msg:"",
                                result:"success"

                            });
                        }
                    });

                }else {
                    Goods.findOne({productId:productId},function (err,goodDoc) {
                        if(err){
                            res.json({
                                status:1,
                                msg:err.message
                            });
                        }else {
                            if(goodDoc){
                                goodDoc.productNum = 1;
                                goodDoc.checked = 1;

                                userDoc.cartList.push(goodDoc);

                                userDoc.save(function (err2,doc) {
                                    if(err2){
                                        res.json({
                                            status:1,
                                            msg:err.message
                                        });
                                    }else {
                                        res.json({
                                            status:0,
                                            msg:"",
                                            result:"success"

                                        });
                                    }
                                });
                            }

                        }
                    });
                }

            }

        }
    });



});


module.exports = router;












