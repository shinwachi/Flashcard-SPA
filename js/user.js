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
		for(var i=0, len = this.vocab.length; i < len ; i++) {
			var v = this.knowsIdx(i);
			if(v == true){
				known++;
			}else if(v == false){
				unknown++;
			}
		};
		return {"known":known, "unknown":unknown};
	},

	checkAndAddToUserVocab:function (_word){
		var foundIdx = this.vocabIndexOf(_word);
		//console.log(foundIdx);
		if (foundIdx == -1){
			//console.log("adding");
			this.vocab.push({word:_word, visit:[]});
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
	}

}; // end User.prototype