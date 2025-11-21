// Array de produtos disponíveis
const products = [
    {
        id: 1,
        name: "Azeite Extra Virgem Premium",
        description: "Primeira extração a frio, acidez inferior a 0,3%",
        price: 89.90,
        image: "azeite.jpg"
    },
    {
        id: 2,
        name: "Azeite com Alho",
        description: "Sabor intenso com alho natural selecionado",
        price: 75.50,
        image: "azeite.jpg"
    },
    {
        id: 3,
        name: "Azeite Trufado",
        description: "Toque refinado de trufa negra italiana",
        price: 125.00,
        image: "azeite.jpg"
    },
    {
        id: 4,
        name: "Azeite com Limão Siciliano",
        description: "Frescor cítrico para saladas e peixes",
        price: 69.90,
        image: "azeite.jpg"
    },
    {
        id: 5,
        name: "Azeite com Pimenta",
        description: "Picância equilibrada com azeite premium",
        price: 72.00,
        image: "azeite.jpg"
    },
    {
        id: 6,
        name: "Azeite Orgânico",
        description: "Certificado orgânico, sustentável",
        price: 95.00,
        image: "azeite.jpg"
    }
];

// Carrinho de compras
let cart = [];

// Renderizar produtos na página
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="images/${product.image}" alt="${product.name}">
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">R$ ${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Adicionar ao Carrinho
            </button>
        </div>
    `).join('');
}

// Adicionar produto ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showNotification('Produto adicionado ao carrinho!');
}

// Atualizar visualização do carrinho
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `R$ ${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Seu carrinho está vazio</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="images/${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }
}

// Atualizar quantidade de um produto
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remover produto do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Abrir/Fechar carrinho
function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    overlay.classList.toggle('open');
}

// Fechar carrinho ao clicar fora
function closeCartIfClickedOutside(event) {
    if (event.target.id === 'cartOverlay') {
        toggleCart();
    }
}

// Abrir modal de pagamento
function openPaymentModal() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const paymentSummaryItems = document.getElementById('paymentSummaryItems');
    const paymentTotal = document.getElementById('paymentTotal');
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    paymentSummaryItems.innerHTML = cart.map(item => `
        <div class="payment-summary-item">
            <span>${item.name} (x${item.quantity})</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    paymentTotal.textContent = `R$ ${totalPrice.toFixed(2)}`;
    
    document.getElementById('paymentModal').classList.add('open');
}

// Fechar modal de pagamento
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('open');
    document.getElementById('customerName').value = '';
    document.getElementById('paymentCode').value = '';
}

// Processar pagamento
function processPayment() {
    const customerName = document.getElementById('customerName').value.trim();
    const paymentCode = document.getElementById('paymentCode').value.trim();

    if (!customerName) {
        alert('Por favor, digite seu nome completo.');
        return;
    }

    if (paymentCode !== '12345') {
        alert('Código de pagamento inválido! Digite: 12345');
        return;
    }

    // Gerar código de confirmação único
    const confirmationCode = 'JA' + Date.now().toString().slice(-8);
    document.getElementById('confirmationCode').textContent = confirmationCode;

    // Fechar modais e limpar carrinho
    closePaymentModal();
    toggleCart();
    document.getElementById('successModal').classList.add('open');

    cart = [];
    updateCart();
}

// Fechar modal de sucesso
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('open');
}

// Mostrar notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #DAA520;
        color: #1a1a1a;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Inicializar a página quando carregar
renderProducts();