// keeps track of user interaction with words, including visits and recalls
function User() {
	this.username = null,
	this.vocab = []
} // end User()

User.prototype = {
	constructor: User,
	// looks for a word in user vocabulary
	vocabIndexOf:function (word){
		for(var i=0, len = this.vocab.length; i < len ; i++) {
			if (this.vocab[i].word === word) return i;
		}
		return -1; // not found
	},

	getVisitedCount:function(){
		return this.vocab.length;
	},

	getKnownUnknownCount:function(){
		var known = 0;
		var unknown = 0;
        var important = 0;
		for(var i=0, len = this.vocab.length; i < len ; i++) {
			var v = this.knowsIdx(i);
			if(v == true){
				known++;
			}else if(v == false){
				unknown++;
			}
            if(this.isImportantWordIdx(i) == true){
                important++;
            }
		};
		return {"known":known, "unknown":unknown, "important":important};
	},

	checkAndAddToUserVocab:function (_word){
		var foundIdx = this.vocabIndexOf(_word);
		//console.log(foundIdx);
		if (foundIdx == -1){
			//console.log("adding");
			this.vocab.push({word:_word, visit:[], important:null});
			//console.log(this.vocab);
			return this.vocabIndexOf(_word);
		}
		// //console.log("finished check");
		return foundIdx;
	},

	addVisitToUserVocab:function (_wordIdx){
		var _timestamp = new Date().getTime();
		this.vocab[_wordIdx].visit.push({time:_timestamp, recall:null})
	},

	observeWord:function (word){
		var userWordIdx = this.checkAndAddToUserVocab(word);
		// //console.log(userWordIdx);
		this.addVisitToUserVocab(userWordIdx);
		//console.log(this.vocab);
	},

	markDontKnow:function (){
		//console.log('marking dontknow');
		var word = getCurrentEntry().word
		var foundIdx = this.vocabIndexOf(word);
		// //console.log(foundIdx);
		this.vocab[foundIdx].visit.slice(-1)[0].recall = false;
		//console.log("markDontKnow: " + this.vocab[foundIdx].visit.slice(-1)[0].recall);
		//showDef();
	},

	unmarkDontKnow:function(){
		//console.log('un-marking dontknow');
		var word = jsonData[currentEntryIdx].word
		var foundIdx = this.vocabIndexOf(word);
		// //console.log(foundIdx);
		this.vocab[foundIdx].visit.slice(-1)[0].recall = true;
		//console.log("unmark dontknow: " + this.vocab[foundIdx].visit.slice(-1)[0].recall);
	},


	visitCount:function(word){
		var foundIdx = this.vocabIndexOf(word);
		return this.vocab[foundIdx].visit.length;
	},

	knowsWord:function(word){
		//console.log("word is: "+word);
		var foundIdx = this.vocabIndexOf(word);
		return this.knowsIdx(foundIdx);
	},

	knowsIdx:function(foundIdx){
		for(var i = this.vocab[foundIdx].visit.length-1; i >= 0; i--){
			if (this.vocab[foundIdx].visit[i].recall == null){
				//console.log("pass");
			}else{
				return this.vocab[foundIdx].visit[i].recall;
			}
		}
		return null; 
	},

    isImportantWordIdx:function(foundIdx){
//        console.log("isImportantWordIdx: " + foundIdx);
        if(foundIdx < 0){
            return false;
        }


        if (('important' in this.vocab[foundIdx]) == false )  {
            return false;
        }else if(this.vocab[foundIdx].important == null){
            return false;
        }else{
            return true;
        }
    },

    isImportantWord:function(word){
        // finds out if the word is marked as important or not
        var foundIdx = this.vocabIndexOf(word);
        return this.isImportantWordIdx(foundIdx);
    },

    toggleImportantWord:function(){

        var word = jsonData[currentEntryIdx].word;
        console.log("toggling important word: " + word);
        var foundIdx = this.vocabIndexOf(word);
        if(('important' in this.vocab[foundIdx]) == false || this.vocab[foundIdx].important == null){
            console.log("unimportant --> important");
            this.vocab[foundIdx].important = true;
        }else{
            console.log("important --> unimporant");
            this.vocab[foundIdx].important = null;
        }
    }

//    getImportantWordCount:function(){
//    }

}; // end User.prototype


