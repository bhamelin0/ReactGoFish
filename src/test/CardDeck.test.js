import createDeck from '../CardDeck.js';

it('can create a deck', () => {
    const newDeck = createDeck();
    expect(newDeck).toBeDefined();

});


it('can draw cards from a deck', () => {
    const newDeck = createDeck();
    
    const card1 = newDeck.draw();
    const card2 = newDeck.draw();
    expect(card1).toBeDefined();
    expect(card2).toBeDefined();
    expect(card1).not.toBe(card2);
});

it('draws 52 cards, then returns null when drawing an empty deck', () => {
    const newDeck = createDeck();
    const drawnCards = new Array();
    
    var newCard = newDeck.draw();
    while(newCard != null) {
        drawnCards.push(newCard);
        newCard = newDeck.draw();
    }

    expect(drawnCards.length).toBe(52);
    expect(newDeck.draw()).toBe(null);
});

it('draws random cards after shuffling', () => {
    const unshuffledDeck = createDeck();
    const shuffledDeck = createDeck();
    shuffledDeck.shuffle();

    const drawnCards = new Array();
    const drawnShuffledCards = new Array();

    var newBaseCard = unshuffledDeck.draw();
    while(newBaseCard != null) {
        drawnCards.push(newBaseCard);
        drawnShuffledCards.push(shuffledDeck.draw());
        newBaseCard = unshuffledDeck.draw();
    }

    expect(drawnCards).not.toStrictEqual(drawnShuffledCards);
});