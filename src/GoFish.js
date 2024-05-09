import { React } from "react";
import { useState, useEffect, } from 'react';
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
        if(currentPlayer === 2) {
            performAITurn(false, p2Sets);
        } else {
            if(!p1Hand.length && deck.length()) {
                setP1Hand([...p1Hand, ...deck.draw()])
            }
        }
    }, [currentPlayer])


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

    async function performAITurn (goAgain, setCount) {
        var drawnCard, set, x;

        await new Promise(resolve => setTimeout(resolve, 500));
        if(goAgain) {
            printToLog(2, `I will make another guess. Hm.....`);
        } else {
            printToLog(2, `It is my turn!`);
        }

        player1DuringTurn = false;
        await new Promise(resolve => setTimeout(resolve, 500));
        if(!p2Hand.length) {
            if(deck.length() > 0) {
                printToLog(2, "I don't have any cards, so I'll draw one.");
                drawnCard = deck.draw();
                p2Hand.push(drawnCard);
                setDeckLength(deck.length());
            } else {
                printToLog(2, "I can't draw any cards and I have none left. Game over!");
                setP2Sets(setCount);
                return;
            }
        } 
        
        var card = p2Hand[Math.floor(Math.random() * p2Hand.length)];
 
        await new Promise(resolve => setTimeout(resolve, 500));
        printToLog(2, `Do you have any ${card.value}'s?`);

        await new Promise(resolve => setTimeout(resolve, 500));
        var gotMatch = takeMatchingCards(card, p2Hand, p1Hand);
        if(!gotMatch) {
            await new Promise(resolve => setTimeout(resolve, 500));
            printToLog(1, `No. Go fish!`);
            drawnCard = deck.draw();
            if(drawnCard) {
                if(drawnCard.value === card.value) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    printToLog(2, `I drew what I asked for!`);
                    gotMatch = 1;
                }
                p2Hand.push(drawnCard);
                setDeckLength(deck.length());
                card = drawnCard; //Evaluate if we completed a set with the card we drew, rather than the card we requested and didn't get
            } else {
                await new Promise(resolve => setTimeout(resolve, 500));
                printToLog(1, `I can't - there are no cards left!`);
            }
        } else {
            printToLog(1, `Yes, ${gotMatch}, here you go.`);
            setP1Hand([...p1Hand]);
        }

        set = checkForSet(p2Hand, card);
        if(set.length === 4) {
            await new Promise(resolve => setTimeout(resolve, 500));
            printToLog(2, `I have completed the ${card.value} set!`);
            setCount++;
            for(x = set.length - 1; x >= 0; x--) {
                p2Hand.splice(set[x], 1);
            }
        }

        setP2Hand([...p2Hand]);
        if(!gotMatch) {
            setP2Sets(setCount);
            setCurrentPlayer(1);
        } else {
            performAITurn(true, setCount);
        }
    };

    async function handleCardClick(card) {
        if(currentPlayer === 2 || player1DuringTurn ){ return; }
        player1DuringTurn = true;
        
        if(!p1Hand.includes(card)) {
            return;
        }
        
        printToLog(1, `Do you have any ${card.value}'s?`);
        var gotMatch = takeMatchingCards(card, p1Hand, p2Hand);
        if(!gotMatch) {
            await new Promise(resolve => setTimeout(resolve, 100));
            printToLog(2, `No. Go fish!`);
            if(deck.length() > 0) {
                var drawnCard = deck.draw();
                if(drawnCard.value === card.value) {
                    printToLog(1, `I drew what I asked for!`);
                    gotMatch = 1;
                }
                p1Hand.push(drawnCard);
                setDeckLength(deck.length());
            } else {
                printToLog(1, "There are no more cards, I can't go fish!");
            }
        } else {
            printToLog(2, `Yes, ${gotMatch}, here you go.`);
            printToLog(1, `I'll guess again!`);
            setP2Hand([...p2Hand]);
        }   

        var set = checkForSet(p1Hand, card);
        if(set.length === 4) {
            await new Promise(resolve => setTimeout(resolve, 100));
            printToLog(1, `I have completed the ${card.value} set!`);
            setP1Sets(p1Sets + 1);
            for(var x = set.length - 1; x >= 0; x--) {
                p1Hand.splice(set[x], 1);
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        if(!gotMatch) {
            setCurrentPlayer(2);
        } else if(p1Hand.length === 0) {
            if(deck.length() > 0 ) {
                printToLog(1, "I don't have any cards, so I'll draw one.");
                drawnCard = deck.draw();
                p1Hand.push(drawnCard);
                setDeckLength(deck.length());
            } else {
                printToLog(1, "I can't draw any cards and I have none left. Game over!");
            }
        }

        setP1Hand([...p1Hand]);
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

            <MessageBox messageList={logText}/>
        </div>
    ); 
};

export default GoFish;