var pressed = [];
var points = 0;
const audio = document.querySelector("#audio");
const start = document.querySelector("#start");
var typing = document.querySelector("#typing");
var word = document.querySelector("#yourWord");
var time = document.querySelector("#yourTime");
var gameStarted = false;
var yourWord = getRandomWord();
const LOCAL_STORAGE_HIGHSCORE_KEY = "HIGH_SCORES";
var playerNameForm = document.querySelector("#playerName");
var playerName;

// Getting random word
function getRandomWord(){
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  return words[getRandomInt(0, words.length)];
};

// Pushing letters to array
renderHighScores();
window.addEventListener('keyup', (e) => {
  if (gameStarted === true) {
    pressed.push(e.key);
    pressed.splice(-yourWord.length - 1, pressed.length - yourWord.length);
    if (pressed.join('').includes(yourWord)) {
      points += 1;
      yourWord = getRandomWord();
      document.querySelector("#points").textContent = "Your points = " + points;
      audio.play();
    }
    typing.textContent = "Your typing " + "[" + pressed + " ]";
    word.textContent = "Your word is: " + yourWord;
  }
});

// Game start
function gameStart() {
  word.textContent = "Your word is: " + yourWord;
  
  if (gameStarted === false ) {
    timeStart();
    saveName();
    hideInfo();

    
  }

  gameStarted = true;
};

// Clock cleaning
function ClearAllIntervals() {
  for (var i = 1; i < 99999; i++)
    window.clearInterval(i);
};

// Clock
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
      display.textContent = "01:00"
    }

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
};

function timeStart () {
  var oneMinute = 60 * 1,
    display = document.querySelector('#yourTime');

  startTimer(oneMinute, display);
};

// Game end
function gameStop() {
  gameStarted = false;
  word.textContent = "Your word is: ";
  document.querySelector("#points").textContent = "Your points = ";
  addHighScore({ name: playerName, points });
  renderHighScores();
  showInfo();
  points = 0;
};

function addHighScore({ name, points }) {
  // Read from local storage
  let highScores = getHighScores()

  // Add new score
  highScores.push({ name, points, date: new Date().toISOString() });
  highScores = highScores.sort((a, b) => b.points - a.points).slice(0, 10);
  
  // Save to local storage
  localStorage.setItem(LOCAL_STORAGE_HIGHSCORE_KEY, JSON.stringify(highScores));
};

function getHighScores() {
  const highScores = JSON.parse(localStorage.getItem(LOCAL_STORAGE_HIGHSCORE_KEY)) || [];
  return highScores.map(highScore => {
    highScore.date = new Date(highScore.date);
    return highScore;
  })
};

function renderHighScores() {
  const tableNode = document.querySelector("#highScores tbody");

  tableNode.innerHTML = "";

  getHighScores().forEach(highScore => {
    tableNode.appendChild(
      htmlToElements(`<tr>
        <td class="text-info bg-dark">${highScore.name}</td>
        <td class="text-info bg-dark">${highScore.date.toISOString().split('T')[0]}</td>
        <td class="text-info bg-dark">${highScore.points}</td>
        </tr>`
      ))
  })
};

function resetHighScores() {
  localStorage.removeItem(LOCAL_STORAGE_HIGHSCORE_KEY);
  renderHighScores();
};

function htmlToElements(html) {
  var template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
};

function saveName() {
  if (gameStarted) {
    return
  }
  playerName = playerNameForm.value;
};

function hideInfo() {
  document.querySelector("#info").classList.add("d-none");
};
function showInfo() {
  document.querySelector("#info").classList.remove("d-none");
};


start.addEventListener("click", gameStart);

