const sentences = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "Hey there! How have you been? I hope your day is going well. Let's catch up soon. Take care and have a fantastic time!",
        "Pizza is my favorite food. I enjoy it with extra cheese, pepperoni, and mushrooms. It's incredibly delicious and satisfying.",
        "The sun is shining brightly, spreading warmth and joy all around. It's a beautiful day to go for a walk and enjoy nature.",
        "My dog, Max, is adorable. He loves to run and play fetch with his favorite blue rubber ball in the park."
    ],
    medium: [
        "Hey there! How have you been? I hope your day is going well. Let's catch up soon. Take care and have a fantastic time!",
        "Pizza is my favorite food. I enjoy it with extra cheese, pepperoni, and mushrooms. It's incredibly delicious and satisfying.",
        "The sun is shining brightly, spreading warmth and joy all around. It's a beautiful day to go for a walk and enjoy nature.",
        "My dog, Max, is adorable. He loves to run and play fetch with his favorite blue rubber ball in the park.",
        "Her dance performance was captivating. The way she moved gracefully on the stage left everyone mesmerized and spellbound."
    ],
    hard: [
        "Meticulously perplexing, the convoluted lexicon challenges dexterity—requiring ambidexterity—on the QWERTY keyboard, venturing through various punctuation marks, numbers, and symbols—a feat not easily accomplished by the uninitiated typist.",
        "Juxtaposing idiomatic phrases with elaborate punctuation, including semicolons, em dashes, en dashes, and ellipses—this veritable typographical gymnastics tests even the most adept keyboard virtuoso.",
        "Extemporaneously exclaiming the gobbledygook prose, typing impeccable iambic pentameter—sans auto-correct—proves perplexing. Typists proficiently pounding keys painstakingly produce prodigious texts, earning accolades and admiration.",
        "Zephyrs whispering zany zingers, vexing even seasoned typists. Quixotically quoting, wearily deciphering, transcribing—the daring keyboard choreography entangles dexterous fingers in a virtuoso spectacle of lexical prowess.",
        "Excruciatingly intricate, the labyrinthine sentences incorporate obscure characters, diacritics, and archaic glyphs—a Herculean typing challenge, reserved for the most intrepid logophiles.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    ],
};

let currentSentenceIndex = 0;
let currentDifficulty = "easy";
let gameDuration = 30;
let startTime, endTime, timerInterval;

function getRandomSentence() {
    const sentencesArray = sentences[currentDifficulty];
    return sentencesArray[Math.floor(Math.random() * sentencesArray.length)];
}

function displaySentence() {
    const sentenceDiv = document.getElementById("sentence");
    const sentence = getRandomSentence();
    sentenceDiv.textContent = sentence;
}

function calculateWordClass(typedWord, originalWord) {
    return typedWord === originalWord ? "correct" : "incorrect";
}

function calculateTypingResult() {
    const typedText = document.getElementById("typingArea").value.trim();
    const originalSentence = document.getElementById("sentence").textContent.trim();

    const typedWords = typedText.split(" ");
    const originalWords = originalSentence.split(" ");

    const spans = originalWords.map((originalWord, index) => {
        const typedWord = typedWords[index] || "";
        const spanClass = calculateWordClass(typedWord, originalWord);
        return `<span class="${spanClass}">${originalWord}</span>`;
    });

    const resultDiv = document.getElementById("sentence");
    resultDiv.innerHTML = spans.join(" ");

    const correctWords = typedWords.reduce((count, typedWord, index) => {
        const originalWord = originalWords[index];
        return count + (typedWord === originalWord ? 1 : 0);
    }, 0);

    const accuracyPercentage = ((correctWords / originalWords.length) * 100).toFixed(2);
    const timeElapsedInSeconds = (endTime - startTime) / 1000;
    const wpm = Math.round(typedWords.length / (timeElapsedInSeconds / 60));

    return {
        accuracy: accuracyPercentage,
        wpm: wpm
    };
}

function updateTypingResult() {
    const result = calculateTypingResult();
    document.getElementById("accuracy").textContent = `${result.accuracy}%`;
    document.getElementById("wpm").textContent = result.wpm;
}

function getLastWord(text) {
    const words = text.trim().split(" ");
    return words[words.length - 1];
}

function removeExtraSpaces() {
    const typedText = document.getElementById("typingArea").value;
    const lastCharacter = typedText.charAt(typedText.length - 1);

    if (lastCharacter === " " && /\s/.test(typedText.charAt(typedText.length - 2))) {
        document.getElementById("typingArea").value = typedText.slice(0, -1);
    }
}


