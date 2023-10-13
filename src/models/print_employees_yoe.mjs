
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function printRecord(amountOfEmployees, amountOfTools) {
  for (let i = 1; i <= amountOfEmployees; i++) {
    for (let j = 1; j <= amountOfTools; j++) {
      console.log(`(${i}, ${j}, ${getRandomInt(1, 10)})`);
    }
  }
}

printRecord(20, 8);
