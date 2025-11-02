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

  const comprarBtn = document.querySelector(".comprar-btn");
  comprarBtn.addEventListener("click", finalizarCompra);

  const removerTodosBtn = document.querySelector(".remover-todos-btn");
  if (removerTodosBtn) {
    removerTodosBtn.addEventListener("click", removerTodosProdutos);
  }

  const estudanteCheckbox = document.getElementById("estudante-checkbox");
  if (estudanteCheckbox) {
    estudanteCheckbox.addEventListener("change", atualizarTotalComDesconto);
  }

  const cupaoInput = document.getElementById("cupao-input");
  if (cupaoInput) {
    cupaoInput.addEventListener("input", atualizarTotalComDesconto);
  }
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
  const checkoutSection = document.querySelector(".checkout-section");
  container.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  
  if (lista.length === 0) {
    container.innerHTML = '<p class="cesto-vazio">O seu cesto está vazio</p>';
    totalSection.style.display = "none";
    checkoutSection.style.display = "none";
    return;
  }

  let total = 0;
  lista.forEach(produto => {
    const artigo = criaProdutoCesto(produto);
    container.appendChild(artigo);
    total += produto.price;
  });

  document.querySelector(".total-valor").textContent = total.toFixed(2) + " €";
  totalSection.style.display = "block";
  checkoutSection.style.display = "block";
  
  atualizarTotalComDesconto();
}

function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  const imagem = document.createElement("img");
  imagem.src = produto.image;
  imagem.alt = produto.title;

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = produto.price.toFixed(2) + " €";
  preco.style.color = "#e74c3c";
  preco.style.fontWeight = "bold";

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.style.backgroundColor = "#e74c3c";
  botaoRemover.style.color = "white";

  botaoRemover.addEventListener("click", function() {
    let lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
    const index = lista.findIndex(p => p.id === produto.id);
    if (index > -1) {
      lista.splice(index, 1);
    }
    localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
    atualizaCesto();
  });

  article.append(imagem, titulo, preco, botaoRemover);
  return article;
}

function removerTodosProdutos() {
  if (confirm("Tem certeza que deseja remover todos os produtos do cesto?")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
    atualizaCesto();
  }
}

function atualizarTotalComDesconto() {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  
  if (lista.length === 0) {
    return;
  }

  let totalOriginal = 0;
  lista.forEach(produto => {
    totalOriginal += produto.price;
  });

  let totalComDesconto = totalOriginal;
  const estudanteCheckbox = document.getElementById("estudante-checkbox");
  const isEstudante = estudanteCheckbox ? estudanteCheckbox.checked : false;

  if (isEstudante) {
    totalComDesconto = totalOriginal * 0.75;
  }

  const valorCheckoutElement = document.querySelector(".valor-checkout");
  
  if (valorCheckoutElement) {
    valorCheckoutElement.textContent = totalComDesconto.toFixed(2) + " €";
  }
}

function finalizarCompra() {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  
  if (lista.length === 0) {
    alert("O seu cesto está vazio!");
    return;
  }

  const produtos = lista.map(produto => produto.id);
  const isEstudante = document.getElementById("estudante-checkbox").checked;
  const cupao = document.getElementById("cupao-input").value.trim();

  const data = {
    products: produtos
  };

  if (isEstudante) {
    data.student = true;
  }

  if (cupao !== "") {
    data.coupon = cupao;
  }

  console.log('Enviando compra para API:', data);

  const comprarBtn = document.querySelector(".comprar-btn");
  const textoOriginal = comprarBtn.textContent;
  comprarBtn.disabled = true;
  comprarBtn.textContent = "A processar...";

  fetch(API_BUY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(err.error || 'Erro ao processar compra');
      });
    }
    return response.json();
  })
  .then(resultado => {
    console.log('Resposta da API:', resultado);
    
    if (resultado.error) {
      alert("Erro: " + resultado.error);
      return;
    }

    let mensagem = "Compra realizada com sucesso!\n\n";
    
    if (resultado.reference) {
      mensagem += `Referência: ${resultado.reference}\n`;
    }
    
    if (resultado.totalCost !== undefined) {
      mensagem += `Total: ${resultado.totalCost.toFixed(2)} €\n`;
    }

    if (isEstudante) {
      mensagem += `\nDesconto de estudante aplicado!`;
    }
    
    if (cupao !== "" && resultado.totalCost !== undefined) {
      mensagem += `\nCupão "${cupao}" aplicado!`;
    }

    alert(mensagem);
    
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
    
    document.getElementById("estudante-checkbox").checked = false;
    document.getElementById("cupao-input").value = "";
    
    atualizaCesto();
  })
  .catch(error => {
    console.error('Erro ao finalizar compra:', error);
    alert('Erro: ' + error.message);
  })
  .finally(() => {
    comprarBtn.disabled = false;
    comprarBtn.textContent = textoOriginal;
  });
}