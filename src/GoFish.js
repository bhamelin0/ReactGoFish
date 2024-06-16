import React, { useState, useEffect } from "react";
import createDeck from './CardDeck.js';
import MessageBox from './MessageBox.js'
import './selfThinkerCards/cards.css';
import './index.css';

const deck = createDeck();
deck.shuffle();
var hand1 = [];
var hand2 = [];
while(hand1.length < 7) {
    hand1.push(deck.draw());
    hand2.push(deck.draw());
}

function CardSortButton({onSortClick}) {
    return (
        <button className="card-sorter" onClick={onSortClick}>Sort my cards</button>
    )
}

function Card({card, hidden, onCardClick}) {
    var cssSuit = card.suit === "diamonds" ? "diams" : card.suit;
    var className = hidden? "card back" : `card rank-${card.value.toLowerCase()} ${cssSuit}`;
    var suitClass = cssSuit === "spades" ? "\u2660" : cssSuit === "hearts" ? "\u2661" : cssSuit === "diams" ? "\u2662" : "\u2663" ;

    return (
        <button className={className} onClick={onCardClick}>
                <span className="rank">{card.value}</span>
                <span className="suit">{suitClass}</span>
        </button>
    )
}

function Deck({deckLength}) {
    return (
        <div className="card back">
            <span className="deckCount">{deckLength}</span>
        </div>
    )
}

function checkForSet(hand, newCard) {
    const indexes = [];
    for(var x = 0; x < hand.length; x++) {
        if( hand[x].value === newCard.value) {
            indexes.push(x);
        }
    }
    return indexes;
}

