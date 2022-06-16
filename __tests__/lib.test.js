const {
  getRandomWord,
  getHighScores,
  addHighScore,
  LOCAL_STORAGE_HIGHSCORE_KEY
} = require('../lib.js');

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock;

test('getRandomWord returns a random word from a list of words', () => {
  expect(getRandomWord(["tree"])).toEqual("tree");
  expect(["tree", "rock"]).toContain(getRandomWord(["tree", "rock"]));
});

test('addHighScore appends a high score object to local storage', () => {
  localStorage.removeItem(LOCAL_STORAGE_HIGHSCORE_KEY);
  const score = { name: "Testing", points: 100 };

  addHighScore(score);
  const highScores = getHighScores();

  expect(highScores.length).toEqual(1);
  expect(highScores[0].name).toEqual("Testing");
  expect(highScores[0].points).toEqual(100);
  expect(highScores[0].date).toBeTruthy();
});

test('addHighScore sorts new high scores by points', () => {
  localStorage.removeItem(LOCAL_STORAGE_HIGHSCORE_KEY);

  addHighScore({ name: "Test", points: 60 });
  addHighScore({ name: "Test", points: 40 });
  addHighScore({ name: "Test", points: 50 });
  const highScores = getHighScores();

  expect(highScores.length).toEqual(3);
  expect(highScores[0].points).toEqual(60);
  expect(highScores[1].points).toEqual(50);
  expect(highScores[2].points).toEqual(40);
});

test('addHighScore removes lowest score if there are more than 10', () => {
  localStorage.removeItem(LOCAL_STORAGE_HIGHSCORE_KEY);

  addHighScore({ name: "Test", points: 1 });
  addHighScore({ name: "Test", points: 2 });
  addHighScore({ name: "Test", points: 3 });
  addHighScore({ name: "Test", points: 4 });
  addHighScore({ name: "Test", points: 5 });
  addHighScore({ name: "Test", points: 6 });
  addHighScore({ name: "Test", points: 7 });
  addHighScore({ name: "Test", points: 8 });
  addHighScore({ name: "Test", points: 9 });
  addHighScore({ name: "Test", points: 10 });
  addHighScore({ name: "Test", points: 11 });

  const highScores = getHighScores();

  expect(highScores.length).toEqual(10);
  expect(Math.min(...highScores.map(score=> score.points))).toEqual(2)
});
