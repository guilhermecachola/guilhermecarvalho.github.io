// Estado do cesto
let cesto = [];

// Renderizar produtos na página
function renderizarProdutos() {
  const container = document.querySelector('.produto-container');
  container.innerHTML = '';

  produtos.forEach(produto => {
    const article = document.createElement('article');
    article.innerHTML = `
      <img src="${produto.image}" alt="${produto.title} - imagem do produto">
      <h3>${produto.title}</h3>
      <p>${produto.description}</p>
      <p class="preco">${produto.price.toFixed(2)}€</p>
      <button onclick="adicionarAoCesto(${produto.id})">Adicionar ao Cesto</button>
    `;
    container.appendChild(article);
  });
}

// Adicionar produto ao cesto
function adicionarAoCesto(id) {
  const produto = produtos.find(p => p.id === id);
  const itemExistente = cesto.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    cesto.push({ ...produto, quantidade: 1 });
  }

  renderizarCesto();
}

// Remover produto do cesto
function removerDoCesto(id) {
  cesto = cesto.filter(item => item.id !== id);
  renderizarCesto();
}

// Atualizar quantidade no cesto
function atualizarQuantidade(id, delta) {
  const item = cesto.find(item => item.id === id);
  if (item) {
    item.quantidade += delta;
    if (item.quantidade <= 0) {
      removerDoCesto(id);
    } else {
      renderizarCesto();
    }
  }
}

// Renderizar cesto de compras
function renderizarCesto() {
  const container = document.querySelector('.cesto-container');
  const totalSection = document.querySelector('.total-section');

  if (cesto.length === 0) {
    container.innerHTML = '<p class="cesto-vazio">O seu cesto está vazio</p>';
    totalSection.style.display = 'none';
    return;
  }

  container.innerHTML = '';
  let total = 0;

  cesto.forEach(item => {
    const subtotal = item.price * item.quantidade;
    total += subtotal;

    const article = document.createElement('article');
    article.innerHTML = `
      <img src="${item.image}" alt="${item.title} - miniatura do produto no cesto">
      <section style="flex: 1;">
        <h3 style="font-size: 14px; margin-bottom: 5px;">${item.title}</h3>
        <p style="font-size: 14px; color: #e74c3c; font-weight: bold;">${item.price.toFixed(2)}€</p>
        <section style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
          <button onclick="atualizarQuantidade(${item.id}, -1)" style="padding: 4px 10px; font-size: 12px;">-</button>
          <span style="font-weight: bold;">${item.quantidade}</span>
          <button onclick="atualizarQuantidade(${item.id}, 1)" style="padding: 4px 10px; font-size: 12px;">+</button>
          <button onclick="removerDoCesto(${item.id})" style="background-color: #e74c3c; padding: 4px 10px; font-size: 12px; margin-left: auto;">Remover</button>
        </section>
      </section>
    `;
    container.appendChild(article);
  });

  document.querySelector('.total-valor').textContent = total.toFixed(2) + '€';
  totalSection.style.display = 'block';
}

// Finalizar compra
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cesto.length > 0) {
      alert('Obrigado pela sua compra! Total: ' + document.querySelector('.total-valor').textContent);
      cesto = [];
      renderizarCesto();
    }
  });

  // Inicializar a página
  renderizarProdutos();
});