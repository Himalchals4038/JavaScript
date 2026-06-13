let playerScore = 0, compScore = 0;
const choices = document.querySelectorAll('.choice');
const genCompChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    const randomNum = Math.floor(Math.random() * 3);
    return choices[randomNum];
}
const playGame = (userChoice) => {
    // console.log(`userChoice = ${userChoice}`);
    const compChoice = genCompChoice();
    // console.log(`compChoice = ${compChoice}`);
    if (userChoice === compChoice){
        console.log("Tie");
    }
    else if (userChoice === 'rock' && compChoice === 'paper'){
        console.log("Computer Wins");
        compScore++;
    }
    else if (userChoice === 'paper' && compChoice === 'scissors'){
        console.log("Computer Wins");
        compScore++;
    }
    else if (userChoice === 'scissors' && compChoice === 'rock'){
        console.log("Computer Wins");
        compScore++;
    }
    else{
        console.log("You Win");
        playerScore++;
    }
    document.getElementById('player-score').innerText = playerScore;
    document.getElementById('computer-score').innerText = compScore;
    if (playerScore === 10){
        alert("You Win");
        playerScore = 0;
        compScore = 0;
    }
    else if (compScore === 10){
        alert("Computer Wins");
        playerScore = 0;
        compScore = 0;
    }
}
choices.forEach(choice => {
    // console.log(choice);
    choice.addEventListener('click', () => {
        const userChoice = choice.getAttribute('id');
        // console.log(userChoice);
        // console.log("Choice was clicked");
        playGame(userChoice);
    });
})