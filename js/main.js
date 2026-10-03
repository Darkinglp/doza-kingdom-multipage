/**
 * ==========================================================================
 * DOZA KINGDOM — SCRIPT PRINCIPAL MULTIPÁGINA
 * ==========================================================================
 */

const AppState = {
  cart: [],
  units: {
    'root-strand': 'IN',
    'solar-bloom': 'IN',
    'crown-silence': 'IN',
    'modal': 'IN'
  }
};

const ProductDatabase = {
  'root-strand': {
    name: 'THE ROOT',
    price: 58.00,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    story: 'Conceived as an anchor during chaotic life transitions. The Root weaves earthen red jasper, matte black onyx, and warm raw brass beads. Each bead is cleansed in cedar smoke and charged with ancestral grounding intention.',
    materials: [
      'Raw red jasper stones (root chakra stability)',
      'Matte black obsidian for energetic boundary protection',
      'Solid brass spacers reflecting sunlight',
      'High-tensile ceremonial bonded cordage'
    ]
  },
  'solar-bloom': {
    name: 'THE SOLAR BLOOM',
    price: 64.00,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=1000&auto=format&fit=crop',
    story: 'Created to honor creative fertility, self-sovereignty, and radiant belly confidence. Citrine glass rondelles and warm terracotta clay beads evoke the noon sun over our sacred community sanctuaries.',
    materials: [
      'Natural honey citrine accents for abundance',
      'Artisanal terracotta clay beads',
      '24k gold-plated ceremonial accents',
      'Comfort-twist cotton thread core'
    ]
  },
  'crown-silence': {
    name: 'CROWN SILENCE',
    price: 72.00,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    story: 'Designed specifically for deep meditation, nervous system soothing, and psychic protection. Clear quartz crystal, antique bone-white seed beads, and polished hematite ground higher intuition into physical flesh.',
    materials: [
      'Genuine pointed clear quartz crystal tips',
      'Fine bone-white glass beads',
      'Magnetic hematite for heavy energetic shielding',
      'Concealed double-twist clasp'
    ]
  }
};

const TarotDeckDatabase = [
  { name: 'The High Priestess', desc: 'Inner stillness held answers that mental logic could not offer. You were guided to trust the unseen.' },
  { name: 'The Empress', desc: 'A cycle of fertile creation, sensual replenishment, and receiving beauty without guilt or exhaustion.' },
  { name: 'The Star', desc: 'Hope restored to your deepest waters. Walk forward unburdened; clarity is returning to your spirit.' },
  { name: 'The Hermit', desc: 'Step back from the collective noise. The lantern you hold is already bright enough to light your next step.' },
  { name: 'Strength', desc: 'Gentle patience outlasts raw aggression. Your soft power is your strongest spiritual shield.' },
  { name: 'Ace of Cups', desc: 'An emotional floodgate of forgiveness, unconditional self-regard, and spiritual renewal is opening.' }
];

document.addEventListener('DOMContentLoaded', () => {
  const savedCart = localStorage.getItem('doza_kingdom_cart');
  if (savedCart) {
    try {
      AppState.cart = JSON.parse(savedCart);
      renderCartUI();
    } catch (e) {
      console.error('Error al cargar carrito:', e);
    }
  }

  const menuToggle = document.getElementById('menuToggle');
  const closeMobileMenu = document.getElementById('closeMobileMenu');
  if (menuToggle) menuToggle.addEventListener('click', () => toggleMobileMenu(true));
  if (closeMobileMenu) closeMobileMenu.addEventListener('click', () => toggleMobileMenu(false));
});

function toggleMobileMenu(open) {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    if (open) menu.classList.add('active');
    else menu.classList.remove('active');
  }
}

function toggleMeasurementUnits(productId) {
  const current = AppState.units[productId] || 'IN';
  const next = current === 'IN' ? 'CM' : 'IN';
  AppState.units[productId] = next;

  const unitIndicator = document.getElementById(`unit-${productId}`);
  const unitLabel = document.getElementById(`unit-label-${productId}`);

  if (unitIndicator) unitIndicator.textContent = next;
  if (unitLabel) unitLabel.textContent = current;
}

