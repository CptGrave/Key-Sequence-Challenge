const LOCAL_STORAGE_HIGHSCORE_KEY = "HIGH_SCORES";

// Getting random word
function getRandomWord(words){
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return words[getRandomInt(0, words.length)];
}

function addHighScore({ name, points }) {
  // Read from local storage
  let highScores = getHighScores()

  // Add new score
  highScores.push({ name, points, date: new Date().toISOString() });
  highScores = highScores.sort((a, b) => b.points - a.points).slice(0, 9);
  
  // Save to local storage
  localStorage.setItem(LOCAL_STORAGE_HIGHSCORE_KEY, JSON.stringify(highScores));
}

function getHighScores() {
  const highScores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HIGHSCORE_KEY)) || [];
  return highScores.map(highScore => {
    highScore.date = new Date(highScore.date);
    return highScore;
  })
}

if (typeof exports !== 'undefined') {
  module.exports = {
    getRandomWord,
    addHighScore,
    getHighScores,
    LOCAL_STORAGE_HIGHSCORE_KEY
  }
}
