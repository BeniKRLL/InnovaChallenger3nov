document.addEventListener('DOMContentLoaded', function() {
    console.log("Script da Delícia Açucarada carregado!");

    // =========================================================================
    // VARIÁVEIS GLOBAIS DE SIMULAÇÃO DE CARRINHO
    // =========================================================================
    // Array que armazenará os produtos adicionados
    let carrinhoDeCompras = [];

    // Elementos do DOM
    const carrinhoConteudo = document.querySelector('#carrinho .simulacao');
    const inputQuantidadeLaranja = document.getElementById('quantidade');
    const btnAdicionarLaranja = document.getElementById('btn-add-laranja');
    
    // Seletor para o botão 'Adicionar ao Carrinho' do Bolo de Cenoura (o primeiro card)
    const btnAdicionarCenoura = document.querySelector('#cardapio .produto-card:first-child .btn-pedido');
    
    // =========================================================================
    // 1. Rolagem Suave para Links de Âncora
    // =========================================================================
    const linksInternos = document.querySelectorAll('a[href^="#"]');
    
    linksInternos.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const id = this.getAttribute('href');
            const alvo = document.querySelector(id);
            
            if (alvo) {
                alvo.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================================
    // 2. LÓGICA DO CARRINHO (Adicionar, Deletar e Renderizar)
    // =========================================================================

    /**
     * Adiciona um item ao carrinhoDeCompras e redesenha o carrinho.
     * @param {string} nome Nome do produto.
     * @param {number} preco Preço unitário.
     * @param {number} quantidade Quantidade.
     */
    function adicionarAoCarrinho(nome, preco, quantidade) {
        carrinhoDeCompras.push({
            id: Date.now() + Math.random(), // ID único para a remoção
            nome: nome,
            preco: preco,
            quantidade: quantidade
        });
        renderizarCarrinho();
        console.log(`Item adicionado: ${nome} (${quantidade}x)`);
    }

    /**
     * Remove um item do carrinho pelo ID e redesenha o carrinho.
     * @param {number} id ID único do produto a ser removido.
     */
    function removerDoCarrinho(id) {
        // Filtra a lista, mantendo apenas os itens cujo ID não correspondem ao ID a ser removido
        carrinhoDeCompras = carrinhoDeCompras.filter(item => item.id !== id);
        renderizarCarrinho();
        console.log(`Item removido com ID: ${id}`);
    }

    /**
     * Calcula o subtotal e atualiza o HTML da seção Carrinho.
     */
    function renderizarCarrinho() {
        let subtotalTotal = 0;
        let htmlItens = '';

        if (carrinhoDeCompras.length === 0) {
            htmlItens = '<p style="color: gray;">O carrinho está vazio. Adicione um produto!</p>';
        } else {
            htmlItens += '<ul>';
            carrinhoDeCompras.forEach(item => {
                const precoItem = item.preco * item.quantidade;
                subtotalTotal += precoItem;

                htmlItens += `
                    <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 5px; border-bottom: 1px dashed #ccc;">
                        <span>
                            <strong>${item.nome}</strong> (${item.quantidade}x) - R$ ${precoItem.toFixed(2).replace('.', ',')}
                        </span>
                        <button class="btn-acao" data-id="${item.id}" style="background-color: #dc3545; padding: 5px 10px; font-size: 0.8em; border-radius: 3px;">
                            X Deletar
                        </button>
                    </li>
                `;
            });
            htmlItens += '</ul>';
        }

        // Atualiza o conteúdo do carrinho
        carrinhoConteudo.innerHTML = `
            ${htmlItens}
            <p style="border-top: 2px solid var(--cor-principal); padding-top: 15px; margin-top: 15px;">
                <strong>Subtotal (R$):</strong> ${subtotalTotal.toFixed(2).replace('.', ',')}
            </p>
        `;

        // Adiciona listeners para os novos botões Deletar
        document.querySelectorAll('.simulacao button[data-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                // Converte o data-id (string) para float para corresponder ao ID gerado
                const idParaRemover = parseFloat(this.getAttribute('data-id'));
                removerDoCarrinho(idParaRemover);
            });
        });
    }

    // Ações de Adicionar
    // Adicionar Bolo de Laranja (com input de quantidade)
    if (btnAdicionarLaranja && inputQuantidadeLaranja) {
        btnAdicionarLaranja.addEventListener('click', function() {
            const quantidade = parseInt(inputQuantidadeLaranja.value) || 1;
            adicionarAoCarrinho('Bolo de Laranja com Calda Caramelizada', 45.00, quantidade);
        });
    }

    // Adicionar Bolo de Cenoura (direto do cardápio - 1 unidade)
    if (btnAdicionarCenoura) {
        btnAdicionarCenoura.addEventListener('click', function(e) {
            e.preventDefault(); 
            adicionarAoCarrinho('Bolo de Cenoura com Cobertura de Chocolate Belga', 55.00, 1);
        });
    }
    
    // Renderiza o carrinho vazio ao carregar
    renderizarCarrinho();

    // =========================================================================
    // 3. Validação Básica do Formulário de Contato
    // =========================================================================
    const formContato = document.getElementById('form-contato');
    const nomeInput = document.getElementById('nome');
    const pedidoInput = document.getElementById('pedido');

    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = nomeInput.value;
            const pedido = pedidoInput.value;

            if (nome.length < 3 || pedido.length < 10) {
                alert('Por favor, preencha seu nome (mínimo 3 caracteres) e a mensagem/pedido (mínimo 10 caracteres).');
            } else {
                alert(`Mensagem enviada com sucesso, ${nome}! A Teresinha responderá em breve. (Dados: "${pedido.substring(0, 30)}...")`);
                formContato.reset();
            }
        });
    }

    // =========================================================================
    // 4. Fluxo de Checkout e Pagamento
    // =========================================================================
    
    const formDelivery = document.getElementById('form-delivery');
    const paymentStep = document.getElementById('payment-step');
    const btnFinalizarPagamento = document.getElementById('btn-finalizar-pagamento');
    const confirmationMessage = document.getElementById('confirmation-message');
    const checkoutStatus = document.getElementById('checkout-status');

    // Função para alternar os campos de pagamento (Cartão/Dinheiro/Pix)
    function updatePaymentFields() {
        if (paymentStep.style.display !== 'block') return;

        const cartaoFields = document.getElementById('cartao-fields');
        const dinheiroFields = document.getElementById('dinheiro-fields');
        const pixFields = document.getElementById('pix-fields');
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value;
        
        if (selectedMethod) {
            cartaoFields.style.display = 'none';
            dinheiroFields.style.display = 'none';
            pixFields.style.display = 'none';

            if (selectedMethod === 'cartao') {
                cartaoFields.style.display = 'block';
            } else if (selectedMethod === 'dinheiro') {
                dinheiroFields.style.display = 'block';
            } else if (selectedMethod === 'pix') {
                pixFields.style.display = 'block';
            }
        }
    }

    // Função para adicionar listeners aos botões de rádio
    function setupPaymentListeners() {
        const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
        
        paymentMethods.forEach(radio => {
            radio.removeEventListener('change', updatePaymentFields);
        });

        paymentMethods.forEach(radio => {
            radio.addEventListener('change', updatePaymentFields);
        });
    }

    // Evento A: Ao enviar o formulário de Entrega (Passa para Pagamento)
    if (formDelivery) {
        formDelivery.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação do Carrinho antes de prosseguir para o Checkout
            if (carrinhoDeCompras.length === 0) {
                 alert("Seu carrinho está vazio! Adicione pelo menos um item para prosseguir.");
                 document.querySelector('#carrinho').scrollIntoView({ behavior: 'smooth' });
                 return;
            }

            formDelivery.style.display = 'none';
            paymentStep.style.display = 'block';
            
            setupPaymentListeners(); 
            updatePaymentFields();
            
            checkoutStatus.textContent = "➡️ Prossiga com a simulação do pagamento.";

            paymentStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    // Evento B: Ao clicar em Confirmar Pagamento
    if (btnFinalizarPagamento) {
        btnFinalizarPagamento.addEventListener('click', function() {
            
            const selectedMethod = document.querySelector('input[name="payment_method"]:checked')?.value;
            let isValid = true;
            
            // Validação simplificada para o Cartão
            if (selectedMethod === 'cartao') {
                const cardNumber = document.getElementById('card_num')?.value;
                if (!cardNumber || cardNumber.length < 16) {
                    alert("Por favor, insira um número de cartão válido (16 dígitos simulados).");
                    isValid = false;
                }
            }
            
            if(isValid) {
                paymentStep.style.display = 'none';
                confirmationMessage.style.display = 'block';
                checkoutStatus.style.display = 'none'; 

                confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

});