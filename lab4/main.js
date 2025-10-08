let contador = 0;

document.getElementById("btnClick").addEventListener("click", () => {
  contador++;
  document.getElementById("contador").textContent = contador;
  document.getElementById("descricao").textContent = "Clicaste no botão!";
});

document.getElementById("btnDblClick").addEventListener("dblclick", () => {
  document.getElementById("titulo").textContent = "Duplo clique detetado!";
  document.body.style.backgroundColor = "#ffeaa7";
});

document.getElementById("btnMouseOver").addEventListener("mouseover", () => {
  document.getElementById("imagem").style.transform = "scale(1.1)";
});

document.getElementById("btnMouseOut").addEventListener("mouseout", () => {
  document.getElementById("imagem").style.transform = "scale(1)";
});

document.getElementById("btnMouseMove").addEventListener("mousemove", () => {
  document.getElementById("descricao").textContent = "Estás a mover o rato sobre o botão!";
});
