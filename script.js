var pressed = [];
var points = 0;
const audio = document.querySelector("#audio");
const start = document.querySelector("#start");
var typing = document.querySelector("#typing");
var word = document.querySelector("#yourWord");
var time = document.querySelector("#yourTime");
var gameStarted = 0;
var yourWord = getRandomWord();
const LOCAL_STORAGE_HIGHSCORE_KEY = "HIGH_SCORES";

// Losowanie slowek
function getRandomWord(){
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return words[getRandomInt(0, words.length)];
}

// Wrzucanie liter do arraya
renderHighScores();
window.addEventListener('keyup', (e) => {
  if (gameStarted === 1) {
    pressed.push(e.key);
    pressed.splice(-yourWord.length - 1, pressed.length - yourWord.length);
    if (pressed.join('').includes(yourWord)) {
      points += 1;
      yourWord = getRandomWord();
      document.querySelector("#points").textContent = "Your points = " + points;
      audio.play();
    }
    typing.textContent = "Your typing " + "[" + pressed + " ]";
    word.textContent = "Your word is : " + yourWord;
  }
});

// Start gry
function gameStart() {
  word.textContent = "Your word is: " + yourWord;

  if (gameStarted === 0) {
    timeStart()
  }

  gameStarted = 1;
}

// Czyszczenie zegara
function ClearAllIntervals() {
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);
}

// Zegar (znalazlem go gdzies w necie)
function startTimer(duration, display) {
  var timer = duration, minutes, seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (display.textContent === "00:00") {
      gameStop();
      ClearAllIntervals();
    }

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

function timeStart () {
  var oneMinute = 60 * 1,
    display = document.querySelector('#yourTime');

  startTimer(oneMinute, display);
};

// Koniec gry
function gameStop() {
  console.log(2);
  console.log("game should stop")
  gameStarted = 0;
  word.textContent = "Your word is : ";
  document.querySelector("#points").textContent = "Your points = ";
  console.log(2);
  addHighScore({ name: "Random name", points });
  renderHighScores();
  points = 0;
}

function addHighScore({ name, points }) {
  // Read from local storage
  let highScores = getHighScores()

  // Add new score
  highScores.push({ name, points, date: new Date().toISOString() });
  highScores = highScores.sort((a, b) => a <= b).slice(0, 10);

  console.log(highScores)
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

function renderHighScores() {
  const tableNode = document.querySelector("#highScores tbody");

  tableNode.innerHTML = "";

  getHighScores().forEach(highScore => {
    tableNode.appendChild(
      htmlToElements(`<tr>
        <td>${highScore.name}</td>
        <td>${highScore.date.toISOString().split('T')[0]}</td>
        <td>${highScore.points}</td>
        </tr>`
      ))
  })
}

function resetHighScores() {
  localStorage.removeItem(LOCAL_STORAGE_HIGHSCORE_KEY);
  renderHighScores();
}

function htmlToElements(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
}
// Do zrobienia - zapisanie wyniku w tabeli (localstorage)
start.addEventListener("click", gameStart);