function GoFish() {
    var player1DuringTurn = false;
    const [p1Hand, setP1Hand] = useState(hand1);
    const [p2Hand, setP2Hand] = useState(hand2);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [logText, setLogText] = useState([
        {player: 0, line: "Let's play Go Fish!"}, 
        {player: 0, line: "Player 1 go first."}]);
    const [deckLength, setDeckLength] = useState(deck.length);

    const [p1Sets, setP1Sets] = useState(0);
    const [p2Sets, setP2Sets] = useState(0);
    const [winnerText, setWinnerText] = useState("");


    useEffect(() => {
        if(p1Sets + p2Sets === 13) {
            setWinnerText(p1Sets > p2Sets ? "Player 1 wins!" : "Player 2 wins!");
        }
    },[p1Sets, p2Sets])

    function printToLog(player, line) {
        logText.push({player, line});
        setLogText([...logText]);
    }

    function takeMatchingCards(card, currentHand, otherHand) {
        var hadCard = 0;
        while(true) {
            var foundCardIndex = otherHand.findIndex((opponentCard) => opponentCard.value === card.value);
            if(foundCardIndex === -1) {
                break;
            }
            var foundCard = otherHand[foundCardIndex];
            otherHand.splice(foundCardIndex, 1);
            currentHand.push(foundCard);
            hadCard++;
        }
        return hadCard;
    }

    async function handleCardClick(card) {
        // Block clicking unless it is our turn
        if(currentPlayer === 2 || player1DuringTurn ){ return; }
        player1DuringTurn = true;
        
        if(!p1Hand.includes(card)) {
            return;
        }

        handleGoFishCard(card, 1);
    }

    async function performAITurn (setCount) {
        var card = p2Hand[Math.floor(Math.random() * p2Hand.length)];
        handleGoFishCard(card, 2, setCount);
    };

    async function handleGoFishCard(card, player, aiSetCount) {
        var drawnCard;

        const currentPlayerHand = player == 1 ? p1Hand : p2Hand;
        const otherPlayerHand = player == 1 ? p2Hand : p1Hand;
        const otherPlayer  = player == 1 ? 2 : 1;
        
        printToLog(player, `Do you have any ${card.value}'s?`);
        var gotMatch = takeMatchingCards(card, currentPlayerHand, otherPlayerHand);
        if(!gotMatch) {
            await new Promise(resolve => setTimeout(resolve, 100));
            printToLog(otherPlayer, `No. Go fish!`);
            if(deck.length() > 0) {
                var drawnCard = deck.draw();
                if(drawnCard.value === card.value) {
                    printToLog(player, `I drew what I asked for!`);
                    gotMatch = 1;
                }
                currentPlayerHand.push(drawnCard);
                setDeckLength(deck.length());
            } else {
                printToLog(otherPlayer, "There are no more cards, I can't go fish!");
            }
        } else {
            printToLog(otherPlayer, `Yes, ${gotMatch}, here you go.`);
            setP2Hand([...p2Hand]);
            setP1Hand([...p1Hand]);
        }   

        if (drawnCard) {
            card = drawnCard; // Ensure we find sets for what we actually drew
        }

        var set = checkForSet(currentPlayerHand, card);
        if(set.length === 4) {
            await new Promise(resolve => setTimeout(resolve, 100));
            printToLog(player, `I have completed the ${card.value} set!`);
            aiSetCount++;

            player == 1 ? setP1Sets(p1Sets + 1) : setP2Sets(aiSetCount);

            for(var x = set.length - 1; x >= 0; x--) {
                currentPlayerHand.splice(set[x], 1);
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));

        setP1Hand([...p1Hand]);
        setP2Hand([...p2Hand]);

        //Handle ending the turn
        if(gotMatch && currentPlayerHand.length === 0) { // Deal with empty hand case
            if(deck.length() > 0 ) {
                await new Promise(resolve => setTimeout(resolve, 100));
                printToLog(player, "But I don't have any cards, so I'll draw one.");
                drawnCard = deck.draw();
                currentPlayerHand.push(drawnCard);
                setDeckLength(deck.length());
                setP1Hand([...p1Hand]);
            } else {
                printToLog(player, "But I can't draw any cards and I have none left. Game over!");
            }
        }

        if(gotMatch) {  // Deal with repeat turn case
            printToLog(player, `I get to guess again!`);

             //If it was the player turn, we are waiting for the next card click
            if(player == 2) {
                await new Promise(resolve => setTimeout(resolve, 100));
                performAITurn(aiSetCount);
            }

        } else { // Deal with switching turn case
            printToLog(player, "My turn is over. Your turn.");

            if(player == 1) {
                setCurrentPlayer(2);
                performAITurn(p2Sets)
            } else {
                //If it was the AI turn, we change the player and just wait for a card to be clicked
                setP2Sets(aiSetCount);
                setCurrentPlayer(1);
                
            }
        } 
    }

    const cardValueTable = {J: 11, Q:12, K:13};
    const cardSuitTable = {hearts: 1, diamonds: 2, spades: 3, clubs: 4};
    function handleSortClick() {

        // We want to sort by number, then by suit, so that like numbers are beside each other in our hand
        const newP1Hand = p1Hand.sort((a,b) => {
            const aValue = cardValueTable[a.value] ? cardValueTable[a.value] : parseInt(a.value);
            const bValue = cardValueTable[b.value] ? cardValueTable[b.value] : parseInt(b.value);

            if(aValue == bValue) {
                return cardSuitTable[a.suit] - cardSuitTable[b.suit];
            }

            return aValue - bValue;
        });
        setP1Hand([...newP1Hand]);
    }

    return (
        <div className="goFish">
            <h1>Go fish!</h1>
            <h2>{winnerText}</h2>
            <div className="playingCards">
                <div className="playingCards">
                    <Deck deckLength={p2Sets}/>
                </div>
                {p2Hand.map((card) => 
                    <Card key={`${card.value},${card.suit}`} card={card} hidden={false}/>
                )}
            </div>

            <div className="playingCards">
                <Deck deckLength={deckLength}/>
            </div>

            <div className="playingCards">
                <div className="playingCards">
                    <Deck deckLength={p1Sets}/>
                </div>
                {p1Hand.map(card => 
                    <Card key={`${card.value},${card.suit}`} card={card} onCardClick={() => handleCardClick(card)}/>
                )}
            </div>
            <CardSortButton onSortClick={() => handleSortClick()}/>
            <MessageBox messageList={logText}/>
        </div>
    ); 

    
};

export default GoFish;