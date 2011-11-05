/**
 * @fileoverview Training data for naive-bayes classifier.
 */
var Morphological = require('./morphological');
var DB = require('./db');

/**
 * Module export
 */
module.exports = Train = {};

/**
 * @param {string} doc
 * @param {string} category
 */
Train.train = function(doc, category) {
    var words = Morphological.getWords(doc);

    var db = new DB('naivebayes');
    db.get().open(function(err, client) {
        var docsCollection = db.getCollection(client, 'docs');
        docsCollection.findOne(function(err, doc) {
            if (!doc) {
                doc = {count: 1, vocabularies: []};
            } else {
                doc.count++;
            }

            // category and words count up
            var categoriesCollection = db.getCollection(client, 'categories');
            categoriesCollection.findOne({category: category}, function(err, cDoc) {
                if (!cDoc) {
                    cDoc = {name: category, count: 1, words: {}};
                } else {
                    cDoc.count += 1;
                }
                for (var i = 0, len = words.length; i < len; i++) {
                    var word = words[i];
                    if (cDoc.words[word]) {
                        cDoc.words[word] += 1;
                    } else {
                        cDoc.words[word] = 1;
                    }
                    if (0 > doc.vocabularies.indexOf(word)) {
                        doc.vocabularies.push(word);
                    }
                }
                categoriesCollection.save(cDoc, function(err) {
                    // upsert docs
                    docsCollection.save(doc, function(err) {
                        client.close();
                    });
                });
            });
        });
    });
};
