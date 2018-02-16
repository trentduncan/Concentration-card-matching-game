
// Global variables

var allCards=["fa fa-diamond","fa fa-diamond","fa fa-paper-plane-o","fa fa-paper-plane-o","fa fa-anchor","fa fa-anchor","fa fa-cube","fa fa-cube","fa fa-bolt","fa fa-bolt","fa fa-leaf","fa fa-leaf","fa fa-bicycle","fa fa-bicycle","fa fa-bomb","fa fa-bomb"];
var seconds = 0;
var minutes = 0;
var moves = 0;
var stars = 3;
var mixedDeck = shuffle(allCards);
var openList = [];
var openListIndex = [];
var matchList = [];




// Shuffle function from http://stackoverflow.com/a/2450976/ Input an array of cards and output
// that array with a randomized order.

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// This function requires no input, but it resets the game board. It is implemented twice:
// first the functionality is tied to the restart button at the top right of the page initiated
// on click, it is also called with the congratulations popup when prompted to play again.

function restartGame() {
	seconds = 0;
	minutes = 0;
	moves = 0;
	stars = 3;
	mixedDeck = shuffle(allCards);
	$('.card').children().remove();
	$('.card').css('pointer-events', 'auto');
	$('.moves').text(moves);
	$('#star1').show();
	$('#star2').show();
	openList = [];
	openListIndex = [];
	matchList = [];
	$('.card').removeClass('match');
	$('.card').removeClass('open show');
}


// This function takes a list as an input, in this case the one for match list to determine when 
// the game is over, the purpose of this function is to start a timer from when the game starts to
// when it ends. It does this by making changes to the global variables "minutes", and "seconds"
// so these variables can be called to output the correct time. The alert box at the beginning prepares
// the player, and the time starts when they click the ok button.

function stopWatch(list) {
	alert('Hello! You are about to begin a game of Concentration. Flip over two cards to try and find a pair. Once all of the cards have been matched the game is over and you win. Press ok to begin. Good Luck!!!');
	setInterval(function() {
		seconds++;
		$('.seconds').text(seconds);
		$('.minutes').text(minutes);
		if (seconds === 60) {
			seconds = 0;
			$('.seconds').text(seconds);
			minutes++;
			$('.minutes').text(minutes);
		}
		if (list.length === 16) {
			return 
		}
	},1000)
}

// This function uses the global variable for "moves" which is being incremented in the main function
// every time a turn is completed. It uses conditional statements to give the user a star rating based
// on the amount of moves taken. It doesnt require any input, but based on the number of moves it uses 
// JQuery to make changes to the amount of stars showing on the page, to reflect the users rating. It 
//  also makes changes to the global variable star which is used on the congratulations popup.

function starRating() {
	if (moves > 16) {
		$('#star1').hide();
		stars = 2;
	}
	if (moves > 24) {
		$('#star2').hide();
		stars = 1;
	}
}


// This function takes no input but is called in the main function when the game is completed, and
// it shows a popup that congratulates the user and gives them their score, time, and amount of moves
// and it asks the user if they want to play again. If they click ok, the page is reloaded and the game
// starts over. If they click cancel, the game doesnt start over and there is text at the bottom showing
// the users past score and tells them to click the restart button at the top right if they want to play again.

function youWin() {
    var txt;
    if (confirm('Congratulations!! You Won!!!\nTime:' + minutes + ' mins ' + seconds + ' secs Moves: ' + moves + '*'.repeat(stars) + ' \n Would you like to play again?') == true) {
        restartGame();
    } else {
        txt = 'You have chosen not to play again. If you change your mind click the restart button at the top right of the screen!\n Your score: Time:' + minutes + ' mins ' + seconds + ' secs Moves: ' + moves;
    }
    document.getElementById("demo").innerHTML = txt;
}


// This is the main document ready function for this game and it calls all of the previously discussed
// functions, with a couple of new inline functions. The variable "openList" holds the 1 or 2 cards that
// are currently open, while "openListIndex" holds their index position with respect to the other cards 
// DOM element position. "matchList" holds the cards that have already been matched. stopWatch is the first
// function called. After that the "restart" CSS class becomes an on click function for restartGame.
// Variable "mixedDeck" uses the shuffle function to get a randomized array of all of the cards. The next
// function runs everytime the CSS class "card" is clicked. Before the first click of each card it doesnt 
// have the actual card attached to it yet, just a randomized array of the cards. The if statement makes
// the first click append the class to add the actual card symbol matching the index position of its DOM
// element to the cards random position in the array. The click also changes the CSS class from "card" to
// "open show", and adds the card and index position to "openList", and "openListIndex". The way the CSS 
// classes are set up, and using Jquery at specific times in this function, it maintains the functionality
// where pointer-events are only allowed on two cards at a time, and pointer events are not allowed on open
// cards or card matches. The next if statement is if the length of openList is 2, which means two cards
// are flipped open this leads to two paths, either the cards are a match in which case they change classes
// to match and stay up, or they arent a match and they go back to the class card. In both of these circumstances
// both openList and openListIndex are reset to being empty and when it is a match the cards are added to matchList, 
// it should also be noted that when it isnt a match, setTimeout is used to make sure the cards stay up long enough 
// for the user to see them. The few other things happening when the openList length is 2, is that the moves variable 
// is incremented by one and JQuery is used to reflect that change on the page, and the starRating function is called. 
// The last part of this function is the if statement that is saying when matchList is equal to 16, or all of the matches 
// have been made it then calls the youWin function.

$(document).ready(function () {
	stopWatch(matchList);
	$('.restart').click(function() {
		restartGame();
	})
	var mixedDeck = shuffle(allCards);
	$('.card').click( function() { 
		var index = $(this).index()
		$(this).addClass('open show');
		if ($(this).children().length === 0) {
			$(this).append('<i class="' + mixedDeck[index] + '"></i>');
		}
		openList.push(mixedDeck[index]);
		openListIndex.push(index);
		$('.open').css('pointer-events', 'none');
		$('.show').css('pointer-events', 'none');
		if (openList.length === 2) {
			$('.card').css('pointer-events', 'none');
			moves++;
			$('.moves').text(moves);
			starRating();
			if (openList[0] === openList[1] && openListIndex[0]!== openListIndex[1]) {
				$('.card:eq('+ openListIndex[0] + ')').removeClass('open show').addClass('match');
				$('.card:eq('+ openListIndex[1] + ')').removeClass('open show').addClass('match');
				matchList.push(openList[0]);
				matchList.push(openList[1]);
				openList = [];
				openListIndex = [];
				$('.card').css('pointer-events', 'auto');
				$('.match').css('pointer-events', 'none');
			} else {
				window.setTimeout( function() {
					$('.card:eq('+ openListIndex[0] + ')').removeClass('open show');
					$('.card:eq('+ openListIndex[1] + ')').removeClass('open show');
					openList = [];
					openListIndex = [];
					$('.card').css('pointer-events', 'auto');
					$('.match').css('pointer-events', 'none');
				} , 800);

			}

			if (matchList.length === 16) {
				window.setTimeout(youWin, 100);
			}
		}
	})
})


