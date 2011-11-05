/**
 * @fileoverview Perform db action, using MongoDB.
 * @author yo_waka
 */
var mongo = require('mongodb');

/**
 * DB schema - dbname is "naivebayes"
 * wordCount    : {_id: 1, "category": "Cat1", "word": "foo", "count": 10},
 *                {_id: 2: "category": "Cat2", word": "bar", "count": 100}
 * categoryCount: {_id: 1, "Cat1": 100, {_id: 2, "Cat2": 1000}
 *
 * Input        : fn("hoge fuga fuga fuga", "foo")
 * categories   : {_id: 1, "name": "foo", "count": 1}
 * words        : {_id: 1, "category": 1, "words": {"hoge": 1, "fuga": 3}}
 * vocabularies : {_id: 1, "words": ["hoge", "fuga"]}
 */

/**
 * @namespace
 */
module.exports = DB = function(dbName, opt_host, opt_port) {
    this.db_ = new mongo.Db(
        dbName,
        new mongo.Server(
            opt_host || DB.Config.host,
            opt_port || DB.Config.port,
            {}
        ),
        {}
    );
};

/**
 * @enum {*}
 */
DB.Config = {
    host: 'localhost',
    port: mongo.Connection.DEFAULT_PORT
};

/**
 * @type {mongodb.Db}
 * @private
 */
DB.prototype.db_ = null;

/**
 * @return {mongodb.Db}
 */
DB.prototype.get = function() {
    return this.db_;
};

/**
 * @param {Database} client
 * @param {string} collectionName
 * @return {mongodb.Collection}
 */
DB.prototype.getCollection = function(client, collectionName) {
    return new mongo.Collection(client, collectionName);
};