document.getElementById("typingArea").addEventListener("keydown", (event) => {
    const spaceKey = " ";
    const backspaceKey = "Backspace";
    const typedText = document.getElementById("typingArea").value;

    if (event.key === spaceKey) {
        const lastCharacter = typedText.charAt(typedText.length - 1);
        const secondLastCharacter = typedText.charAt(typedText.length - 2);

        if (lastCharacter === " " && /\s/.test(secondLastCharacter)) {
            // If space bar is pressed and there is already a space after the last character,
            // prevent default behavior (preventing multiple spaces).
            event.preventDefault();
        }
    } else if (event.key === backspaceKey) {
        const lastCharacter = typedText.charAt(typedText.length - 1);
        const secondLastCharacter = typedText.charAt(typedText.length - 2);

        if (lastCharacter === " " && !/\s/.test(secondLastCharacter)) {
            // If Backspace is pressed and the last character is a space, but the character
            // before that is not a space, prevent default behavior (preventing multiple backspaces).
            event.preventDefault();
        }
    }
});



document.getElementById("typingArea").addEventListener("input", () => {
    removeExtraSpaces();
    checkTypingCompletion();
});

function checkTypingCompletion() {
    const typedText = document.getElementById("typingArea").value.trim();
    const originalSentence = document.getElementById("sentence").textContent.trim();
    const typedLastWord = getLastWord(typedText);
    const originalLastWord = getLastWord(originalSentence);

    if (typedLastWord === originalLastWord) {
        endGame();
    }

    updateTypingResult();
}

let multiplayerMode = false;
const players = [];

function startGame() {
    const easyCheckbox = document.querySelector('input[name="difficulty"][value="easy"]');
    const mediumCheckbox = document.querySelector('input[name="difficulty"][value="medium"]');
    const hardCheckbox = document.querySelector('input[name="difficulty"][value="hard"]');

    if (easyCheckbox.checked) {
        currentDifficulty = "easy";
    } else if (mediumCheckbox.checked) {
        currentDifficulty = "medium";
    } else if (hardCheckbox.checked) {
        currentDifficulty = "hard";
    } else {
        alert("Please select a difficulty level!");
        return;
    }

    const timeInput = document.getElementById("timeInput");
    const userGameDuration = parseInt(timeInput.value, 10);

    if (isNaN(userGameDuration) || userGameDuration < 10 || userGameDuration > 300) {
        alert("Please enter a valid game duration between 10 and 300 seconds.");
        return;
    }

    gameDuration = userGameDuration;

    const multiplayerCheckbox = document.querySelector('input[name="gameMode"][value="multiplayer"]');
    multiplayerMode = multiplayerCheckbox.checked;

    if (multiplayerMode) {
        document.getElementById("lobby-container").style.display = "block";
        document.getElementById("typingArea").setAttribute("disabled", "true");
        document.getElementById("startButton").setAttribute("disabled", "true");

        setTimeout(() => {
            document.getElementById("lobby-container").style.display = "none";
            document.getElementById("typingArea").removeAttribute("disabled");
            document.getElementById("startButton").removeAttribute("disabled");

            players.forEach(player => {
                player.startGame();
            });

            document.getElementById("typingArea").focus();
            startTimer();
        }, 10000);

        players.push({
            startGame: startGame,
            calculateTypingResult: calculateTypingResult
        });
    } else {
        displaySentence();
        startTime = new Date().getTime();
        document.getElementById("typingArea").value = "";
        document.getElementById("typingArea").removeAttribute("disabled");
        document.getElementById("startButton").setAttribute("disabled", "true");
        document.getElementById("result").style.display = "none";

        document.getElementById("typingArea").focus();

        const timerElement = document.getElementById("timer");
        let remainingTime = gameDuration;
        timerElement.textContent = remainingTime;

        timerInterval = setInterval(() => {
            remainingTime--;
            timerElement.textContent = remainingTime;
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    endTime = new Date().getTime();
    document.getElementById("typingArea").setAttribute("disabled", "true");
    document.getElementById("startButton").removeAttribute("disabled");
    if (multiplayerMode) {
        const allPlayersFinished = players.every(player => player.isFinished);
        if (allPlayersFinished) {
            showLeaderboard();
        }
    } else {
        showResult();
    }
}

function showResult() {
    const resultDiv = document.getElementById("result");
    const result = calculateTypingResult();

    document.getElementById("accuracy").textContent = `${result.accuracy}%`;
    document.getElementById("wpm").textContent = result.wpm;
    resultDiv.style.display = "block";
}

function showLeaderboard() {
    players.sort((a, b) => {
        const aResult = a.calculateTypingResult();
        const bResult = b.calculateTypingResult();

        const aAccuracy = parseFloat(aResult.accuracy);
        const bAccuracy = parseFloat(bResult.accuracy);

        if (aAccuracy === bAccuracy) {
            return bResult.wpm - aResult.wpm;
        }

        return bAccuracy - aAccuracy;
    });
    const leaderboardContainer = document.getElementById("leaderboard-container");
    leaderboardContainer.innerHTML = "<h2>Leaderboard</h2>";

    players.forEach((player, index) => {
        const result = player.calculateTypingResult();
        const playerResult = `<p>Player ${index + 1}: Accuracy: ${result.accuracy}%, WPM: ${result.wpm}</p>`;
        leaderboardContainer.innerHTML += playerResult;
    }); 

    leaderboardContainer.style.display = "block";
}

document.getElementById("startButton").addEventListener("click", startGame);
