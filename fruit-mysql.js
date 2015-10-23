/* بسم الله الرحمن الرحيم */

module.exports = (function () {
  
  var mysql   = require('mysql')
    , sql     = require('sql-query')
    , config  = {};

  function exec (query, callBack) {
    var connection = mysql.createConnection(config);
    connection.connect();
    connection.query(query, function(err, rows, fields) {
      connection.end();
      callBack(err, rows, fields);
    });
  }
  
  function generateInsertQuery (tableName, data) {
    var sqlQuery  = sql.Query()
      , sqlInsert = sqlQuery.insert()
    if(Array.isArray(data)) {
      var values = data.slice(0);
      return values.reduce(function (query, record) {
        return query + ' , ' + sqlInsert.into(tableName).set(record).build().split('VALUES').pop();
      }, sqlInsert.into(tableName).set(values.shift()).build())
    } else {
      return sqlInsert.into(tableName).set(data).build();
    }
  }
  
  function DataManager () {
    
    this.type = 'mysql';
    
    this.connect = function (conf, callBack) {
      var config = conf;
      exec('SELECT 1 + 1 AS solution', function (err) {
        callBack(err);
      })
      return this;
    }
    
    this.config = function (conf) {
      config = conf;
      return this;
    }
    
    this.insert = function (tableName, data, callBack) {
      var query = generateInsertQuery(tableName, data);
      exec(query, function (err, results) {
        callBack(err, err ? undefined : {
            result : {
                success       : true
              , affectedCount : results.affectedRows
              , count         : results.affectedRows
            }
          , insertedId : [ results.insertId]
        })
      });
    }
    
    this.findAll = function (tableName, callBack) {
      this.find(tableName, {}, callBack);
    }
    
    this.find = function (tableName, condition, callBack) {
      var sqlQuery  = sql.Query()
        , sqlSelect = sqlQuery.select()
        ,  query    = sqlSelect.from(tableName).select().where(condition).build();
      
      exec(query, function (err, results) {
        callBack(err, results)
      });
    }    
    
    this.findOne = function (tableName, condition, callBack) {
      var sqlQuery  = sql.Query()
        , sqlSelect = sqlQuery.select()
        ,  query    = sqlSelect.from(tableName).select().where(condition).limit(1).build();
      
      exec(query, function (err, results) {
        callBack(err, results.shift())
      });
    }    
    
  }
  
  return new DataManager;
  
}());