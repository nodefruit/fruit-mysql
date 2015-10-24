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

    function generateInsertQueries (tableName, data) {
      var sqlQuery  = sql.Query()
        , sqlInsert = sqlQuery.insert();
      return data.reduce(function (queries, values, index) {
        queries.push(sqlInsert.into(tableName).set(values).build());
        queries.push("SELECT @ids := CONCAT(CONCAT(@ids, ','), LAST_INSERT_ID()) FROM " + tableName + " LIMIT 1")
        if (index + 1 == data.length ) {
          queries.push("SELECT @ids AS ids FROM " + tableName + " LIMIT 1");
        }
        return queries;
      }, ["SET @ids = ''"]).join(';\n');
    }
    
    this.insert = function (tableName, data, callBack, returnIds) {
      var isOneId = !(Array.isArray(data) && returnIds)
        , query   = ( isOneId ? generateInsertQuery : generateInsertQueries)(tableName, data);
      exec(query, function (err, results) {
        if(!err) results = (isOneId ? results: results.pop().pop().ids.split(',').slice(1).map(Number));
        callBack(err, err ? undefined : {
            result : {
                success       : true
              , affectedCount : isOneId ? results.affectedRows : results.length
              , count         : isOneId ? results.affectedRows : results.length
            }
          , insertedId : isOneId ? [results.insertId] : results
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
    
    function update (one, tableName, data, condition, callBack) {
      var sqlQuery  = sql.Query()
        , sqlUpdate = sqlQuery.update()
        , query     = sqlUpdate.into(tableName).set(data).where(condition).build() + (one ? ' LIMIT 1 ' : '');
      
      exec(query, function (err, results) {
        callBack(err, err ? undefined : {
          results : {
              success       : true
            , count         : results.affectedRows
            , affectedCount : results.changedRows
          }
        })
      });
    }
    
    this.update = function (tableName, data, condition, callBack) {
      update (true, tableName, data, condition, callBack);
    }
    
    this.updateAll = function (tableName, data, condition, callBack) {
      update (false, tableName, data, condition, callBack);
    }
    
  }
  
  return new DataManager;
  
}());