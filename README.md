node-naivebayes-simple
==========

This is simple imaplementation of Naive Bayes algorythm for Node.


Requirements
===========

- MongoDB http://www.mongodb.org/
- node-mongodb-native https://github.com/christkv/node-mongodb-native
- mecab-binding https://github.com/hakobera/node-mecab-binding


How to install
===========

    git clone git://github.com/waka/node-naivebayes-simple
    cd node-naivebayes-simple
    npm install -g
    npm link


Usage
==========

Training document and category.

    var Train = require('naivebayes-simple').Train;
    Train.train('学習させるテキストだよ。', 'テストカテゴリ');

Classify document, and get document's category.

    var Classifier = require('naivebayes-simple').Classifier;
    Classifier.on('classified', function(arg) {
        var category = arg[0];
        var originalDoc = arg[1];
        console.log(originalDoc + ' => category: ' + category);
    });
    Classifier.classify('分類するテキストだよ。');