function handleAddToCart(productId, title, price, inputId, image) {
  const measureInput = document.getElementById(inputId);
  const measurementValue = measureInput ? measureInput.value.trim() : '';

  if (!measurementValue || parseFloat(measurementValue) <= 0) {
    alert('Please enter your waist measurement before adding to your bag.\n\nBecause each strand is custom consecrated to your body, we require this measurement.');
    if (measureInput) measureInput.focus();
    return;
  }

  const unit = AppState.units[productId] || 'IN';
  const fullMeasurement = `${measurementValue} ${unit}`;

  const existingItemIndex = AppState.cart.findIndex(
    item => item.id === productId && item.measurement === fullMeasurement
  );

  if (existingItemIndex > -1) {
    AppState.cart[existingItemIndex].quantity += 1;
  } else {
    AppState.cart.push({
      id: productId,
      name: title,
      price: price,
      measurement: fullMeasurement,
      image: image,
      quantity: 1
    });
  }

  persistCart();
  renderCartUI();
  toggleCartDrawer(true);
}

function persistCart() {
  localStorage.setItem('doza_kingdom_cart', JSON.stringify(AppState.cart));
}

function renderCartUI() {
  const countBadge = document.getElementById('cartCount');
  const countTitle = document.getElementById('cartCountTitle');
  const cartList = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotal');

  const totalQuantity = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (countBadge) countBadge.textContent = totalQuantity;
  if (countTitle) countTitle.textContent = `(${totalQuantity} item${totalQuantity === 1 ? '' : 's'})`;
  if (subtotalEl) subtotalEl.textContent = `$${totalPrice.toFixed(2)} USD`;

  if (!cartList) return;

  if (AppState.cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 8v4l3 3"></path>
        </svg>
        <p>Your bag is currently empty.</p>
        <span>Discover intentional waistbeads in The Shop.</span>
      </div>
    `;
    return;
  }

  let html = '';
  AppState.cart.forEach((item, index) => {
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title-row">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          <span class="cart-item-measure">Waist: ${item.measurement}</span>
          <div class="cart-item-controls">
            <div class="qty-pill">
              <button class="qty-btn" onclick="updateCartItemQty(${index}, -1)">&minus;</button>
              <span class="qty-number">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartItemQty(${index}, 1)">&plus;</button>
            </div>
            <button class="remove-item-btn" onclick="removeCartItem(${index})">Remove</button>
          </div>
        </div>
      </div>
    `;
  });
  cartList.innerHTML = html;
}

function updateCartItemQty(index, delta) {
  if (!AppState.cart[index]) return;
  AppState.cart[index].quantity += delta;
  if (AppState.cart[index].quantity <= 0) {
    AppState.cart.splice(index, 1);
  }
  persistCart();
  renderCartUI();
}

function removeCartItem(index) {
  if (!AppState.cart[index]) return;
  AppState.cart.splice(index, 1);
  persistCart();
  renderCartUI();
}

function toggleCartDrawer(forceOpen) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;

  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !drawer.classList.contains('active');

  if (shouldOpen) {
    drawer.classList.add('active');
    overlay.classList.add('active');
  } else {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
  }
}

function processCheckoutExpress(method) {
  if (AppState.cart.length === 0) {
    alert('Your sacred bag is empty.');
    return;
  }
  alert(`Initiating secure ${method} gateway.\n\nOrder Total: ${document.getElementById('cartSubtotal').textContent}\nAll strands will be handcrafted according to your submitted measurements.`);
}

function processFullCheckout() {
  if (AppState.cart.length === 0) {
    alert('Your sacred bag is empty.');
    return;
  }
  alert('Redirecting to 256-bit encrypted checkout to finalize shipping address and payment method.');
}

function revealTarotCard(slotNumber) {
  const slot = document.getElementById(`cardSlot${slotNumber}`);
  if (!slot) return;

  if (slot.classList.contains('flipped')) {
    slot.classList.remove('flipped');
    return;
  }

  const randomCard = TarotDeckDatabase[Math.floor(Math.random() * TarotDeckDatabase.length)];
  const nameEl = document.getElementById(`cardName${slotNumber}`);
  const descEl = document.getElementById(`cardDesc${slotNumber}`);

  if (nameEl) nameEl.textContent = randomCard.name;
  if (descEl) descEl.textContent = randomCard.desc;

  slot.classList.add('flipped');
}

function openMeasureModal() {
  const modal = document.getElementById('measureModal');
  if (modal) modal.classList.add('active');
}

