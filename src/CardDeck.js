// object to represent a deck of cards for use in various card games

const { create } = require("react-test-renderer");

var suits = ["hearts", "spades", "diamonds", "clubs"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function swap(array, a,b) {
    const temp = array[a];
    array[a] = array[b];
    array[b] = temp;
}

function shuffle(deck, swaps = 500) {
    if(deck.length < 2) { return; }
    for(var x = 0; x < swaps; x++) {
        const card1 = Math.floor(Math.random() * deck.length);
        const card2 = Math.floor(Math.random() * deck.length);
        swap(deck, card1, card2);
    }
}

function createDeck() {
    const deck = {}; 
    const cardList = new Array();
    for(var x = 0; x< suits.length; x++) {
        for(var y = 0; y < values.length; y++) {
            const card = {
                value: values[y],
                suit: suits[x]
            }

            cardList.push(card);
        }
    }

    deck._cardList = cardList;
    deck.shuffle = (number = 500) => { shuffle(deck._cardList, number) };
    deck.draw = () => { return deck._cardList.length > 0 ? deck._cardList.pop() : null; }
    deck.length = () => { return deck._cardList.length; }
    return deck;
}

module.exports = createDeck;
