document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }

  carregarProdutos(produtos);
  atualizaCesto();
});

function carregarProdutos(listaProdutos) {
  const container = document.querySelector(".produto-container");
  container.innerHTML = "";

  listaProdutos.forEach(produto => {
    const artigo = criarProduto(produto);
    container.appendChild(artigo);
  });
}

function criarProduto(produto) {
  const article = document.createElement("article");

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;

  const preco = document.createElement("p");
  preco.classList.add("preco");
  preco.textContent = produto.price.toFixed(2) + "€";

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao Cesto";

  botao.addEventListener("click", function() {
    const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
    lista.push(produto);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  article.append(imagem, titulo, descricao, preco, botao);
  return article;
}

function atualizaCesto() {
  const container = document.querySelector(".cesto-container");
  const totalSection = document.querySelector(".total-section");
  container.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  if (lista.length === 0) {
    container.innerHTML = '<p class="cesto-vazio">O seu cesto está vazio</p>';
    totalSection.style.display = "none";
    return;
  }

  let total = 0;
  lista.forEach(produto => {
    const artigo = criaProdutoCesto(produto);
    container.appendChild(artigo);
    total += produto.price;
  });

  document.querySelector(".total-valor").textContent = total.toFixed(2) + "€";
  totalSection.style.display = "block";
}

function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = produto.price.toFixed(2) + "€";
  preco.style.color = "#e74c3c";
  preco.style.fontWeight = "bold";

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.style.backgroundColor = "#e74c3c";
  botaoRemover.style.color = "white";

  botaoRemover.addEventListener("click", function() {
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
    lista = lista.filter(p => p.id !== produto.id);
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  article.append(imagem, titulo, preco, botaoRemover);
  return article;
}
