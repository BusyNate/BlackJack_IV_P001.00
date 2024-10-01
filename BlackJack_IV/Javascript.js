var dealerSum = 0;
var yourSum = 0;
var dealerAceCount = 0;
var yourAceCount = 0;
var hidden;
var canHit = true; // Allows you to hit as long as yourSum < 21
var gameResult;
var deck;

//---------------------Events----------------------------------------//

window.onload = () => {
    buildDeck();
    shuffleDeck();
    startGame();
};

//======================Functions================================//

function buildDeck() {
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const suits = ["C", "D", "H", "S"];
    deck = [];

    // Populate deck
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(rank + "-" + suit);
        }
    }

    console.log(deck);
}

// Shuffle deck using Fisher-Yates algorithm
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getCardValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log(hidden + " and " + dealerSum);

    while (dealerSum < 17) {
        const cardImage = document.createElement("img");
        const card = deck.pop();
        cardImage.src = "Card images/" + card + ".png";
        dealerAceCount += checkAce(card);
        dealerSum += getCardValue(card);
        document.getElementById("dealer-cards").appendChild(cardImage);
        console.log(dealerSum + " dealer cards Sum");
    }

    // Give cards to the player
    for (let i = 0; i < 1; i++) {
        const cardImage = document.createElement("img");
        const card = deck.pop();
        cardImage.src = "Card images/" + card + ".png";
        yourAceCount += checkAce(card);
        yourSum += getCardValue(card);
        document.getElementById("your-cards").appendChild(cardImage);
    }
    console.log(yourSum + " = your cards");

    document.getElementById("hit").addEventListener("click", Hit);
    document.getElementById("stand").addEventListener("click", Stand);
}

function getCardValue(card) {
    const [rank] = card.split("-");

    switch (rank) {
        case "A":
            return 11;
        case "J":
        case "Q":
        case "K":
            return 10;
        default:
            return parseInt(rank);
    }
}

function Hit() {
    if (canHit) {
        const cardImage = document.createElement("img");
        const card = deck.pop();
        cardImage.src = "Card images/" + card + ".png";
        yourAceCount += checkAce(card);
        yourSum += getCardValue(card);
        document.getElementById("your-cards").appendChild(cardImage);

        if (reduceAce(yourSum, yourAceCount) > 21) {
            canHit = false;
        }
    }
}

function Stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    canHit = false;

    document.getElementById("hidden").src = "./Card Images/" + hidden + ".png";

    // Display scores when standing
    console.log("Your cards: " + yourSum + " Dealer cards: " + dealerSum);
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    if (yourSum > 21) {
        console.log("Lose");
        document.getElementById("results").innerText = "You lose";
        gameResult = -1;
    } else if (dealerSum > 21) {
        console.log("win");
        document.getElementById("results").innerText = "You win";
        gameResult = 1;
    } else if (dealerSum === yourSum) {
        console.log("Tie");
        document.getElementById("results").innerText = "It's a tie";
        gameResult = 0;
    } else if (yourSum > dealerSum) {
        console.log("win");
        document.getElementById("results").innerText = "You win";
        gameResult = 1;
    } else if (dealerSum > yourSum) {
        console.log("lose");
        document.getElementById("results").innerText = "You lose";
        gameResult = -1;
    }
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum < 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount--;
    }
    return playerSum;
}

// Checks if the card's rank is an Ace and returns 1 if true, otherwise returns 0.
// Uses the ternary operator to concisely express the conditional logic.
function checkAce(card) {
    return card[0] === "A" ? 1 : 0;
}