function openProductModal(productId) {
  const product = ProductDatabase[productId];
  if (!product) return;

  const modal = document.getElementById('productDetailModal');
  const nameEl = document.getElementById('modalProductName');
  const priceEl = document.getElementById('modalProductPrice');
  const imgEl = document.getElementById('modalProductImg');
  const storyEl = document.getElementById('modalProductStory');
  const materialsEl = document.getElementById('modalProductMaterials');
  const addBtn = document.getElementById('modalAddToCartBtn');

  if (nameEl) nameEl.textContent = product.name;
  if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)} USD`;
  if (imgEl) imgEl.src = product.image;
  if (storyEl) storyEl.textContent = product.story;

  if (materialsEl) {
    materialsEl.innerHTML = product.materials.map(m => `<li>${m}</li>`).join('');
  }

  if (addBtn) {
    addBtn.onclick = () => {
      const input = document.getElementById('modalCustomMeasure');
      const val = input ? input.value.trim() : '';
      if (!val || parseFloat(val) <= 0) {
        alert('Please enter your waist measurement.');
        return;
      }
      handleAddToCart(productId, product.name, product.price, 'modalCustomMeasure', product.image);
      closeModal('productDetailModal');
    };
  }

  if (modal) modal.classList.add('active');
}

// js/main.js
function openBookingModal(serviceType) {
  // Enlace base de tu clienta (cuando te lo dé, cambias 'dozakingdom' por su usuario real)
  const baseUrl = 'https://calendly.com/dozakingdom'; 
  let targetUrl = baseUrl;

  // Detecta qué botón tocó el usuario
  if (serviceType === 'Yoga') {
    targetUrl = `${baseUrl}/yoga`;
  } else if (serviceType === 'Tarot') {
    targetUrl = `${baseUrl}/tarot`;
  } else {
    targetUrl = baseUrl; // Muestra la lista con ambos servicios
  }

  // Colores de la marca Doza Kingdom (fondo oscuro y acento dorado)
  const brandParams = 'hide_landing_page_details=1&hide_gdpr_banner=1&background_color=181614&text_color=ffffff&primary_color=c5a880';

  if (window.Calendly) {
    Calendly.initPopupWidget({
      url: `${targetUrl}?${brandParams}`
    });
  } else {
    window.open(`${targetUrl}?${brandParams}`, '_blank');
  }
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const service = document.getElementById('bookingService').value;
  const name = document.getElementById('clientName').value;
  const email = document.getElementById('clientEmail').value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;

  alert(`Blessings, ${name}!\n\nYour sacred reservation for "${service}" on ${date} at ${time} has been requested. A confirmation calendar invite and prep guide have been dispatched to ${email}.`);
  closeModal('bookingModal');
}

function openRsvpModal(eventTitle) {
  const modal = document.getElementById('rsvpModal');
  const titleEl = document.getElementById('rsvpEventTitle');
  if (titleEl) titleEl.textContent = eventTitle;
  if (modal) modal.classList.add('active');
}

function handleRsvpSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('rsvpName').value;
  const email = document.getElementById('rsvpEmail').value;
  alert(`Thank you, ${name}. You are registered for the circle. We look forward to holding space with you. Confirmation sent to ${email}.`);
  closeModal('rsvpModal');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// CONTADOR Y BASE DE DATOS DE CARTAS
let revealedCardsCount = 0;

const tarotDatabase = [
  { name: "The High Priestess", meaning: "Intuition, sacred secrets, subconscious wisdom." },
  { name: "The Empress", meaning: "Sensory abundance, somatic grounding, creative flow." },
  { name: "The Star", meaning: "Hope, bodily restoration, ancestral rejuvenation." },
  { name: "The Hierophant", meaning: "Spiritual structure, somatic discipline, lineage." },
  { name: "The Hermit", meaning: "Inner exploration, nervous system silence, sacred rest." }
];

function flipTarotCard(index, cardElement) {
  if (cardElement.classList.contains('is-flipped')) return;

  // Seleccionar carta aleatoria
  const randomCard = tarotDatabase[Math.floor(Math.random() * tarotDatabase.length)];
  const frontContainer = document.getElementById(`cardFront-${index}`);

  frontContainer.innerHTML = `
    <span style="font-size: 0.7rem; color: #c5a880; letter-spacing: 0.2em; margin-bottom: 0.8rem;">ARCANA REVEALED</span>
    <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; color: #fff; margin-bottom: 0.5rem;">${randomCard.name}</h4>
    <p style="font-size: 0.85rem; color: #a8a096; line-height: 1.4;">${randomCard.meaning}</p>
  `;

  cardElement.classList.add('is-flipped');
  revealedCardsCount++;

  // Si voltea 2 o 3 cartas, mostramos la invitación a la sesión y hacemos visible el veredicto
  if (revealedCardsCount >= 2) {
    const verdictBox = document.getElementById('readingVerdictBox');
    if (verdictBox) {
      verdictBox.style.display = 'block';
    }
  }
}

// FUNCIÓN PARA DESLIZAR SUAVEMENTE A LA SECCIÓN DE RESERVA
function smoothScrollToBooking(service) {
  const bookingSec = document.getElementById('bookingSection');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
  }
}

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
  }
});