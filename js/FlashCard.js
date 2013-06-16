// main function: flashCard()


// keeps track of the card the user is looking at
var currentEntryIdx = 0;

// this is the flashCard card deck
var jsonData = null;

// // array shuffling function: fisher-yates <-- from: shuffleArray.js

// from: user.js
// var user = new User();
var user = null;

restoreUser();



function restoreUser(){
	// restore user settings
	if(localStorage.getItem("user")){
		// find local user
		user=JSON.parse(localStorage.getItem("user"));
		user.__proto__ = User.prototype;
	} else {
		// create new user
		user = new User();
	}
}


function displayUserJson(){
	$("#userTextInfo").text(JSON.stringify(user));
	// $("#userTextInfo").focus(function(){
	// 	var $this = $(this);
	// 	$this.select();
	// 	window.setTimeout(function() {
 //        $this.select();
 //    }, 1);

    // Work around WebKit's little problem
 //    function mouseUpHandler() {
 //        // Prevent further mouseup intervention
 //        $this.off("mouseup", mouseUpHandler);
 //        return false;
 //    }

 //    $this.mouseup(mouseUpHandler);
	// });


}



///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////



$("#cardView").hide(); // hide cardview

// save user settings
function saveUser(){
	localStorage.setItem("user", JSON.stringify(user));
}

var isShowDefAlways = false;
function showDefAlways(trueFalse){
	isShowDefAlways = trueFalse;
	if (isShowDefAlways == true)
	{
		showDef();
	}else{
		hideDef();
	}
}

function hideDef(){
	if(isShowDefAlways == false){
	$('.def').each(function(){
		$(this).hide();
	});
	}
}

function fadeDef(){
	if(isShowDefAlways == false){
	$('.def').each(function(){
		$(this).fadeOut(300);
	});
}
}

function showDef(){
	$('.def').fadeIn(150);
	
}

function toggleDef(){
	if(isShowDefAlways == false){
		$('.def').fadeToggle(150);
	}
}

function setProgressBar(){
	// <div class="progress">
	// <div class="bar" style="width: 0%;" id="idxProgress"></div>
	// </div>
	// <div class="progress">
	// 				<div class="bar-success" style="width: 0%" id="knownPct"></div> 
	// 				<div class="bar-danger" style="width: 0%" id="unknownPct"></div> 
	// 				<div class="bar" style="width: 0%" id="idxProgress"></div>
	// 			</div>

	var progressPct = (user.getVisitedCount()/jsonData.length)*100;
	// var visitedCount = user.getVisitedCount()
	var knownUnknown = user.getKnownUnknownCount();
	var knownPct   = (knownUnknown.known/jsonData.length)*100
	var unknownPct = (knownUnknown.unknown/jsonData.length)*100
	var remainingVisited = progressPct - (knownPct + unknownPct);

	$('#knownPct').attr('style', "width: "+knownPct+"%");
	$('#unknownPct').attr('style', "width: "+unknownPct+"%");
	$('#idxProgress').attr('style', "width: "+remainingVisited+"%");
    
	$('#indexDisplay').text("Idx:"+currentEntryIdx + "/" + jsonData.length
		+ " visited: " + user.getVisitedCount()
		+ " known: " + knownUnknown.known
		+ " unknown: " + knownUnknown.unknown
        + " important: " + knownUnknown.important);
	console.log(progressPct+' '+$('#idxProgress').attr('style'));
	console.log(progressPct+' '+$('#knownPct').attr('style'));

}

function checkAllFilter(){
	$('#filterUnvisited').prop('checked', true);
	$('#filterVisited')  .prop('checked', true);
	$('#filterKnown')    .prop('checked', true);
	$('#filterDontKnow') .prop('checked', true);
    $('#filterImportant').prop('checked', true);
}

///////////////////////////////////////////////////////////////////////

function display(){
	d = getCurrentEntry();
	console.log(d);
	// draw new card
	var entry = '<div id="entry"><h2><div class="word">'+
				d.word+
				'<div id="userVocabIndicator"></div>'+
				'</div></h2><div class="def">'+
				//d.def.replace(/\n/g, "<br>").replace(/\【\考\法[^【]*】/g,'<span class="label label-info">考法</span>' )+
				d.def.replace(/\n/g, "<br>").replace(/\u3010\u8003\u6CD5[^\u3010]*\u3011/g,'<span class="label label-info">\u8003\u6CD5</span>' )+
				

				'<br><a href="http://dictionary.reference.com/browse/'+d.word+'" target="_blank">dictionary.com</a><brf>'+
				"</div></div>"
	
	// show new card in the entry
	$('#entry').replaceWith(entry);
	displayUserKnowsWord(d.word);
	setProgressBar();
} // end display

