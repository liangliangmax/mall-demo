let express = require('express');

let goods = require('../mock/goodsData');

let router = express.Router();

router.get('/list',function (req,res,next) {

    res.json(goods);
});

module.exports = router;