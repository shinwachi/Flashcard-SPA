// FlashCardStackModel.js
// Shin Wachi 2013
// MIT License (http://opensource.org/licenses/MIT)

var app = app || {}

app.FlashCardStack = Backbone.Model.extend({
    defaults:{
        wordsDef:[], // words and definitions
        stackIndices:[], // represents word location in a stack of cards (can be shuffled)
        currentIndex:0
    },

    addWord:function(wordDef){
        // add the word at the end of the word list
        this.get('wordsDef').push(wordDef);

        // assign maximum+1 index to new word in stackIndex
        var m = _.max(this.get('wordsDef'));
        var n = 0;
        if (m != _.max([])){
            n = m+1;
        }
        this.get('stackIndices').push(n);
    },

    addWords:function(wordCollection){
        _.each(wordCollection, function(x){
           this.addWord(x);
        });
    },

    renumber:function(){
//        _.range(0, this.get('wordsDef').length, 1);


    },

    shuffle:function(){
        shuffleEntryArray(this.get('stackIndices'));
    }


});