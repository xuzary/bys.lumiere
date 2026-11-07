// language: JavaScript, file: script.js, target: Browser ES2020
document.addEventListener('DOMContentLoaded', () => {
  const cart = {
    'Vanilla Comfort': 0,
    'Brisa de Eucalipto': 0,
    'Strawberry Dream': 0,
    'Passion Glow': 0,
  };

  // Configuração de tamanho e preço atual
  let selectedSize = '140g';
  let unitPrice = 44.90;
  let burnText = '~30h de queima';
  const GIFT_WRAP_PRICE = 8.00;

  // Número de WhatsApp (deixe apenas números com DDI+DDD ou vazio para abrir o seletor do WhatsApp)
  const WHATSAPP_NUMBER = '';

  const cartCountEl = document.getElementById('cartCount');
  const emptyOrderMsg = document.getElementById('emptyOrderMsg');
  const selectedCandlesList = document.getElementById('selectedCandlesList');
  const orderSubtotalValue = document.getElementById('orderSubtotalValue');
  const customerNameInput = document.getElementById('customerName');
  const paymentMethodSelect = document.getElementById('paymentMethod');
  const customerNotesInput = document.getElementById('customerNotes');
  const isGiftCheckbox = document.getElementById('isGiftCheckbox');
  const giftMessageWrap = document.getElementById('giftMessageWrap');
  const giftMessageInput = document.getElementById('giftMessageInput');
  const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
  const copyOrderBtn = document.getElementById('copyOrderBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const floatingBagLabel = document.getElementById('floatingBagLabel');
  const floatingBagSub = document.getElementById('floatingBagSub');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  // Recomendações do Quiz Olfativo
  const QUIZ_RECOMMENDATIONS = {
    relax: {
      candle: 'Vanilla Comfort',
      title: 'VANILLA COMFORT',
      desc: 'Perfeita para desacelerar à noite: a baunilha cremosa cria uma atmosfera acolhedora de descanso e autocuidado.',
    },
    fresh: {
      candle: 'Brisa de Eucalipto',
      title: 'BRISA DE EUCALIPTO',
      desc: 'Ideal para renovar o ar e trazer equilíbrio mental com o frescor revigorante das folhas de eucalipto.',
    },
    joy: {
      candle: 'Strawberry Dream',
      title: 'STRAWBERRY DREAM',
      desc: 'O aroma doce e envolvente dos morangos deixa o ambiente alegre, romântico e cheio de personalidade.',
    },
    tropical: {
      candle: 'Passion Glow',
      title: 'PASSION GLOW',
      desc: 'Inspirada na essência do maracujá, combina frescor tropical com uma sensação imediata de paz.',
    },
  };

  function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Menu mobile
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Seletor de Tamanho / Peso (100g, 140g, 190g)
  document.querySelectorAll('.size-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.size-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      selectedSize = pill.getAttribute('data-size') || '140g';
      unitPrice = parseFloat(pill.getAttribute('data-price') || '44.90');
      burnText = pill.getAttribute('data-burn') || '~30h de queima';

      document.querySelectorAll('[data-price-display]').forEach((el) => {
        el.textContent = formatBRL(unitPrice);
      });
      document.querySelectorAll('[data-burn-display]').forEach((el) => {
        el.textContent = `Pote ${selectedSize} · ${burnText}`;
      });

      updateUI();
    });
  });

  // Quiz Olfativo Interativo
  const quizResultBox = document.getElementById('quizResultBox');
  const quizResultName = document.getElementById('quizResultName');
  const quizResultDesc = document.getElementById('quizResultDesc');
  const quizAddBtn = document.getElementById('quizAddBtn');
  let currentQuizCandle = 'Vanilla Comfort';

  document.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-option-btn').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');

      const mood = btn.getAttribute('data-mood') || 'relax';
      const rec = QUIZ_RECOMMENDATIONS[mood] || QUIZ_RECOMMENDATIONS.relax;
      currentQuizCandle = rec.candle;

      if (quizResultName && quizResultDesc && quizResultBox) {
        quizResultName.textContent = rec.title;
        quizResultDesc.textContent = rec.desc;
        quizResultBox.classList.remove('hidden');
      }
    });
  });

  if (quizAddBtn) {
    quizAddBtn.addEventListener('click', () => {
      cart[currentQuizCandle] = (cart[currentQuizCandle] || 0) + 1;
      updateUI();
      const orderBuilder = document.getElementById('pedido-rapido');
      if (orderBuilder) {
        orderBuilder.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Toggle de Presente
  if (isGiftCheckbox && giftMessageWrap) {
    isGiftCheckbox.addEventListener('change', () => {
      if (isGiftCheckbox.checked) {
        giftMessageWrap.classList.remove('hidden');
      } else {
        giftMessageWrap.classList.add('hidden');
      }
      updateUI();
    });
  }

  function updateUI() {
    let totalItems = 0;
    selectedCandlesList.innerHTML = '';

    Object.entries(cart).forEach(([candleName, qty]) => {
      const qtySpan = document.querySelector(`[data-qty-for="${candleName}"]`);
      if (qtySpan) {
        qtySpan.textContent = String(qty);
      }

      if (qty > 0) {
        totalItems += qty;
        const lineSubtotal = qty * unitPrice;
        const li = document.createElement('li');
        li.innerHTML = `
          <span>✦ <strong>${qty}x ${candleName}</strong> (${selectedSize})</span>
          <strong>${formatBRL(lineSubtotal)}</strong>
        `;
        selectedCandlesList.appendChild(li);
      }
    });

    const isGift = isGiftCheckbox && isGiftCheckbox.checked;
    let totalValue = totalItems * unitPrice;

    if (isGift && totalItems > 0) {
      totalValue += GIFT_WRAP_PRICE;
      const giftLi = document.createElement('li');
      giftLi.innerHTML = `
        <span>🎁 Embalagem Especial para Presente + Cartão</span>
        <strong>${formatBRL(GIFT_WRAP_PRICE)}</strong>
      `;
      selectedCandlesList.appendChild(giftLi);
    }

    if (cartCountEl) {
      cartCountEl.textContent = String(totalItems);
    }

    if (orderSubtotalValue) {
      orderSubtotalValue.textContent = formatBRL(totalValue);
    }

    // Atualiza botão flutuante
    if (floatingBagLabel && floatingBagSub) {
      if (totalItems === 0) {
        floatingBagLabel.textContent = 'Fazer Pedido';
        floatingBagSub.textContent = 'Escolha suas velas';
      } else {
        floatingBagLabel.textContent = `Sacola (${totalItems})`;
        floatingBagSub.textContent = `${formatBRL(totalValue)} · Finalizar`;
      }
    }

    if (totalItems === 0) {
      emptyOrderMsg.classList.remove('hidden');
      selectedCandlesList.classList.add('hidden');
    } else {
      emptyOrderMsg.classList.add('hidden');
      selectedCandlesList.classList.remove('hidden');
    }
  }

  // Botões + e - nos cards de velas
  document.querySelectorAll('.candle-card').forEach((card) => {
    const candleName = card.getAttribute('data-candle');
    if (!candleName) return;

    card.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        if (action === 'inc') {
          cart[candleName] = (cart[candleName] || 0) + 1;
        } else if (action === 'dec' && cart[candleName] > 0) {
          cart[candleName] -= 1;
        }
        updateUI();
      });
    });

    const addBtn = card.querySelector('.add-candle-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (cart[candleName] === 0) {
          cart[candleName] = 1;
          updateUI();
        }
        const orderBuilder = document.getElementById('pedido-rapido');
        if (orderBuilder) {
          orderBuilder.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  });

  function buildOrderMessage() {
    const selected = Object.entries(cart).filter(([, qty]) => qty > 0);
    const name = customerNameInput ? customerNameInput.value.trim() : '';
    const payment = paymentMethodSelect ? paymentMethodSelect.value : 'Pix';
    const notes = customerNotesInput ? customerNotesInput.value.trim() : '';
    const isGift = isGiftCheckbox && isGiftCheckbox.checked;
    const giftMsg = giftMessageInput ? giftMessageInput.value.trim() : '';

    let totalItems = 0;
    const lines = [];
    lines.push(`Olá, Bys Lumière! ✨`);
    if (name) {
      lines.push(`Me chamo *${name}* e gostaria de fazer um pedido de velas aromáticas:`);
    } else {
      lines.push(`Gostaria de fazer um pedido de velas aromáticas:`);
    }
    lines.push('');

    if (selected.length === 0) {
      lines.push(`• Gostaria de conhecer a disponibilidade e valores da coleção (${selectedSize}).`);
    } else {
      selected.forEach(([candle, qty]) => {
        totalItems += qty;
        const sub = formatBRL(qty * unitPrice);
        lines.push(`• *${qty}x ${candle}* (${selectedSize}) — ${sub}`);
      });

      let totalValue = totalItems * unitPrice;
      if (isGift) {
        totalValue += GIFT_WRAP_PRICE;
        lines.push(`• 🎁 *Embalagem para Presente* — ${formatBRL(GIFT_WRAP_PRICE)}`);
        if (giftMsg) {
          lines.push(`  _Cartão: "${giftMsg}"_`);
        }
      }
      lines.push('');
      lines.push(`*Subtotal estimado:* ${formatBRL(totalValue)}`);
      lines.push(`*Forma de pagamento:* ${payment}`);
    }

    if (notes) {
      lines.push(`*Entrega / Observações:* ${notes}`);
    }

    lines.push('');
    lines.push(`Poderia confirmar a disponibilidade e me informar as opções de entrega/retirada? ♡`);
    return lines.join('\n');
  }

  if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
      const msg = encodeURIComponent(buildOrderMessage());
      const url = WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
        : `https://api.whatsapp.com/send?text=${msg}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  if (copyOrderBtn) {
    copyOrderBtn.addEventListener('click', async () => {
      const text = buildOrderMessage();
      try {
        await navigator.clipboard.writeText(text);
        if (copyFeedback) {
          copyFeedback.classList.remove('hidden');
          setTimeout(() => copyFeedback.classList.add('hidden'), 5000);
        }
      } catch {
        window.open('https://instagram.com/bys.lumiere', '_blank', 'noopener,noreferrer');
      }
    });
  }

  updateUI();
});