function displayUserKnowsWord(word){
	var visits = user.visitCount(word);
	// var indicator = '<span class="badge badge-success">visit '+user.visitCount(word)+'</span>';
	//console.log("user status: " + user.knowsWord(word));
	if (user.knowsWord(word)){
		// indicator = "<b>you know this word</b>";
		indicator = '<span class="label">visit '+visits+'</span> <span class="badge badge-success">known</span>';
	}else if (user.knowsWord(word) == null){
		indicator = '<span class="label">visit '+visits+'</span>';
	}else {
		indicator = '<span class="label">visit '+visits+'</span> <span class="badge badge-important">unknown</span>';
	}

    var importance = '';
    if (user.isImportantWord(word)){
        importance = '<span class="badge badge-warning"><i class="icon-star icon-white"></i></span>'  ;
    };

	//console.log('marking: ' + indicator);
	$('#userVocabIndicator').replaceWith('<div id="userVocabIndicator">'+indicator+importance+'</div>');

} // end displayUserKnowsWord


function shuffleEntryArray(jsonDataOriginal){
	jsonData = shuffleArray(jsonDataOriginal);
	currentEntryIdx = 0;
} // end shuffleEntryArray


function getCurrentEntry(){
	return jsonData[currentEntryIdx];
} // end getCurrentEntry

function displayFirst(){
	var d = getCurrentEntry();
	user.observeWord(d.word);
	display();
} // end displayFirst

// skip to next event, either forward or backward, determined by iterfunct()
function skipToPrevNext(iterFunct){



	// get conditions of filters
	var filterUnvisited = $('#filterUnvisited').prop('checked');
	var filterVisited   = $('#filterVisited').prop('checked');
	var filterKnown     = $('#filterKnown').prop('checked');
	var filterDontKnow  = $('#filterDontKnow').prop('checked');
    var filterImportant = $('#filterImportant').prop('checked');


	var d = getCurrentEntry();

	// keep track of how many entries were skipped
	var skipped = 0;

	// complex set of logic which will use filters to skip to next item
	// todo: simplify the logic
	var continueFlag = true;
	while(continueFlag){

		// get next index
		currentEntryIdx = iterFunct( currentEntryIdx );

		if(currentEntryIdx > jsonData.length-1){
			continueFlag = false;
			currentEntryIdx = jsonData.length-1;
		}else if ( currentEntryIdx < 0){
			continueFlag = false; // stop at end
			currentEntryIdx = 0;
		}else{
			d = getCurrentEntry();
			var userVocabIdx = user.vocabIndexOf(d.word);
//			console.log("userVocabIdx"+userVocabIdx);
			var userKnows = false;
			if(userVocabIdx >= 0){ // mean it is in the user vocab
				if(filterVisited){
					continueFlag = false;
				}else{
					userKnows =  user.knowsIdx(userVocabIdx);
					
					if(filterKnown && userKnows != null){
						continueFlag = false;
					}else if (filterDontKnow && userKnows == false){
						continueFlag = false;
					}
				}

                if(filterImportant=true){

                    if(user.isImportantWordIdx(userVocabIdx)==true){
                        continueFlag=false;
                    }
                }
			}else{
				if(filterUnvisited==true){
					continueFlag = false;
				}


            }
		}
		skipped++;
	}
	console.log("skipped: "+skipped);
	return d;
}


function displayNext(){
	
	if (currentEntryIdx===null){   // then user saw nothing in this shuffled deck yet
		currentEntryIdx=0;
	}

	var d = skipToPrevNext(function(x){
		return x+1;
	});

	user.observeWord(d.word);
	display();
} // end displayNext


function displayPrevious(){
	if (currentEntryIdx>0){
		var d = skipToPrevNext(function(x){
			return x-1;
		});

		user.observeWord(d.word);
		display();
	}
} // end displayPrevious

