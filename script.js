var pressed = [];
var points = 0;
const audio = document.querySelector("#audio");
const start = document.querySelector("#start");
var typing = document.querySelector("#typing");
var word = document.querySelector("#yourWord");
var time = document.querySelector("#yourTime");
var gameStarted = 0;
var yourWord = getRandomWord();

//Losowanie slowek
function getRandomWord(){
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    return words[getRandomInt(0, words.length)];
}
//Wrzucanie liter do arraya
  window.addEventListener('keyup', (e) => {
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
    
  });
//Start gry

  function gameStart() {

    
    word.textContent = "Your word is: " + yourWord;
    if (gameStarted === 0) {
      timeStart()
    }
    gameStarted = 1;
  }
//Czyszczenie zegara
function ClearAllIntervals() {
  for (var i = 1; i < 99999; i++)
      window.clearInterval(i);
}
//Zegar (znalazlem go gdzies w necie)
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


//Koniec gry
function gameStop() {
  console.log("game should stop")
  gameStarted = 0;
  word.textContent = "Your word is : ";
  document.querySelector("#points").textContent = "Your points = ";
}
//Do zrobienia - zapisanie wyniku w tabeli (localstorage)


         


start.addEventListener("click", gameStart);

