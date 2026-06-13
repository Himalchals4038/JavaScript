let playerScore = 0, compScore = 0;
const choices = document.querySelectorAll('.choice');
const playerScoreElement = document.getElementById('player-score');
const compScoreElement = document.getElementById('computer-score');
let msg = document.querySelector('.msg-container');
// console.dir(msg);

const options = ['rock', 'paper', 'scissors'];
const genCompChoice = () => {
    const randomNum = Math.floor(Math.random() * 3);
    return options[randomNum];
};

const playGame = (userChoice) => {
    // Reset message styles for normal rounds in case a previous game was just won
    msg.style.backgroundColor = "black";
    msg.style.color = "white";

    const compChoice = genCompChoice();
    if (userChoice === compChoice){
        console.log("Tie");
        msg.innerText = "Tie";
    }
    else if(
        (userChoice === 'rock' && compChoice === 'paper') || (userChoice === 'paper' && compChoice === 'scissors') || (userChoice === 'scissors' && compChoice === 'rock')
    ){
        console.log("Computer Wins");
        compScore++;
        msg.innerText = "Computer Wins this round";
    }
    else{
        console.log("You Win");
        playerScore++;
        msg.innerText = "You Win this round";
    }

    playerScoreElement.innerText = playerScore;
    compScoreElement.innerText = compScore;

    if (playerScore === 10){
        // alert("You Win");
        msg.innerText = "You Won the game!";
        msg.style.backgroundColor = "chartreuse";
        msg.style.color = "darkblue";
        playerScore = 0;
        compScore = 0;
    } else if (compScore === 10){
        // alert("Computer Wins");
        msg.innerText = "Computer Won the game!";
        msg.style.backgroundColor = "orange";
        msg.style.color = "darkviolet";
        playerScore = 0;
        compScore = 0;
    }

    if (playerScore === 0 && compScore === 0) {
        playerScoreElement.innerText = playerScore;
        compScoreElement.innerText = compScore;
    }
};
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        playGame(choice.id);
    });
});