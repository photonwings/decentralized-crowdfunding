var mysql = require("mysql2");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "V@ibHav2000",
  database: "Fundbits",
});

module.exports = db;
