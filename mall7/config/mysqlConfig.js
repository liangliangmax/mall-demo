let dbConfig = {};


dbConfig.host = process.env.dbHost ||'10.4.249.94';
dbConfig.user = process.env.dbUser ||'root';
dbConfig.password = process.env.dbPassword ||'root';
dbConfig.port = process.env.dbPort ||'3306';
dbConfig.database = process.env.dbDatabase ||'liang';

module.exports = dbConfig;