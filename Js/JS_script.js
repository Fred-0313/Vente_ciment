
        // SLIDESHOW
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slide-dot');

        function goToSlide(n) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }
        setInterval(() => goToSlide(currentSlide + 1), 4000);

        // MENU MOBILE
        function toggleMenu() {
            document.getElementById('mobile-nav').classList.toggle('open');
            document.getElementById('hamburger').classList.toggle('open');
            document.body.style.overflow = document.getElementById('mobile-nav').classList.contains('open') ? 'hidden' : '';
        }
        function closeMenu() {
            document.getElementById('mobile-nav').classList.remove('open');
            document.getElementById('hamburger').classList.remove('open');
            document.body.style.overflow = '';
        }
        window.addEventListener('resize', () => { if (window.innerWidth > 1024) closeMenu(); });

        // PANIER
        let cart = [];

        function addToCart(name, price) {
            const existing = cart.find(i => i.name === name);
            if (existing) { existing.qty++; } else { cart.push({ name, price, qty: 1 }); }
            updateCartUI();
            const btn = document.getElementById('cart-btn');
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => btn.style.transform = '', 300);
        }

        function updateCartUI() {
            const count = cart.reduce((a, b) => a + b.qty, 0);
            const countEl = document.getElementById('cart-count');
            countEl.textContent = count;
            countEl.style.display = count > 0 ? 'flex' : 'none';
            const itemsEl = document.getElementById('cart-items');
            const footerEl = document.getElementById('cart-footer');

            if (cart.length === 0) {
                itemsEl.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" style="width:48px;height:48px;stroke:#ccc;fill:none;stroke-width:1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg><p>Votre panier est vide.<br/>Ajoutez des produits !</p></div>';
                footerEl.style.display = 'none';
                return;
            }
            footerEl.style.display = 'block';
            let html = '', total = 0;
            cart.forEach((item, idx) => {
                total += item.price * item.qty;
                html += `<div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString('fr-FR')} F</div>
        </div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>`;
            });
            itemsEl.innerHTML = html;
            document.getElementById('cart-total-price').textContent = total.toLocaleString('fr-FR') + ' F';
        }

        function changeQty(idx, delta) {
            cart[idx].qty += delta;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
            updateCartUI();
        }

        function toggleCart() {
            document.getElementById('cart-sidebar').classList.toggle('open');
            document.getElementById('cart-overlay').classList.toggle('open');
        }

        function orderViaWhatsApp() {
            if (cart.length === 0) return;
            let msg = 'Bonjour SN ASSIKI ! Je souhaite commander :%0A%0A';
            let total = 0;
            cart.forEach(item => {
                msg += `- ${item.qty}x ${item.name} : ${(item.price * item.qty).toLocaleString('fr-FR')} F%0A`;
                total += item.price * item.qty;
            });
            msg += `%0ATotal estime : ${total.toLocaleString('fr-FR')} F%0A%0AMerci de confirmer la disponibilite et la livraison.`;
            window.open('https://wa.me/0166469694?text=' + msg, '_blank');
        }

        function sendWhatsAppQuote() {
            const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
            const nom = inputs[0].value || 'Non precise';
            const tel = inputs[1].value || 'Non precise';
            const projet = inputs[2].value || 'Non precise';
            const produits = inputs[3].value || 'Non precise';
            const message = inputs[4].value || '';
            const msg = `Bonjour SN ASSIKI ! Demande de devis :%0A%0ANom : ${nom}%0ATel : ${tel}%0AProjet : ${projet}%0ACommande : ${produits}%0A%0A${message}`;
            window.open('https://wa.me/0166469694?text=' + msg, '_blank');
        }

        // FILTRES
        function filterProducts(cat, event) {
            document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
            if (event && event.target) event.target.classList.add('active');
            document.querySelectorAll('.product-card').forEach(card => {
                card.classList.toggle('hidden', cat !== 'tous' && card.dataset.category !== cat);
            });
        }

        // SCROLL REVEAL
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // NAV SCROLL
        window.addEventListener('scroll', () => {
            document.getElementById('main-nav').style.height = window.scrollY > 50 ? '58px' : '70px';
        });
    