let dbConfig = {};


dbConfig.host = process.env.mongo.host ||'10.4.249.94';
dbConfig.user = process.env.mongo.user ||'root';
dbConfig.password = process.env.mongo.password ||'root';
dbConfig.port = process.env.mongo.port ||'3306';
dbConfig.database = process.env.mongo.database ||'liang';

module.exports = dbConfig;