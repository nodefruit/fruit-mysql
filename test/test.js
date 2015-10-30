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


describe ('Creating a table for test', function () {
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