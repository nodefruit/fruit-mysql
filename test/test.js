var assert    = require('assert')
  , adapter   = require('..')
  , config    = require('./testEnv')
  , tableName = 'table_' + Math.random().toString(36).substring(7); // in case the database has some tables

describe('Connexion to the database', function () {
  var success = false;
  
  beforeEach(function (done) {
    adapter.connect(config, function (err) {
      success = !err;
      done();
    });
  });
  
  it('should get connected', function () {
    assert.equal(success, true);
  });
})

describe('Creating a table for test', function () {
  var success = false;
  
  beforeEach(function (done) {
    var mysql       = require('mysql')
      , connection  = mysql.createConnection(config)
      , query       = 'CREATE table IF NOT EXISTS `' + tableName + '`'
          + '(`id` int(11) NOT NULL AUTO_INCREMENT, `name` varchar(50), `age` int(11), PRIMARY KEY (`id`) );'
    connection.connect();
    connection.query(query, function(err) {
      success = !err;
      done();
    });
  });
  
  it('should create the table successfully', function () {
    assert.equal(success, true);
  });
});

describe('Successfully inserting a recored', function () {
  var results = {}
    , error   = null
    , data    = {
        name  : 'khalid'
      , age   : 26
    }
  
  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    });
  });
  
  it('it should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 1);
    assert.equal(results.result.count, 1);
    assert.equal(results.insertedId.length, 1);
  });
});

describe('Successfully inserting many records', function () {
  var results = {}
    , error   = null
    , data    = [
      {
          name  : 'Ahmed'
        , age   : 40
      },
      {
          name  : 'Abdullah'
        , age   : 30
      }
    ];
  
  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    });
  });
  
  it('it should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 2);
    assert.equal(results.result.count, 2);
  });
});

describe('Successfully inserting many records with ids returned (mysql only)', function () {
  var results = {}
    , error   = null
    , data    = [
      {
          name  : 'Omar'
        , age   : 31
      },
      {
          name  : 'Othmane'
        , age   : 32
      }
    ];
  
  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    }, true);
  });
  
  it('it should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 2);
    assert.equal(results.result.count, 2);
    assert.equal(results.insertedId.length, 2);
  });
});

describe('Dropping the table', function () {
  var success = false;
  
  beforeEach(function (done) {
    var mysql       = require('mysql')
      , connection  = mysql.createConnection(config)
      , query       = 'DROP TABLE `' + tableName + '`';
    
    connection.connect();
    connection.query(query, function(err) {
      success = !err;
      done();
    });
  });
  
  it('should drop the table successfully', function () {
    assert.equal(success, true);
  });
});
