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
        , age   : 30
      },
      {
          name  : 'Othmane'
        , age   : 30
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

describe('Unsuccessful insertion due to inexisting table', function () {
  var error   = false
    , result  = null
    , table   = 'user_' + Math.random().toString(36).substring(7)
    , data    = {
        name  : 'khalid'
      , age   : 26
    };
  
  beforeEach(function (done) {
    adapter.insert(table, data, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });
  
  it('should not insert', function () {
    assert.equal(result, null);
    assert.equal(error, true);
  });
});

describe('Unsuccessful insertion due to incorrect data', function () {
  var error     = false
    , result    = null
    , data      = {
        myname  : 'khalid'
      , myage   : 26
    };
  
  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });
  
  it('should not insert', function () {
    assert.equal(result, null);
    assert.equal(error, true);
  });
});

describe('Successfully selecting data', function () {
  var error     = false
    , result    = null
    , condition = {
        name    : 'khalid'
      , age     : 26
    };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });
  
  it('should find a user with the same name and age', function () {
    assert.equal(result.length, 1);
    assert.equal(result[0].name, condition.name);
    assert.equal(result[0].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with limit', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, 2);
  });
  
  it('should find a user with the same name and age', function () {
    assert.equal(result.length, 2);
    assert.equal(result[0].age, condition.age);
    assert.equal(result[1].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with limit and offset', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, 1, 1);
  });
  
  it('should find a user with the same name and age', function () {
    assert.equal(result.length, 1);
    assert.equal(result[0].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting one record', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.findOne(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });
  
  it('should find a user with the same name and age', function () {
    assert.equal(result.age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting all data', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.findAll(tableName, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });
  
  it('should find a user with the same name and age', function () {
    assert.equal(result.length, 5);
    assert.equal(error, null);
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