// keeps track of what key shortcut is bound to what function
var shortCutKeyFunctionPairs = [];
function addControlWithKeyShortcut(controlElementId, buttonElementId, buttonLabel, buttonClass, shortcutKey, eventHandler){
	// have shortcutKey as null if you don't want shortcuts

	// e.g., 
	//   controlElementId = "#controls"
	//    buttonElementId = "iKnow" <<<<< this will become "#iKnow"
	//    buttonLabel = "know (e)"
	// 	  buttonClass = "btn-primary"
	//    shortcutKey = "E"
	//    eventhandler = <somefunction>

	// add user save function
	var userSaveEventHandler = function(event){
		eventHandler(event);
		saveUser();
	}

	$(controlElementId).append('<button class="btn '+buttonClass+'" type="button" id="'+buttonElementId+'">'
		+buttonLabel+'</button> ');
	$("#"+buttonElementId).button()
			   .click(function(event){
			   		event.preventDefault();
			   		userSaveEventHandler(event);
				});
	if(shortcutKey){
		shortCutKeyFunctionPairs.push([shortcutKey, userSaveEventHandler]);
	}
	// console.log(shortcutKey + shortCutKeyFunctionPairs);

} // end addControlWithKeyShortcut



///////////// main function ////////////////////////////

function flashCard(jsonDataOriginal){


			// 	<a href="#cardViewTab" id='cardViewTab'>Cards</a>
			// </li>
			// <li>
			// 	<a href="#userViewTab" id='userViewTab'>User</a>
			// </li>


$('#userInfoView').hide();
// set up tabs
$('.nav-tabs > li > a').click(function(event){
	//get displaying tab content jQuery selector
	var active_tab_selector = $('.nav-tabs > li.active > a').attr('href');
	 
	//hide displaying tab content
	//$(active_tab_selector).removeClass('active');
	$('.nav-tabs > li').removeClass('active');


	//add 'active' css into clicked navigation
	$(this).parents('li').addClass('active');
	console.log("clicked "+$(this).attr('id'));

	$('.mainView').hide();
	switch($(this).attr('id')) {
		case 'cardViewTab':
			$("#cardView").show();
			break;
		case 'userViewTab':
			$('#userInfoView').show();
			displayUserJson();
			break;

	};
});



	shuffleEntryArray(jsonDataOriginal);

	displayFirst()
	// displayNext(); // go to first card
	hideDef(); // hide the definition from the user

	$('#showDefinition').change(function(){
		showDefAlways(this.checked);
	})
	
	$('#checkAllFilter').button().click(function(event){
		checkAllFilter();
	});

	addControlWithKeyShortcut('#controls', 'prevWord', '<i class="icon-backward icon-white"></i> back (a)', 'btn-primary', 'A', 
		function(event){
			displayPrevious();
	    	hideDef();
		});

	addControlWithKeyShortcut('#controls', 'nextWord', '<i class="icon-forward icon-white"></i> next (space)', 'btn-primary', ' ', 
		function(event){
	    	displayNext();
	    	hideDef();
		});
	
	addControlWithKeyShortcut('#controls', 'checkWord', '<i class="icon-info-sign icon-white"></i> definition (f-lip)', 'btn-info', 'F', 
		function(event){
			toggleDef();
		});

	addControlWithKeyShortcut('#controls', 'iKnow', '<i class="icon-ok-sign icon-white"></i> know (e)', 'btn-success', 'E', 
		function(event){
			user.unmarkDontKnow();
			display()
			showDef();
		});

	addControlWithKeyShortcut('#controls', 'dontKnow', '<i class="icon-question-sign icon-white"></i> don\'t know (d)', 'btn-danger', 'D', 
		function(event){
			user.markDontKnow();
	    	display()
	    	showDef();
		});

    addControlWithKeyShortcut('#controls', 'toggleImportance', '<i class="icon-star icon-white"></i>important (s-tar)', 'btn-warning', 'S',
        function(event){
            user.toggleImportantWord();
            display();
            showDef();
        });


	// handle shortcut keys
	$("body").on('keyup', function(event) { 
		    var c= String.fromCharCode(event.keyCode);
		    for(var i = 0, l = shortCutKeyFunctionPairs.length; i < l; i++){
		    	var k = shortCutKeyFunctionPairs[i];
		    	if(c.match(k[0])){
		    		k[1](event);
		    	}
		    }
		});

} // end flashCard