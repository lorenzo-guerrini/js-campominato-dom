//Pulsante Play e contatore partite
const play = document.getElementById("play");
play.addEventListener("click", start);
let playCounter = 0;

//Punti 
let points;

//Start
function start() {
    //Variabili griglia e difficulty selector
    const grid = document.getElementById("grid");
    const difficultySelector = document.getElementById("difficulty-selector");
    const difficulty = difficultySelector.value;

    if (playCounter == 0) {
        grid.classList.add("started");
    }

    //Rimuove messaggio in basso di fine partita se presente
    const gameEndElement = document.getElementById("game-end");
    gameEndElement.classList.remove("show");
    gameEndElement.classList.add("hidden");

    //Azzera i punti
    points = 0;

    //Funzioni da eseguire
    animationManager(grid);
    difficultyManager(grid, difficulty);

    playCounter++;
}

//Gestore delle animazioni
function animationManager(grid) {
    grid.animate([
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(360deg)' }
    ], {
        duration: 500
    });
}

//Gestore dlle difficoltà
function difficultyManager(grid, difficulty) {
    if (difficulty == 1) {
        gridGenerator(grid, 100, "easy"); //Easy
    } else if (difficulty == 2) {
        gridGenerator(grid, 81, "medium"); //Medium
    } else {
        gridGenerator(grid, 49, "hard"); //Hard
    }
}

//Genera la griglia con ciascun elemento
function gridGenerator(grid, gridTotal, className) {
    //Svuota la griglia
    grid.innerHTML = "";

    //Genera array di bombe
    const bombsArray = bombGenerator(gridTotal);
    console.log(bombsArray);

    for (let i = 1; i <= gridTotal; i++) {
        //Genera gridSquare
        let gridSquare = gridSquareGenerator(className, i);

        //Aggiunge eventListener al click in basa a se è una bomba o no
        if (isBomb(bombsArray, i)) {
            gridSquare.addEventListener("click", addBombClass);
        } else {
            gridSquare.addEventListener("click", addActiveClass);
        }

        //Aggiunge gridSquare alla griglia
        grid.append(gridSquare);
    }
}

//Generatore di array di bombe
function bombGenerator(gridTotal) {
    const bombs = [];
    do {
        let newBomb = randomNumberGen(1, gridTotal);

        if (!isBomb(bombs, newBomb)) {
            bombs.push(newBomb);
        }

    } while (bombs.length < 16)

    return bombs;
}

//Generatore di numeri random
function randomNumberGen(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//Controlla se un elemento è una bomba o no
function isBomb(bombsArray, value) {
    for (let p = 0; p < bombsArray.length; p++) {
        if (bombsArray[p] == value) {
            return true;
        }
    }

    return false;
}

//Generatore di gridSquare
function gridSquareGenerator(className, i) {
    //Crea gridSquare
    let gridSquare = document.createElement("div");
    gridSquare.classList.add("grid-square");
    gridSquare.classList.add(className);

    //Inserisce numero dentro gridSquare
    let gridSquareNumber = document.createElement("div");
    gridSquareNumber.classList.add("grid-number");
    gridSquareNumber.innerHTML = i;
    gridSquare.append(gridSquareNumber);

    return gridSquare;
}

//Aggiunge la classe "active" ad un elemento
function addActiveClass(difficulty) {
    this.classList.add("active");
    points++;

    if (points == difficultyPointsCalc(difficulty)) {
        endGame("win");
    }
    console.log(points);

    //Rimuove l'EventListener per impedire punti infiniti
    this.removeEventListener("click", addActiveClass);
}

function difficultyPointsCalc(difficulty) {
    if (difficulty == "easy") {
        return 84;
    }

    if (difficulty == "medium") {
        return 65;
    }

    return 33;
}

//Per ggiumgere la classe "bomb" ad un elemento
function addBombClass() {
    this.classList.add("bomb");
    endGame("lose");

    //Rimuove l'EventListener
    this.removeEventListener("click", addBombClass);
}

function endGame(outcome) {
    //TODO: Rendere globale grid
    const grid = document.getElementById("grid");
    grid.classList.add("inactive");
    
    //Variabili varie
    const gameEndElement = document.getElementById("game-end");
    gameEndElement.classList.remove("hidden");
    gameEndElement.classList.add("show");

    document.getElementById("n-match").innerHTML = "Partita " + playCounter + ": ";

    let outcomeContainer = document.getElementById("game-outcome");
    
    //Gestisce l'outcome
    if (outcome == "win") {
        outcomeContainer.innerHTML = "Complimenti, ha vinto :-)";
    } else {
        outcomeContainer.innerHTML = "Peccato, hai perso :-(";
    }

    document.getElementById("game-total-points").innerHTML = "Hai fatto: " + points + " punti.";
}