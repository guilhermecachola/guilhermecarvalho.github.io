// URLs das APIs utilizadas para produtos, categorias e compras
const API_PRODUCTS = 'https://deisishop.pythonanywhere.com/products/';
const API_CATEGORIES = 'https://deisishop.pythonanywhere.com/categories/';
const API_BUY = 'https://deisishop.pythonanywhere.com/buy/';

// Arrays globais para guardar os produtos da API e os produtos filtrados
let todosProdutos = [];
let produtosFiltrados = [];

// Quando o documento estiver completamente carregado, executa esta função
document.addEventListener("DOMContentLoaded", function() {

  // Inicializa o localStorage se ainda não houver produtos guardados
  if (!localStorage.getItem("produtos-selecionados")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
  }

  // Carrega as categorias e os produtos da API
  carregarCategoriasDaAPI();
  carregarProdutosDaAPI();
  
  // Atualiza o cesto de compras
  atualizaCesto();

  // Liga o evento de mudança no filtro de categoria
  const selectCategoria = document.getElementById("filtro-categoria");
  selectCategoria.addEventListener("change", aplicarFiltros);

  // Liga o evento de mudança na ordenação por preço
  const selectOrdenacao = document.getElementById("ordenar-preco");
  selectOrdenacao.addEventListener("change", aplicarFiltros);

  // Liga o evento de input (digitação) no campo de pesquisa
  const inputPesquisa = document.getElementById("pesquisa-produto");
  inputPesquisa.addEventListener("input", aplicarFiltros);

  // Liga o botão de compra à função de finalizar compra
  const comprarBtn = document.querySelector(".comprar-btn");
  comprarBtn.addEventListener("click", finalizarCompra);

  // Liga o botão de remover todos os produtos, se existir
  const removerTodosBtn = document.querySelector(".remover-todos-btn");
  if (removerTodosBtn) {
    removerTodosBtn.addEventListener("click", removerTodosProdutos);
  }

  // Liga a checkbox de estudante à função que recalcula o total com desconto
  const estudanteCheckbox = document.getElementById("estudante-checkbox");
  if (estudanteCheckbox) {
    estudanteCheckbox.addEventListener("change", atualizarTotalComDesconto);
  }

  // Liga o campo de cupão à função que recalcula o total com desconto
  const cupaoInput = document.getElementById("cupao-input");
  if (cupaoInput) {
    cupaoInput.addEventListener("input", atualizarTotalComDesconto);
  }
});

// Função para carregar as categorias a partir da API
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

// Popula o <select> de categorias com as opções recebidas da API
function popularSelectCategorias(categorias) {
  const select = document.getElementById("filtro-categoria");
  
  categorias.forEach(categoria => {
    const option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
  });
}

// Aplica os filtros de categoria, ordenação e pesquisa
function aplicarFiltros() {
  const categoriaSelecionada = document.getElementById("filtro-categoria").value;
  const ordenacaoSelecionada = document.getElementById("ordenar-preco").value;
  const textoPesquisa = document.getElementById("pesquisa-produto").value.toLowerCase().trim();

  let produtosFiltrados = [...todosProdutos];

  // Filtra por categoria, se selecionada
  if (categoriaSelecionada !== "") {
    produtosFiltrados = produtosFiltrados.filter(produto => 
      produto.category === categoriaSelecionada
    );
  }

  // Filtra por texto de pesquisa (no título ou descrição)
  if (textoPesquisa !== "") {
    produtosFiltrados = produtosFiltrados.filter(produto => 
      produto.title.toLowerCase().includes(textoPesquisa) ||
      produto.description.toLowerCase().includes(textoPesquisa)
    );
  }

  // Ordena os produtos por preço
  if (ordenacaoSelecionada === "crescente") {
    produtosFiltrados.sort((a, b) => a.price - b.price);
  } else if (ordenacaoSelecionada === "decrescente") {
    produtosFiltrados.sort((a, b) => b.price - a.price);
  }

  // Atualiza o ecrã com os produtos filtrados
  carregarProdutos(produtosFiltrados);
}

// Carrega os produtos da API
function carregarProdutosDaAPI() {
  const container = document.querySelector(".produto-container");
  
  // Mostra mensagem temporária enquanto carrega
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

// Mostra os produtos no ecrã
function carregarProdutos(listaProdutos) {
  const container = document.querySelector(".produto-container");
  container.innerHTML = "";

  if (!listaProdutos || listaProdutos.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Nenhum produto encontrado.</p>';
    return;
  }

  // Cria os elementos de cada produto e adiciona ao container
  listaProdutos.forEach(produto => {
    const artigo = criarProduto(produto);
    container.appendChild(artigo);
  });
}

// Cria o elemento HTML de um produto individual
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

  // Botão para adicionar o produto ao cesto
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

// Atualiza o conteúdo do cesto de compras
function atualizaCesto() {
  const container = document.querySelector(".cesto-container");
  const totalSection = document.querySelector(".total-section");
  const checkoutSection = document.querySelector(".checkout-section");
  container.innerHTML = "";

  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  
  // Se o cesto estiver vazio
  if (lista.length === 0) {
    container.innerHTML = '<p class="cesto-vazio">O seu cesto está vazio</p>';
    totalSection.style.display = "none";
    checkoutSection.style.display = "none";
    return;
  }

  let total = 0;

  // Cria os elementos de cada produto no cesto
  lista.forEach(produto => {
    const artigo = criaProdutoCesto(produto);
    container.appendChild(artigo);
    total += produto.price;
  });

  // Atualiza o total e mostra as secções de checkout
  document.querySelector(".total-valor").textContent = total.toFixed(2) + " €";
  totalSection.style.display = "block";
  checkoutSection.style.display = "block";
  
  atualizarTotalComDesconto();
}

// Cria o elemento HTML de um produto dentro do cesto
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

  // Botão para remover um produto do cesto
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

// Remove todos os produtos do cesto com confirmação
function removerTodosProdutos() {
  if (confirm("Tem certeza que deseja remover todos os produtos do cesto?")) {
    localStorage.setItem("produtos-selecionados", JSON.stringify([]));
    atualizaCesto();
  }
}

// Recalcula o total com desconto de estudante e/ou cupão
function atualizarTotalComDesconto() {
  const lista = JSON.parse(localStorage.getItem("produtos-selecionados"));
  
  if (lista.length === 0) {
    return;
  }

  // Soma o total original
  let totalOriginal = 0;
  lista.forEach(produto => {
    totalOriginal += produto.price;
  });

  let totalComDesconto = totalOriginal;
  const estudanteCheckbox = document.getElementById("estudante-checkbox");
  const isEstudante = estudanteCheckbox ? estudanteCheckbox.checked : false;

  // Aplica desconto de 25% para estudantes
  if (isEstudante) {
    totalComDesconto = totalOriginal * 0.75;
  }

  // Atualiza o valor total no checkout
  const valorCheckoutElement = document.querySelector(".valor-checkout");
  
  if (valorCheckoutElement) {
    valorCheckoutElement.textContent = totalComDesconto.toFixed(2) + " €";
  }
}

// Envia os dados da compra para a API
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

  // Adiciona propriedades extras se aplicável
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

  // Envia o pedido POST para a API
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

    // Mensagem de sucesso personalizada
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
    
    // Limpa o cesto e os campos
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
    // Restaura o botão de compra
    comprarBtn.disabled = false;
    comprarBtn.textContent = textoOriginal;
  });
}
