// URLs da API do DEISI Shop
const API_PRODUCTS = 'https://deisishop.pythonanywhere.com/products/';
const API_CATEGORIES = 'https://deisishop.pythonanywhere.com/categories/';

// Variável global para guardar todos os produtos
let todosProdutos = [];

document.addEventListener("DOMContentLoaded", function() {
  // Inicializa o localStorage se ainda não existir
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }

  // Carrega as categorias e produtos da API
  carregarCategoriasDaAPI();
  carregarProdutosDaAPI();
  
  // Atualiza o cesto
  atualizaCesto();

  // Adiciona event listener ao select de categorias
  const selectCategoria = document.getElementById("filtro-categoria");
  selectCategoria.addEventListener("change", function() {
    filtrarProdutosPorCategoria(this.value);
  });
});

/**
 * Carrega as categorias da API e popula o select
 */
function carregarCategoriasDaAPI() {
  fetch(API_CATEGORIES)
    .then(response => response.json())
    .then(categorias => {
      console.log('Categorias recebidas:', categorias);
      popularSelectCategorias(categorias);
    })
    .catch(error => {
      console.error('Erro ao carregar categorias:', error);
    });
}

/**
 * Popula o select com as categorias recebidas da API
 */
function popularSelectCategorias(categorias) {
  const select = document.getElementById("filtro-categoria");
  
  // Adiciona cada categoria ao select
  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
  });
}

/**
 * Filtra os produtos pela categoria selecionada
 */
function filtrarProdutosPorCategoria(categoria) {
  if (categoria === "") {
    // Mostra todos os produtos
    carregarProdutos(todosProdutos);
  } else {
    // Filtra produtos pela categoria
    const produtosFiltrados = todosProdutos.filter(produto => 
      produto.category === categoria
    );
    carregarProdutos(produtosFiltrados);
  }
}

/**
 * Função que usa AJAX/Fetch para obter produtos da API
 */
function carregarProdutosDaAPI() {
  const container = document.querySelector(".produto-container");
  
  // Mostra mensagem de loading
  container.innerHTML = '<p style="text-align: center; padding: 20px;">A carregar produtos...</p>';

  // Faz o pedido HTTP à API
  fetch(API_PRODUCTS)
    .then(response => response.json())
    .then(data => {
      console.log('Produtos recebidos:', data);
      todosProdutos = data; // Guarda todos os produtos
      carregarProdutos(data);
    })
    .catch(error => {
      console.error('Erro:', error);
      container.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    });
}

/**
 * Carrega os produtos no DOM
 */
function carregarProdutos(listaProdutos) {
  const container = document.querySelector(".produto-container");
  container.innerHTML = "";

  // Verifica se recebemos produtos
  if (!listaProdutos || listaProdutos.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum produto disponível nesta categoria.</p>';
    return;
  }

  listaProdutos.forEach(produto => {
    const artigo = criarProduto(produto);
    container.appendChild(artigo);
  });
}

/**
 * Cria um elemento de produto
 */
function criarProduto(produto) {
  const article = document.createElement("article");

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const categoria = document.createElement("p");
  categoria.textContent = `Categoria: ${produto.category}`;
  categoria.style.fontSize = "12px";
  categoria.style.color = "#3498db";
  categoria.style.fontWeight = "bold";

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

  article.append(imagem, titulo, categoria, descricao, preco, botao);
  return article;
}

/**
 * Atualiza o cesto de compras
 */
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

/**
 * Cria um produto para o cesto
 */
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