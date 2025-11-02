const API_PRODUCTS = 'https://deisishop.pythonanywhere.com/products/';
const API_CATEGORIES = 'https://deisishop.pythonanywhere.com/categories/';
const API_BUY = 'https://deisishop.pythonanywhere.com/buy/';

let todosProdutos = [];
let produtosFiltrados = [];

document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }

  carregarCategoriasDaAPI();
  carregarProdutosDaAPI();
  
  atualizaCesto();

  const selectCategoria = document.getElementById("filtro-categoria");
  selectCategoria.addEventListener("change", aplicarFiltros);

  const selectOrdenacao = document.getElementById("ordenar-preco");
  selectOrdenacao.addEventListener("change", aplicarFiltros);

  const inputPesquisa = document.getElementById("pesquisa-produto");
  inputPesquisa.addEventListener("input", aplicarFiltros);

  const checkoutBtn = document.querySelector(".checkout-btn");
  checkoutBtn.addEventListener("click", finalizarCompra);
});


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


function popularSelectCategorias(categorias) {
  const select = document.getElementById("filtro-categoria");
  
  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
  });
}


function aplicarFiltros() {
  const categoriaSelecionada = document.getElementById("filtro-categoria").value;
  const ordenacaoSelecionada = document.getElementById("ordenar-preco").value;
  const textoPesquisa = document.getElementById("pesquisa-produto").value.toLowerCase().trim();

  let produtosFiltrados = [...todosProdutos];

  if (categoriaSelecionada !== "") {
    produtosFiltrados = produtosFiltrados.filter(produto => 
      produto.category === categoriaSelecionada
    );
  }

  if (textoPesquisa !== "") {
    produtosFiltrados = produtosFiltrados.filter(produto => 
      produto.title.toLowerCase().includes(textoPesquisa) ||
      produto.description.toLowerCase().includes(textoPesquisa)
    );
  }

  if (ordenacaoSelecionada === "crescente") {
    produtosFiltrados.sort((a, b) => a.price - b.price);
  } else if (ordenacaoSelecionada === "decrescente") {
    produtosFiltrados.sort((a, b) => b.price - a.price);
  }

  carregarProdutos(produtosFiltrados);
}


function carregarProdutosDaAPI() {
  const container = document.querySelector(".produto-container");
  
  container.innerHTML = '<p style="text-align: center; padding: 20px;">A carregar produtos...</p>';

  fetch(API_PRODUCTS)
    .then(response => response.json())
    .then(data => {
      console.log('Produtos recebidos:', data);
      todosProdutos = data;
      carregarProdutos(data);
    })
    .catch(error => {
      console.error('Erro:', error);
      container.innerHTML = '<p style="text-align: center; color: red; padding: 20px;">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    });
}


function carregarProdutos(listaProdutos) {
  const container = document.querySelector(".produto-container");
  container.innerHTML = "";

  if (!listaProdutos || listaProdutos.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum produto encontrado.</p>';
    return;
  }

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


function finalizarCompra() {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  
  if (lista.length === 0) {
    alert("O seu cesto está vazio!");
    return;
  }

  const produtos = lista.map(produto => produto.id);
  const estudanteId = prompt("Digite o seu ID de estudante:");
  
  if (!estudanteId) {
    alert("ID de estudante é obrigatório!");
    return;
  }

  const data = {
    products: produtos,
    student_id: parseInt(estudanteId),
    name: "Cliente",
    address: "Morada não especificada"
  };

  console.log('Enviando compra:', data);

  const checkoutBtn = document.querySelector(".checkout-btn");
  const textoOriginal = checkoutBtn.textContent;
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = "A processar...";

  fetch(API_BUY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na resposta do servidor');
    }
    return response.json();
  })
  .then(resultado => {
    console.log('Resposta da compra:', resultado);
    
    if (resultado.message && resultado.message.includes("error")) {
      alert("Erro ao processar compra: " + resultado.message);
    } else {
      alert(`Compra realizada com sucesso!\n\nReferência: ${resultado.reference || 'N/A'}\nTotal: ${resultado.totalCost ? resultado.totalCost.toFixed(2) + '€' : 'N/A'}`);
      
      localStorage.setItem("produtos-selecionados", JSON.stringify([]));
      atualizaCesto();
    }
  })
  .catch(error => {
    console.error('Erro ao finalizar compra:', error);
    alert('Erro ao finalizar compra. Tente novamente mais tarde.');
  })
  .finally(() => {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = textoOriginal;
  });
}