let mongoConfig = {};

mongoConfig.host = process.env.mongoHost ||'10.4.249.94';
mongoConfig.user = process.env.mongouUser ||'root';
mongoConfig.password = process.env.mongoPassword ||'root';
mongoConfig.port = process.env.mongoPort ||'27017';
mongoConfig.database = process.env.mongoDatabase ||'liang-test';

module.exports = mongoConfig;