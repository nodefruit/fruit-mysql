/* بسم الله الرحمن الرحيم */

module.exports = (function () {
  
  var mysql   = require('mysql')
    , config  = {};

 
  function DataManager () {
    
    this.type = 'mysql';
    
    this.connect = function (conf, callBack) {
      var connection = mysql.createConnection(config = conf);
      connection.connect();
      connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        connection.end();
        callBack(err);
      });
      return this;
    }
    
    this.config = function (conf) {
      config = conf;
      return this;
    }
    
  }
  
  return new DataManager;
  
}());