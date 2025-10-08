function hoverEvent() {
  document.getElementById('hoverText').innerText = "Obrigado por passares!";
}

function resetText() {
  document.getElementById('hoverText').innerText = "Passa por aqui!";
}

function changeTextColor(color) {
  document.getElementById('paintText').style.color = color;
}

const bgColors = ['blue', 'red', 'yellow', 'gray'];
let bgColorIndex = 0;

function cycleBackgroundColors() {
  const input = document.getElementById('textInput');
  input.style.backgroundColor = bgColors[bgColorIndex];
  bgColorIndex = (bgColorIndex + 1) % bgColors.length;
}

function submitColor() {
  const inputColor = document.getElementById('colorInput').value.toLowerCase();
  document.body.style.backgroundColor = inputColor;
}


let counter = 33;

function incrementCounter() {
  counter++;
  document.getElementById('counter').innerText = counter;
}
