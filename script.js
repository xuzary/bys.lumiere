// language: JavaScript, file: script.js, target: Browser ES2020
document.addEventListener('DOMContentLoaded', () => {
  const cart = {
    'Vanilla Comfort': 0,
    'Brisa de Eucalipto': 0,
    'Strawberry Dream': 0,
    'Passion Glow': 0,
  };

  // Número de WhatsApp configurável (deixe apenas dígitos com DDI+DDD ou vazio para abrir seletor)
  const WHATSAPP_NUMBER = '';

  const cartCountEl = document.getElementById('cartCount');
  const emptyOrderMsg = document.getElementById('emptyOrderMsg');
  const selectedCandlesList = document.getElementById('selectedCandlesList');
  const customerNameInput = document.getElementById('customerName');
  const customerNotesInput = document.getElementById('customerNotes');
  const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
  const copyOrderBtn = document.getElementById('copyOrderBtn');
  const copyFeedback = document.getElementById('copyFeedback');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

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
        const li = document.createElement('li');
        li.innerHTML = `
          <span>✦ <strong>${candleName}</strong></span>
          <span>Quantidade: <strong>${qty}x</strong></span>
        `;
        selectedCandlesList.appendChild(li);
      }
    });

    if (cartCountEl) {
      cartCountEl.textContent = String(totalItems);
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
    const notes = customerNotesInput ? customerNotesInput.value.trim() : '';

    let lines = [];
    lines.push(`Olá, Bys Lumière! ✨`);
    if (name) {
      lines.push(`Me chamo *${name}* e gostaria de fazer um pedido de velas aromáticas:`);
    } else {
      lines.push(`Gostaria de fazer um pedido de velas aromáticas:`);
    }
    lines.push('');

    if (selected.length === 0) {
      lines.push(`• Gostaria de conhecer a disponibilidade e valores da coleção.`);
    } else {
      selected.forEach(([candle, qty]) => {
        lines.push(`• *${qty}x* ${candle}`);
      });
    }

    if (notes) {
      lines.push('');
      lines.push(`Observações: ${notes}`);
    }

    lines.push('');
    lines.push(`Poderia me informar a disponibilidade, valores e opções de entrega? ♡`);
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

  // Upload de foto na seção Sobre Mim (salva no navegador)
  const photoUpload = document.getElementById('photoUpload');
  const creatorPortrait = document.getElementById('creatorPortrait');
  const customPortraitImg = document.getElementById('customPortraitImg');

  const savedPhoto = localStorage.getItem('bys_lumiere_portrait');
  if (savedPhoto && customPortraitImg && creatorPortrait) {
    customPortraitImg.src = savedPhoto;
    customPortraitImg.classList.remove('hidden');
    creatorPortrait.classList.add('hidden');
  }

  if (photoUpload && customPortraitImg && creatorPortrait) {
    photoUpload.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result);
        customPortraitImg.src = result;
        customPortraitImg.classList.remove('hidden');
        creatorPortrait.classList.add('hidden');
        try {
          localStorage.setItem('bys_lumiere_portrait', result);
        } catch {
          // Ignora se exceder limite do localStorage
        }
      };
      reader.readAsDataURL(file);
    });

    customPortraitImg.addEventListener('click', () => {
      photoUpload.click();
    });
  }

  updateUI();
});

