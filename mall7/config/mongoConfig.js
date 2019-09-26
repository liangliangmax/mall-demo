let mongoConfig = {};

mongoConfig.host = process.env.mongo.host ||'10.4.249.94';
mongoConfig.user = process.env.mongo.user ||'root';
mongoConfig.password = process.env.mongo.password ||'root';
mongoConfig.port = process.env.mongo.port ||'27017';
mongoConfig.database = process.env.mongo.database ||'liang-test';

module.exports = mongoConfig;