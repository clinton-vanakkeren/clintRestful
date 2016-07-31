var knex = require('knex')({
    client: 'pg',
    connection: {
        host     : '127.0.0.1',
        database : 'clintrestfuldb',
        user:'postgres',
        password:'clinton417'
  }
});

var Bookshelf = require('bookshelf')(knex);
var Bear = Bookshelf.Model.extend({
  tableName:'bears'
});

var Bears = Bookshelf.Collection.extend({
  model: Bear
});

module.exports = {Bear:Bear,Bears:Bears};
