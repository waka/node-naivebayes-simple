/**
 * @fileoverview Naive-bayes classifier.
 */
var sys = require('sys');
var events = require('events');
var Morphological = require('./morphological');
var DB = require('./db');

/**
 * @constructor
 */
var Classifier = function() {
    events.EventEmitter.call(this);
    this.vocabularies_ = [];
};
sys.inherits(Classifier, events.EventEmitter);

/**
 * @type {number}
 * @private
 */
Classifier.prototype.allDocCount_ = 0;

/**
 * @type {Array}
 * @private
 */
Classifier.prototype.vocabularies_ = null;

/**
 * category の生起確率 P(category) = 訓練データとしてカテゴリが与えられた件数 / 総文書数
 * @param {number} categoryCount
 * @return {number}
 */
Classifier.prototype.priorProb = function(categoryCount) {
    return categoryCount / this.allDocCount_;
};

/**
 * @param {string} word
 * @param {Object} categoryWords
 * @return {number}
 */
Classifier.prototype.getCountInCategory = function(word, categoryWords) {
    if (word in categoryWords) {
        return categoryWords[word];
    }
    return 0;
};

/**
 * cat に word が含まれる条件付き確率 P(word|cat) = カテゴリの中に単語が現れた回数とカテゴリに出現した単語の総数
 * @param {string} word
 * @param {Object} categoryWords
 * @param {number} allWordCount
 * @return {number}
 */
Classifier.prototype.wordProb = function(word, categoryWords, allWordCount) {
    var wordCountInCategory = this.getCountInCategory(word, categoryWords);
    // ラプラススムージング（ゼロ頻度問題のために1を足す）
    return (wordCountInCategory + 1.0) / (allWordCount + this.vocabularies_.length);
};

/**
 * @param {Array.<string>} words
 * @param {number} categoryCount
 * @param {Object} categoryWords
 * @return {number}
 */
Classifier.prototype.getScore = function(words, categoryCount, categoryWords) {
    var allWordCount = 0;
    for (var word in categoryWords) {
        allWordCount += categoryWords[word];
    }

    var score = Math.log(this.priorProb(categoryCount));
    words.forEach(function(word) {
        score += Math.log(this.wordProb(word, categoryWords, allWordCount));
    }, this);
    return score;
};

/**
 * @param {string} doc
 * @return {string=}
 */
Classifier.prototype.classify = function(doc) {
    var bestCategory = null;
    var max = -Number.MAX_VALUE;
    var words = Morphological.getWords(doc);

    var self = this;
    var db = new DB('naivebayes');
    db.get().open(function(err, client) {
        var docCollection = db.getCollection(client, "docs");
        docCollection.findOne(function(err, docs) {
            self.allDocCount_ = docs.count;
            self.vocabularies_ = docs.vocabularies;

            categoriesCollection = db.getCollection(client, 'categories');
            var cursor = categoriesCollection.find();
            cursor.each(function(err, category) {
                if (!category) {
                    self.emit('classified', [bestCategory, doc]);
                    client.close();
                } else {
                    var score = self.getScore(words, category.count, category.words);
                    if (score > max) {
                        max = score;
                        bestCategory = category.name;
                    }
                }
            });
        });
    });
};


/**
 * Module export
 */
module.exports = new Classifier();
