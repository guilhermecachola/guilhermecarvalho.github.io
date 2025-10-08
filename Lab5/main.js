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

function changeBodyColor(selectElement) {
  document.body.style.backgroundColor = selectElement.value;
}


const paintText = document.getElementById('paintText');
const buttons = document.querySelectorAll('.color-btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    paintText.style.color = color;
    paintText.innerText = `Agora estou ${color}!`;
  });
});


let counter = 72;

function incrementCounter() {
  counter++;
  document.getElementById('counter').innerText = counter;
}



function showGreeting() {
  const name = document.getElementById('nameInput').value.trim();
  const age = document.getElementById('ageInput').value.trim();

  if (name && age) {
    document.getElementById('greetingMessage').innerText = `Olá, ${name} tem ${age} anos`;
  } else {
    alert("Por favor, preencha ambos os campos.");
  }
}

let autoCounterValue = 0;

function startAutoCounter() {
  setInterval(() => {
    autoCounterValue++;
    document.getElementById('autoCounter').innerText = autoCounterValue;
  }, 1000);
}

window.onload = function() {
  startAutoCounter();
}
