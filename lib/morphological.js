/**
 * @fileoverview Split bug-of-words
 * @author yo_waka
 */
var MeCab = require('mecab-binding');

/**
 * @namespace
 */
module.exports = Morphological = {};

/**
 * @param {string} sentence
 * @return {Array.<string>}
 */
Morphological.split = function(sentence) {
    var segments = [];
    var m = new MeCab.Tagger('');
    var nodes = m.parse(sentence).split('\n');
    nodes.forEach(function(node) {
        node = node.split(',')[0].split('\t');
        if (node.length > 1) {
            switch (node[1]) {
                case '助詞':
                case '助動詞':
                case '記号':
                    break;
                default:
                    segments.push(node[0]);
                    break;
            }
        }
    });
    return segments;
};

/**
 * @param {string} doc
 * @return {Array.<string>}
 */
Morphological.getWords = function(doc) {
    var words = Morphological.split(doc);
    return words;
};
